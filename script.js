(() => {
  const MOSCOW_OFFSET_MS = 3 * 60 * 60 * 1000;

  function nextEventDate() {
    const now = new Date();
    const moscowNow = new Date(now.getTime() + MOSCOW_OFFSET_MS);
    const year = moscowNow.getUTCFullYear();
    const month = moscowNow.getUTCMonth();
    const day = moscowNow.getUTCDate();
    const hour = moscowNow.getUTCHours();
    const eventDay = hour < 13 ? day : day + 1;
    return new Date(Date.UTC(year, month, eventDay));
  }

  const date = nextEventDate();
  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC'
  }).format(date);

  document.querySelectorAll('.js-event-date').forEach((node) => {
    node.textContent = formattedDate;
  });

  document.querySelectorAll('a[href="#registration"]').forEach((link) => {
    link.addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'registration_cta_click', cta_id: link.id });
    });
  });

  const reader = document.getElementById('mobile-reader');
  const progress = document.getElementById('reader-progress');
  const sections = [...document.querySelectorAll('.myth')];
  const hero = document.querySelector('.hero');
  const registration = document.getElementById('registration');
  let scheduled = false;
  function updateReader() {
    scheduled = false;
    const passedHero = hero.getBoundingClientRect().bottom <= 0;
    const formRect = registration.getBoundingClientRect();
    const atForm = formRect.top < innerHeight && formRect.bottom > 0;
    reader.hidden = !passedHero || atForm;
    let current = 1;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= innerHeight * 0.35) current = index + 1;
    });
    progress.textContent = current + '/7';
    progress.setAttribute('aria-label', 'Разбор ' + current + ' из 7');
  }
  function scheduleReader() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateReader); }
  }
  addEventListener('scroll', scheduleReader, { passive: true });
  addEventListener('resize', scheduleReader);
  addEventListener('load', scheduleReader);
  updateReader();

  let depthSent = false;
  function reportDepth() {
    if (depthSent) return;
    const page = document.documentElement;
    const maxScroll = page.scrollHeight - window.innerHeight;
    if (maxScroll > 0 && window.scrollY / maxScroll >= 0.75) {
      depthSent = true;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'scroll_depth', percent: 75 });
      window.removeEventListener('scroll', reportDepth);
    }
  }
  window.addEventListener('scroll', reportDepth, { passive: true });

  document.querySelectorAll('a[aria-disabled="true"]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });
})();
