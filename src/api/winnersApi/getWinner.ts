import { BASE_URL, Winner } from '../types';

export const getWinner = async (id: number): Promise<Winner> => {
  const response = await fetch(`${BASE_URL}/winners/${id}`);
  if (!response.ok) throw new Error('Winner not found');
  return response.json();
};
