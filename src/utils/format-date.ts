export function formatDateShortHand(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
  });
}
