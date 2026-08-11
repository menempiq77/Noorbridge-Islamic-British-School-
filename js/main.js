// ============================================================
// NoorBridge Academy — Landing Page Interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      if (!isOpen) {
        mainNav.querySelectorAll('.nav-group.open').forEach(g => g.classList.remove('open'));
      }
    });

    mainNav.querySelectorAll('.nav-dropdown a, .nav-single').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.querySelectorAll('.nav-group.open').forEach(g => g.classList.remove('open'));
      });
    });
  }

  // ---- Nav dropdown groups (About / Programme / Admissions) ----
  const navGroups = document.querySelectorAll('.nav-group');

  navGroups.forEach(group => {
    const trigger = group.querySelector('.nav-group-trigger');
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = group.classList.contains('open');
      navGroups.forEach(g => g.classList.remove('open'));
      if (!isOpen) group.classList.add('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-group')) {
      navGroups.forEach(g => g.classList.remove('open'));
    }
  });

  // ---- FAQ accordion ----
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // close all other panels
      accordionItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.accordion-panel').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // ---- Admissions form (front-end only placeholder) ----
  const form = document.getElementById('admissionsForm');
  const formNote = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const parentName = document.getElementById('parentName').value.trim();

      formNote.textContent = `Thank you${parentName ? ', ' + parentName : ''}! Our admissions team will reach out within one business day.`;
      form.reset();
    });
  }

  // ---- Highlight active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav .nav-dropdown a, .main-nav .nav-single');

  const setActive = () => {
    let currentId = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        currentId = section.id;
      }
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${currentId}` ? 'var(--emerald-700)' : '';
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  // ---- Back to top button ----
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('visible', window.scrollY > 480);
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Newsletter signup (front-end only placeholder) ----
  const newsletterForm = document.getElementById('newsletterForm');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const button = newsletterForm.querySelector('button');
      const originalText = button.textContent;
      button.textContent = 'Subscribed!';
      newsletterForm.reset();
      setTimeout(() => { button.textContent = originalText; }, 3000);
    });
  }
});
