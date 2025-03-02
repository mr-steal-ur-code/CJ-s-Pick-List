const formatPhoneNumber = (value: string | number | readonly string[] | undefined) => {
  if (!value) return "";
  const cleanedNumber = String(value).replace(/\D/g, "");

  if (cleanedNumber.length < 4) {
    return cleanedNumber;
  }
  if (cleanedNumber.length < 7) {
    return `(${cleanedNumber.slice(0, 3)})-${cleanedNumber.slice(3)}`;
  }
  return `(${cleanedNumber.slice(0, 3)})-${cleanedNumber.slice(
    3,
    6
  )}-${cleanedNumber.slice(6)}`;
};

export default formatPhoneNumber;