// Motion for the drawing set: reveal on scroll, count-ups and the scroll-progress line. The page is complete without
// this file. People who ask their system for reduced motion get fades and drawing only (styles.css .motion-calm).
(() => {
  const root = document.documentElement;
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('motion', calm ? 'motion-calm' : 'motion-full');

  // Scroll progress, written as a CSS variable once per frame.
  let ticking = false;
  const progress = () => {
    ticking = false;
    const max = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--progress', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0');
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(progress); } }, { passive: true });
  window.addEventListener('resize', progress, { passive: true });
  progress();

  if (!('IntersectionObserver' in window)) return;

  // Count a figure up from zero (single numbers only, e.g. 123, 200+, $100k+). Screen readers get the final text.
  const countUp = (dd) => {
    const m = /^(\D*)(\d+)(\D*)$/.exec(dd.textContent.trim());
    if (!m || +m[2] === 0) return;
    const [, pre, num, post] = m, end = +num;
    dd.textContent = '';
    const shown = document.createElement('span'), real = document.createElement('span');
    shown.setAttribute('aria-hidden', 'true');
    real.className = 'visually-hidden';
    real.textContent = pre + num + post;
    dd.append(shown, real);
    const t0 = performance.now(), ms = calm ? 700 : 1100;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms), eased = 1 - Math.pow(1 - k, 3);
      shown.textContent = pre + Math.round(end * eased) + post;
      if (k < 1) requestAnimationFrame(step);
    };
    shown.textContent = pre + '0' + post;
    requestAnimationFrame(step);
  };

  const SELECTOR = [
    '.section-head', '.schedule tbody tr', '.sheet', '.sheet-text > *', '.figures > div', '.finance', '.title-block',
    '.path li', '.plates figure', '.refs figure', '.refs-note', '.about-text p', '.notes > div', '.contact-grid > *',
  ].join(',');
  const fold = window.innerHeight * 0.92;
  const items = [...document.querySelectorAll(SELECTOR)].filter((el) => el.getBoundingClientRect().top > fold);

  const io = new IntersectionObserver((entries) => {
    const arriving = entries.filter((e) => e.isIntersecting).map((e) => e.target)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    arriving.forEach((el, i) => {
      el.style.setProperty('--d', Math.min(i * 0.07, 0.42).toFixed(2) + 's');
      el.classList.add('in');
      io.unobserve(el);
      if (el.matches('.figures > div')) countUp(el.querySelector('dd'));
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  for (const el of items) { el.classList.add('rv'); io.observe(el); }

  // Figures already on screen at load still count up.
  document.querySelectorAll('.figures > div:not(.rv) dd').forEach(countUp);
})();
