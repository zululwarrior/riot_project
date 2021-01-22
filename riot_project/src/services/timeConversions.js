const periods = {
  month: 30 * 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
};

export const convertToTimeAgo = (timestamp) => {
  const secondsDiff = Date.now() - timestamp;

  if (secondsDiff > periods.month) {
    return Math.floor(secondsDiff / periods.month) > 1
      ? Math.floor(secondsDiff / periods.month) + ' months ago'
      : Math.floor(secondsDiff / periods.month) + ' month ago';
  } else if (secondsDiff > periods.day) {
    return Math.floor(secondsDiff / periods.day) > 1
      ? Math.floor(secondsDiff / periods.day) + ' days ago'
      : Math.floor(secondsDiff / periods.day) + ' day ago';
  } else if (secondsDiff > periods.hour) {
    return Math.floor(secondsDiff / periods.hour) > 1
      ? Math.floor(secondsDiff / periods.hour) + ' hours ago'
      : Math.floor(secondsDiff / periods.hour) + ' hour ago';
  } else if (secondsDiff > periods.minute) {
    return Math.floor(secondsDiff / periods.minute) > 1
      ? Math.floor(secondsDiff / periods.minute) + ' minutes ago'
      : Math.floor(secondsDiff / periods.minute) + ' minute ago';
  }
  return 'A few seconds ago';
};

export const convertToTime = (timestamp) => {
  const hour = Math.floor(timestamp / 60 / 60);
  const minute = Math.floor((timestamp - hour * 60 * 60) / 60);
  const second = timestamp - minute * 60;

  if (hour > 0) {
    return hour + 'h ' + minute + 'm ' + second + 's';
  } else if (minute > 0) {
    return minute + 'm ' + second + 's';
  }
  return second + 's';
};

export const convertToMinutes = (timestamp) => {
  const minute = Math.floor(timestamp / 60) 
}
