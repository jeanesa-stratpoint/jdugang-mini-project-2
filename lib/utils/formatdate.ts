export function formatDate(date: Date | string | null | undefined): string {
  if (!date) {
    return "Draft";
  }

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}