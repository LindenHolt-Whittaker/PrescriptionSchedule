export const formatLongDate = (date: Date): string => {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatShortDate = (date: Date): string => {
  return date.toLocaleDateString("en-GB", {
    year: "2-digit",
    month: "numeric",
    day: "2-digit",
  });
};
