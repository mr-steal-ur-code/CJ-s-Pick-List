const dateFromTimestamp = (timestamp: { seconds: number; nanoseconds: number } | string | Date | number | { _seconds: number; _nanoseconds: number }) => {
  if (timestamp instanceof Date) {
    const year = timestamp.getFullYear();
    const month = String(timestamp.getMonth() + 1).padStart(2, "0");
    const day = String(timestamp.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  }

  else if (typeof timestamp === "string") {
    const [date] = timestamp.split("T");
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
  }

  else if (typeof timestamp === "number") {
    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  }

  else if (typeof timestamp === "object") {
    let dateObj: Date;

    if ("seconds" in timestamp && "nanoseconds" in timestamp) {
      dateObj = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
    }
    else if ("_seconds" in timestamp && "_nanoseconds" in timestamp) {
      dateObj = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6);
    }
    else {
      console.error("Unsupported timestamp format:", timestamp);
      return null;
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  }

  console.error("Unsupported timestamp type:", typeof timestamp);
  return null;
};

export default dateFromTimestamp;