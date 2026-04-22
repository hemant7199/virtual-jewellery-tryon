import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import './AROverlay.css';

const AROverlay = forwardRef(({ jewellery, onReady, onError, onFPSUpdate }, ref) => {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState('idle');

  useImperativeHandle(ref, () => ({
    setJewellery: (item) => { if (engineRef.current) engineRef.current.jewellery = item; },
    capture: () => canvasRef.current?.toDataURL('image/png') || null,
    getFPS:  () => engineRef.current?.fps || 0,
    stop:    () => {
      engineRef.current?.stop();
      streamRef.current?.getTracks().forEach(t => t.stop());
    },
  }));

  useEffect(() => {
    let engine;
    setStatus('loading');

    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
    }).then(stream => {
      streamRef.current = stream;
      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = async () => {
        try {
          await videoRef.current.play();

          engine = new CanvasAREngine(videoRef.current, canvasRef.current);
          engine.start((fps) => onFPSUpdate?.(fps));
          engineRef.current = engine;

          if (jewellery) engine.jewellery = jewellery;

          setStatus('active');
          onReady?.('canvas');

        } catch (err) {
          console.error("Video play error:", err);
        }
      };
    }).catch(err => {
      setStatus('error');
      onError?.(err);
    });

    return () => {
      engine?.stop();
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) engineRef.current.jewellery = jewellery;
  }, [jewellery]);

  return (
    <div className="ar-overlay-wrap">
      <video ref={videoRef} className="ar-video" playsInline muted autoPlay />
      <canvas ref={canvasRef} className="ar-canvas" />

      {status === 'loading' && (
        <div className="ar-status-overlay">
          <div className="spinner" />
          <span>Initialising camera…</span>
        </div>
      )}

      {status === 'error' && (
        <div className="ar-status-overlay ar-error">
          <span style={{ fontSize:'3rem' }}>📷</span>
          <p>Camera access denied. Allow camera and refresh.</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

      {status === 'active' && (
        <div className="ar-badge">
          <span className="ar-dot green" />
          AR Live
        </div>
      )}
    </div>
  );
});

AROverlay.displayName = 'AROverlay';
export default AROverlay;

/* ── Canvas AR Engine ───────────────── */
class CanvasAREngine {
  constructor(video, canvas) {
    this.video = video;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.jewellery = null;
    this.running = false;
    this.fps = 0;
    this._frames = 0;
    this._lastSec = performance.now();
  }

  start(onFPS) {
    this.running = true;
    this.onFPS = onFPS;
    this._tick();
  }

  stop() {
    this.running = false;
  }

  _tick() {
    if (!this.running) return;
    requestAnimationFrame(() => this._tick());

    const { canvas, ctx, video } = this;
    if (!video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    if (this.jewellery) this._draw();

    this._fps();
  }

  _draw() {
    const { canvas, ctx } = this;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    const c = this._colors(this.jewellery.material);
    const cat = this.jewellery.category;

    ctx.save();
    ctx.globalAlpha = 0.9;

    if (cat === 'bracelet' || cat === 'bangle') {
      const x = cx + W * 0.15;
      const y = cy + H * 0.25;
      const r = H * 0.09;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = c.main;
      ctx.lineWidth = r * 0.2;
      ctx.stroke();

      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(
          x + Math.cos(a) * r,
          y + Math.sin(a) * r,
          r * 0.12,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = c.hl;
        ctx.fill();
      }
    }

    ctx.restore();
  }

  _colors(mat) {
    return {
      main: '#c9a84c',
      hl: '#f0d080',
      dark: '#8a6a1e'
    };
  }

  _fps() {
    this._frames++;
    const now = performance.now();
    if (now - this._lastSec >= 1000) {
      this.fps = this._frames;
      this._frames = 0;
      this._lastSec = now;
      this.onFPS?.(this.fps);
    }
  }
}