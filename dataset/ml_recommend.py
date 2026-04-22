"""
GLIMMR - Python ML Recommendation Engine
=========================================
Content-Based Filtering using k-Nearest Neighbors
Capstone Project | TIET Patiala

Usage:
    pip install pandas scikit-learn numpy
    python ml_recommend.py

This script demonstrates the ML recommendation logic
that powers the backend /api/recommend endpoints.
The same logic is implemented in Node.js in routes/recommend.js
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics.pairwise import cosine_similarity
import json

# ── Sample Dataset ──────────────────────────────────────────────────
JEWELLERY_DATA = [
    {"id": "j001", "name": "Royal Kundan Jhumka",      "category": "earring",   "material": "gold",     "style": "bridal",        "price": 18500, "colorTone": "warm", "rating": 4.8},
    {"id": "j002", "name": "Diamond Solitaire Studs",  "category": "earring",   "material": "diamond",  "style": "minimalist",    "price": 45000, "colorTone": "cool", "rating": 4.9},
    {"id": "j003", "name": "Silver Oxidized Hoop",     "category": "earring",   "material": "silver",   "style": "contemporary",  "price": 1299,  "colorTone": "cool", "rating": 4.3},
    {"id": "j004", "name": "Classic Diamond Pendant",  "category": "necklace",  "material": "diamond",  "style": "minimalist",    "price": 55000, "colorTone": "cool", "rating": 4.9},
    {"id": "j005", "name": "Kundan Meenakari Choker",  "category": "necklace",  "material": "gold",     "style": "bridal",        "price": 28000, "colorTone": "warm", "rating": 4.7},
    {"id": "j006", "name": "Solitaire Engagement Ring","category": "ring",      "material": "diamond",  "style": "minimalist",    "price": 120000,"colorTone": "cool", "rating": 5.0},
    {"id": "j007", "name": "Gold Maharani Ring",       "category": "ring",      "material": "gold",     "style": "traditional",   "price": 22000, "colorTone": "warm", "rating": 4.7},
    {"id": "j008", "name": "Stackable Rose Gold Bands","category": "ring",      "material": "rose-gold","style": "contemporary",  "price": 15000, "colorTone": "warm", "rating": 4.8},
    {"id": "j009", "name": "Diamond Tennis Bracelet",  "category": "bracelet",  "material": "diamond",  "style": "minimalist",    "price": 95000, "colorTone": "cool", "rating": 4.9},
    {"id": "j010", "name": "Gold Kada Bracelet",       "category": "bracelet",  "material": "gold",     "style": "traditional",   "price": 42000, "colorTone": "warm", "rating": 4.7},
    {"id": "j011", "name": "Diamond Nose Pin",         "category": "nose-ring", "material": "diamond",  "style": "minimalist",    "price": 8500,  "colorTone": "cool", "rating": 4.8},
    {"id": "j012", "name": "Gold Nath Nose Ring",      "category": "nose-ring", "material": "gold",     "style": "bridal",        "price": 15000, "colorTone": "warm", "rating": 4.7},
]

OUTFIT_RULES = {
    "bridal":       ["bridal-lehenga", "bridal-saree", "wedding-gown", "heavy-dupatta-set"],
    "traditional":  ["saree", "lehenga", "salwar-kameez", "anarkali"],
    "contemporary": ["western-dress", "kurti", "indo-western", "co-ord-set"],
    "casual":       ["jeans-top", "casual-dress", "co-ord-set", "tank-top"],
    "minimalist":   ["formal-wear", "business-casual", "monochrome-outfit"],
    "fusion":       ["indo-western", "ethnic-top-jeans", "fusion-wear"],
}

COLOR_RULES = {
    "gold":     ["red", "maroon", "green", "royal-blue", "off-white", "mustard"],
    "silver":   ["blue", "black", "grey", "white", "purple", "teal"],
    "diamond":  ["black", "white", "navy", "grey", "all-colors"],
    "rose-gold":["pink", "peach", "nude", "lavender", "blush"],
    "platinum": ["black", "white", "silver-grey", "midnight-blue"],
    "pearl":    ["pastel", "white", "cream", "soft-pink", "powder-blue"],
}


class JewelleryRecommender:
    """
    Content-Based Filtering Recommendation Engine
    Features: category, material, style, colorTone, price (normalized)
    """

    def __init__(self, data):
        self.df = pd.DataFrame(data)
        self.le_cat   = LabelEncoder()
        self.le_mat   = LabelEncoder()
        self.le_style = LabelEncoder()
        self.le_tone  = LabelEncoder()
        self.scaler   = StandardScaler()
        self.model    = NearestNeighbors(n_neighbors=5, metric='cosine', algorithm='brute')
        self._build()

    def _build(self):
        df = self.df.copy()
        df['cat_enc']   = self.le_cat.fit_transform(df['category'])
        df['mat_enc']   = self.le_mat.fit_transform(df['material'])
        df['style_enc'] = self.le_style.fit_transform(df['style'])
        df['tone_enc']  = self.le_tone.fit_transform(df['colorTone'])
        df['price_norm']= self.scaler.fit_transform(df[['price']])

        # Weight features: category (3x), material (2x), style (2x), tone (1x), price (1x)
        self.features = np.column_stack([
            df['cat_enc'].values   * 3,
            df['mat_enc'].values   * 2,
            df['style_enc'].values * 2,
            df['tone_enc'].values  * 1,
            df['price_norm'].values * 1,
        ])
        self.model.fit(self.features)
        print(f"✅ Recommender built with {len(df)} items | Features: {self.features.shape[1]}")

    def recommend_similar(self, item_id, n=4):
        """Get n most similar items to item_id"""
        idx = self.df[self.df['id'] == item_id].index
        if len(idx) == 0:
            print(f"❌ Item {item_id} not found")
            return []

        i = idx[0]
        distances, indices = self.model.kneighbors(
            self.features[i].reshape(1, -1), n_neighbors=n + 1
        )

        results = []
        for j, dist in zip(indices[0], distances[0]):
            if j == i:
                continue
            item = self.df.iloc[j].to_dict()
            item['similarity_score'] = round(1 - dist, 4)
            results.append(item)

        return results[:n]

    def recommend_outfit(self, item_id):
        """Get outfit recommendations for a jewellery item"""
        item = self.df[self.df['id'] == item_id]
        if item.empty:
            return None

        item = item.iloc[0]
        outfits = OUTFIT_RULES.get(item['style'], OUTFIT_RULES['contemporary'])
        colors  = COLOR_RULES.get(item['material'], ['all-colors'])

        return {
            'item': item['name'],
            'style': item['style'],
            'material': item['material'],
            'outfit_suggestions': outfits,
            'color_suggestions': colors,
        }

    def get_similarity_matrix(self):
        """Compute full cosine similarity matrix"""
        return cosine_similarity(self.features)

    def print_report(self):
        """Print full recommendation report"""
        print("\n" + "="*60)
        print("GLIMMR ML RECOMMENDATION ENGINE — TEST REPORT")
        print("="*60)

        for _, item in self.df.iterrows():
            print(f"\n🔍 Source: {item['name']} [{item['category']} | {item['material']} | {item['style']}]")

            similar = self.recommend_similar(item['id'], n=3)
            print(f"   Similar pieces:")
            for s in similar:
                print(f"   → {s['name']} (score: {s['similarity_score']:.3f}) [{s['category']} | {s['material']}]")

            outfit = self.recommend_outfit(item['id'])
            if outfit:
                print(f"   Outfit types: {', '.join(outfit['outfit_suggestions'][:3])}")
                print(f"   Colors: {', '.join(outfit['color_suggestions'][:4])}")


def evaluate_model(recommender):
    """Basic evaluation metrics"""
    print("\n" + "="*60)
    print("MODEL EVALUATION")
    print("="*60)

    sim_matrix = recommender.get_similarity_matrix()
    n = len(recommender.df)

    # Intra-category similarity (should be higher)
    same_cat_sims = []
    diff_cat_sims = []

    for i in range(n):
        for j in range(i+1, n):
            sim = sim_matrix[i][j]
            if recommender.df.iloc[i]['category'] == recommender.df.iloc[j]['category']:
                same_cat_sims.append(sim)
            else:
                diff_cat_sims.append(sim)

    print(f"Avg. same-category similarity:  {np.mean(same_cat_sims):.4f}")
    print(f"Avg. cross-category similarity: {np.mean(diff_cat_sims):.4f}")

    if np.mean(same_cat_sims) > np.mean(diff_cat_sims):
        print("✅ Model correctly scores same-category items higher")
    else:
        print("⚠️  Model may need tuning")

    # Category distribution
    print(f"\nDataset distribution:")
    for cat, count in recommender.df['category'].value_counts().items():
        bar = '█' * count
        print(f"  {cat:12s} | {bar} ({count})")


if __name__ == '__main__':
    print("🚀 GLIMMR ML Recommendation Engine")
    print("   Capstone Project | TIET Patiala\n")

    rec = JewelleryRecommender(JEWELLERY_DATA)
    rec.print_report()
    evaluate_model(rec)

    # Export similarity data as JSON for Node.js
    print("\n📦 Exporting similarity matrix...")
    sim = rec.get_similarity_matrix()
    ids = rec.df['id'].tolist()
    sim_export = {
        ids[i]: {
            ids[j]: round(float(sim[i][j]), 4)
            for j in range(len(ids)) if i != j and sim[i][j] > 0.7
        }
        for i in range(len(ids))
    }
    with open('similarity_cache.json', 'w') as f:
        json.dump(sim_export, f, indent=2)
    print("✅ Saved to similarity_cache.json")
    print("\nDone! 🎉")
