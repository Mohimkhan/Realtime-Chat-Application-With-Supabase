export const formatCustomDate = (
  date: Date,
): Record<"date" | "time", string> => {
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2); // Get last two digits of year

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format and handle midnight (0 hours)
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 hours should be 12 AM

  // Pad minutes with a leading zero if needed
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  return {
    date: `${day}-${month}-${year}`,
    time: `${hours}:${formattedMinutes} ${ampm}`,
  };
};
