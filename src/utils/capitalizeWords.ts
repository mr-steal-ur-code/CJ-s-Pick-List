export default function capitalizeWords(str: string) {
  if (typeof str !== "string") return str;
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}