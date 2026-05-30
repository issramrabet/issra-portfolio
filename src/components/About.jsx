

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stats = [
  { value: '7+',  label: 'Projects Built',       icon: '⚡' },
  { value: '6',   label: 'Programming Languages', icon: '</>' },
  { value: '90%', label: 'ML Model Accuracy',     icon: '🧠' },
  { value: '4',   label: 'Languages Spoken',      icon: '🌐' },
];

const languages = [
  { lang: 'Arabic',  level: 'Native',         pct: 100, flag: '🇸🇦', color: '#2f65da' },
  { lang: 'French',  level: 'C1 Fluent',       pct: 90,  flag: '🇫🇷', color: '#03b8b8' },
  { lang: 'English', level: 'C1 Professional', pct: 90,  flag: '🇬🇧', color: '#7151a4' },
  { lang: 'German',  level: 'A2 Basic',        pct: 40,  flag: '🇩🇪', color: '#19848e' },
];

const education = [
  { school: 'ENISo', degree: 'Applied Computer Engineering', period: 'Sep 2025 → Present', icon: '🏛️', logo: '/eniso.png', fallback: '🏛️', location: 'Sousse' },
  { school: 'IPEIM', degree: 'Preparatory Cycle — Math & Physics', period: 'Sep 2023 → Jun 2025', icon: '📐', logo: '/ipeim.png', fallback: '📐', location: 'Monastir' },
];

function EyeTrackingRobot() {
  const containerRef = useRef(null);
  const [offsets, setOffsets] = useState({ lx:0,ly:0,rx:0,ry:0 });
  const [blinking, setBlinking] = useState(false);
  const [mood, setMood] = useState('curious');
  const blinkRef = useRef(null);
  const W=180, H=Math.round(180*305/287);
  const LEX=74,LEY=80,REX=107,REY=80,SOCKET_R=10,PUPIL_MAX=3;

  useEffect(()=>{
    const scheduleBlink=()=>{ blinkRef.current=setTimeout(()=>{ setBlinking(true); setTimeout(()=>setBlinking(false),130); scheduleBlink(); },2000+Math.random()*4000); };
    scheduleBlink();
    const moods=['curious','excited','thinking'];
    const mi=setInterval(()=>setMood(moods[Math.floor(Math.random()*3)]),4000);
    return ()=>{ clearTimeout(blinkRef.current); clearInterval(mi); };
  },[]);

  useEffect(()=>{
    const onMove=(e)=>{
      if(!containerRef.current) return;
      const r=containerRef.current.getBoundingClientRect();
      const la=Math.atan2(e.clientY-(r.top+LEY),e.clientX-(r.left+LEX));
      const ra=Math.atan2(e.clientY-(r.top+REY),e.clientX-(r.left+REX));
      setOffsets({ lx:Math.cos(la)*PUPIL_MAX,ly:Math.sin(la)*PUPIL_MAX,rx:Math.cos(ra)*PUPIL_MAX,ry:Math.sin(ra)*PUPIL_MAX });
    };
    window.addEventListener('mousemove',onMove);
    return ()=>window.removeEventListener('mousemove',onMove);
  },[]);

  const moodColor={ curious:'#8855ee',excited:'#2251c8',thinking:'#247a89' }[mood];
  return (
    <motion.div ref={containerRef} initial={{ opacity:0,scale:0.8,y:10 }} animate={{ opacity:1,scale:1,y:0 }}
      transition={{ duration:0.7,ease:[0.16,1,0.3,1] }}
      style={{ position:'relative',width:W,height:H,userSelect:'none',flexShrink:0 }}>
      <motion.div animate={{ opacity:[0.4,0.8,0.4] }} transition={{ duration:2.5,repeat:Infinity,ease:'easeInOut' }}
        style={{ position:'absolute',inset:-8,borderRadius:'50%',background:`radial-gradient(circle,${moodColor}33 0%,transparent 70%)`,pointerEvents:'none',zIndex:0 }}/>
      <img src="/rob.png" alt="robot" draggable={false}
        style={{ width:W,height:H,display:'block',position:'relative',zIndex:1,objectFit:'contain',mixBlendMode:'screen',pointerEvents:'none' }}/>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position:'absolute',top:0,left:0,zIndex:2,pointerEvents:'none' }}>
        {[{cx:LEX,cy:LEY,ox:offsets.lx,oy:offsets.ly,spin:1},{cx:REX,cy:REY,ox:offsets.rx,oy:offsets.ry,spin:-1}].map((eye,idx)=>(
          <g key={idx}>
            <motion.circle cx={eye.cx} cy={eye.cy} r={SOCKET_R*0.75} fill="none" stroke={moodColor} strokeWidth="0.7" strokeDasharray="3 2.5" opacity="0.6"
              animate={{ rotate:eye.spin>0?360:-360 }} transition={{ duration:3.5,repeat:Infinity,ease:'linear' }}
              style={{ originX:`${eye.cx}px`,originY:`${eye.cy}px` }}/>
            {!blinking&&(<>
              <motion.circle cx={eye.cx+eye.ox} cy={eye.cy+eye.oy} r={SOCKET_R*0.38} fill={moodColor} animate={{ fill:moodColor }} transition={{ duration:0.4 }}/>
              <circle cx={eye.cx+eye.ox+SOCKET_R*0.18} cy={eye.cy+eye.oy-SOCKET_R*0.18} r={SOCKET_R*0.13} fill="white" opacity="0.95"/>
            </>)}
            {blinking&&<rect x={eye.cx-SOCKET_R} y={eye.cy-SOCKET_R} width={SOCKET_R*2} height={SOCKET_R*2} rx={SOCKET_R} fill="rgba(5,4,14,0.9)"/>}
          </g>
        ))}
      </svg>
      <motion.div animate={{ opacity:[0.3,0.8,0.3],color:moodColor }} transition={{ duration:2,repeat:Infinity }}
        style={{ position:'absolute',bottom:-18,left:'50%',transform:'translateX(-50%)',fontFamily:'monospace',fontSize:'0.5rem',letterSpacing:'0.18em',whiteSpace:'nowrap',pointerEvents:'none' }}>
        {mood.toUpperCase()}
      </motion.div>
    </motion.div>
  );
}

