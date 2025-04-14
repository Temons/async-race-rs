import { initGarage, removePopup } from './components/garageController';
import { initWinners } from './components/winnersController';
import './styles/garage.css';

const app = document.getElementById('app');

const renderView = async (view: string): Promise<void> => {
  if (!app) return;

  removePopup(); // Убираем попап при переходе

  window.history.pushState({ view }, '', `#${view}`);

  if (view === 'garage') {
    await initGarage(); // Загружаем гараж
  } else if (view === 'winners') {
    await initWinners(); // Загружаем победителей
  }

  // Назначаем навигационные кнопки (после рендера нового DOM)
  document.getElementById('garage-btn')?.addEventListener('click', () => renderView('garage'));
  document.getElementById('winners-btn')?.addEventListener('click', () => renderView('winners'));
};

// Обрабатываем переход по истории
window.onpopstate = () => {
  const view = window.location.hash.replace('#', '') || 'garage';
  renderView(view);
};

// Начальная загрузка
document.addEventListener('DOMContentLoaded', () => {
  const view = window.location.hash.replace('#', '') || 'garage';
  renderView(view);
});
