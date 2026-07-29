import api from "./api";

export interface BoardList {
  id: number;
  title: string;
  position: number;
  board_id: number;
  created_at: string;
  updated_at: string;
}

export const getBoardLists = async (
  boardId: number,
): Promise<BoardList[]> => {
  const response = await api.get<BoardList[]>(
    `/boards/${boardId}/lists`,
  );

  return response.data;
};