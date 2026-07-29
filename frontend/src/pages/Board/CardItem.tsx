import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import type { Card } from "../../services/cardService";

interface CardItemProps {
  card: Card;
  onClick: (card: Card) => void;
}

const CardItem = ({
  card,
  onClick,
}: CardItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => onClick(card)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",

        background: "#ffffff",
        color: "#172B4D",

        borderRadius: 10,
        padding: 14,

        marginBottom: 10,

        boxShadow:
          "0 1px 2px rgba(9,30,66,.25)",

        border: "1px solid #E5E7EB",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: 15,
          marginBottom: 10,
        }}
      >
        {card.title}
      </div>

      {card.description && (
        <div
          style={{
            color: "#5E6C84",
            fontSize: 14,
            marginBottom: 10,
          }}
        >
          {card.description}
        </div>
      )}

      {card.due_date && (
        <div
          style={{
            display: "inline-block",
            background: "#E3FCEF",
            color: "#006644",
            padding: "4px 8px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          📅 {card.due_date}
        </div>
      )}

      {(card.labels ?? []).length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginTop: 8,
          }}
        >
          {(card.labels ?? []).map((label) => (
            <span
              key={label.id}
              style={{
                background: label.color,
                color: "white",
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardItem;