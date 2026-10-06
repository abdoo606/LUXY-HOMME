import type { Doctor } from '../config/content';

export interface TimeSlot {
  time: string;
  booked: boolean;
}

/** Generate 30-minute slots between start and end ("HH:mm"), marking booked ones. */
export function generateSlots(
  doctor: Doctor | null,
  dateStr: string,
  bookedTimes: string[]
): TimeSlot[] {
  if (!doctor) return [];
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay();
  if (!doctor.workingDays.includes(day)) return [];

  const [sh, sm] = doctor.hours.start.split(':').map(Number);
  const [eh, em] = doctor.hours.end.split(':').map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;

  const slots: TimeSlot[] = [];
  for (let m = startMin; m < endMin; m += 30) {
    const hh = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    const time = `${hh}:${mm}`;
    slots.push({ time, booked: bookedTimes.includes(time) });
  }
  return slots;
}

/** Next N bookable dates for a doctor (starting from today), as YYYY-MM-DD. */
export function upcomingDates(doctor: Doctor | null, count = 10): string[] {
  const dates: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 40 && dates.length < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (!doctor || doctor.workingDays.includes(d.getDay())) {
      dates.push(d.toISOString().slice(0, 10));
    }
  }
  return dates;
}

export function formatDate(dateStr: string, lang: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
