(() => {
  const panel = document.getElementById('preventcauseriePanel');
  const launch = document.getElementById('preventcauserieLaunch');
  const close = document.getElementById('preventcauserieClose');
  if (!panel || !launch || !close) return;

  const hide = () => panel.classList.remove('open');

  launch.addEventListener('click', () => panel.classList.toggle('open'));
  close.addEventListener('click', hide);

  document.querySelectorAll('[data-preventcauserie]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.preventcauserie;
      hide();
      if (['consultation', 'lab', 'meds', 'imaging', 'specialist', 'callback'].includes(target)) {
        openModal(target);
      } else if (target === 'business') {
        document.querySelector('#business')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (target === 'emergency') {
        document.querySelector('#vital-emergencies')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
