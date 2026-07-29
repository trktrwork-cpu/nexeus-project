import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { BoardList } from "../../services/boardService";
import type { Card } from "../../services/cardService";

import CardItem from "./CardItem";

interface BoardColumnProps {
  list: BoardList;
  cards: Card[];
  onAddCard: (listId: number) => void;
  onCardClick: (card: Card) => void;
}

const BoardColumn = ({
  list,
  cards,
  onAddCard,
  onCardClick,
}: BoardColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: `list-${list.id}`,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: "24%",
        minWidth: 0,
        background: "#f4f5f7",
        borderRadius: 12,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 180px)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "#172B4D",
          }}
        >
          {list.title}
        </h3>

        <button
          onClick={() => onAddCard(list.id)}
          style={{
            border: "none",
            background: "#0052CC",
            color: "#fff",
            borderRadius: 8,
            width: 32,
            height: 32,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          +
        </button>
      </div>

      <SortableContext
        items={cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          {cards.length === 0 ? (
            <div
              style={{
                color: "#6B7280",
                textAlign: "center",
                marginTop: 20,
              }}
            >
              No cards
            </div>
          ) : (
            cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                onClick={onCardClick}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default BoardColumn;