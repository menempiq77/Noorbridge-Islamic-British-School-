// ============================================================
// NoorBridge Academy — Site Interactions
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
        mainNav.querySelectorAll('.nav-group.open').forEach(group => group.classList.remove('open'));
      }
    });

    mainNav.querySelectorAll('.nav-dropdown a, .nav-single').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.querySelectorAll('.nav-group.open').forEach(group => group.classList.remove('open'));
      });
    });
  }

  // ---- Nav dropdown groups (About / Programme / Admissions) ----
  const navGroups = document.querySelectorAll('.nav-group');

  navGroups.forEach(group => {
    const trigger = group.querySelector('.nav-group-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = group.classList.contains('open');
      navGroups.forEach(otherGroup => otherGroup.classList.remove('open'));
      if (!isOpen) group.classList.add('open');
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-group')) {
      navGroups.forEach(group => group.classList.remove('open'));
    }
  });

  // ---- Active page navigation ----
  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.main-nav .nav-dropdown a, .main-nav .nav-single').forEach(link => {
    const target = new URL(link.href, window.location.href);
    const targetPage = (target.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (targetPage !== currentPage) return;

    const group = link.closest('.nav-group');
    if (group) {
      group.classList.add('active');
    } else {
      link.classList.add('active');
    }
  });

  // ---- FAQ accordion ----
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      accordionItems.forEach(other => {
        const otherPanel = other.querySelector('.accordion-panel');
        other.classList.remove('open');
        if (otherPanel) otherPanel.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });

  // ---- Admissions form (front-end only placeholder) ----
  const form = document.getElementById('admissionsForm');
  const formNote = document.getElementById('formNote');

  if (form && formNote) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const parentNameField = document.getElementById('parentName');
      const parentName = parentNameField ? parentNameField.value.trim() : '';

      formNote.textContent = `Thank you${parentName ? ', ' + parentName : ''}! Our admissions team will reach out within one business day.`;
      form.reset();
    });
  }

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
    newsletterForm.addEventListener('submit', event => {
      event.preventDefault();
      const button = newsletterForm.querySelector('button');
      if (!button) return;

      const originalText = button.textContent;
      button.textContent = 'Subscribed!';
      newsletterForm.reset();
      setTimeout(() => { button.textContent = originalText; }, 3000);
    });
  }
});
