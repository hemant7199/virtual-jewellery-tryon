import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { jewelleryAPI } from '../utils/api';
import { MOCK_JEWELLERY, formatPrice } from '../utils/mockData';
import './TryOnPage.css';

// ── AR Engine (MediaPipe + Canvas overlay) ──────────────────────────
class AREngine {
  constructor(videoEl, canvasEl) {
    this.video = videoEl;
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.faceMesh = null;
    this.hands = null;
    this.camera = null;
    this.currentJewellery = null;
    this.faceResults = null;
    this.handResults = null;
    this.fps = 0;
    this._frameCount = 0;
    this._lastTime = performance.now();
    this.active = false;
  }

  async init() {
    // Dynamically load MediaPipe
    try {
      const { FaceMesh } = await import('@mediapipe/face_mesh');
      const { Hands } = await import('@mediapipe/hands');
      const { Camera } = await import('@mediapipe/camera_utils');

      this.faceMesh = new FaceMesh({
        locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`
      });
      this.faceMesh.setOptions({
        maxNumFaces: 1, refineLandmarks: true,
        minDetectionConfidence: 0.5, minTrackingConfidence: 0.5
      });
      this.faceMesh.onResults(r => { this.faceResults = r; });

      this.hands = new Hands({
        locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
      });
      this.hands.setOptions({
        maxNumHands: 2, modelComplexity: 1,
        minDetectionConfidence: 0.5, minTrackingConfidence: 0.5
      });
      this.hands.onResults(r => { this.handResults = r; });

      this.camera = new Camera(this.video, {
        onFrame: async () => {
          if (!this.active) return;
          await this.faceMesh.send({ image: this.video });
          await this.hands.send({ image: this.video });
          this._render();
        },
        width: 640, height: 480
      });

      this.active = true;
      await this.camera.start();
      return true;
    } catch (err) {
      console.warn('MediaPipe load failed, using fallback:', err);
      return false;
    }
  }

  _render() {
    const { canvas, ctx, video } = this;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video mirrored
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    if (!this.currentJewellery) {
      this._renderLandmarkDots();
      this._updateFPS();
      return;
    }

    // Render jewellery based on category
    const cat = this.currentJewellery.category;
    if ((cat === 'earring' || cat === 'necklace' || cat === 'pendant' || cat === 'nose-ring') && this.faceResults?.multiFaceLandmarks?.length) {
      this._renderFaceJewellery();
    }
    if ((cat === 'ring' || cat === 'bracelet' || cat === 'bangle') && this.handResults?.multiHandLandmarks?.length) {
      this._renderHandJewellery();
    }

    this._renderLandmarkDots();
    this._updateFPS();
  }

  _renderFaceJewellery() {
    const lms = this.faceResults.multiFaceLandmarks[0];
    const { canvas, ctx } = this;
    const W = canvas.width, H = canvas.height;

    const get = (i) => ({ x: (1 - lms[i].x) * W, y: lms[i].y * H });

    const cat = this.currentJewellery.category;
    const material = this.currentJewellery.material;
    const colors = this._materialColors(material);

    if (cat === 'earring') {
      // Left ear: landmark 234, right ear: 454
      const leftEar  = get(234);
      const rightEar = get(454);
      const size = Math.abs(get(10).y - get(152).y) * 0.12;
      this._drawEarring(leftEar, size, colors);
      this._drawEarring(rightEar, size, colors);
    }

    if (cat === 'necklace' || cat === 'pendant') {
      const chin = get(152);
      const size = Math.abs(get(10).y - get(152).y) * 0.35;
      this._drawNecklace(chin, size, colors);
    }

    if (cat === 'nose-ring') {
      const noseL = get(49);
      const size = Math.abs(get(10).y - get(152).y) * 0.03;
      this._drawNoseRing(noseL, size, colors);
    }
  }

  _renderHandJewellery() {
    const { canvas, ctx } = this;
    const W = canvas.width, H = canvas.height;

    const cat = this.currentJewellery.category;
    const material = this.currentJewellery.material;
    const colors = this._materialColors(material);

    for (const hand of this.handResults.multiHandLandmarks) {
      const get = (i) => ({ x: (1 - hand[i].x) * W, y: hand[i].y * H });

      if (cat === 'ring') {
        // Ring finger: landmarks 13-16
        const base = get(13);
        const tip = get(16);
        const size = Math.hypot(tip.x - base.x, tip.y - base.y) * 0.4;
        this._drawRing(get(14), size, colors);
      }

      if (cat === 'bracelet' || cat === 'bangle') {
        const wrist = get(0);
        const size = Math.hypot(get(5).x - get(17).x, get(5).y - get(17).y) * 0.6;
        this._drawBracelet(wrist, size, colors);
      }
    }
  }

  _drawEarring(pos, size, colors) {
    const { ctx } = this;
    ctx.save();

    // Hook
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size * 0.3, 0, Math.PI * 2);
    ctx.strokeStyle = colors.main;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Drop / gem
    const dropY = pos.y + size * 1.2;
    const grad = ctx.createRadialGradient(pos.x, dropY, 0, pos.x, dropY, size);
    grad.addColorStop(0, colors.highlight);
    grad.addColorStop(0.5, colors.main);
    grad.addColorStop(1, colors.dark);

    ctx.beginPath();
    ctx.arc(pos.x, dropY, size, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Shine
    ctx.beginPath();
    ctx.arc(pos.x - size * 0.3, dropY - size * 0.3, size * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fill();

    ctx.restore();
  }

  _drawNecklace(pos, size, colors) {
    const { ctx } = this;
    ctx.save();

    // Chain arc
    ctx.beginPath();
    ctx.arc(pos.x, pos.y - size * 0.5, size * 1.2, Math.PI * 0.15, Math.PI * 0.85);
    ctx.strokeStyle = colors.main;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.85;
    ctx.stroke();

    // Pendant
    const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 0.4);
    grad.addColorStop(0, colors.highlight);
    grad.addColorStop(0.5, colors.main);
    grad.addColorStop(1, colors.dark);

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.globalAlpha = 0.9;
    ctx.fill();

    ctx.restore();
  }

  _drawNoseRing(pos, size, colors) {
    const { ctx } = this;
    ctx.save();

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, Math.max(size * 8, 4), 0, Math.PI * 2);
    ctx.strokeStyle = colors.main;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Gem on ring
    ctx.beginPath();
    ctx.arc(pos.x + size * 6, pos.y, size * 4, 0, Math.PI * 2);
    ctx.fillStyle = colors.highlight;
    ctx.fill();

    ctx.restore();
  }

  _drawRing(pos, size, colors) {
    const { ctx } = this;
    ctx.save();

    const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size);
    grad.addColorStop(0, colors.highlight);
    grad.addColorStop(0.5, colors.main);
    grad.addColorStop(1, colors.dark);

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
    ctx.strokeStyle = grad;
    ctx.lineWidth = size * 0.4;
    ctx.globalAlpha = 0.85;
    ctx.stroke();

    // Diamond
    ctx.beginPath();
    ctx.arc(pos.x, pos.y - size * 0.8, size * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = colors.highlight;
    ctx.globalAlpha = 0.95;
    ctx.fill();

    ctx.restore();
  }

  _drawBracelet(pos, size, colors) {
    const { ctx } = this;
    ctx.save();

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
    ctx.strokeStyle = colors.main;
    ctx.lineWidth = size * 0.18;
    ctx.globalAlpha = 0.8;
    ctx.stroke();

    // Beads / gems
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const bx = pos.x + Math.cos(angle) * size;
      const by = pos.y + Math.sin(angle) * size;
      ctx.beginPath();
      ctx.arc(bx, by, size * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = colors.highlight;
      ctx.globalAlpha = 0.9;
      ctx.fill();
    }

    ctx.restore();
  }

  _renderLandmarkDots() {
    if (!this.faceResults?.multiFaceLandmarks?.length) return;
    const { canvas, ctx } = this;
    const W = canvas.width, H = canvas.height;
    const lms = this.faceResults.multiFaceLandmarks[0];

    ctx.save();
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < lms.length; i += 10) {
      const x = (1 - lms[i].x) * W;
      const y = lms[i].y * H;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fillStyle = '#c9a84c';
      ctx.fill();
    }
    ctx.restore();
  }

  _materialColors(material) {
    const map = {
      gold:       { main: '#c9a84c', highlight: '#f0d080', dark: '#8a6a1e' },
      silver:     { main: '#b0b8c1', highlight: '#e8edf0', dark: '#6a7680' },
      diamond:    { main: '#a8d8f0', highlight: '#ffffff', dark: '#4a90b8' },
      'rose-gold':{ main: '#d4856a', highlight: '#f0b09a', dark: '#9a4a30' },
      'white-gold':{ main: '#d0d8e0', highlight: '#f0f4f8', dark: '#8090a0' },
      platinum:   { main: '#c0c8d0', highlight: '#e8ecf0', dark: '#707880' },
      pearl:      { main: '#f0ece4', highlight: '#ffffff', dark: '#c0b8a8' },
      default:    { main: '#c9a84c', highlight: '#f0d080', dark: '#8a6a1e' }
    };
    return map[material] || map.default;
  }

  _updateFPS() {
    this._frameCount++;
    const now = performance.now();
    if (now - this._lastTime >= 1000) {
      this.fps = this._frameCount;
      this._frameCount = 0;
      this._lastTime = now;
    }
  }

  setJewellery(item) { this.currentJewellery = item; }
  stop() {
    this.active = false;
    this.camera?.stop?.();
  }
}

// ── Component ────────────────────────────────────────────────────────
export default function TryOnPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [jewelleryList, setJewelleryList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [arReady, setArReady] = useState(false);
  const [arError, setArError] = useState(false);
  const [fps, setFps] = useState(0);
  const [loading, setLoading] = useState(true);
  const [camPermission, setCamPermission] = useState('pending'); // pending | granted | denied

  // Load jewellery list
  useEffect(() => {
    const load = async () => {
      try {
        const res = await jewelleryAPI.getAll({ limit: 20 });
        const list = res.data.data;
        setJewelleryList(list);
        // Pre-select from URL param or state
        if (id) {
          const pre = list.find(j => j._id === id) || state?.jewellery;
          if (pre) setSelected(pre);
        }
      } catch {
        setJewelleryList(MOCK_JEWELLERY);
        if (id) {
          const pre = MOCK_JEWELLERY.find(j => j._id === id) || state?.jewellery;
          if (pre) setSelected(pre);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Init AR engine
  useEffect(() => {
    const initAR = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      const engine = new AREngine(videoRef.current, canvasRef.current);
      engineRef.current = engine;

      // Request camera access
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } });

videoRef.current.srcObject = stream;

videoRef.current.onloadedmetadata = () => {
  videoRef.current.play().catch(err => {
    console.log("Video play error:", err);
  });
};

setCamPermission('granted');

        const ok = await engine.init();
        setArReady(ok);
        if (!ok) {
          // Fallback: just show video without MediaPipe
          setArReady('fallback');
        }
      } catch (err) {
        console.error('Camera error:', err);
        setCamPermission('denied');
        setArError(true);
      }
    };
    initAR();

    return () => { engineRef.current?.stop(); };
  }, []);

  // Update selected jewellery in engine
  useEffect(() => {
    engineRef.current?.setJewellery(selected);
  }, [selected]);

  // FPS ticker
  useEffect(() => {
    const interval = setInterval(() => {
      if (engineRef.current) setFps(engineRef.current.fps);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCapture = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `glimmr-tryon-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const categories = [...new Set(jewelleryList.map(j => j.category))];

  return (
    <div className="tryon-page">
      <div className="tryon-layout">

        {/* ── Camera Panel ─────────────── */}
        <div className="tryon-camera-panel">
          <div className="tryon-header">
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Back</button>
            <div className="tryon-title">
              <span className="ar-dot"></span>
              <span>AR Try-On</span>
            </div>
            <div className="tryon-fps">{fps > 0 ? `${fps} FPS` : '–'}</div>
          </div>

          <div className="camera-container">
            <video ref={videoRef} className="camera-video" playsInline muted autoPlay></video>
            <canvas ref={canvasRef} className="camera-canvas"></canvas>

            {camPermission === 'pending' && (
              <div className="camera-overlay">
                <div className="spinner"></div>
                <p>Requesting camera access…</p>
              </div>
            )}

            {camPermission === 'denied' && (
              <div className="camera-overlay camera-error">
                <span style={{ fontSize: '3rem' }}>📷</span>
                <h3>Camera Access Required</h3>
                <p>Please allow camera access in your browser settings to use AR try-on.</p>
                <button className="btn btn-gold" onClick={() => window.location.reload()}>
                  Try Again
                </button>
              </div>
            )}

            {/* AR Status */}
            {arReady && (
              <div className="ar-status">
                <span className={`ar-indicator ${arReady === true ? 'active' : 'fallback'}`}></span>
                {arReady === true ? 'AR Active' : 'Camera Active'}
              </div>
            )}

            {/* Selected piece info */}
            {selected && (
              <div className="selected-info">
                <span className="selected-name">{selected.name}</span>
                <span className="selected-price">{formatPrice(selected.price, selected.currency)}</span>
              </div>
            )}

            {/* Controls */}
            <div className="camera-controls">
              <button className="ctrl-btn" onClick={handleCapture} title="Capture Photo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
              <button className="ctrl-btn" onClick={() => setSelected(null)} title="Remove Jewellery">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* AR guidance */}
          <div className="ar-tips">
            <span>💡 Tips:</span>
            <span>Face well-lit area</span>·
            <span>Keep device steady</span>·
            <span>Look at camera</span>
          </div>
        </div>

        {/* ── Jewellery Selector ───────── */}
        <div className="tryon-selector">
          <div className="selector-header">
            <h3>Select Jewellery</h3>
            <span className="selector-count">{jewelleryList.length} pieces</span>
          </div>

          {/* Category filters */}
          <div className="category-filters">
            <button
              className={`cat-filter-btn ${!selected?.category ? 'active' : ''}`}
              onClick={() => setSelected(null)}
            >All</button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-filter-btn ${selected?.category === cat ? 'active' : ''}`}
                onClick={() => {
                  const first = jewelleryList.find(j => j.category === cat);
                  if (first) setSelected(first);
                }}
              >{cat}</button>
            ))}
          </div>

          {loading ? (
            <div className="loading-screen"><div className="spinner"></div></div>
          ) : (
            <div className="jewellery-selector-grid">
              {jewelleryList.map(item => (
                <div
                  key={item._id}
                  className={`selector-item ${selected?._id === item._id ? 'active' : ''}`}
                  onClick={() => setSelected(item)}
                >
                  <div className="selector-thumb">
                    {item.model3dUrl ? (
                      <img
                        src={item.model3dUrl.replace('/models/','/images/').replace('.glb','.svg')}
                        alt={item.name}
                        style={{width:'100%',height:'100%',objectFit:'contain',padding:'4px'}}
                        onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                      />
                    ) : null}
                    <span className="selector-icon" style={{display: item.model3dUrl ? 'none' : 'flex'}}>
                      {item.category === 'earring' ? '💎' :
                       item.category === 'necklace' ? '📿' :
                       item.category === 'ring' ? '💍' :
                       item.category === 'bracelet' ? '🔮' :
                       item.category === 'nose-ring' ? '✦' :
                       item.category === 'bangle' ? '⭕' : '🌟'}
                    </span>
                  </div>
                  <div className="selector-info">
                    <span className="selector-name">{item.name}</span>
                    <span className="selector-price">{formatPrice(item.price, item.currency)}</span>
                    <span className="selector-cat badge badge-dark">{item.category}</span>
                  </div>
                  {selected?._id === item._id && (
                    <span className="selector-check">✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
