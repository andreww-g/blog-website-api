import { DateTime } from 'luxon';

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '-';
  return date instanceof Date
    ? DateTime.fromJSDate(date).toISODate() || '-'
    : DateTime.fromISO(date).toISODate() || '-';
};
