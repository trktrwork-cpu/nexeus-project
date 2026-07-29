import { useState } from "react";

import {
  createCard,
  type Card,
} from "../../services/cardService";

interface CreateCardModalProps {
  listId: number;
  onClose: () => void;
  onCreate: (card: Card) => void;
}

const CreateCardModal = ({
  listId,
  onClose,
  onCreate,
}: CreateCardModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Title is required.");
      return;
    }

    try {
      const newCard = await createCard(listId, {
        title,
        description,
        due_date: dueDate || undefined,
      });

      onCreate(newCard);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to create card.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15,23,42,0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "560px",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 20px 50px rgba(0,0,0,.35)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "2rem",
            textAlign: "center",
            color: "#1f2937",
          }}
        >
          Create Card
        </h2>

        <label
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: ".5rem",
            fontWeight: 600,
            color: "#374151",
          }}
        >
          Title
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: ".9rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            marginBottom: "1.8rem",
            boxSizing: "border-box",
            fontSize: "1rem",
            color: "#111827",
            background: "#fff",
          }}
        />

        <label
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: ".5rem",
            fontWeight: 600,
            color: "#374151",
          }}
        >
          Description
        </label>

        <textarea
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            padding: ".9rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            marginBottom: "1.8rem",
            boxSizing: "border-box",
            resize: "vertical",
            fontSize: "1rem",
            color: "#111827",
            background: "#fff",
          }}
        />

        <label
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: ".5rem",
            fontWeight: 600,
            color: "#374151",
          }}
        >
          Due Date
        </label>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{
            width: "100%",
            padding: ".9rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            marginBottom: "2rem",
            boxSizing: "border-box",
            fontSize: "1rem",
            color: "#111827",
            background: "#fff",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: ".75rem 1.5rem",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#fff",
              color: "#111827",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            style={{
              padding: ".75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Create Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCardModal;