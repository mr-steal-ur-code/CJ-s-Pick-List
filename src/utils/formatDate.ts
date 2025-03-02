const formatDate = (date: string | undefined) => {
  if (!date) return "N/A";
  try {
    const dateString = new Date(date)
    const formattedDate = dateString.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return formattedDate;
  } catch (error) {
    console.log("error formatting date:", error);

    return date;
  }
}
export default formatDate;