"""
GLIMMR — Python ML Microservice
=================================
Flask REST API wrapping the scikit-learn recommendation engine.
Runs on port 5001 independently from Node.js backend.

Setup:
    pip install flask flask-cors pandas scikit-learn numpy
    python ml_service.py

Then configure backend/.env:
    ML_SERVICE_URL=http://localhost:5001
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics.pairwise import cosine_similarity
import json, os, csv

app = Flask(__name__)
CORS(app)

# ── Load Dataset ─────────────────────────────────────────────────────
DATA_PATH = os.path.join(os.path.dirname(__file__), 'jewellery_catalog.csv')

def load_data():
    try:
        df = pd.read_csv(DATA_PATH)
        print(f"✅ Loaded {len(df)} items from {DATA_PATH}")
        return df
    except FileNotFoundError:
        print("⚠️  CSV not found, using inline data")
        return pd.DataFrame(INLINE_DATA)

INLINE_DATA = [
    {"id":"j001","name":"Royal Kundan Jhumka","category":"earring","material":"gold","style":"bridal","price":18500,"colorTone":"warm","rating":4.8},
    {"id":"j002","name":"Diamond Solitaire Studs","category":"earring","material":"diamond","style":"minimalist","price":45000,"colorTone":"cool","rating":4.9},
    {"id":"j003","name":"Silver Oxidized Hoop","category":"earring","material":"silver","style":"contemporary","price":1299,"colorTone":"cool","rating":4.3},
    {"id":"j004","name":"Classic Diamond Pendant","category":"necklace","material":"diamond","style":"minimalist","price":55000,"colorTone":"cool","rating":4.9},
    {"id":"j005","name":"Kundan Meenakari Choker","category":"necklace","material":"gold","style":"bridal","price":28000,"colorTone":"warm","rating":4.7},
    {"id":"j006","name":"Solitaire Engagement Ring","category":"ring","material":"diamond","style":"minimalist","price":120000,"colorTone":"cool","rating":5.0},
    {"id":"j007","name":"Gold Maharani Ring","category":"ring","material":"gold","style":"traditional","price":22000,"colorTone":"warm","rating":4.7},
    {"id":"j008","name":"Diamond Tennis Bracelet","category":"bracelet","material":"diamond","style":"minimalist","price":95000,"colorTone":"cool","rating":4.9},
    {"id":"j009","name":"Diamond Nose Pin","category":"nose-ring","material":"diamond","style":"minimalist","price":8500,"colorTone":"cool","rating":4.8},
    {"id":"j010","name":"Gold Nath Nose Ring","category":"nose-ring","material":"gold","style":"bridal","price":15000,"colorTone":"warm","rating":4.7},
]

# ── Build Recommender ─────────────────────────────────────────────────
class MLRecommender:
    OUTFIT_RULES = {
        "bridal":       ["bridal-lehenga","bridal-saree","wedding-gown","heavy-dupatta-set"],
        "traditional":  ["saree","lehenga","salwar-kameez","anarkali","sharara"],
        "contemporary": ["western-dress","kurti","indo-western","co-ord-set","blazer"],
        "casual":       ["jeans-top","casual-dress","co-ord-set","tank-top","dungaree"],
        "minimalist":   ["formal-wear","business-casual","monochrome-outfit","tailored-suit"],
        "fusion":       ["indo-western","ethnic-top-jeans","fusion-wear","dhoti-pants"],
    }
    COLOR_RULES = {
        "gold":       ["red","maroon","green","royal-blue","off-white","mustard","deep-teal"],
        "silver":     ["blue","black","grey","white","purple","teal","lavender"],
        "diamond":    ["black","white","navy","grey","burgundy","all-colors"],
        "rose-gold":  ["pink","peach","nude","lavender","blush","dusty-rose"],
        "white-gold": ["black","white","silver-grey","midnight-blue","ivory"],
        "platinum":   ["black","white","silver-grey","midnight-blue","charcoal"],
        "pearl":      ["pastel","white","cream","soft-pink","powder-blue","champagne"],
    }

    def __init__(self, df):
        self.df = df.copy()
        self._encode_and_fit()

    def _encode_and_fit(self):
        df = self.df
        encoders = {}
        for col in ['category','material','style','colorTone']:
            le = LabelEncoder()
            df[f'{col}_enc'] = le.fit_transform(df[col].fillna('unknown'))
            encoders[col] = le
        self.encoders = encoders

        scaler = StandardScaler()
        df['price_norm'] = scaler.fit_transform(df[['price']].fillna(df['price'].mean()))
        self.scaler = scaler

        # Weighted feature matrix
        self.X = np.column_stack([
            df['category_enc'].values  * 3.0,
            df['material_enc'].values  * 2.5,
            df['style_enc'].values     * 2.0,
            df['colorTone_enc'].values * 1.0,
            df['price_norm'].values    * 0.8,
            df['rating'].fillna(4.5).values * 0.5,
        ])

        self.knn = NearestNeighbors(n_neighbors=min(6, len(df)), metric='cosine', algorithm='brute')
        self.knn.fit(self.X)

        self.sim_matrix = cosine_similarity(self.X)
        print(f"✅ ML model built | {len(df)} items | {self.X.shape[1]} features")

    def similar(self, item_id, n=5):
        mask = self.df['id'] == item_id
        if not mask.any():
            return [], None
        idx = self.df[mask].index[0]
        distances, indices = self.knn.kneighbors(self.X[idx].reshape(1,-1), n_neighbors=n+1)
        results = []
        for j, d in zip(indices[0], distances[0]):
            if self.df.iloc[j]['id'] == item_id:
                continue
            row = self.df.iloc[j].to_dict()
            row['similarity'] = round(float(1 - d), 4)
            results.append(row)
        source = self.df.iloc[idx].to_dict()
        return results[:n], source

    def outfit(self, item_id):
        mask = self.df['id'] == item_id
        if not mask.any():
            return None
        item = self.df[mask].iloc[0]
        style = item.get('style', 'contemporary')
        material = item.get('material', 'gold')
        return {
            'item_id': item_id,
            'item_name': item['name'],
            'style': style,
            'material': material,
            'outfit_suggestions': self.OUTFIT_RULES.get(style, self.OUTFIT_RULES['contemporary']),
            'color_suggestions': self.COLOR_RULES.get(material, ['all-colors']),
            'occasions': item.get('occasion', '').split(',') if isinstance(item.get('occasion'), str) else [],
        }

    def search_by_features(self, category=None, material=None, style=None, max_price=None, n=10):
        df = self.df.copy()
        if category: df = df[df['category'] == category]
        if material: df = df[df['material'] == material]
        if style:    df = df[df['style'] == style]
        if max_price: df = df[df['price'] <= float(max_price)]
        df = df.sort_values('rating', ascending=False)
        return df.head(n).to_dict('records')

    def stats(self):
        df = self.df
        return {
            'total': len(df),
            'categories': df['category'].value_counts().to_dict(),
            'materials': df['material'].value_counts().to_dict(),
            'avg_price': float(df['price'].mean()),
            'avg_rating': float(df['rating'].mean()),
        }


# Init recommender
df = load_data()
rec = MLRecommender(df)

# ── Routes ────────────────────────────────────────────────────────────

@app.route('/health')
def health():
    return jsonify({'status':'ok','service':'GLIMMR ML Microservice','items':len(df)})

@app.route('/recommend/similar', methods=['POST'])
def recommend_similar():
    data = request.json or {}
    item_id = data.get('item_id') or data.get('jewelleryId')
    n = int(data.get('limit', 5))
    if not item_id:
        return jsonify({'error': 'item_id required'}), 400
    results, source = rec.similar(item_id, n)
    if source is None:
        return jsonify({'error': f'Item {item_id} not found'}), 404
    return jsonify({'success': True, 'source': source['name'], 'recommendations': results, 'count': len(results)})

@app.route('/recommend/outfit', methods=['POST'])
def recommend_outfit():
    data = request.json or {}
    item_id = data.get('item_id') or data.get('jewelleryId')
    if not item_id:
        return jsonify({'error': 'item_id required'}), 400
    result = rec.outfit(item_id)
    if not result:
        return jsonify({'error': f'Item {item_id} not found'}), 404
    return jsonify({'success': True, 'data': result})

@app.route('/search', methods=['GET','POST'])
def search():
    if request.method == 'POST':
        data = request.json or {}
    else:
        data = request.args.to_dict()
    results = rec.search_by_features(
        category=data.get('category'),
        material=data.get('material'),
        style=data.get('style'),
        max_price=data.get('max_price'),
        n=int(data.get('limit', 10))
    )
    return jsonify({'success': True, 'data': results, 'count': len(results)})

@app.route('/stats')
def stats():
    return jsonify({'success': True, 'data': rec.stats()})

@app.route('/similarity-matrix')
def similarity_matrix():
    ids = df['id'].tolist()
    matrix = {}
    sim = rec.sim_matrix
    for i, id1 in enumerate(ids):
        matrix[id1] = {
            ids[j]: round(float(sim[i][j]), 3)
            for j in range(len(ids)) if i != j and sim[i][j] > 0.6
        }
    return jsonify({'success': True, 'matrix': matrix})

if __name__ == '__main__':
    print("\n🚀 GLIMMR ML Microservice")
    print("   Endpoints:")
    print("   POST /recommend/similar  — kNN jewellery recommendations")
    print("   POST /recommend/outfit   — outfit pairing suggestions")
    print("   GET  /search             — feature-based search")
    print("   GET  /stats              — dataset statistics")
    print("   GET  /similarity-matrix  — full cosine similarity")
    print("   GET  /health\n")
    app.run(host='0.0.0.0', port=5001, debug=True)
