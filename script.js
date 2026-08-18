const navbar=document.getElementById('navbar');
const menu=document.getElementById('menuToggle');
const back=document.getElementById('backTop');
menu.addEventListener('click',()=>navbar.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>navbar.classList.remove('open')));
window.addEventListener('scroll',()=>back.classList.toggle('show',scrollY>450));
back.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));


// Auto-scroll: mulai setelah 2 detik tanpa aktivitas user.
(() => {
  const IDLE_DELAY = 2000;
  const SCROLL_STEP = 0.7;
  const SCROLL_INTERVAL = 16;
  const TOP_RESET_DURATION = 450;

  let idleTimer;
  let autoScrollTimer = null;
  let resettingToTop = false;

  const stopAutoScroll = () => {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    if (document.documentElement.scrollHeight <= window.innerHeight) return;

    autoScrollTimer = setInterval(() => {
      if (resettingToTop) return;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScroll - 2) {
        resettingToTop = true;
        stopAutoScroll();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
          resettingToTop = false;
          startAutoScroll();
        }, TOP_RESET_DURATION);
        return;
      }

      window.scrollBy(0, SCROLL_STEP);
    }, SCROLL_INTERVAL);
  };

  const registerActivity = () => {
    stopAutoScroll();
    resettingToTop = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startAutoScroll, IDLE_DELAY);
  };

  ['mousemove', 'mousedown', 'wheel', 'touchstart', 'touchmove', 'keydown', 'pointerdown'].forEach(eventName => {
    window.addEventListener(eventName, registerActivity, { passive: true });
  });

  window.addEventListener('scroll', () => {
    if (!resettingToTop && autoScrollTimer) return;
    registerActivity();
  }, { passive: true });

  registerActivity();
})();
