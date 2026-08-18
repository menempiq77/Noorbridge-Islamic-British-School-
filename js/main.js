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
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const parentNameField = document.getElementById('parentName');
      const parentName = parentNameField ? parentNameField.value.trim() : '';

      // TODO: wire this form to the admissions endpoint when one is available.
      formNote.textContent = `Thank you${parentName ? ', ' + parentName : ''}! Our admissions team will reach out within one business day.`;
      form.reset();
    });
  }

  // ---- Homepage image slider ----
  const slider = document.querySelector('[data-slider]');
  if (slider) {
    const slides = [...slider.querySelectorAll('[data-slide]')];
    const dots = [...slider.querySelectorAll('[data-slide-dot]')];
    const previous = slider.querySelector('[data-slider-prev]');
    const next = slider.querySelector('[data-slider-next]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;
    let timer;

    const showSlide = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === current);
        dot.setAttribute('aria-selected', String(i === current));
      });
    };
    const stop = () => { if (timer) window.clearInterval(timer); };
    const start = () => {
      stop();
      if (!reducedMotion) timer = window.setInterval(() => showSlide(current + 1), 6000);
    };
    previous?.addEventListener('click', () => { showSlide(current - 1); start(); });
    next?.addEventListener('click', () => { showSlide(current + 1); start(); });
    dots.forEach(dot => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.slideDot)); start(); }));
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', event => {
      if (!slider.contains(event.relatedTarget)) start();
    });
    slider.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); showSlide(current - 1); start(); }
      if (event.key === 'ArrowRight') { event.preventDefault(); showSlide(current + 1); start(); }
    });
    showSlide(0);
    start();
  }

  // ---- Accessible tab sets ----
  document.querySelectorAll('[data-tabs]').forEach(tabSet => {
    const triggers = [...tabSet.querySelectorAll('[role="tab"]')];
    const panels = [...tabSet.querySelectorAll('[role="tabpanel"]')];
    if (!triggers.length || !panels.length) return;

    const activate = (trigger, moveFocus = false) => {
      const targetId = trigger.getAttribute('aria-controls');
      triggers.forEach(item => item.setAttribute('aria-selected', String(item === trigger)));
      panels.forEach(panel => { panel.hidden = panel.id !== targetId; });
      if (moveFocus) trigger.focus();
    };
    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => activate(trigger));
      trigger.addEventListener('keydown', event => {
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % triggers.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + triggers.length) % triggers.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = triggers.length - 1;
        if (nextIndex !== index) {
          event.preventDefault();
          activate(triggers[nextIndex], true);
        }
      });
    });
    const initial = triggers.find(trigger => trigger.getAttribute('aria-selected') === 'true') || triggers[0];
    activate(initial);
  });

  // ---- Fee calculator ----
  const calculator = document.querySelector('[data-fee-calculator]');
  if (calculator) {
    const stage = calculator.querySelector('[data-calc-stage]');
    const term = calculator.querySelector('[data-calc-term]');
    const children = calculator.querySelector('[data-calc-children]');
    const total = calculator.querySelector('[data-calc-total]');
    const discount = calculator.querySelector('[data-calc-discount]');
    const registrationTotal = calculator.querySelector('[data-calc-registration]');
    const firstPayment = calculator.querySelector('[data-calc-first-payment]');
    const registrationFee = Number(calculator.dataset.registrationFee || 0);
    const formatCurrency = amount => `$${amount.toLocaleString(undefined, {
      maximumFractionDigits: 2
    })}`;
    const update = () => {
      const monthly = Number(stage?.selectedOptions[0]?.dataset.monthlyRate || 0);
      const selectedTerm = term?.selectedOptions[0];
      const termFactor = Number(selectedTerm?.dataset.discountFactor || 1);
      const termLabel = selectedTerm?.dataset.discountLabel || 'No subscription discount';
      const learnerCount = Number(children?.value || 1);
      const additionalLearners = Math.max(learnerCount - 1, 0);
      const siblingDiscountRate = Number(children?.selectedOptions[0]?.dataset.siblingDiscount || 0);
      const undiscountedTuition = monthly * learnerCount;
      const subscriptionDiscount = undiscountedTuition * (1 - termFactor);
      const siblingDiscount = monthly * termFactor * siblingDiscountRate * additionalLearners;
      const tuition = undiscountedTuition - subscriptionDiscount - siblingDiscount;
      const registration = registrationFee * learnerCount;
      const discountTotal = subscriptionDiscount + siblingDiscount;
      const first = tuition + registration;
      const siblingLabel = additionalLearners
        ? ` + ${siblingDiscountRate * 100}% sibling discount on ${additionalLearners} additional learner${additionalLearners === 1 ? '' : 's'}`
        : '';
      if (total) total.textContent = `${formatCurrency(tuition)} per month`;
      if (discount) discount.textContent = `${termLabel}${siblingLabel} (${formatCurrency(discountTotal)} saved)`;
      if (registrationTotal) registrationTotal.textContent = formatCurrency(registration);
      if (firstPayment) firstPayment.textContent = formatCurrency(first);
    };
    [stage, term, children].forEach(select => select?.addEventListener('change', update));
    update();
  }

  // ---- Stage application forms ----
  document.querySelectorAll('[data-stage-form]').forEach(stageForm => {
    const note = stageForm.querySelector('[data-stage-form-note]');
    if (!note) return;
    stageForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!stageForm.checkValidity()) {
        stageForm.reportValidity();
        return;
      }
      // TODO: wire this form to the admissions endpoint when one is available.
      const name = stageForm.elements.studentName?.value.trim();
      note.textContent = `Application received${name ? ` for ${name}` : ''} — we'll contact you on WhatsApp within one working day.`;
      stageForm.reset();
    });
  });

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
