import api from "./api";

export interface Card {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  position: number;
  list_id: number;
  created_at: string;
  updated_at: string;
  labels: {
    id: number;
    name: string;
    color: string;
    board_id: number;
  }[];
}

export interface CreateCardRequest {
  title: string;
  description?: string;
  due_date?: string;
}

export interface UpdateCardRequest {
  title?: string;
  description?: string;
  due_date?: string | null;
}

export const getCards = async (
  listId: number,
): Promise<Card[]> => {
  const response = await api.get<Card[]>(
    `/lists/${listId}/cards`,
  );

  return response.data;
};

export const createCard = async (
  listId: number,
  data: CreateCardRequest,
): Promise<Card> => {
  const response = await api.post<Card>(
    `/lists/${listId}/cards`,
    data,
  );

  return response.data;
};

export const updateCard = async (
  cardId: number,
  data: UpdateCardRequest,
): Promise<Card> => {
  const response = await api.patch<Card>(
    `/cards/${cardId}`,
    data,
  );

  return response.data;
};

export const deleteCard = async (
  cardId: number,
): Promise<void> => {
  await api.delete(`/cards/${cardId}`);
};

export const moveCard = async (
  cardId: number,
  listId: number,
  position: number,
): Promise<Card> => {
  const response = await api.patch<Card>(
    `/cards/${cardId}/move`,
    {
      list_id: listId,
      position,
    },
  );

  return response.data;
};