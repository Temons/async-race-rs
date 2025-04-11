import {
  getCars,
  createCar,
  deleteCar,
  updateCar,
  getCar,
} from '../api/carsApi';
import { renderGarage } from '../views/garageView';
import { generateRandomCars } from '../utils/random';
import { driveCar, startEngine, stopEngine } from '../api/engineApi';
import { animateCar } from '../utils/animation';

let selectedCarId: number | null = null;

let currentPage = 1;
const limit = 7;

const updateCarList = async () => {
  const list = document.getElementById('car-list');
  const count = document.getElementById('garage-count');
  const page = document.getElementById('garage-page');
  if (!list || !count || !page) return;

  const { cars, total } = await getCars({ page: currentPage, limit });
  count.textContent = total.toString();
  page.textContent = currentPage.toString();

  list.innerHTML = cars.map((car) => `
  <div class="car-row" data-id="${car.id}">
    
    <div class="car-top-panel">
      <div class="car-buttons">
        <button class="select-btn" data-id="${car.id}">SELECT</button>
        <button class="remove-btn" data-id="${car.id}">REMOVE</button>
      </div>
      <span class="car-name">${car.name}</span>
    </div>

    <div class="car-bottom-panel">
      <div class="engine-buttons">
        <button class="start-btn" data-id="${car.id}">A</button>
        <button class="stop-btn" data-id="${car.id}">B</button>
      </div>
      
      <div class="car-track">
        <div class="car-icon" style="color: ${car.color};">
          <svg fill="currentColor" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490 490" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M490,313.616c0-75.056-59.143-137.375-133.293-142.231C332.67,107.742,271.94,65.48,203.369,65.48 c-70.698,0-132.366,44.293-155.089,110.777C19.181,187.634,0,215.459,0,247.138v116.549h63.252 c5.061,34.369,34.741,60.833,70.498,60.833c35.748,0,65.427-26.464,70.489-60.833h80.881c5.061,34.369,34.741,60.833,70.498,60.833 c35.748,0,65.427-26.464,70.488-60.833H490V313.616z M337.333,284.387c-27.193,7.225-48.046,30.155-52.213,58.449h-71.326V193.31 l123.538-1.177V284.387z M334.152,171.31l-120.357,1.147V86.713C266.63,90.523,312.789,123.087,334.152,171.31z M192.943,86.709 v85.947l-121.436,1.157C92.336,124.113,138.939,90.557,192.943,86.709z M20.851,247.138c0-23.878,15.013-44.729,37.493-52.347 l134.6-1.283v120.126c-12.803-19.064-34.557-31.636-59.193-31.636c-35.757,0-65.437,26.469-70.498,60.837H20.851V247.138z M133.75,403.669c-27.805,0-50.417-22.613-50.417-50.408c0-27.8,22.612-50.412,50.417-50.412c27.794,0,50.408,22.612,50.408,50.412 C184.158,381.056,161.545,403.669,133.75,403.669z M355.618,403.669c-27.804,0-50.417-22.613-50.417-50.408 c0-27.8,22.613-50.412,50.417-50.412c27.795,0,50.407,22.612,50.407,50.412C406.025,381.056,383.414,403.669,355.618,403.669z M469.149,342.836h-43.042c-4.939-33.541-33.33-59.539-67.923-60.772v-89.65c61.968,5.518,110.965,58.086,110.965,121.202V342.836z"></path> <path d="M355.802,338.702l14.376,14.371l-14.742,14.742l-14.376-14.37L355.802,338.702z M119.191,353.445l14.376,14.37 l14.743-14.742l-14.376-14.371L119.191,353.445z"></path> <path d="M108.674,247.988h25.077c5.762,0,10.426-4.669,10.426-10.426c0-5.758-4.663-10.425-10.426-10.425h-25.077 c-5.762,0-10.426,4.667-10.426,10.425C98.248,243.32,102.911,247.988,108.674,247.988z"></path> <path d="M232.141,247.988h25.077c5.762,0,10.425-4.669,10.425-10.426c0-5.758-4.663-10.425-10.425-10.425h-25.077 c-5.762,0-10.425,4.667-10.425,10.425C221.716,243.32,226.379,247.988,232.141,247.988z"></path> </g></svg>
        </div>
        <div class="flag">🏁</div>
      </div>
    </div>

  </div>
`).join('');

  document.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = Number((btn as HTMLButtonElement).dataset.id);
      await deleteCar(id);
      updateCarList();
    });
  });

  document.querySelectorAll('.select-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = Number((btn as HTMLButtonElement).dataset.id);
      const car = await getCar(id);

      const updateNameInput = document.getElementById('update-name') as HTMLInputElement;
      const updateColorInput = document.getElementById('update-color') as HTMLInputElement;

      updateNameInput.value = car.name;
      updateColorInput.value = car.color;

      selectedCarId = id; // сохраняем id выбранной машины
    });
  });

  document.querySelectorAll('.start-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = Number((btn as HTMLButtonElement).dataset.id);
      const carRow = document.querySelector(`.car-row[data-id="${id}"]`);
      const carIcon = carRow?.querySelector('.car-icon') as HTMLElement;
      const track = carRow?.querySelector('.car-track') as HTMLElement;

      try {
        const { velocity } = await startEngine(id);
        const distance = track.offsetWidth - carIcon.offsetWidth;
        const time = distance / velocity;

        // Запускаем анимацию
        carIcon.style.transition = `transform ${time}s linear`;
        carIcon.style.transform = `translateX(${distance}px)`;

        // Ждём подтверждение, что можно ехать
        const drive = await driveCar(id);

        if (!drive.success) {
          // Остановить машинку прямо где она есть:
          const computedStyle = getComputedStyle(carIcon);
          const matrix = new WebKitCSSMatrix(computedStyle.transform);
          const currentX = matrix.m41;

          carIcon.style.transition = 'none';
          carIcon.style.transform = `translateX(${currentX}px)`;
          console.warn(`🚫 Машина ${id} заглохла на ${Math.round(currentX)}px`);
        }
      } catch (error) {
        console.error('❌ Ошибка при запуске машины:', error);
      }
    });
  });

  document.querySelectorAll('.stop-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = Number((btn as HTMLButtonElement).dataset.id);
      const carRow = document.querySelector(`.car-row[data-id="${id}"]`);
      const carIcon = carRow?.querySelector('.car-icon') as HTMLElement;

      await stopEngine(id);

      carIcon.style.transition = 'transform 1s linear';
      carIcon.style.transform = 'translateX(0)';
    });
  });
};

export const initGarage = async () => {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = renderGarage();
  await updateCarList();

  // 🎯 Обработчики
  document.getElementById('create-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.getElementById('create-name') as HTMLInputElement).value;
    const color = (document.getElementById('create-color') as HTMLInputElement).value;
    await createCar({ name, color });
    updateCarList();
  });

  document.getElementById('generate-cars')?.addEventListener('click', async () => {
    await generateRandomCars(100);
    updateCarList();
  });

  document.getElementById('prev-page')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      updateCarList();
    }
  });

  document.getElementById('next-page')?.addEventListener('click', () => {
    currentPage += 1;
    updateCarList();
  });

  document.getElementById('update-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (selectedCarId === null) {
      alert('Сначала выберите машину кнопкой SELECT!');
      return;
    }

    const name = (document.getElementById('update-name') as HTMLInputElement).value;
    const color = (document.getElementById('update-color') as HTMLInputElement).value;

    await updateCar(selectedCarId, { name, color });

    selectedCarId = null;
    (document.getElementById('update-form') as HTMLFormElement).reset();

    updateCarList();
  });
};
