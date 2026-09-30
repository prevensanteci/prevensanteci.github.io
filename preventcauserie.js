(() => {
  const panel = document.getElementById('preventcauseriePanel');
  const launch = document.getElementById('preventcauserieLaunch');
  const close = document.getElementById('preventcauserieClose');
  if (!panel || !launch || !close) return;

  const setState = open => {
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    launch.setAttribute('aria-expanded', String(open));
  };
  const hide = (restoreFocus = true) => {
    setState(false);
    if (restoreFocus) launch.focus({ preventScroll: true });
  };
  const show = () => {
    setState(true);
    setTimeout(() => panel.querySelector('button[data-preventcauserie]')?.focus({ preventScroll: true }), 20);
  };

  launch.addEventListener('click', () => panel.classList.contains('open') ? hide() : show());
  close.addEventListener('click', () => hide());

  document.querySelectorAll('[data-preventcauserie]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.preventcauserie;
      hide(false);
      if (['consultation', 'lab', 'meds', 'imaging', 'specialist'].includes(target)) {
        openModal(target);
      } else if (target === 'business') {
        document.querySelector('#business')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (target === 'emergency') {
        document.querySelector('#vital-emergencies')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  document.addEventListener('pointerdown', event => {
    if (!panel.classList.contains('open')) return;
    if (!panel.contains(event.target) && !launch.contains(event.target)) hide(false);
  });

  window.PreventcauserieUI = { hide, show };
})();
