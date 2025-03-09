const dateFromTimestamp = (timestamp: { seconds: number; nanoseconds: number } | string | Date) => {
  let dateObj: Date;

  if (timestamp instanceof Date) {
    timestamp = timestamp.toISOString();
  }
  else if (typeof timestamp === "string") {
    const [date] = timestamp.split("T");
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
  }
  else if (typeof timestamp === "object" && "seconds" in timestamp) {
    dateObj = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  }


}
export default dateFromTimestamp;