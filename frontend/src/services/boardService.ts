import api from "./api";

export interface Board {
  id: number;
  title: string;
  description: string | null;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface BoardList {
  id: number;
  title: string;
  position: number;
  board_id: number;
  created_at: string;
  updated_at: string;
}

export const getBoards = async (): Promise<Board[]> => {
  const response = await api.get<Board[]>("/boards");

  return response.data;
};

export const getBoard = async (
  boardId: number,
): Promise<Board> => {
  const response = await api.get<Board>(
    `/boards/${boardId}`,
  );

  return response.data;
};

export const getBoardLists = async (
  boardId: number,
): Promise<BoardList[]> => {
  const response = await api.get<BoardList[]>(
    `/boards/${boardId}/lists`,
  );

  return response.data;
};