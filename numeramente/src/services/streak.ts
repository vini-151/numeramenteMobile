import { api } from './api';
import { dataLocal } from '../utils/data';

export type StreakInfo = {
  streak_atual: number;
  maior_streak: number;
  dias: string[]; // 'AAAA-MM-DD'
};

export async function fazerCheckin(userId: number) {
  const { data } = await api.post<{
    novo_dia: boolean;
    streak_atual: number;
    maior_streak: number;
  }>(`/usuarios/${userId}/checkin`, { data: dataLocal() });
  return data;
}

export async function buscarStreak(userId: number) {
  const { data } = await api.get<StreakInfo>(`/usuarios/${userId}/streak`, {
    params: { hoje: dataLocal() },
  });
  return data;
}