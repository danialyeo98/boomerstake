/* BoomersStake — script.js */

/* ── Particle canvas with depth + shooting stars ── */
(function(){
  const cv=document.getElementById('bgc')||document.getElementById('bgc')||document.getElementById('bg-canvas');
  if(!cv)return;
  const cx=cv.getContext('2d');
  let W,H,pts=[],stars=[],tick=0,mouse={x:-999,y:-999};
  const PAL=[{r:168,g:85,b:247},{r:34,g:211,b:238},{r:124,g:58,b:237},{r:6,g:182,b:212},{r:245,g:158,b:11}];
  function rgba(p,a){return`rgba(${p.r},${p.g},${p.b},${a})`}
  function resize(){W=cv.width=innerWidth;H=cv.height=innerHeight}
  function seed(){
    const n=Math.min(110,Math.floor(W*H/12000));
    pts=Array.from({length:n},()=>{
      const c=PAL[Math.floor(Math.random()*PAL.length)];
      return{x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.22,
        r:Math.random()*1.6+.3,col:c,a:Math.random()*.45+.15,ph:Math.random()*Math.PI*2,
        sp:Math.random()*.012+.005,depth:Math.random()};
    });
  }
  function spawnStar(){
    const c=PAL[Math.floor(Math.random()*PAL.length)],ang=(Math.random()*30+15)*Math.PI/180,spd=Math.random()*5+4;
    stars.push({x:Math.random()*W*.6,y:Math.random()*H*.4,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,
      len:Math.random()*120+60,life:1,decay:Math.random()*.015+.01,col:c,w:Math.random()*1.5+.5});
  }
  function draw(){
    cx.clearRect(0,0,W,H);tick++;
    if(tick%220===0&&Math.random()<.6)spawnStar();
    const t=tick*.016;
    stars=stars.filter(s=>s.life>0);
    stars.forEach(s=>{
      const tx={x:s.x-s.vx*(s.len/8),y:s.y-s.vy*(s.len/8)};
      const g=cx.createLinearGradient(tx.x,tx.y,s.x,s.y);
      g.addColorStop(0,rgba(s.col,0));g.addColorStop(.7,rgba(s.col,s.life*.5));g.addColorStop(1,rgba(s.col,s.life*.9));
      cx.beginPath();cx.moveTo(tx.x,tx.y);cx.lineTo(s.x,s.y);cx.strokeStyle=g;cx.lineWidth=s.w;cx.stroke();
      const gh=cx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.w*3);
      gh.addColorStop(0,rgba(s.col,s.life));gh.addColorStop(1,rgba(s.col,0));
      cx.beginPath();cx.arc(s.x,s.y,s.w*3,0,Math.PI*2);cx.fillStyle=gh;cx.fill();
      s.x+=s.vx;s.y+=s.vy;s.life-=s.decay;
    });
    pts.forEach(p=>{
      p.x+=p.vx*(.4+p.depth*.8);p.y+=p.vy*(.4+p.depth*.8);
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.sqrt(dx*dx+dy*dy),rz=90+p.depth*40;
      if(d<rz&&d>0){const f=(1-d/rz)*.4;p.x+=dx/d*f;p.y+=dy/d*f}
      const alpha=p.a*(.5+.5*Math.sin(t*p.sp*60+p.ph)),br=.5+p.depth*.5,rad=p.r*(.7+p.depth*.6);
      const gl=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,rad*6);
      gl.addColorStop(0,rgba(p.col,alpha*.3*br));gl.addColorStop(1,rgba(p.col,0));
      cx.beginPath();cx.arc(p.x,p.y,rad*6,0,Math.PI*2);cx.fillStyle=gl;cx.fill();
      cx.beginPath();cx.arc(p.x,p.y,rad,0,Math.PI*2);cx.fillStyle=rgba(p.col,alpha*br);cx.fill();
    });
    const near=pts.filter(p=>p.depth>.5);
    for(let i=0;i<near.length;i++){for(let j=i+1;j<near.length;j++){
      const dx=near[i].x-near[j].x,dy=near[i].y-near[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<80){cx.beginPath();cx.moveTo(near[i].x,near[i].y);cx.lineTo(near[j].x,near[j].y);
        cx.strokeStyle=`rgba(110,60,255,${(1-d/80)*.08})`;cx.lineWidth=.6;cx.stroke();}
    }}
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',()=>{resize();seed()},{passive:true});
  window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY},{passive:true});
  window.addEventListener('mouseleave',()=>{mouse.x=-999;mouse.y=-999});
  resize();seed();draw();
})();


/* ── Remove duplicate background layers left in HTML ── */
(function removeDuplicateBgLayers(){
  ['bg-fog','bg-ambient','bg-vignette','bg-scanlines'].forEach(cls => {
    const all = document.querySelectorAll('.' + cls);
    if(all.length > 1){
      for(let i = 1; i < all.length; i++) all[i].remove();
    }
  });
})();

