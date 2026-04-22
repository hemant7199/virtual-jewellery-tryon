import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jewelleryAPI, recommendAPI } from '../utils/api';
import { MOCK_JEWELLERY, formatPrice, MATERIAL_EMOJI } from '../utils/mockData';
import JewelleryCard from '../components/JewelleryCard';
import './RecommendPage.css';

const OUTFIT_ICONS = {
  'saree': '👘', 'lehenga': '🥻', 'salwar-kameez': '👗',
  'anarkali': '👗', 'western-dress': '👗', 'kurti': '👚',
  'indo-western': '👘', 'jeans-top': '👖', 'casual-dress': '👗',
  'formal-wear': '👔', 'gown': '🎀', 'blouse': '👕'
};

export default function RecommendPage() {
  const navigate = useNavigate();
  const [jewelleryList, setJewelleryList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [outfitRec, setOutfitRec] = useState(null);
  const [jewelleryRec, setJewelleryRec] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('outfit');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await jewelleryAPI.getAll({ limit: 20 });
        setJewelleryList(res.data.data);
      } catch {
        setJewelleryList(MOCK_JEWELLERY);
      }
    };
    load();
  }, []);

  const handleSelect = async (item) => {
    setSelected(item);
    setLoading(true);
    try {
      const [outfitRes, jewRes] = await Promise.allSettled([
        recommendAPI.outfit(item._id),
        recommendAPI.jewellery(item._id, 4)
      ]);
      if (outfitRes.status === 'fulfilled') setOutfitRec(outfitRes.value.data.data);
      if (jewRes.status === 'fulfilled') setJewelleryRec(jewRes.value.data.data);
    } catch {
      // Fallback outfit data
      setOutfitRec(buildFallbackOutfit(item));
      setJewelleryRec(MOCK_JEWELLERY.filter(j => j._id !== item._id && j.style === item.style).slice(0, 4));
    } finally {
      setLoading(false);
    }
  };

  const buildFallbackOutfit = (item) => {
    const rules = {
      bridal:       { outfitSuggestions: ['bridal-lehenga', 'bridal-saree', 'wedding-gown'], colorSuggestions: ['red', 'maroon', 'off-white', 'gold'], stylingTips: ['Coordinate all jewellery metals for a cohesive bridal look.', 'Heavy jewellery pairs best with simple, elegant fabrics.'] },
      traditional:  { outfitSuggestions: ['saree', 'lehenga', 'salwar-kameez', 'anarkali'], colorSuggestions: ['red', 'green', 'royal-blue', 'mustard'], stylingTips: ['Traditional gold jewellery shines brightest against rich, solid colors.', 'Pair intricate pieces with simple outfits to let the jewellery stand out.'] },
      contemporary: { outfitSuggestions: ['western-dress', 'kurti', 'indo-western'], colorSuggestions: ['black', 'white', 'navy', 'grey'], stylingTips: ['Contemporary pieces work best with clean, minimal outfits.', 'Mix metals for a modern layered look.'] },
      minimalist:   { outfitSuggestions: ['formal-wear', 'business-casual', 'monochrome'], colorSuggestions: ['white', 'black', 'beige', 'grey'], stylingTips: ['Let minimalist jewellery be the subtle accent — keep rest of styling clean.', 'One statement minimalist piece is more powerful than many.'] },
      casual:       { outfitSuggestions: ['jeans-top', 'casual-dress', 'co-ord-set'], colorSuggestions: ['denim', 'white', 'pastels', 'earthy'], stylingTips: ['Casual jewellery should be lightweight and comfortable.', 'Stack simple pieces for effortless everyday style.'] },
      fusion:       { outfitSuggestions: ['indo-western', 'ethnic-top-jeans', 'fusion-wear'], colorSuggestions: ['teal', 'mustard', 'rust', 'olive'], stylingTips: ['Fusion jewellery bridges traditional and contemporary — experiment freely!', 'Mix textures: pair oxidized silver with denim or gold with western cuts.'] }
    };
    const rule = rules[item.style] || rules.contemporary;
    return { jewellery: item.name, style: item.style, material: item.material, ...rule, occasions: item.occasion };
  };

  const iconMap = { earring:'💎', necklace:'📿', ring:'💍', bracelet:'🔮', 'nose-ring':'✦', bangle:'⭕', pendant:'🌟' };

  return (
    <div className="recommend-page">
      {/* Header */}
      <div className="recommend-hero">
        <div className="container">
          <span className="section-tag">Style Intelligence</span>
          <h1>Your Personal <em className="gold-italic">Style Guide</em></h1>
          <div className="gold-line-center"></div>
          <p>Select any jewellery piece to receive AI-powered outfit and styling recommendations.</p>
        </div>
      </div>

      <div className="container recommend-body">
        <div className="recommend-layout">

          {/* Left: Jewellery Selector */}
          <div className="recommend-selector">
            <div className="rec-selector-header">
              <h3>Choose a Piece</h3>
              <span className="selector-count">{jewelleryList.length} items</span>
            </div>
            <div className="rec-item-list">
              {jewelleryList.map(item => (
                <div
                  key={item._id}
                  className={`rec-item ${selected?._id === item._id ? 'active' : ''}`}
                  onClick={() => handleSelect(item)}
                >
                  <span className="rec-item-icon">{iconMap[item.category] || '💎'}</span>
                  <div className="rec-item-info">
                    <span className="rec-item-name">{item.name}</span>
                    <div className="rec-item-meta">
                      <span className="badge badge-dark">{item.category}</span>
                      <span className="rec-item-price">{formatPrice(item.price, item.currency)}</span>
                    </div>
                  </div>
                  {selected?._id === item._id && <span className="rec-check">✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Results */}
          <div className="recommend-results">
            {!selected && (
              <div className="rec-empty">
                <span className="rec-empty-icon">✦</span>
                <h3>Select a jewellery piece</h3>
                <p>Our AI recommendation engine will instantly suggest outfit pairings, color combinations, and styling tips based on your selection.</p>
                <div className="rec-features">
                  {['Outfit Type Matching','Color Harmony Guide','Styling Tips','Related Pieces'].map(f => (
                    <div key={f} className="rec-feature-tag">
                      <span>✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selected && (
              <>
                {/* Selected item summary */}
                <div className="rec-selected-card">
                  <span className="rec-selected-icon">{iconMap[selected.category]}</span>
                  <div>
                    <h3>{selected.name}</h3>
                    <div className="rec-selected-meta">
                      <span className="badge badge-gold">{selected.style}</span>
                      <span className="badge badge-dark">{MATERIAL_EMOJI[selected.material]} {selected.material}</span>
                      <span className="price">{formatPrice(selected.price, selected.currency)}</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-gold btn-sm"
                    onClick={() => navigate(`/tryon/${selected._id}`, { state: { jewellery: selected } })}
                  >AR Try-On</button>
                </div>

                {/* Tabs */}
                <div className="rec-tabs">
                  <button className={`rec-tab ${activeTab === 'outfit' ? 'active' : ''}`} onClick={() => setActiveTab('outfit')}>Outfit & Colors</button>
                  <button className={`rec-tab ${activeTab === 'tips' ? 'active' : ''}`} onClick={() => setActiveTab('tips')}>Styling Tips</button>
                  <button className={`rec-tab ${activeTab === 'related' ? 'active' : ''}`} onClick={() => setActiveTab('related')}>Related Pieces</button>
                </div>

                {loading ? (
                  <div className="loading-screen" style={{ minHeight: 200 }}>
                    <div className="spinner"></div>
                    <span style={{ color: 'var(--grey)', fontSize: 13 }}>Generating recommendations…</span>
                  </div>
                ) : (
                  <div className="rec-tab-content">
                    {activeTab === 'outfit' && outfitRec && (
                      <div className="outfit-rec">
                        <div className="rec-section">
                          <h4>Recommended Outfit Types</h4>
                          <div className="outfit-cards">
                            {outfitRec.outfitSuggestions?.map(outfit => (
                              <div key={outfit} className="outfit-card">
                                <span className="outfit-card-icon">{OUTFIT_ICONS[outfit] || '👗'}</span>
                                <span className="outfit-card-name">{outfit.replace(/-/g,' ')}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rec-section">
                          <h4>Color Palette</h4>
                          <div className="color-palette">
                            {outfitRec.colorSuggestions?.map(color => (
                              <div key={color} className="color-chip">
                                <div className="color-swatch" style={{ background: colorToHex(color) }}></div>
                                <span>{color.replace(/-/g,' ')}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {outfitRec.occasions?.length > 0 && (
                          <div className="rec-section">
                            <h4>Perfect For</h4>
                            <div className="occasion-chips">
                              {outfitRec.occasions.map(o => (
                                <span key={o} className="badge badge-gold">{o}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'tips' && outfitRec && (
                      <div className="styling-tips">
                        <h4>Expert Styling Tips</h4>
                        <div className="tips-list">
                          {outfitRec.stylingTips?.map((tip, i) => (
                            <div key={i} className="tip-card">
                              <span className="tip-num">{String(i+1).padStart(2,'0')}</span>
                              <p>{tip}</p>
                            </div>
                          ))}
                        </div>

                        <div className="rec-section" style={{ marginTop: 24 }}>
                          <h4>General {MATERIAL_EMOJI[selected.material]} {selected.material} Tips</h4>
                          <div className="tips-list">
                            {getMaterialTips(selected.material).map((tip, i) => (
                              <div key={i} className="tip-card">
                                <span className="tip-num">✦</span>
                                <p>{tip}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'related' && (
                      <div className="related-rec">
                        <h4>Pieces That Pair Well</h4>
                        {jewelleryRec.length > 0 ? (
                          <div className="jewellery-grid" style={{ marginTop: 20 }}>
                            {jewelleryRec.map(item => <JewelleryCard key={item._id} item={item} />)}
                          </div>
                        ) : (
                          <p style={{ color: 'var(--grey)', fontSize: 13, marginTop: 12 }}>
                            No related pieces found. Browse our full collection!
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function colorToHex(color) {
  const map = {
    red:'#c0392b', maroon:'#800000', green:'#27ae60', 'royal-blue':'#2c4ab0',
    'off-white':'#f5f0e8', mustard:'#c9a825', navy:'#1a237e', black:'#1a1a1a',
    white:'#f0f0f0', grey:'#808080', blue:'#3498db', purple:'#8e44ad',
    teal:'#1abc9c', pink:'#e91e8c', peach:'#ffb347', nude:'#e8c9a0',
    lavender:'#9b59b6', blush:'#ffb6c1', rust:'#b7410e', olive:'#808000',
    beige:'#f5f5dc', denim:'#1560bd', pastel:'#b5d2e0', cream:'#fffdd0'
  };
  return map[color.toLowerCase().replace(/\s+/g,'-')] || '#c9a84c';
}

function getMaterialTips(material) {
  const tips = {
    gold: ['Store gold jewellery in soft cloth pouches away from other pieces.', 'Clean with warm soapy water and a soft brush; dry thoroughly.', 'Remove before swimming — chlorine damages gold alloys.'],
    silver: ['Polish silver regularly with a silver cloth to prevent tarnishing.', 'Store in airtight bags or anti-tarnish pouches.', 'Avoid contact with perfumes, lotions, and household chemicals.'],
    diamond: ['Diamonds attract grease — clean regularly with a soft brush and mild detergent.', 'Have settings professionally inspected annually.', 'Store diamonds separately — they can scratch other stones and metals.'],
    'rose-gold': ['Rose gold is durable but avoid harsh chemicals that can affect the copper alloy.', 'The warm tone pairs beautifully with soft, romantic colors.', 'Polish with a soft, dry cloth to maintain the rosy luster.'],
    pearl: ['Wipe pearls with a soft damp cloth after wearing — never soak them.', 'Store flat, not hanging, to prevent silk thread stretching.', 'Pearls are organic gems — they need moisture; wear them often!']
  };
  return tips[material] || ['Store jewellery separately to prevent scratching.', 'Remove before exercise, swimming, or using cleaning products.', 'Visit a jeweller annually for professional inspection and cleaning.'];
}