/* ── Stat card ── */
function StatCard({ value, label, icon, index, onClick, isActive }) {
  const cardRef=useRef(null), rafRef=useRef(null);
  const [hovered,setHovered]=useState(false);
  const [particles,setParticles]=useState([]);
  const pidRef=useRef(0);
  const isLang=label==='Languages Spoken';

  const burst=useCallback(()=>{
    const p=Array.from({length:7},(_,i)=>({ id:pidRef.current++,angle:(i/7)*360,c:i%2===0?'var(--violet)':'var(--cyan)' }));
    setParticles(p); setTimeout(()=>setParticles([]),750);
  },[]);

  const onMove=useCallback((e)=>{
    if(!cardRef.current) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current=requestAnimationFrame(()=>{
      const r=cardRef.current.getBoundingClientRect();
      const nx=(e.clientX-r.left)/r.width-0.5, ny=(e.clientY-r.top)/r.height-0.5;
      cardRef.current.style.transform=`translateY(-8px) perspective(600px) rotateX(${-ny*14}deg) rotateY(${nx*14}deg)`;
    });
  },[]);

  const onLeave=useCallback(()=>{
    cancelAnimationFrame(rafRef.current);
    if(cardRef.current) cardRef.current.style.transform='';
    setHovered(false);
  },[]);

  useEffect(()=>()=>cancelAnimationFrame(rafRef.current),[]);

  return (
    <motion.div initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }}
      viewport={{ once:true }} transition={{ duration:0.6,delay:index*0.1,ease:[0.16,1,0.3,1] }}
      style={{ position:'relative' }}>
      <div ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave}
        onMouseEnter={()=>{ setHovered(true); if(!isLang) burst(); }}
        onClick={isLang?()=>{ burst(); onClick(); }:undefined}
        style={{
          height:130,
          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          padding:'0 20px',
          background:isActive?'linear-gradient(135deg,rgba(136,85,238,.2),rgba(34,200,160,.1))':hovered?'linear-gradient(135deg,rgba(136,85,238,.12),rgba(34,200,160,.06))':'var(--surface)',
          border:'1px solid',
          borderColor:isActive?'var(--violet)':hovered?'var(--cyan)':'var(--border)',
          borderRadius:16,textAlign:'center',
          cursor:isLang?'pointer':'default',
          transition:'border-color .25s,box-shadow .3s,background .3s',
          position:'relative',overflow:'hidden',
          boxShadow:isActive?'0 0 0 2px rgba(136,85,238,.3),0 12px 40px rgba(136,85,238,.2)':hovered?'0 12px 40px rgba(34,180,180,.15),inset 0 1px 0 rgba(255,255,255,.05)':'none',
        }}>
        <div style={{ position:'absolute',inset:0,backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,.008) 2px,rgba(255,255,255,.008) 4px)',pointerEvents:'none',opacity:hovered||isActive?1:0,transition:'opacity .3s' }}/>
        <div style={{ position:'absolute',top:0,right:0,width:0,height:0,borderStyle:'solid',borderWidth:'0 26px 26px 0',borderColor:`transparent ${isActive?'rgba(136,85,238,.6)':hovered?'rgba(34,200,160,.45)':'rgba(136,85,238,.2)'} transparent transparent`,transition:'border-color .3s' }}/>
        <div style={{ fontSize:icon==='</>'?'0.7rem':'1rem',fontFamily:icon==='</>'?'monospace':'inherit',color:'var(--cyan)',marginBottom:6,opacity:0.75 }}>{icon}</div>
        <span style={{ display:'block',fontFamily:'var(--font-display)',fontSize:'clamp(1.8rem,3.5vw,2.5rem)',lineHeight:1,background:'linear-gradient(135deg,var(--violet),var(--cyan))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:6 }}>{value}</span>
        <div style={{ color:'var(--muted)',fontSize:'0.6rem',fontFamily:'var(--font-mono)',letterSpacing:'0.13em',textTransform:'uppercase' }}>{label}</div>
        {isLang&&<div style={{ marginTop:6,fontSize:'0.5rem',fontFamily:'var(--font-mono)',color:isActive?'var(--violet)':'var(--muted)',letterSpacing:'0.1em',transition:'color .3s' }}>{isActive?'● close':'● open'}</div>}
        <motion.div animate={hovered?{x:['-100%','200%']}:{x:'-100%'}} transition={{ duration:0.55,ease:'easeInOut' }}
          style={{ position:'absolute',top:0,left:0,width:'55%',height:'100%',background:'linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent)',pointerEvents:'none' }}/>
      </div>
      {particles.map(p=>(
        <motion.div key={p.id} initial={{ x:'50%',y:'50%',opacity:1,scale:1 }}
          animate={{ x:`calc(50% + ${Math.cos(p.angle*Math.PI/180)*55}px)`,y:`calc(50% + ${Math.sin(p.angle*Math.PI/180)*55}px)`,opacity:0,scale:0 }}
          transition={{ duration:0.65,ease:'easeOut' }}
          style={{ position:'absolute',top:0,left:0,width:6,height:6,borderRadius:'50%',background:p.c,pointerEvents:'none',zIndex:20 }}/>
      ))}
    </motion.div>
  );
}

