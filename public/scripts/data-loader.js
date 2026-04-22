(function () {
  const BASE = '/data/';

  function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = parseCSVLine(lines[0]);
    return lines.slice(1).map(line => {
      const values = parseCSVLine(line);
      const obj = {};
      headers.forEach((h, i) => { obj[h.trim()] = (values[i] || '').trim(); });
      return obj;
    });
  }

  function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === ',' && !inQuotes) {
        result.push(current); current = '';
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  }

  function createStars(count) {
    let html = '';
    for (let i = 0; i < parseInt(count || 5); i++) {
      html += '<i class="fas fa-star"></i>';
    }
    return html;
  }

  function loadReviews() {
    const track = document.getElementById('reviewsTrack');
    if (!track) return;

    fetch(BASE + 'reviews.csv?' + Date.now())
      .then(r => r.text())
      .then(text => {
        const reviews = parseCSV(text);
        if (!reviews.length) return;

        track.innerHTML = reviews.map(r => `
          <div class="testimonial-card">
            <div class="testimonial-rating">${createStars(r.rating)}</div>
            <h4>${r.title}</h4>
            <p>${r.review}</p>
            <div class="testimonial-author">
              <div class="author-avatar">${r.initials}</div>
              <div>
                <strong>${r.name}</strong>
                <span>${r.date}</span>
              </div>
            </div>
          </div>
        `).join('');

        reinitSlider();
      })
      .catch(() => {});
  }

  function reinitSlider() {
    const slider = document.getElementById('testimonialSlider');
    if (!slider) return;

    const track = slider.querySelector('.testimonials-track');
    const cards = track.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');
    if (!cards.length || !prevBtn || !nextBtn || !dotsContainer) return;

    let current = 0;
    const gap = 32;

    function getVisible() {
      const w = slider.offsetWidth;
      if (w > 900) return 3;
      if (w > 600) return 2;
      return 1;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - getVisible());
    }

    function update() {
      const cardW = cards[0].offsetWidth + gap;
      track.style.transform = `translateX(-${current * cardW}px)`;
      dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      const max = getMaxIndex();
      for (let i = 0; i <= max; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => { current = i; update(); });
        dotsContainer.appendChild(dot);
      }
    }

    buildDots();
    update();

    prevBtn.addEventListener('click', () => {
      current = Math.max(0, current - 1); update();
    });
    nextBtn.addEventListener('click', () => {
      current = Math.min(getMaxIndex(), current + 1); update();
    });

    let autoSlide = setInterval(() => {
      current = current >= getMaxIndex() ? 0 : current + 1;
      update();
    }, 5000);

    slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
    slider.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => {
        current = current >= getMaxIndex() ? 0 : current + 1;
        update();
      }, 5000);
    });

    window.addEventListener('resize', () => {
      buildDots();
      if (current > getMaxIndex()) current = getMaxIndex();
      update();
    });
  }

  function loadPartners() {
    const grid = document.getElementById('partnersGrid');
    if (!grid) return;

    fetch(BASE + 'partners.csv?' + Date.now())
      .then(r => r.text())
      .then(text => {
        const partners = parseCSV(text);
        if (!partners.length) return;

        grid.innerHTML = partners.map(p =>
          `<div class="partner-logo" data-type="${p.type}"><span>${p.name}</span></div>`
        ).join('');
      })
      .catch(() => {});
  }

  function loadAllReviews() {
    const container = document.getElementById('allReviewsGrid');
    if (!container) return;

    fetch(BASE + 'reviews.csv?' + Date.now())
      .then(r => r.text())
      .then(text => {
        const reviews = parseCSV(text);
        if (!reviews.length) return;

        const countEl = document.getElementById('reviewCount');
        if (countEl) countEl.textContent = reviews.length;

        container.innerHTML = reviews.map(r => `
          <div class="review-card">
            <div class="review-header">
              <div class="author-avatar">${r.initials}</div>
              <div>
                <strong>${r.name}</strong>
                <span class="review-date">${r.date}</span>
              </div>
              <div class="review-rating">${createStars(r.rating)}</div>
            </div>
            <h3>${r.title}</h3>
            <p>${r.review}</p>
          </div>
        `).join('');
      })
      .catch(() => {});
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadReviews();
    loadPartners();
    loadAllReviews();
  });
})();
