export const dateConversion = (date: string) => {
  if (!date) {
    return;
  }

  const months = [
    'januar',
    'februar',
    'marts',
    'april',
    'maj',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'december',
  ];

  // Split the input date string by the dot separator
  const [day, month, year] = date.split('.');

  // Convert the month number to an integer and get the Danish month name
  const monthName = months[parseInt(month, 10) - 1];

  // Return the formatted date string
  return `${parseInt(day, 10)}. ${monthName} ${year}`;
};