/* ── Language cards — drop into a 2×2 grid below the stat boxes ── */
function LanguageCards({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="lang-grid"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}
          style={{ overflow: 'hidden' }}
        >
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, paddingTop:14 }}>
            {languages.map((l, i) => (
              <motion.div
                key={l.lang}
                initial={{ opacity:0, y:-30, scale:0.85, rotate: i%2===0?-6:6 }}
                animate={{ opacity:1, y:0, scale:1, rotate:0 }}
                exit={{ opacity:0, y:-20, scale:0.8, rotate: i%2===0?-8:8 }}
                transition={{ type:'spring', stiffness:320, damping:24, delay: i*0.06 }}
                style={{
                  padding:'14px 16px',
                  background:'rgba(8,6,20,0.9)',
                  border:`1px solid ${l.color}44`,
                  borderRadius:12,
                  boxShadow:`0 6px 24px ${l.color}18`,
                  backdropFilter:'blur(12px)',
                }}
              >
                <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10 }}>
                  <span style={{ fontSize:'1.4rem',lineHeight:1 }}>{l.flag}</span>
                  <div>
                    <div style={{ fontSize:'0.85rem',fontWeight:600,color:'white',lineHeight:1.1 }}>{l.lang}</div>
                    <div style={{ fontSize:'0.6rem',fontFamily:'monospace',color:l.color,letterSpacing:'0.08em',marginTop:2 }}>{l.level}</div>
                  </div>
                  <div style={{ marginLeft:'auto',fontSize:'0.7rem',fontFamily:'monospace',color:'rgba(255,255,255,.25)' }}>{l.pct}%</div>
                </div>
                <div style={{ height:3,background:'rgba(255,255,255,.07)',borderRadius:3,overflow:'hidden' }}>
                  <motion.div
                    initial={{ width:0 }}
                    animate={{ width:`${l.pct}%` }}
                    transition={{ duration:1,ease:[0.16,1,0.3,1],delay:0.2+i*0.06 }}
                    style={{ height:'100%',background:`linear-gradient(90deg,${l.color}99,${l.color})`,borderRadius:3,position:'relative' }}
                  >
                    <motion.div
                      animate={{ x:['-100%','200%'] }}
                      transition={{ duration:2,repeat:Infinity,ease:'linear',delay:0.8+i*0.15 }}
                      style={{ position:'absolute',top:0,left:0,width:'40%',height:'100%',background:'linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)',borderRadius:3 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Education card ── */
function EduCard({ school, degree, period, icon, logo, fallback, location }) {
  const [hovered,setHovered]=useState(false);
  const [imgFailed,setImgFailed]=useState(false);
  return (
    <div style={{ display:'flex',gap:16,padding:'18px 20px',background:hovered?'linear-gradient(135deg,rgba(136,85,238,.08),rgba(10,8,20,.8))':'var(--surface)',border:'1px solid',borderColor:hovered?'var(--violet)':'var(--border)',borderRadius:14,marginBottom:12,cursor:'default',position:'relative',transition:'all .25s',transform:hovered?'translateY(-3px) translateX(4px)':'none',boxShadow:hovered?'0 8px 32px rgba(100,50,200,.15)':'none',overflow:'visible',zIndex:hovered?2:1 }}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
      <span style={{ fontSize:'1.5rem',flexShrink:0,lineHeight:1,marginTop:2 }}>{icon}</span>
      <div>
        <div style={{ fontWeight:600,marginBottom:2,fontSize:'0.95rem' }}>{school}</div>
        <div style={{ color:'var(--muted)',fontSize:'0.82rem' }}>{degree}</div>
        <div style={{ color:'var(--violet)',fontSize:'0.7rem',fontFamily:'var(--font-mono)',marginTop:4,letterSpacing:'0.06em' }}>{period}</div>
      </div>
      <div style={{ position:'absolute',right:-150,top:'50%',transform:hovered?'translateY(-50%) translateX(0)':'translateY(-50%) translateX(-8px)',width:130,padding:'10px 10px 8px',background:'var(--surface)',border:'1px solid rgba(136,85,238,.3)',borderRadius:10,boxShadow:'0 8px 28px rgba(80,30,180,.15)',display:'flex',flexDirection:'column',alignItems:'center',gap:6,opacity:hovered?1:0,pointerEvents:'none',transition:'opacity .3s,transform .3s',zIndex:10 }}>
        <svg style={{ position:'absolute',left:-42,top:'50%',transform:'translateY(-50%)',overflow:'visible',pointerEvents:'none' }} width="42" height="2" viewBox="0 0 42 2">
          <line x1="0" y1="1" x2="42" y2="1" stroke="rgba(136,85,238,.5)" strokeWidth="1.5" strokeDasharray="4 3"/>
          <polygon points="4,1 10,4 10,-2" fill="rgba(136,85,238,.6)"/>
        </svg>
        {!imgFailed?<img src={logo} alt={`${school} logo`} onError={()=>setImgFailed(true)} style={{ width:72,height:72,objectFit:'contain',borderRadius:8,background:'rgba(120,80,200,.06)',padding:4 }}/>:<div style={{ width:72,height:72,borderRadius:8,background:'rgba(136,85,238,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem' }}>{fallback}</div>}
        <div style={{ fontSize:'0.6rem',letterSpacing:'0.1em',color:'var(--muted)',fontFamily:'var(--font-mono)',textAlign:'center' }}>{school} — {location}</div>
      </div>
    </div>
  );
}

/* ── MAIN ── */
export default function About() {
  const sectionRef = useRef(null);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.querySelectorAll('.reveal').forEach((el,i)=>setTimeout(()=>el.classList.add('visible'),i*120)); });
    },{ threshold:0.1 });
    if(sectionRef.current) obs.observe(sectionRef.current);
    return ()=>obs.disconnect();
  },[]);

  return (
    <section id="about" ref={sectionRef} style={{ padding:'clamp(80px,10vw,140px) clamp(24px,5vw,80px)',position:'relative' }}>

      <div className="reveal" style={{ display:'flex',alignItems:'center',gap:16,marginBottom:24 }}>
        <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.75rem',letterSpacing:'0.3em',color:'var(--violet)',textTransform:'uppercase' }}>00. About</span>
        <div style={{ flex:1,height:1,background:'var(--border)',maxWidth:80 }}/>
      </div>

      <div className="about-grid" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'start',maxWidth:1200,margin:'0 auto' }}>

        {/* LEFT */}
        <div>
          <div className="reveal" style={{ display:'flex',alignItems:'flex-start',gap:24,marginBottom:32 }}>
            <div style={{ flexShrink:0,marginTop:8 }}><EyeTrackingRobot /></div>
            <h2 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(36px,5vw,64px)',lineHeight:0.95,letterSpacing:'-0.01em',margin:0 }}>
              Building AI <br/><span className="gradient-text">Systems</span> that<br/>actually work
            </h2>
          </div>
          <p className="reveal" style={{ color:'var(--muted)',lineHeight:1.9,fontSize:'1.05rem',marginBottom:24 }}>
            I'm Issra Mrabet, a 1st-year Applied Computer Engineering student at ENISo (National School of Engineers of Sousse), Tunisia. I came through the Math-Physics preparatory cycle at IPEIM, Monastir, two years of building the foundations to then break them with code.
          </p>
          <p className="reveal" style={{ color:'var(--muted)',lineHeight:1.9,fontSize:'1.05rem',marginBottom:28 }}>
            I'm obsessed with the intersection of AI and real-world impact; from gesture-controlled interfaces to medical imaging diagnostics. I build things that see, think, and respond. Currently seeking a summer internship to contribute to production-level projects.
          </p>
          <div className="reveal" style={{ position:'relative' }}>
            {education.map(e=><EduCard key={e.school} {...e}/>)}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {/* stat grid */}
          <div className="reveal" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
            {stats.map((s,i)=>(
              <StatCard key={s.label} {...s} index={i}
                isActive={s.label==='Languages Spoken'&&langOpen}
                onClick={s.label==='Languages Spoken'?()=>setLangOpen(o=>!o):undefined}
              />
            ))}
          </div>

          {/* language cards drop into the empty space below */}
          <LanguageCards visible={langOpen} />
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}