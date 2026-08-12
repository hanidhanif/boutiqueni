const navbar=document.getElementById('navbar');
const menu=document.getElementById('menuToggle');
const back=document.getElementById('backTop');
menu.addEventListener('click',()=>navbar.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>navbar.classList.remove('open')));
window.addEventListener('scroll',()=>back.classList.toggle('show',scrollY>450));
back.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
