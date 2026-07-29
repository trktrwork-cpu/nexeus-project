export const getWeekStart = (date: Date) => {
  const monday = new Date(date);

  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  monday.setDate(monday.getDate() + diff);

  return monday;
};

export const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};