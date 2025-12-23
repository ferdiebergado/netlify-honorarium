const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function toDateRange(startDate: string, endDate: string): string {
  console.debug('startDate:', startDate, 'endDate:', endDate);

  const start = new Date(startDate);
  const end = new Date(endDate);

  const startMonth = start.getMonth();
  const endMonth = end.getMonth();

  const startDay = start.getDate();
  const endDay = end.getDate();

  console.debug('startDay:', startDay, 'endDay:', endDay);
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startYear === endYear) {
    if (startMonth === endMonth) {
      return `${months[startMonth]} ${startDay.toString()}-${endDay.toString()}, ${startYear.toString()}`;
    } else if (endMonth > startMonth) {
      return `${months[startMonth]} ${startDay.toString()}-${months[endMonth]} ${endDay.toString()}, ${startYear.toString()}`;
    }
  } else if (endYear > startYear) {
    if (startMonth === endMonth) {
      return `${months[startMonth]} ${startDay.toString()}-${endDay.toString()}, ${endYear.toString()}`;
    } else if (endMonth > startMonth) {
      return `${months[startMonth]} ${startDay.toString()}-${months[endMonth]} ${endDay.toString()}, ${endYear.toString()}`;
    }
  }

  throw new Error('invalid date range');
}

export function formatDate(date: string): string {
  // 1. Create a Date object from the string.
  // Note: JavaScript parses "YYYY-MM-DD" strings as UTC by default.
  const dateObject: Date = new Date(date + 'T00:00:00'); // Add T00:00:00 for consistent parsing in local timezone

  // 2. Define the formatting options.
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // 3. Format the date using Intl.DateTimeFormat.
  // 'en-US' specifies the locale (English, United States).
  return new Intl.DateTimeFormat('en-US', options).format(dateObject);
}
