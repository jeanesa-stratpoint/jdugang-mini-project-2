export function formatDate(date: Date | string | null | undefined): string {
  if (!date) {
    return "Draft";
  }

  const dateObj = new Date(date);
  const now = new Date();
  
  // in seconds
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  // intervals in seconds
  const minute = 60;
  const hour = 3600; // 60 * 60
  const day = 86400; // 24 * 60 * 60
  const threeDays = 259200; // 3 * 24 * 60 * 60

  if (diffInSeconds > threeDays) {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (diffInSeconds < minute) {
    return "Just now";
  }

  if (diffInSeconds < hour) {
    const minutes = Math.floor(diffInSeconds / minute);
    return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
  }

  if (diffInSeconds < day) {
    const hours = Math.floor(diffInSeconds / hour);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  const days = Math.floor(diffInSeconds / day);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
}