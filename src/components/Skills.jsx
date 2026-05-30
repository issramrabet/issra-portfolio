import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const CAT_COLORS = {
  'AI & Data':    '#a78bfa',
  'Languages':    '#22d3ee',
  'Web & Deploy': '#f472b6',
  'Tools':        '#fbbf24',
};

const skills = {
  'AI & Data':    ['PyTorch','TensorFlow','Pandas','NumPy','Scikit-learn','OpenCV','Hugging Face'],
  'Languages':    ['Python','TypeScript','JavaScript','C++','SQL','Bash','Rust'],
  'Web & Deploy': ['React','Next.js','Node.js','Docker','Vercel','Nginx','FastAPI'],
  'Tools':        ['Git','Figma','Linux','Neovim','Obsidian','Blender','Notion'],
};

// ── Canvas2D pill → THREE.Texture ─────────────────────────────────
function makeTagTexture(label, hexColor) {
  const fontSize = 26; const pad = 22;
  const cv = document.createElement('canvas');
  const cx = cv.getContext('2d');
  cx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;
  const tw = cx.measureText(label).width;
  cv.width  = tw + pad * 2 + 4;
  cv.height = fontSize + pad + 4;
  cx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;
  const r = cv.height / 2;
  const pill = (ctx) => {
    ctx.beginPath(); ctx.moveTo(r, 0); ctx.lineTo(cv.width - r, 0);
    ctx.arcTo(cv.width, 0, cv.width, cv.height, r);
    ctx.lineTo(cv.width, cv.height - r);
    ctx.arcTo(cv.width, cv.height, 0, cv.height, r);
    ctx.lineTo(r, cv.height);
    ctx.arcTo(0, cv.height, 0, 0, r);
    ctx.lineTo(0, r); ctx.arcTo(0, 0, cv.width, 0, r);
    ctx.closePath();
  };
  pill(cx); cx.fillStyle = hexColor + '18'; cx.fill();
  pill(cx); cx.strokeStyle = hexColor + 'cc'; cx.lineWidth = 2; cx.stroke();
  cx.fillStyle = '#ffffff';
  cx.fillText(label, pad, fontSize + pad / 2 - 1);
  const tex = new THREE.CanvasTexture(cv);
  tex.needsUpdate = true;
  return { tex, aspect: cv.width / cv.height };
}

function fibSphere(n, rMin, rMax) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / n);
    const a = 2 * Math.PI * i / phi;
    const r = rMin + Math.random() * (rMax - rMin);
    pts.push(new THREE.Vector3(
      r * Math.sin(theta) * Math.cos(a),
      r * Math.cos(theta),
      r * Math.sin(theta) * Math.sin(a)
    ));
  }
  return pts;
}

