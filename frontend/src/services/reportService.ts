import api from "./api";

export interface HoursByUser {
  user_id: number;
  username: string;
  total_hours: number;
}

export interface HoursByCard {
  card_id: number;
  card_title: string;
  total_hours: number;
}

export interface WeeklySummary {
  total_hours: number;
  newly_created_tasks: number;
}

export interface WeeklyReport {
  summary: WeeklySummary;
  hours_by_user: HoursByUser[];
  hours_by_card: HoursByCard[];
}

export const getWeeklyReport = async (
  weekStart: string,
): Promise<WeeklyReport> => {
  const response = await api.get<WeeklyReport>("/reports/weekly", {
    params: {
      week_start: weekStart,
    },
  });

  return response.data;
};