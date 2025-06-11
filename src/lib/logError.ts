export const logError = (
  e: Error | unknown,
  message: string,
  data?: Record<string | number, string | number>,
): void => {
  const separator = '-'.repeat(100);
  let dataString = '';

  for (const name in data) {
    dataString += `${name}: ${data[name]}\n`;
  }

  console.log(`${separator}\n!ERROR!\n${message}\n${dataString}`);
  console.log(e);
  console.log(separator);
};
