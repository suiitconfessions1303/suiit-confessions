export function formatDateTime(value) {
  if (!value) return "Time unavailable";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function timeAgo(value) {
  if (!value) return "Unknown time";
  const diff = Date.now() - new Date(value).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
}

export function isWithinDays(value, days) {
  if (!value) return false;
  return Date.now() - new Date(value).getTime() < days * 86400000;
}

export function isToday(value) {
  if (!value) return false;
  return new Date(value).toDateString() === new Date().toDateString();
}

export function deviceOf(item) {
  return item.metadata?.deviceType || "Unknown";
}

export function isMobileDevice(item) {
  return /mobile|tablet/i.test(deviceOf(item));
}

export function computeStats(items) {
  const total = items.length;
  const mobile = items.filter(isMobileDevice).length;
  return {
    total,
    today: items.filter((i) => isToday(i.submittedAt)).length,
    week: items.filter((i) => isWithinDays(i.submittedAt, 7)).length,
    mobileShare: total ? Math.round((mobile / total) * 100) : 0,
  };
}
