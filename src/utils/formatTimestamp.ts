import { Timestamp } from "firebase/firestore";

type DateFormats = {
  shortDate: string;
  longDate: string;
  dateInput: string;
}

const formatTimestamp = (timestamp: Timestamp, format: keyof DateFormats) => {
  if (!timestamp) return;
  const seconds = timestamp.seconds;

  const date = new Date(seconds * 1000);

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
      console.log("Invalid format provided. Supported formats: shortDate, longDate");
  }
}

export { formatTimestamp };
