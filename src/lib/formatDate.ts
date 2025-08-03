export const formatDate = (ms: number, withTime = true): string => {
  const date = new Date(ms);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы с 0
  const year = date.getFullYear();

  const time = withTime ? `${hours}:${minutes} ` : ''

  return time + `${day}.${month}.${year}`;
};
