import api from "./api";
import type { Card } from "./cardService";

export interface Label {
  id: number;
  name: string;
  color: string;
  board_id: number;
}

export interface CreateLabelRequest {
  board_id: number;
  name: string;
  color: string;
}

export interface UpdateLabelRequest {
  name: string;
  color: string;
}

export const getBoardLabels = async (
  boardId: number,
): Promise<Label[]> => {
  const response = await api.get<Label[]>(
    `/boards/${boardId}/labels`,
  );

  return response.data;
};

export const createLabel = async (
  data: CreateLabelRequest,
): Promise<Label> => {
  const response = await api.post<Label>(
    "/labels",
    data,
  );

  return response.data;
};

export const updateLabel = async (
  labelId: number,
  data: UpdateLabelRequest,
): Promise<Label> => {
  const response = await api.patch<Label>(
    `/labels/${labelId}`,
    data,
  );

  return response.data;
};

export const deleteLabel = async (
  labelId: number,
): Promise<void> => {
  await api.delete(`/labels/${labelId}`);
};

export const attachLabel = async (
  cardId: number,
  labelId: number,
): Promise<Card> => {
  const response = await api.post<Card>(
    `/cards/${cardId}/labels/${labelId}`,
  );

  return response.data;
};

export const detachLabel = async (
  cardId: number,
  labelId: number,
): Promise<Card> => {
  const response = await api.delete<Card>(
    `/cards/${cardId}/labels/${labelId}`,
  );

  return response.data;
};