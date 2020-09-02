import dayjs from 'dayjs';
import { BY } from '../../constants';
import { TaskData } from '../../types';

export const dateToHuman = ({
  date,
  today,
  dateType,
}: {
  date: string;
  today: string;
  dateType: keyof TaskData;
}) => {
  const daysFromToday = dayjs(date).diff(dayjs(today), 'day');
  const todayText = daysFromToday === 0 ? 'Today' : `${daysFromToday} days`;

  if (dateType === BY) {
    const isOverdue = dateType === BY && daysFromToday <= 0;
    const isToday = dateType === BY && daysFromToday === 0;
    const isThisWeek = name === BY && daysFromToday > 0 && daysFromToday < 7;

    return {
      isOverdue,
      isToday,
      isThisWeek,
      todayText,
      daysFromToday,
    };
  }

  return {
    isOverdue: false,
    isToday: false,
    isThisWeek: false,
    todayText,
    daysFromToday,
  };
};
