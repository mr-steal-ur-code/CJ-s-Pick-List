import { Timestamp } from "firebase/firestore";

type DateFormats = {
  shortDate: string;
  longDate: string;
  dateInput: string;
}

const formatTimestamp = (timestampOrDate: Timestamp | Date | any, format: keyof DateFormats) => {
  if (!timestampOrDate) return;

  let date: Date;

  // Handle Firebase Timestamp
  if (timestampOrDate instanceof Timestamp) {
    date = new Date(timestampOrDate.seconds * 1000);
  }
  // Handle JavaScript Date object
  else if (timestampOrDate instanceof Date) {
    date = timestampOrDate;
  }
  // Handle other object types, like toString() format
  else if (typeof timestampOrDate === 'object') {
    // Try to convert to Date if it's a date-like object
    date = new Date(timestampOrDate);
  }
  // If conversion failed or invalid input
  if (!date || isNaN(date.getTime())) {
    console.error("Invalid date format provided");
    return;
  }

  const monthName = date.toLocaleString("default", { month: "long" });
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  switch (format) {
    case "shortDate":
      return `${month}/${day}/${year}`;
    case "longDate":
      return `${monthName} ${day}, ${year}`;
    case "dateInput":
      return `${year}-${month}-${day}`;
    default:
      console.log("Invalid format provided. Supported formats: shortDate, longDate, dateInput");
      return;
  }
}

export { formatTimestamp };