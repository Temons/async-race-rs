const BASE_URL = 'http://localhost:3000';

export interface EngineResponse {
  velocity: number;
  distance: number;
}

export const startEngine = async (id: number): Promise<EngineResponse> => {
  console.log('startEngine', id);
  const res = await fetch(`${BASE_URL}/engine?id=${id}&status=started`, { method: 'PATCH' });
  return res.json();
};

export const stopEngine = async (id: number): Promise<EngineResponse> => {
  const res = await fetch(`${BASE_URL}/engine?id=${id}&status=stopped`, { method: 'PATCH' });
  return res.json();
};

export const driveCar = async (id: number): Promise<{ success: boolean }> => {
  const res = await fetch(`${BASE_URL}/engine?id=${id}&status=drive`, { method: 'PATCH' });
  return res.status === 200 ? { success: true } : { success: false };
};
