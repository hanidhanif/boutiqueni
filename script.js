const navbar = document.getElementById('navbar');
const backTop = document.getElementById('backTop');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  backTop.classList.toggle('show', window.scrollY > 500);
});

backTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

menuToggle.addEventListener('click', () => navMenu.classList.toggle('open'));

document.querySelectorAll('#navMenu a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('open'));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
