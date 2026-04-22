document.addEventListener('DOMContentLoaded', () => {

  // ---- Sticky Header with scroll effect ----
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 50);
    backToTop.classList.toggle('visible', scrollY > 500);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Mobile Nav Toggle ----
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  mobileToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    mobileToggle.classList.toggle('active');
  });

  // ---- Desktop Mega Menu Hover Intent ----
  if (window.innerWidth > 768) {
    const megaItems = document.querySelectorAll('.nav-item.has-mega');
    megaItems.forEach(item => {
      let closeTimer = null;

      item.addEventListener('mouseenter', () => {
        clearTimeout(closeTimer);
        megaItems.forEach(other => {
          if (other !== item) other.classList.remove('mega-open');
        });
        item.classList.add('mega-open');
      });

      item.addEventListener('mouseleave', () => {
        closeTimer = setTimeout(() => {
          item.classList.remove('mega-open');
        }, 300);
      });
    });
  }

  // Mobile mega menu toggle
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.nav-item.has-mega > .nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = link.parentElement;
        parent.classList.toggle('open');
        document.querySelectorAll('.nav-item.has-mega').forEach(item => {
          if (item !== parent) item.classList.remove('open');
        });
      });
    });
  }

  // ---- Product Tabs ----
  function initTabs(tabSelector, contentPrefix) {
    document.querySelectorAll(tabSelector).forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        document.querySelectorAll(tabSelector).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll(`[id^="${contentPrefix}"]`).forEach(c => c.classList.remove('active'));
        const target = document.getElementById(`${contentPrefix}${tabId}`);
        if (target) target.classList.add('active');
      });
    });
  }

  initTabs('.tab-btn', 'tab-');

  // ---- Searched Links Tabs ----
  document.querySelectorAll('.searched-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.search;
      document.querySelectorAll('.searched-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.searched-content').forEach(c => c.classList.remove('active'));
      const target = document.getElementById(`search-${id}`);
      if (target) target.classList.add('active');
    });
  });

  // ---- Partners Filter ----
  document.querySelectorAll('.partner-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.partner;
      document.querySelectorAll('.partner-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.partner-logo').forEach(logo => {
        if (type === 'all') {
          logo.classList.remove('hidden');
        } else {
          const logoType = logo.dataset.type || '';
          logo.classList.toggle('hidden', !logoType.includes(type));
        }
      });
    });
  });

  // ---- Testimonials Slider ----
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');

  if (track && cards.length) {
    let currentSlide = 0;
    let cardsPerView = getCardsPerView();
    let totalSlides = Math.ceil(cards.length / cardsPerView);

    function getCardsPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === currentSlide) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goToSlide(index) {
      currentSlide = index;
      if (currentSlide < 0) currentSlide = totalSlides - 1;
      if (currentSlide >= totalSlides) currentSlide = 0;

      const cardWidth = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${currentSlide * cardsPerView * cardWidth}px)`;

      document.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    buildDots();

    let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);

    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.parentElement.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
    });

    window.addEventListener('resize', () => {
      cardsPerView = getCardsPerView();
      totalSlides = Math.ceil(cards.length / cardsPerView);
      buildDots();
      goToSlide(0);
    });
  }

  // ---- Scroll Reveal Animations ----
  const revealElements = document.querySelectorAll(
    '.product-card, .why-card, .calc-category, .cta-card, .testimonial-card, .stat-card'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  document.querySelectorAll('.section-header').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // ---- Smooth anchor scrolling ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = anchor.getAttribute('href');
      if (target.length > 1) {
        const el = document.querySelector(target);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          mainNav.classList.remove('open');
        }
      }
    });
  });

  // ---- Animate numbers on scroll ----
  function animateCounter(el, target, suffix) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 25);
  }

  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const match = text.match(/(\d+)/);
        if (match && !el.dataset.animated) {
          el.dataset.animated = 'true';
          const num = parseInt(match[1]);
          const suffix = text.replace(match[1], '');
          animateCounter(el, num, suffix);
        }
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));

  // ---- Form input formatting ----
  const mobileInput = document.querySelector('.hero-form .form-input');
  if (mobileInput) {
    mobileInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
  }

  // ---- Touch swipe for testimonials ----
  if (track) {
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
    });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextBtn.click();
        } else {
          prevBtn.click();
        }
      }
    });
  }

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

});
