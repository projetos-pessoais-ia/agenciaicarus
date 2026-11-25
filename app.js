'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navegacao');
const siteHeader = document.querySelector('.site-header');

// O header mantém seu espaço no layout e compacta apenas a barra interna.
// A pequena diferença entre os limites evita oscilar perto da transição.
let floatingHeader = window.scrollY > 72;
let headerFramePending = false;
function updateHeader() {
  const position = window.scrollY;
  if (position > 72) floatingHeader = true;
  else if (position < 36) floatingHeader = false;
  siteHeader.classList.toggle('is-floating', floatingHeader);
  headerFramePending = false;
}
window.addEventListener('scroll', () => {
  if (!headerFramePending) {
    headerFramePending = true;
    window.requestAnimationFrame(updateHeader);
  }
}, { passive: true });
window.addEventListener('pageshow', updateHeader);
updateHeader();

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
const desktop = window.matchMedia('(min-width: 761px)');
desktop.addEventListener('change', closeMenu);

const projectMessages = {
  migracao: 'Olá, gostaria de conversar sobre a migração da minha loja para Shopify.',
  'nova-loja': 'Olá, gostaria de conversar sobre a criação de uma loja Shopify.',
  melhoria: 'Olá, gostaria de conversar sobre melhorias na minha loja Shopify.',
  integracao: 'Olá, gostaria de conversar sobre uma integração ou funcionalidade para minha loja Shopify.',
};
const projectLabels = {
  migracao: 'Migração para Shopify',
  'nova-loja': 'Criação de uma loja Shopify',
  melhoria: 'Melhorias em uma loja existente',
  integracao: 'Integrações e funcionalidades',
};
let selectedProject = '';
const config = window.ICARUS_CONFIG || {};
const projectForm = document.querySelector('#project-form');
const projectSelect = document.querySelector('#contact-project');
const projectSubmit = document.querySelector('#project-submit');
const number = String(config.whatsapp || '').replace(/\D/g, '');
const email = String(config.contactEmail || '').trim();
const hasWhatsapp = number.length >= 10 && number.length <= 15;
const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const quickContact = document.querySelector('#floating-contact');
const quickContactNote = document.querySelector('#floating-contact-note');

quickContact.addEventListener('click', () => {
  if (hasWhatsapp) {
    const greeting = 'Olá! Gostaria de conversar sobre um projeto com a Icarus.';
    window.location.href = `https://wa.me/${number}?text=${encodeURIComponent(greeting)}`;
    return;
  }

  quickContactNote.hidden = !quickContactNote.hidden;
});

function updateContact() {
  if (selectedProject) projectSelect.value = selectedProject;
  projectSubmit.disabled = !hasWhatsapp && !hasEmail;
  projectSubmit.firstChild.textContent = hasWhatsapp ? 'Continuar no WhatsApp ' : 'Enviar projeto ';
  document.querySelector('#form-channel-note').textContent = hasWhatsapp
    ? 'Você poderá revisar a mensagem no WhatsApp antes de enviar.'
    : hasEmail ? 'Seu aplicativo de e-mail abrirá com os detalhes do projeto.'
    : 'O envio estará disponível em breve.';
}
if (projectForm) {
  projectSelect.addEventListener('change', () => { selectedProject = projectSelect.value; });
  projectForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!projectForm.reportValidity() || (!hasWhatsapp && !hasEmail)) return;
    const data = new FormData(projectForm);
    const label = projectLabels[data.get('project')] || 'Outra ideia';
    const message = [
      `Olá, sou ${String(data.get('name')).trim()}.`,
      `E-mail: ${String(data.get('email')).trim()}`,
      `Projeto: ${label}`,
      data.get('store') ? `Loja: ${data.get('store')}` : '',
      '', String(data.get('message')).trim(),
    ].filter(line => line !== '').join('\n');
    window.location.href = hasWhatsapp
      ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
      : `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Projeto Shopify — ' + label)}&body=${encodeURIComponent(message)}`;
    const status = document.querySelector('#form-status');
    status.hidden = false;
    status.textContent = hasWhatsapp ? 'Conclua o envio da mensagem no WhatsApp.' : 'Conclua o envio no seu aplicativo de e-mail.';
  });
  document.querySelectorAll('[data-project]').forEach(link => {
    link.addEventListener('click', () => {
      selectedProject = link.dataset.project;
      updateContact();
    });
  });
  updateContact();
}
document.querySelector('#year').textContent = String(new Date().getFullYear());

// Abertura e fechamento animados, com uma resposta selecionada por vez.
const faqItems = [...document.querySelectorAll('.faq-list details')];
const faqAnimations = new WeakMap();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeFaq = faqItems.find(item => item.open) || null;
function animateFaq(item, expand) {
  const startHeight = item.getBoundingClientRect().height;
  faqAnimations.get(item)?.cancel();
  item.open = true;
  const summary = item.querySelector('summary');
  const answer = item.querySelector('.faq-answer');
  const border = parseFloat(getComputedStyle(item).borderBottomWidth) || 0;
  const endHeight = summary.offsetHeight + (expand ? answer.scrollHeight : 0) + border;
  const animation = item.animate(
    [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
    { duration: reducedMotion.matches ? 0 : 280, easing: 'cubic-bezier(.22, 1, .36, 1)' }
  );
  faqAnimations.set(item, animation);
  animation.onfinish = () => {
    item.open = expand;
    faqAnimations.delete(item);
  };
}
faqItems.forEach(item => {
  item.querySelector('summary').addEventListener('click', event => {
    event.preventDefault();
    const expand = activeFaq !== item;
    if (activeFaq && activeFaq !== item) animateFaq(activeFaq, false);
    activeFaq = expand ? item : null;
    animateFaq(item, expand);
  });
});

// Reveal each block once it reaches the visible area.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const sectionEntrance = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;

      target.classList.remove('scroll-pending');
      sectionEntrance.unobserve(target);
    });
  }, { rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-scroll-reveal]').forEach(block => {
    if (block.getBoundingClientRect().top < window.innerHeight) return;

    block.classList.add('scroll-pending');
    sectionEntrance.observe(block);
  });
}
