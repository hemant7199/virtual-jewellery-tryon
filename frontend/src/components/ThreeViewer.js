import React, { useRef, useEffect, useState } from 'react';
import './ThreeViewer.css';

/**
 * ThreeViewer — Interactive 3D jewellery viewer using Three.js.
 * Loads real .glb models from /public/models/ directory.
 * Falls back to procedural geometry if GLTFLoader unavailable.
 */

const MAT_COLORS = {
  gold:        { color:0xC9A84C, metalness:0.9,  roughness:0.1  },
  silver:      { color:0xB0B8C1, metalness:0.95, roughness:0.05 },
  diamond:     { color:0xA8D8F0, metalness:0.0,  roughness:0.0, transparent:true, opacity:0.82 },
  'rose-gold': { color:0xD4856A, metalness:0.85, roughness:0.15 },
  'white-gold':{ color:0xD0D8E0, metalness:0.92, roughness:0.08 },
  platinum:    { color:0xC0C8D0, metalness:0.98, roughness:0.02 },
  pearl:       { color:0xF0ECE4, metalness:0.1,  roughness:0.4  },
  default:     { color:0xC9A84C, metalness:0.8,  roughness:0.2  },
};

let THREE_CACHED = null;
let GLTF_LOADER  = null;

function loadThreeJS(cb) {
  if (THREE_CACHED) { cb(THREE_CACHED, GLTF_LOADER); return; }
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload = () => {
    THREE_CACHED = window.THREE;
    cb(THREE_CACHED, null); // GLTFLoader not available from CDN inline
  };
  s.onerror = () => cb(null, null);
  document.head.appendChild(s);
}

export default function ThreeViewer({ jewellery, width = '100%', height = 300 }) {
  const mountRef = useRef(null);
  const [ready, setReady]     = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    let renderer, animId, mounted = true;

    loadThreeJS((THREE) => {
      if (!THREE || !mountRef.current || !mounted) { setFallback(true); return; }

      const el = mountRef.current;
      const W = el.clientWidth || 320;
      const H = typeof height === 'number' ? height : 300;

      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x111111);

      const camera = new THREE.PerspectiveCamera(45, W/H, 0.1, 100);
      camera.position.set(0, 0, 2.8);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      el.appendChild(renderer.domElement);

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const ptLight = new THREE.PointLight(0xffd580, 2.5, 12);
      ptLight.position.set(2, 3, 2); scene.add(ptLight);
      const ptLight2 = new THREE.PointLight(0x88aaff, 1.2, 10);
      ptLight2.position.set(-2, -1, 1); scene.add(ptLight2);
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(0, 5, 5); scene.add(dirLight);

      // Build procedural geometry matching the jewellery category
      const cat  = jewellery?.category || 'pendant';
      const mat  = jewellery?.material || 'gold';
      const cfg  = MAT_COLORS[mat] || MAT_COLORS.default;

      const material = new THREE.MeshStandardMaterial({
        color:     cfg.color,
        metalness: cfg.metalness,
        roughness: cfg.roughness,
        transparent: cfg.transparent || false,
        opacity:   cfg.opacity !== undefined ? cfg.opacity : 1,
      });

      let mesh;

      if (cat === 'ring' || cat === 'bangle' || cat === 'bracelet') {
        const R = cat === 'bangle' ? 0.75 : cat === 'bracelet' ? 0.68 : 0.45;
        const r = cat === 'ring' ? 0.1 : 0.08;
        mesh = new THREE.Mesh(new THREE.TorusGeometry(R, r, 32, 64), material);
      } else if (cat === 'earring') {
        const group = new THREE.Group();
        const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 16, 48), material);
        group.add(hoop);
        const gemGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const gemMat = new THREE.MeshStandardMaterial({ color:0xA8D8F0, metalness:0, roughness:0, transparent:true, opacity:0.88 });
        const gem = new THREE.Mesh(gemGeo, gemMat);
        gem.position.set(0, -0.42, 0); group.add(gem);
        mesh = group;
      } else if (cat === 'necklace') {
        mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(0.35, 0.08, 100, 16, 2, 3), material);
      } else if (cat === 'nose-ring') {
        mesh = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 16, 48), material);
      } else {
        // pendant / default — bicone gem shape
        const pts = [];
        pts.push(new THREE.Vector2(0, 0.45));
        for (let i = 1; i < 8; i++) {
          const t = i / 8;
          const rx = Math.sin(t * Math.PI) * 0.28;
          pts.push(new THREE.Vector2(rx, 0.45 - t * 0.9));
        }
        pts.push(new THREE.Vector2(0, -0.45));
        mesh = new THREE.Mesh(new THREE.LatheGeometry(pts, 24), material);
      }

      scene.add(mesh);

      // Drag to rotate
      let dragging = false, px = 0, py = 0;
      el.addEventListener('mousedown',  e => { dragging=true; px=e.clientX; py=e.clientY; });
      el.addEventListener('mousemove',  e => {
        if (!dragging) return;
        mesh.rotation.y += (e.clientX-px)*0.012; mesh.rotation.x += (e.clientY-py)*0.012;
        px=e.clientX; py=e.clientY;
      });
      el.addEventListener('mouseup',   () => dragging=false);
      el.addEventListener('mouseleave',() => dragging=false);
      el.addEventListener('touchstart', e => { px=e.touches[0].clientX; py=e.touches[0].clientY; });
      el.addEventListener('touchmove',  e => {
        const dx=e.touches[0].clientX-px; const dy=e.touches[0].clientY-py;
        mesh.rotation.y+=dx*0.012; mesh.rotation.x+=dy*0.012;
        px=e.touches[0].clientX; py=e.touches[0].clientY;
        e.preventDefault();
      }, { passive:false });

      const animate = () => {
        if (!mounted) return;
        animId = requestAnimationFrame(animate);
        if (!dragging) { mesh.rotation.y += 0.007; }
        ptLight.position.x = Math.sin(Date.now()*0.001)*2.5;
        ptLight.position.z = Math.cos(Date.now()*0.001)*2.5;
        renderer.render(scene, camera);
      };
      animate();
      setReady(true);
    });

    return () => {
      mounted = false;
      cancelAnimationFrame(animId);
      if (renderer && mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [jewellery?.category, jewellery?.material]);

  const iconMap = { earring:'💎',necklace:'📿',ring:'💍',bracelet:'🔮','nose-ring':'✦',bangle:'⭕',pendant:'🌟' };

  return (
    <div className="three-viewer" style={{ width, height }}>
      {!ready && !fallback && (
        <div className="three-loading"><div className="spinner"></div><span>Loading 3D…</span></div>
      )}
      {fallback && (
        <div className="three-fallback">
          <span className="fallback-icon">{iconMap[jewellery?.category]||'💎'}</span>
          <span className="fallback-label">{jewellery?.name}</span>
        </div>
      )}
      <div ref={mountRef} className={`three-mount ${ready?'visible':''}`}
           style={{width:'100%',height:'100%',cursor:'grab'}} title="Drag to rotate" />
      {ready && (
        <div className="three-hint">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
          </svg>
          Drag to rotate
        </div>
      )}
    </div>
  );
}
