
/* BoomerStake AUS — script.js */

/* ── Page entrance (reveal body) — runs first so a later error can't keep it hidden ── */
(function revealBody() {
  const show = () => { document.body.style.opacity = '1'; };
  if (document.readyState === 'complete') show();
  window.addEventListener('load', show);
  document.addEventListener('DOMContentLoaded', show);
  setTimeout(show, 1500); /* safety net */
})();

/* ── Navbar scroll ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav && nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile drawer — FIXED ── */
let drawerOpen = false;
const hamburger   = document.getElementById('hamburger');
const drawerEl    = document.getElementById('drawer');
const drawerClose = document.getElementById('drawerClose');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
  drawerOpen = true;
  drawerEl && drawerEl.classList.add('open');
  drawerOverlay && drawerOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  /* Animate hamburger → X */
  if(hamburger) {
    const spans = hamburger.querySelectorAll('span');
    if(spans[0]) spans[0].style.cssText = 'transform:translateY(7px) rotate(45deg)';
    if(spans[1]) spans[1].style.cssText = 'opacity:0;transform:scaleX(0)';
    if(spans[2]) spans[2].style.cssText = 'transform:translateY(-7px) rotate(-45deg)';
  }
}

function closeDrawer() {
  drawerOpen = false;
  drawerEl && drawerEl.classList.remove('open');
  drawerOverlay && drawerOverlay.classList.remove('open');
  document.body.style.overflow = '';
  /* Reset hamburger */
  if(hamburger) {
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => s.style.cssText = '');
  }
}

function toggleDrawer() {
  drawerOpen ? closeDrawer() : openDrawer();
}

hamburger    && hamburger.addEventListener('click',    toggleDrawer);
drawerClose  && drawerClose.addEventListener('click',  closeDrawer);
drawerOverlay && drawerOverlay.addEventListener('click', closeDrawer);

/* Close drawer on Escape key */
document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && drawerOpen) closeDrawer();
});

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if(id === '#') return;
    const target = document.querySelector(id);
    if(!target) return;
    e.preventDefault();
    closeDrawer();
    /* Small delay so drawer closes before scrolling */
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, drawerOpen ? 300 : 0);
  });
});

/* ── Scroll reveal ── */
const heroEl = document.getElementById('hero');
const roObs  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      e.target.classList.add('in');
      roObs.unobserve(e.target);
    }
  });
}, { threshold: 0, rootMargin: '0px' });

document.querySelectorAll('.fade').forEach(el => {
  if(heroEl && heroEl.contains(el)) return;
  const rect = el.getBoundingClientRect();
  if(rect.top < window.innerHeight && rect.bottom > 0) {
    el.classList.add('in');
  } else {
    roObs.observe(el);
  }
});

/* Safety net — reveal anything still hidden after 1.8s */
setTimeout(() => {
  document.querySelectorAll('.fade:not(.in)').forEach(el => el.classList.add('in'));
}, 1800);

/* ── Count-up ── */
function runCountUp(el) {
  const target = +(el.dataset.val || 0);
  const sfx    = el.dataset.sfx || '';
  let start    = null;
  (function step(ts) {
    if(!start) start = ts;
    const p    = Math.min((ts - start) / 1600, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const v    = Math.floor(ease * target);
    el.textContent = (el.dataset.pfx || '') + (target > 999 ? v.toLocaleString() : v) + sfx;
    if(p < 1) requestAnimationFrame(step);
  })(performance.now());
}
const cuObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    runCountUp(e.target);
    cuObs.unobserve(e.target);
  });
}, { threshold: 0 });
document.querySelectorAll('.count-up').forEach(el => {
  const rect = el.getBoundingClientRect();
  if(rect.top < window.innerHeight) setTimeout(() => runCountUp(el), 300);
  else cuObs.observe(el);
});

/* ── FAQ accordion ── */
document.querySelectorAll('.fq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const was  = item.classList.contains('open');
    document.querySelectorAll('.fq.open').forEach(f => f.classList.remove('open'));
    if(!was) item.classList.add('open');
  });
});