function SkillsCanvas({ canvasEl }) {
  useEffect(() => {
    if (!canvasEl) return;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvasEl.offsetWidth, canvasEl.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    // Prevent Three.js from darkening/gamma-shifting the texture
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, canvasEl.offsetWidth / canvasEl.offsetHeight, 0.1, 200);
    camera.position.set(0, 0, 10);

    // Stars
    for (const [cnt, size, opacity, spread] of [
      [700, 0.04, 0.5, 70],
      [250, 0.02, 0.2, 90],
    ]) {
      const pos = new Float32Array(cnt * 3);
      for (let i = 0; i < cnt * 3; i++) pos[i] = (Math.random() - 0.5) * spread;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      scene.add(new THREE.Points(g, new THREE.PointsMaterial({
        color: 0xc4b5fd, size, transparent: true, opacity,
      })));
    }

    // ── PHOTO: raw transparent PNG, no shapes, no glow, no halo ──
    // Natural portrait ratio 375×500 ≈ 0.75
    const photoTex = new THREE.TextureLoader().load('/iss.png');
    photoTex.minFilter = THREE.LinearFilter;
    photoTex.magFilter = THREE.LinearFilter;
    photoTex.colorSpace = THREE.LinearSRGBColorSpace;

    const imgH = 10.0;               // BIG — fills center
    const imgW = imgH * 0.75;       // natural aspect

    const photoMat = new THREE.MeshBasicMaterial({
      map: photoTex,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      alphaTest: 0.01,             // hard cut at silhouette edge, zero blur
    });
    const photoPlane = new THREE.Mesh(new THREE.PlaneGeometry(imgW, imgH), photoMat);
    photoPlane.position.set(0, -0.1, 0.2); // slightly in front of tag cloud
    scene.add(photoPlane);

    // ── Tag cloud ──
    const allSkills = Object.entries(skills).flatMap(([cat, items]) =>
      items.map(name => ({ name, color: CAT_COLORS[cat] || '#a78bfa' }))
    );
    const positions = fibSphere(allSkills.length, 4.4, 7.0);
    const group = new THREE.Group();
    scene.add(group);
    const sprites = [];

    allSkills.forEach((skill, i) => {
      const { tex, aspect } = makeTagTexture(skill.name, skill.color);
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: tex, transparent: true, depthWrite: false,
      }));
      const h = 0.46; sp.scale.set(h * aspect, h, 1);
      sp.position.copy(positions[i]);
      sp.userData = {
        basePos:  positions[i].clone(),
        bobDelay: i * 0.47 + Math.random(),
        bobSpeed: 0.38 + Math.random() * 0.3,
        bobAmp:   0.08 + Math.random() * 0.12,
        pulse:    Math.random() * Math.PI * 2,
      };
      group.add(sp);
      sprites.push(sp);
    });

    // Connection lines
    const linePts = [];
    for (let i = 0; i < positions.length; i++)
      for (let j = i + 1; j < positions.length; j++)
        if (positions[i].distanceTo(positions[j]) < 2.8)
          linePts.push(positions[i].clone(), positions[j].clone());
    group.add(new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(linePts),
      new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.06 })
    ));

    // Mouse
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onTouch = (e) => {
      mouse.tx = (e.touches[0].clientX / window.innerWidth  - 0.5) * 2;
      mouse.ty = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch, { passive: true });

    const onResize = () => {
      const w = canvasEl.offsetWidth, h = canvasEl.offsetHeight;
      renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    let rafId;
    const clock = new THREE.Clock();
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      group.rotation.y += 0.0018;
      group.rotation.x += (mouse.y * 0.18 - group.rotation.x) * 0.06;
      group.rotation.z += (-mouse.x * 0.12 - group.rotation.z) * 0.06;

      // Photo always faces camera — no rotation effects
      photoPlane.quaternion.copy(camera.quaternion);

      sprites.forEach(sp => {
        const { basePos, bobDelay, bobSpeed, bobAmp, pulse } = sp.userData;
        sp.position.x = basePos.x;
        sp.position.y = basePos.y + Math.sin(t * bobSpeed + bobDelay) * bobAmp;
        sp.position.z = basePos.z + Math.cos(t * bobSpeed * 0.65 + bobDelay) * bobAmp * 0.5;
        sp.material.opacity = 0.75 + Math.sin(t * 0.55 + pulse) * 0.25;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [canvasEl]);

  return null;
}



export default function Skills() {
  const [canvasEl, setCanvasEl] = useState(null);

  return (
    <section id="skills" style={{ padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient bg blobs — behind everything, just atmosphere */}
      <div style={{ position:'absolute',top:'5%',left:'-20%',width:'60%',height:'60%',
        background:'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
        pointerEvents:'none', filter:'blur(60px)', zIndex:0 }} />
      <div style={{ position:'absolute',bottom:'0%',right:'-15%',width:'50%',height:'50%',
        background:'radial-gradient(circle, rgba(34,211,238,0.03) 0%, transparent 70%)',
        pointerEvents:'none', filter:'blur(60px)', zIndex:0 }} />

      <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>

        {/* Label */}
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}}
          style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
          <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.72rem', letterSpacing:'0.32em', color:'#a78bfa', textTransform:'uppercase' }}>
            02. Skills
          </span>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)', maxWidth:80 }} />
        </motion.div>

        {/* Heading */}
        <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7,delay:0.1}}
          style={{ fontFamily:'"Syne","Clash Display",sans-serif', fontSize:'clamp(44px,6.5vw,78px)', lineHeight:0.93, letterSpacing:'-0.02em', marginBottom:14, fontWeight:700 }}>
          The{' '}
          <span style={{ background:'linear-gradient(135deg,#a78bfa 0%,#22d3ee 50%,#f472b6 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            Arsenal
          </span>
        </motion.h2>

      

        {/* ── 3D Canvas ── */}
        <motion.div initial={{opacity:0,scale:0.97}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:0.9,delay:0.15}}
          style={{ width:'100%', height:'clamp(460px,65vw,720px)', position:'relative', marginBottom:64 }}>

          {/* Faint scene glow only — no shapes */}
          <div style={{ position:'absolute',inset:0,pointerEvents:'none',zIndex:0,
            background:'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(139,92,246,0.07) 0%, transparent 72%)' }} />

          <canvas
            ref={el => { if (el && el !== canvasEl) setCanvasEl(el); }}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', display:'block', zIndex:1 }}
          />
          {canvasEl && <SkillsCanvas canvasEl={canvasEl} />}

          {/* Legend */}
          <div style={{ position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)',
            display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center', zIndex:2 }}>
            {Object.entries(CAT_COLORS).map(([cat, col]) => (
              <motion.div key={cat} whileHover={{scale:1.08}}
                style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'"JetBrains Mono",monospace',
                  fontSize:'0.58rem', letterSpacing:'0.1em', color:col, textTransform:'uppercase',
                  background:'rgba(4,4,15,0.75)', padding:'4px 12px', borderRadius:100,
                  border:`1px solid ${col}28`, backdropFilter:'blur(12px)', cursor:'default' }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:col, display:'inline-block', boxShadow:`0 0 6px ${col}` }} />
                {cat}
              </motion.div>
            ))}
          </div>
        </motion.div>

        
         
      </div>
    </section>
  );
}