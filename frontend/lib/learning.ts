import type { ReviewCard } from '../types/course';
export const dayKey = (date = new Date()): string => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function previousDay(date = new Date()): string { const previous = new Date(date); previous.setDate(previous.getDate()-1); return dayKey(previous); }
// Simple interval scheduler (1, 3, 7, 14, 30 days); deliberately not presented as FSRS.
export function scheduleReview(card: ReviewCard | undefined, remembered: boolean, now = Date.now()): ReviewCard {
  const repetitions = remembered ? (card?.repetitions ?? 0) + 1 : 0;
  const interval = remembered ? [1,3,7,14,30][Math.min(repetitions-1,4)] : 0;
  return { repetitions, interval, due: now + (remembered ? interval * 86400000 : 600000) };
}
export function currentStreak(streak: number, lastStudy: string, today = new Date()): number { return [dayKey(today), previousDay(today)].includes(lastStudy) ? streak : 0; }
