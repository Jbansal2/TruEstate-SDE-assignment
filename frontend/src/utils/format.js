export const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-IN") : "-";
