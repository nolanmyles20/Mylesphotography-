// Mobile nav toggle + active link highlight
const btn = document.querySelector('.hamburger');
const links = document.querySelector('.navlinks');
if (btn && links) btn.addEventListener('click', ()=> links.classList.toggle('open'));

const path = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navlinks a').forEach(a=>{
  const target = a.getAttribute('href');
  if ((path === '' && target === 'index.html') || path === target) a.classList.add('active');
});
