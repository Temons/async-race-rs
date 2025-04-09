const app = document.getElementById('app');

const renderView = (view: string): void => {
  if (app) app.innerHTML = view === 'garage' ? 'Garage Page' : 'Winners Page';
  window.history.pushState({ view }, '', `#${view}`);
};

window.onpopstate = () => {
  const view = location.hash.replace('#', '') || 'garage';
  renderView(view);
};

renderView('garage');