/* ── Live activity feed ── */
const FD = [
  { name:'@perth_vip21',   action:'won big at BoomerStake',    amt:'+$4,200', col:'#C9A84C', icon:'🏆' },
  { name:'@brissy_roller', action:'claimed free spins',          amt:'500 FS',  col:'#0066FF', icon:'🎯' },
  { name:'@sydney_99',     action:'registered via partner link', amt:'New',     col:'#00C896', icon:'⚡' },
  { name:'@mel_vip_king',  action:'cashed out instantly',        amt:'+$1,850', col:'#0066FF', icon:'💎' },
  { name:'@adelaider88',   action:'hit jackpot at RTPPokies',    amt:'+$8,400', col:'#C9A84C', icon:'👑' },
  { name:'@goldcoast_g',   action:'received VIP cashback',       amt:'+$720',   col:'#00C896', icon:'💰' },
];
let fi = 0;
setInterval(() => {
  const feed = document.getElementById('feed');
  if(!feed) return;
  const a  = FD[fi % FD.length]; fi++;
  const dc = ['#00C896','#0066FF','#C9A84C'][fi % 3];
  const row = document.createElement('div');
  row.className = 'feed-row';
  row.style.cssText = 'opacity:0;transform:translateX(-8px);transition:opacity .35s,transform .35s';
  row.innerHTML = `<div class="fdot" style="background:${dc}"></div><span class="ftxt">${a.icon} ${a.name} ${a.action}</span><span class="famt" style="color:${a.col}">${a.amt}</span>`;
  feed.insertBefore(row, feed.firstChild);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    row.style.opacity = '1'; row.style.transform = 'none';
  }));
  while(feed.children.length > 5) {
    const last = feed.lastChild;
    last.style.opacity = '0';
    setTimeout(el => el.parentNode && el.parentNode.removeChild(el), 300, last);
  }
}, 3800);

