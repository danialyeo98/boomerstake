/* BoomersStake AUS — script.js (Premium Redesign) */

/* ── Navbar scroll ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav && nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile drawer ── */
const hamburger  = document.getElementById('hamburger');
const drawerEl   = document.getElementById('drawer');
const drawerClose = document.getElementById('drawerClose');

hamburger  && hamburger.addEventListener('click',  openDrawer);
drawerClose && drawerClose.addEventListener('click', closeDrawer);

function openDrawer() {
  drawerEl && drawerEl.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawerEl && drawerEl.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if(id === '#') return;
    const target = document.querySelector(id);
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeDrawer();
  });
});

/* ── Scroll reveal ── */
const heroEl = document.getElementById('hero');
const roObs  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      e.target.classList.add('in', 'visible');
      roObs.unobserve(e.target);
    }
  });
}, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

document.querySelectorAll('.fade, .reveal').forEach(el => {
  if(heroEl && heroEl.contains(el)) return;
  const rect = el.getBoundingClientRect();
  if(rect.top < window.innerHeight && rect.bottom > 0) {
    el.classList.add('in', 'visible');
  } else {
    roObs.observe(el);
  }
});

/* Safety fallback — reveal anything still hidden after 2s */
setTimeout(() => {
  document.querySelectorAll('.fade:not(.in)').forEach(el => {
    el.classList.add('in', 'visible');
  });
}, 2000);

/* ── Count-up animations ── */
function runCountUp(el) {
  const target = +(el.dataset.val || el.dataset.target || 0);
  const sfx    = el.dataset.sfx || el.dataset.suffix || '';
  let   start  = null;
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
}, { threshold: 0, rootMargin: '0px' });

document.querySelectorAll('.count-up').forEach(el => {
  const rect = el.getBoundingClientRect();
  if(rect.top < window.innerHeight && rect.bottom > 0) {
    setTimeout(() => runCountUp(el), 250);
  } else {
    cuObs.observe(el);
  }
});

/* ── FAQ accordion ── */
document.querySelectorAll('.fq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item   = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.fq.open').forEach(f => f.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});

/* ── Live activity feed ── */
const FD = [
  { name: '@perth_vip21',   action: 'won big at BoomersStake',     amt: '+$4,200', col: '#C9A84C', icon: '🏆' },
  { name: '@brissy_roller', action: 'claimed 500 free spins',       amt: '500 FS',  col: '#0066FF', icon: '🎯' },
  { name: '@sydney_99',     action: 'registered via partner link',  amt: 'New',     col: '#00C896', icon: '⚡' },
  { name: '@mel_vip_king',  action: 'cashed out instantly',         amt: '+$1,850', col: '#0066FF', icon: '💎' },
  { name: '@adelaider88',   action: 'hit jackpot at RTPPokies',     amt: '+$8,400', col: '#C9A84C', icon: '👑' },
  { name: '@goldcoast_g',   action: 'received VIP cashback',        amt: '+$720',   col: '#00C896', icon: '💰' },
];
let fi = 0;
setInterval(() => {
  const feed = document.getElementById('feed');
  if(!feed) return;
  const a  = FD[fi % FD.length]; fi++;
  const dc = ['#00C896','#0066FF','#C9A84C','#0066FF'][fi % 4];
  const row = document.createElement('div');
  row.className = 'feed-row';
  row.style.cssText = 'opacity:0;transform:translateX(-8px);transition:opacity .35s,transform .35s';
  row.innerHTML = `<div class="fdot" style="background:${dc}"></div><span class="ftxt">${a.icon} ${a.name} ${a.action}</span><span class="famt" style="color:${a.col}">${a.amt}</span>`;
  feed.insertBefore(row, feed.firstChild);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    row.style.opacity = '1';
    row.style.transform = 'none';
  }));
  if(feed.children.length > 5) {
    const last = feed.lastChild;
    last.style.opacity = '0';
    last.style.transition = 'opacity .3s';
    setTimeout(() => last.parentNode && last.parentNode.removeChild(last), 320);
  }
}, 3800);

/* ── Card 3D tilt on hover ── */
if(window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.pcard:not(.featured)').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform = `translateY(-6px) rotateX(${-dy * 3}deg) rotateY(${dx * 4}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transformStyle = '';
    });
  });

  /* Featured card — gentler tilt since it already has animation */
  document.querySelectorAll('.pcard.featured').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform = `translateY(-8px) scale(1.01) rotateX(${-dy * 2}deg) rotateY(${dx * 3}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Button ripple effect ── */
(function() {
  function addRipple(btn) {
    btn.addEventListener('click', e => {
      const r   = btn.getBoundingClientRect();
      const max = Math.max(r.width, r.height) * 1.5;
      const sp  = document.createElement('span');
      sp.style.cssText = `
        position:absolute;width:${max}px;height:${max}px;
        left:${e.clientX - r.left - max/2}px;
        top:${e.clientY - r.top - max/2}px;
        border-radius:50%;
        background:rgba(255,255,255,0.18);
        transform:scale(0);
        animation:ripple .5s ease forwards;
        pointer-events:none;z-index:10;
      `;
      btn.appendChild(sp);
      sp.addEventListener('animationend', () => sp.remove());
    });
  }

  const style = document.createElement('style');
  style.textContent = '@keyframes ripple{0%{transform:scale(0);opacity:1}100%{transform:scale(1.2);opacity:0}}';
  document.head.appendChild(style);

  document.querySelectorAll('.btn').forEach(addRipple);
})();

/* ── Form — opens native email client ── */
const form = document.querySelector('form[action^="mailto"]');
if(form) {
  form.addEventListener('submit', () => {
    const btn = form.querySelector('[type="submit"]');
    if(btn) {
      btn.textContent = '✓ Opening Email...';
      btn.style.background = '#00C896';
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.style.background = '';
      }, 3000);
    }
  });
}

/* ── Hero dashboard counter animation ── */
(function animateDashboard() {
  const dashVals = [
    { selector: '.dr-val', targets: ['$84,220', '3,847', '$10,000'] }
  ];
  // Numbers in dashboard already static — just add subtle pulse
  document.querySelectorAll('.dashboard-row').forEach((row, i) => {
    setTimeout(() => {
      row.style.transition = 'opacity .3s';
      row.style.opacity = '0.7';
      setTimeout(() => { row.style.opacity = '1'; }, 200);
    }, i * 300 + 800);
  });
})();
