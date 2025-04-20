import { BASE_URL } from '../types';

export const deleteWinner = async (id: number): Promise<void> => {
  await fetch(`${BASE_URL}/winners/${id}`, { method: 'DELETE' });
};
