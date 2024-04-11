import { DateTime, Interval } from 'luxon';

export const getWeeks = (dates: string[]): string[][] => {
  const result = [];
  const copyArr = [...dates];
  const daysInWeek = 7;

  while (copyArr.length) {
    result.push(copyArr.splice(0, daysInWeek));
  }
  return result;
};

// get all dates in ISO format from date's range
export const getDateInterval = (
  startDate: string,
  endDate: string,
  withoutWeeknds = false,
): string[] => {
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);

  if (withoutWeeknds) {
    const result: string[] = [];
    const weekendDays = [6, 7];
    Interval
      .fromDateTimes(start.startOf('day'), end.endOf('day'))
      .splitBy({ day: 1 })
      .forEach((date: Interval) => {
        if (!weekendDays.includes(date.start?.weekday ?? 0)) {
          result.push(date.start?.toISODate() || '');
        }
      });
    return result;
  }

  return Interval.fromDateTimes(start.startOf('day'), end.endOf('day'))
    .splitBy({ day: 1 })
    .map((item: Interval) => item.start?.toISODate() ?? '');
};

// get all months from date's range
export const getMonthInterval = (
  startDate: string,
  endDate: string,
): { text: string, dates: string[] }[] => {
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);

  return Interval
    .fromDateTimes(start.startOf('day'), end.endOf('day'))
    .splitBy({ month: 1 })
    .map((item: Interval) => (
      { text: item.start?.monthLong ?? '', dates: [item.start?.toISODate() || '', item.end?.minus({ day: 1 }).toISODate() || ''] }
    ));
};

// get all years from date's range
export const getYearInterval = (
  startDate: string,
  endDate: string,
): string[] => {
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);

  return Interval
    .fromDateTimes(start.startOf('day'), end.endOf('day'))
    .splitBy({ year: 1 })
    .map((item: Interval) => item.start?.year.toString() ?? '');
};

export const getAverageNumberOfDays = (
  startDate: string,
  endDate: string,
  type: 'year' | 'month',
): number => {
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);

  if (type === 'year') {
    return Interval.fromDateTimes(start.startOf('year'), end.endOf('year'))
      .splitBy({ year: 1 })
      .map((item) => item.start!.daysInYear!)
      .reduce((acc, item, index, array) => {
        if (index === array.length - 1) {
          return (acc + item) / array.length;
        }
        return acc + item;
      }, 0);
  }

  return Interval.fromDateTimes(start.startOf('month'), end.endOf('month'))
    .splitBy({ month: 1 })
    .map((item) => item.start!.daysInMonth!)
    .reduce((acc, item, index, array) => {
      if (index === array.length - 1) {
        return (acc + item) / array.length;
      }
      return acc + item;
    }, 0);
};
