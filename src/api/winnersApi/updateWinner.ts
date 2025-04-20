import { BASE_URL, Winner } from '../types';

export const updateWinner = async (id: number, winner: Winner): Promise<Winner> => {
  const response = await fetch(`${BASE_URL}/winners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(winner),
  });
  return response.json();
};