/* ── Cursor ── */
const cDotEl=document.getElementById('cDot'),cRingEl=document.getElementById('cRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;if(cDotEl){cDotEl.style.left=mx+'px';cDotEl.style.top=my+'px'}},{passive:true});
(function ar(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;if(cRingEl){cRingEl.style.left=rx+'px';cRingEl.style.top=ry+'px'}requestAnimationFrame(ar)})();
document.querySelectorAll('a,button,.pcard,.wc,.tpill,.fq-q,.ccard,.comm-card,.trust-pill').forEach(el=>{
  el.addEventListener('mouseenter',()=>cRingEl&&cRingEl.classList.add('hov','hover'));
  el.addEventListener('mouseleave',()=>cRingEl&&cRingEl.classList.remove('hov','hover'));
});

/* ── Navbar ── */
const navEl=document.getElementById('nav');
window.addEventListener('scroll',()=>navEl&&navEl.classList.toggle('stuck',scrollY>60),{passive:true});

/* ── Drawer ── */
const hbgEl=document.getElementById('hbg')||document.getElementById('hamburger');
const dCloseEl=document.getElementById('dClose')||document.getElementById('drawerClose');
const drawerEl=document.getElementById('drawer');
if(hbgEl)hbgEl.addEventListener('click',()=>{if(drawerEl)drawerEl.classList.add('open');document.body.style.overflow='hidden'});
if(dCloseEl)dCloseEl.addEventListener('click',closeDrawer);
function closeDrawer(){if(drawerEl)drawerEl.classList.remove('open');document.body.style.overflow=''}

/* ── Scroll reveal ──
   FIX: hero elements use CSS animation (heroFade) not this observer.
   Never observe anything inside #hero — causes opacity:0 freeze.
   ── */
const heroSection = document.getElementById('hero');
const roObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('in','visible');
      roObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fade,.reveal').forEach(el => {
  /* Skip hero section children — they animate via CSS on page load */
  if(heroSection && heroSection.contains(el)) return;
  roObs.observe(el);
});

/* ── Count-up ── */
const cuObs=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(!e.isIntersecting)return;
  const el=e.target,target=+(el.dataset.val||el.dataset.target||0),sfx=el.dataset.sfx||el.dataset.suffix||'';
  let s=null;
  (function step(ts){if(!s)s=ts;const p=Math.min((ts-s)/1800,1),ease=1-Math.pow(1-p,3);
    const v=Math.floor(ease*target);el.textContent=(target>999?v.toLocaleString():v)+sfx;
    if(p<1)requestAnimationFrame(step);})(performance.now());
  cuObs.unobserve(el);
}),{threshold:.5});
document.querySelectorAll('.count-up').forEach(el=>cuObs.observe(el));

/* ── FAQ ── */
document.querySelectorAll('.fq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const it=q.parentElement,was=it.classList.contains('open');
    document.querySelectorAll('.fq.open,.faq-item.open').forEach(f=>f.classList.remove('open'));
    if(!was)it.classList.add('open');
  });
});

/* ── Live feed ── */
const FD=[
  {name:'@perth_vip21',  action:'won big at Nexus Bet',        amt:'+$4,200',col:'var(--g3)',    icon:'🏆'},
  {name:'@brissy_roller',action:'claimed 500 free spins',      amt:'500 FS', col:'var(--c3)',    icon:'🎯'},
  {name:'@sydney_99',    action:'registered via partner link', amt:'New',    col:'var(--green)',  icon:'⚡'},
  {name:'@mel_vip_king', action:'cashed out instantly',        amt:'+$1,850',col:'var(--p3)',    icon:'💎'},
  {name:'@adelaider88',  action:'hit jackpot at Zenith',       amt:'+$8,400',col:'var(--g3)',    icon:'👑'},
  {name:'@goldcoast_g',  action:'received VIP cashback',       amt:'+$720',  col:'var(--c3)',    icon:'💰'},
];
let fi=0;
setInterval(()=>{
  const feed=document.getElementById('feed')||document.getElementById('activityFeed');if(!feed)return;
  const a=FD[fi%FD.length];fi++;
  const dc=['var(--green)','var(--ok)','var(--c4)','var(--p4)','var(--g3)'][fi%5];
  const row=document.createElement('div');
  row.className=(feed.id==='feed'?'feed-row':'activity-item');
  row.style.cssText='opacity:0;transform:translateX(-10px);transition:opacity .4s,transform .4s';
  const dotClass=feed.id==='feed'?'fdot':'activity-dot';
  const txtClass=feed.id==='feed'?'ftxt':'activity-text';
  const amtClass=feed.id==='feed'?'famt':'activity-val';
  row.innerHTML=`<div class="${dotClass}" style="background:${dc};box-shadow:0 0 6px ${dc}"></div><span class="${txtClass}">${a.icon} ${a.name} ${a.action}</span><span class="${amtClass}" style="color:${a.col}">${a.amt}</span>`;
  feed.insertBefore(row,feed.firstChild);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{row.style.opacity='1';row.style.transform='none'}));
  if(feed.children.length>5){
    const last=feed.lastChild;last.style.cssText+='opacity:0;transition:opacity .3s';
    setTimeout(()=>last.parentNode&&last.parentNode.removeChild(last),320);
  }
},3800);

