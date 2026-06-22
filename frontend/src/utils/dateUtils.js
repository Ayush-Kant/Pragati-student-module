import { format, parseISO } from 'date-fns';

export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';

  const start = parseISO(startDate);
  const end = parseISO(endDate);

  const startMonth = format(start, 'MMM');
  const endMonth = format(end, 'MMM');

  if (startMonth === endMonth) {
    return `${startMonth} ${format(start, 'd')} - ${format(end, 'd')}, ${format(end, 'yyyy')}`;
  } else {
    return `${startMonth} ${format(start, 'd')} - ${endMonth} ${format(end, 'd')}, ${format(end, 'yyyy')}`;
  }
};
