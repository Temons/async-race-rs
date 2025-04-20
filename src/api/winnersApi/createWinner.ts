import { BASE_URL, Winner } from '../types';

export const createWinner = async (winner: Winner): Promise<Winner> => {
  const response = await fetch(`${BASE_URL}/winners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(winner),
  });
  return response.json();
};