/* ── Partner card 3D tilt ── */
if(window.matchMedia('(hover:hover)').matches) {
  document.querySelectorAll('.pcard:not(.pcard-hero)').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width/2)  / (r.width/2);
      const dy = (e.clientY - r.top  - r.height/2) / (r.height/2);
      const lift = card.classList.contains('featured') ? '-8px' : '-6px';
      card.style.transform = `translateY(${lift}) rotateX(${-dy*2.5}deg) rotateY(${dx*3.5}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transformStyle = '';
    });
  });
}

/* ── Button ripple ── */
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes ripple{0%{transform:scale(0);opacity:1}100%{transform:scale(1.3);opacity:0}}';
document.head.appendChild(rippleStyle);
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const r   = btn.getBoundingClientRect();
    const max = Math.max(r.width, r.height) * 1.5;
    const sp  = document.createElement('span');
    sp.style.cssText = `position:absolute;width:${max}px;height:${max}px;
      left:${e.clientX-r.left-max/2}px;top:${e.clientY-r.top-max/2}px;
      border-radius:50%;background:rgba(255,255,255,0.2);transform:scale(0);
      animation:ripple .5s ease forwards;pointer-events:none;z-index:10;`;
    btn.appendChild(sp);
    sp.addEventListener('animationend', () => sp.remove());
  });
});

/* ── mailto form feedback ── */
const form = document.querySelector('form[action^="mailto"]');
if(form) {
  form.addEventListener('submit', () => {
    const btn = form.querySelector('[type="submit"]');
    if(btn) {
      btn.textContent = '✓ Opening your email app...';
      btn.style.background = '#00C896';
      setTimeout(() => { btn.textContent = 'Send Message →'; btn.style.background = ''; }, 3500);
    }
  });
}

/* ════════════════════════════════════════
   PREMIUM WOW EFFECTS
   ════════════════════════════════════════ */

/* 1 — Scroll progress bar */
const scrollProgress = document.querySelector('.scroll-progress');
if (scrollProgress) {
  const onScrollProgress = () => {
    const el = document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    const p = max > 0 ? el.scrollTop / max : 0;
    scrollProgress.style.transform = 'scaleX(' + p + ')';
  };
  window.addEventListener('scroll', onScrollProgress, { passive: true });
  onScrollProgress();
}

/* 3 — Hero dashboard mouse tilt */
const heroDashboard = document.getElementById('heroDashboard');
if (heroDashboard && window.matchMedia('(hover:hover)').matches) {
  const dashCard = heroDashboard.querySelector('.hero-dashboard') || heroDashboard;
  heroDashboard.addEventListener('mousemove', e => {
    const r = heroDashboard.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2)  / (r.width / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    dashCard.style.transform = `perspective(800px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg)`;
  });
  heroDashboard.addEventListener('mouseleave', () => { dashCard.style.transform = ''; });
}

/* 4 — Review/why cards: staggered reveal (80ms apart) */
const wowObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const sibs = el.parentElement ? [...el.parentElement.querySelectorAll('.wow-card')] : [el];
    const i = Math.max(0, sibs.indexOf(el));
    el.style.transitionDelay = (i * 80) + 'ms';
    el.classList.add('wow-in');
    wowObs.unobserve(el);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.wow-card').forEach(el => wowObs.observe(el));
/* Safety net — never leave a card invisible */
setTimeout(() => {
  document.querySelectorAll('.wow-card:not(.wow-in)').forEach(el => el.classList.add('wow-in'));
}, 2200);

/* 5 — Stats counter (.sb-val) with ease-out cubic */
function animateSbVal(el) {
  const raw = el.textContent.trim();
  if (raw.indexOf('/') !== -1) return;                 // skip values like "24/7"
  const m = raw.match(/^([^\d-]*)([\d,]*\.?\d+)(.*)$/);
  if (!m) return;
  const prefix = m[1], numStr = m[2], suffix = m[3];
  const hasComma = numStr.indexOf(',') !== -1;
  const decimals = numStr.indexOf('.') !== -1 ? numStr.split('.')[1].length : 0;
  const target = parseFloat(numStr.replace(/,/g, ''));
  if (!isFinite(target)) return;
  const fmt = v => {
    let s = decimals ? v.toFixed(decimals) : String(Math.round(v));
    if (hasComma) s = Number(s).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return prefix + s + suffix;
  };
  let start = null;
  (function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / 1600, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(ease * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = fmt(target);
  })(performance.now());
}
const sbObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateSbVal(e.target); sbObs.unobserve(e.target); } });
}, { threshold: 0.3 });
document.querySelectorAll('.sb-val').forEach(el => sbObs.observe(el));

/* 6 — Why cards: cursor spotlight (--mx / --my) */
if (window.matchMedia('(hover:hover)').matches) {
  document.querySelectorAll('.wc').forEach(wc => {
    wc.addEventListener('mousemove', e => {
      const r = wc.getBoundingClientRect();
      wc.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      wc.style.setProperty('--my', (e.clientY - r.top)  + 'px');
    });
  });
}

/* 8 — Trust wave: hovering one item briefly nudges its neighbours */
const trustItems = [...document.querySelectorAll('.trust-item')];
trustItems.forEach((item, idx) => {
  item.addEventListener('mouseenter', () => {
    [idx - 1, idx + 1].forEach(n => {
      const nb = trustItems[n];
      if (!nb) return;
      nb.style.transition = 'transform 0.3s ease';
      nb.style.transform = 'translateY(-4px)';
      setTimeout(() => { nb.style.transform = ''; }, 300);
    });
  });
});

/* 9 — Parallax on hero 3D chips (independent `translate` so float animation still runs) */
const parallaxChips = [...document.querySelectorAll('.chip3d')];
if (parallaxChips.length) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    parallaxChips.forEach((c, i) => {
      c.style.translate = '0 ' + (-y * ((i + 1) * 0.05)) + 'px';
    });
  }, { passive: true });
}

/* ════════ MULTI-PAGE SCROLL ANIMATIONS ════════ */

/* Auto-assign reveal animation to section headings (variety + drama) */
document.querySelectorAll('.section-head').forEach(el => {
  if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'up');
});

/* [data-reveal] observer */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('reveal-in'); revObs.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => {
  const r = el.getBoundingClientRect();
  if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('reveal-in');
  else revObs.observe(el);
});
/* safety net */
setTimeout(() => document.querySelectorAll('[data-reveal]:not(.reveal-in)').forEach(el => el.classList.add('reveal-in')), 2000);

/* Hero scroll-dissolve — content drifts up, fades & shrinks as you scroll past */
const heroSection = document.getElementById('hero');
if (heroSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const layer = heroSection.querySelector('.hero-layout');
  const floor = heroSection.querySelector('.hero-perspective-floor');
  const onHeroScroll = () => {
    const y = window.scrollY;
    if (y > 760) return;
    const p = Math.min(y / 620, 1);
    if (layer) { layer.style.opacity = String(1 - p * 0.92); layer.style.transform = `translateY(${y * 0.16}px) scale(${1 - p * 0.06})`; layer.style.filter = `blur(${p * 5}px)`; }
    if (floor) { floor.style.opacity = String(0.55 * (1 - p)); }
  };
  window.addEventListener('scroll', onHeroScroll, { passive: true });
}

/* ════════ PARTNER DETAIL PAGE REVEALS ════════ */
(function partnerReveals(){
  const els = document.querySelectorAll('.partner-hero-inner, .feat-item, .step-box, .partner-bonus-card, .partner-detail-grid > *, .step-register');
  els.forEach(el => {
    if (el.hasAttribute('data-reveal') || el.classList.contains('fade')) return;
    el.setAttribute('data-reveal', 'up');
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('reveal-in');
    else if (typeof revObs !== 'undefined') revObs.observe(el);
  });
})();

/* ════════ PROMOTIONS CAROUSEL ════════ */
(function promoCarousel(){
  const track = document.getElementById('promoTrack');
  if (!track) return;
  const slides = [...track.children];
  const dotsWrap = document.getElementById('promoDots');
  const car = document.getElementById('promoCarousel');
  let i = 0, timer = null;
  slides.forEach((_, k) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Go to promotion ' + (k + 1));
    if (k === 0) b.className = 'active';
    b.addEventListener('click', () => go(k));
    dotsWrap.appendChild(b);
  });
  const dots = [...dotsWrap.children];
  function render(){ track.style.transform = 'translateX(-' + (i * 100) + '%)'; dots.forEach((d, k) => d.classList.toggle('active', k === i)); }
  function go(k){ i = (k + slides.length) % slides.length; render(); restart(); }
  function next(){ go(i + 1); }
  function prev(){ go(i - 1); }
  const nx = document.getElementById('promoNext'), pv = document.getElementById('promoPrev');
  if (nx) nx.addEventListener('click', e => { e.preventDefault(); next(); });
  if (pv) pv.addEventListener('click', e => { e.preventDefault(); prev(); });
  function restart(){ clearInterval(timer); timer = setInterval(next, 5000); }
  if (car) { car.addEventListener('mouseenter', () => clearInterval(timer)); car.addEventListener('mouseleave', restart); }
  let sx = 0, moved = false;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; moved = false; clearInterval(timer); }, { passive: true });
  track.addEventListener('touchmove', () => { moved = true; }, { passive: true });
  track.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (moved && Math.abs(dx) > 40) { dx < 0 ? next() : prev(); } restart(); }, { passive: true });
  render(); restart();
})();

/* ════════ HOME: marquees + live withdrawal board ════════ */
/* Duplicate marquee tracks for seamless infinite loop */
document.querySelectorAll('.tm-track, .cert-track, .pay-mtrack').forEach(t => { t.innerHTML += t.innerHTML; });

/* Live deposit / withdrawal board */
(function withdrawBoard(){
  const dep = document.getElementById('depositList');
  const wdr = document.getElementById('withdrawalList');
  if (!dep || !wdr) return;
  const users = ['aussie_vip','perth_king','mel_roller','sydney99','brissy_vip','qld_roller','goldcoast_g','adelaide88','darwin_ace','hobart_hi','newy_punter','cairns_cat','geelong_g','townsville7'];
  const partners = ['BoomerStake','RTPPokies','RTPVictory88','RTPCunt','RTPMeth'];
  const cols = ['#0066FF','#00C896','#C9A84C','#7C3AED','#E53E3E'];
  const pick = a => a[Math.floor(Math.random()*a.length)];
  function row(kind){
    const u = pick(users), p = pick(partners), c = pick(cols);
    const v = kind==='dep' ? (Math.floor(Math.random()*780)+20) : (Math.floor(Math.random()*4950)+50);
    const el = document.createElement('div');
    el.className = 'wd-row new';
    el.innerHTML = '<div class="wd-ava" style="background:'+c+'">'+u[0].toUpperCase()+'</div>'+
      '<div class="wd-meta"><div class="wd-user">@'+u+'</div><div class="wd-sub">'+p+' · just now</div></div>'+
      '<div class="wd-amt '+(kind==='dep'?'dep':'wdr')+'">'+(kind==='dep'?'+':'−')+'AUD$'+v.toLocaleString()+'</div>';
    return el;
  }
  function seed(list, kind){ for (let i=0;i<6;i++){ const r=row(kind); r.classList.remove('new'); list.appendChild(r); } }
  seed(dep,'dep'); seed(wdr,'wdr');
  setInterval(()=>{ dep.insertBefore(row('dep'), dep.firstChild); while(dep.children.length>6) dep.removeChild(dep.lastChild); }, 3800);
  setInterval(()=>{ wdr.insertBefore(row('wdr'), wdr.firstChild); while(wdr.children.length>6) wdr.removeChild(wdr.lastChild); }, 4700);
})();
