import api from "./api";

export interface Worklog {
  id: number;
  card_id: number;
  user_id: number;
  hours: string;
  work_date: string;
  notes: string | null;
  created_at: string;
}

export const getWeeklyWorklogs = async (
  weekStart: string,
): Promise<Worklog[]> => {
  const response = await api.get<Worklog[]>("/worklogs/me", {
    params: {
      week_start: weekStart,
    },
  });

  return response.data;
};