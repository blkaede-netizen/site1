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
