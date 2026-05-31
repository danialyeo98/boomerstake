
/* BoomersStake AUS — script.js */

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
    el.textContent = (target > 999 ? v.toLocaleString() : v) + sfx;
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
  { name:'@perth_vip21',   action:'won big at BoomersStake',    amt:'+$4,200', col:'#C9A84C', icon:'🏆' },
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
  document.querySelectorAll('.pcard').forEach(card => {
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