/* ── Partner card spotlight ── */
document.querySelectorAll('.pcard').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
});

/* ── Multi-layer parallax ── 
   FIX: throttled, hero-only, skipped on touch devices.
   NEVER apply transform to position:fixed background elements
   as it causes scroll position artifacts.
   ─────────────────────────────────────────────────────── */
(function initParallax(){
  /* Skip entirely on touch-only devices — no mouse, no effect */
  if(!window.matchMedia('(hover:hover)').matches) return;

  let pMX=0, pMY=0, tMX=0, tMY=0;
  let heroVisible = true; /* assume visible until observer says otherwise */
  let lastFrame = 0;

  document.addEventListener('mousemove', e => {
    tMX = (e.clientX / innerWidth  - 0.5) * 2;
    tMY = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  /* Only run parallax while hero section is in view */
  const heroEl = document.getElementById('hero');
  if(heroEl && 'IntersectionObserver' in window){
    new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting;
    }, { threshold: 0 }).observe(heroEl);
  }

  function pl(ts){
    requestAnimationFrame(pl);
    /* Throttle to ~30fps max — prevents over-painting */
    if(ts - lastFrame < 32) return;
    lastFrame = ts;
    if(!heroVisible) return;

    pMX += (tMX - pMX) * 0.06;
    pMY += (tMY - pMY) * 0.06;

    /* Only move elements INSIDE the hero (not fixed background layers) */
    const neb = document.querySelector('.hero-nebula') || document.querySelector('.h-neb');
    if(neb) neb.style.transform = `translate(${pMX*18}px, ${pMY*12}px)`;

    const aurora = document.querySelector('.hero-aurora') || document.querySelector('.h-aurora');
    if(aurora) aurora.style.transform = `translate(${pMX*10}px, ${pMY*6}px)`;
    /* NOTE: .bg-fog is position:fixed — do NOT transform it (causes scroll jump) */
  }
  requestAnimationFrame(pl);

  /* JS smooth scroll for anchor links — replaces CSS scroll-behavior:smooth */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── Button: 3D tilt + ripple ── */
(function(){
  function tilt(btn){
    btn.addEventListener('mousemove',e=>{
      const r=btn.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)/(r.width/2),dy=(e.clientY-r.top-r.height/2)/(r.height/2);
      btn.style.transform=`translateY(-3px) scale(1.012) rotateX(${-dy*4}deg) rotateY(${dx*6}deg)`;
      btn.style.transformStyle='preserve-3d';
    });
    btn.addEventListener('mouseleave',()=>{btn.style.transform='';btn.style.transformStyle=''});
    btn.addEventListener('mousedown',()=>{btn.style.transform='translateY(1px) scale(.983)'});
    btn.addEventListener('mouseup',e=>{
      const r=btn.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)/(r.width/2),dy=(e.clientY-r.top-r.height/2)/(r.height/2);
      btn.style.transform=`translateY(-3px) scale(1.012) rotateX(${-dy*4}deg) rotateY(${dx*6}deg)`;
    });
  }
  function ripple(btn){
    btn.addEventListener('click',e=>{
      const r=btn.getBoundingClientRect(),max=Math.max(r.width,r.height)*1.6;
      const sp=document.createElement('span');
      sp.style.cssText=`position:absolute;width:${max}px;height:${max}px;left:${e.clientX-r.left-max/2}px;top:${e.clientY-r.top-max/2}px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.22) 0%,transparent 65%);transform:scale(0);animation:btnR .55s cubic-bezier(.4,0,.2,1) forwards;pointer-events:none;z-index:10;`;
      btn.appendChild(sp);sp.addEventListener('animationend',()=>sp.remove());
    });
  }
  const st=document.createElement('style');
  st.textContent='@keyframes btnR{0%{transform:scale(0);opacity:1}80%{transform:scale(1);opacity:.4}100%{transform:scale(1.1);opacity:0}}';
  document.head.appendChild(st);
  const hasHov=window.matchMedia('(hover:hover)').matches;
  document.querySelectorAll('.btn').forEach(btn=>{if(hasHov)tilt(btn);ripple(btn)});
})();
