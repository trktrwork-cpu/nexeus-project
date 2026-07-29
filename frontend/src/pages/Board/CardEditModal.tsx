import { useEffect, useState } from "react";

import {
    type Card,
    updateCard,
    deleteCard,
} from "../../services/cardService";

import {
    type Label,
    getBoardLabels,
    createLabel,
    attachLabel,
    detachLabel,
    updateLabel,
    deleteLabel,
} from "../../services/labelService";

interface CardEditModalProps {
    boardId: number;
    card: Card;
    onClose: () => void;
    onSave: (card: Card) => void;
    onDelete: (cardId: number) => void;
}

const CardEditModal = ({
    boardId,
    card,
    onClose,
    onSave,
    onDelete,
}: CardEditModalProps) => {
    const [title, setTitle] = useState(card.title);

    const [description, setDescription] = useState(
        card.description ?? "",
    );

    const [dueDate, setDueDate] = useState(
        card.due_date ?? "",
    );

    // ADD THIS HERE
    const [labels, setLabels] = useState<Label[]>([]);

    const [newLabelName, setNewLabelName] =
        useState("");

    const [newLabelColor, setNewLabelColor] =
        useState("#2563eb");

    useEffect(() => {
        setTitle(card.title);
        setDescription(card.description ?? "");
        setDueDate(card.due_date ?? "");

        const loadLabels = async () => {
            try {
                const boardLabels = await getBoardLabels(boardId);
                setLabels(boardLabels);
            } catch (error) {
                console.error(error);
            }
        };

        loadLabels();
    }, [card, boardId]);

    const handleSave = async () => {
        if (!title.trim()) {
            alert("Title is required.");
            return;
        }

        try {
            const updatedCard = await updateCard(card.id, {
                title,
                description,
                due_date: dueDate || null,
            });

            onSave(updatedCard);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to update card.");
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this card?",
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteCard(card.id);
            onDelete(card.id);
        } catch (error) {
            console.error(error);
            alert("Failed to delete card.");
        }
    };

    const toggleLabel = async (label: Label) => {
        try {
            const hasLabel = card.labels.some(
                (l) => l.id === label.id,
            );

            const updatedCard = hasLabel
                ? await detachLabel(card.id, label.id)
                : await attachLabel(card.id, label.id);

            onSave(updatedCard);
        } catch (error) {
            console.error(error);
            alert("Failed to update labels.");
        }
    };

    const handleCreateLabel = async () => {
        if (!newLabelName.trim()) {
            return;
        }

        try {
            const label = await createLabel({
                board_id: boardId,
                name: newLabelName,
                color: newLabelColor,
            });

            setLabels((prev) => [...prev, label]);

            setNewLabelName("");
            setNewLabelColor("#2563eb");
        } catch (error) {
            console.error(error);
            alert("Failed to create label.");
        }
    };

    const handleUpdateLabel = async (label: Label) => {
        const newName = prompt("Label name", label.name);

        if (newName === null) return;

        const newColor =
            prompt("Label color (hex)", label.color) ??
            label.color;

        try {
            const updated = await updateLabel(label.id, {
                name: newName,
                color: newColor,
            });

            setLabels((prev) =>
                prev.map((l) =>
                    l.id === updated.id ? updated : l,
                ),
            );
        } catch (error) {
            console.error(error);
            alert("Failed to update label.");
        }
    };

    const handleDeleteLabel = async (labelId: number) => {
        if (!window.confirm("Delete this label?")) {
            return;
        }

        try {
            await deleteLabel(labelId);

            setLabels((prev) =>
                prev.filter((l) => l.id !== labelId),
            );
        } catch (error) {
            console.error(error);
            alert("Failed to delete label.");
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
                    Edit Card
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

                <label
                    style={{
                        display: "block",
                        textAlign: "center",
                        marginBottom: ".75rem",
                        fontWeight: 600,
                        color: "#374151",
                    }}
                >
                    Labels
                </label>

                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "2rem",
                    }}
                >
                    {labels.map((label) => {
                        const selected = card.labels.some(
                            (l) => l.id === label.id,
                        );

                        return (
                            <button
                                key={label.id}
                                type="button"
                                onClick={() => toggleLabel(label)}
                                style={{
                                    background: label.color,
                                    color: "#fff",
                                    border: selected
                                        ? "3px solid #111827"
                                        : "1px solid transparent",
                                    borderRadius: "999px",
                                    padding: "6px 12px",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    opacity: selected ? 1 : 0.75,
                                }}
                            >
                                {label.name}
                            </button>
                        );
                    })}
                </div>

                <hr
                    style={{
                        margin: "24px 0",
                    }}
                />

                <h3
                    style={{
                        marginBottom: "12px",
                        color: "#1f2937",
                    }}
                >
                    Create Label
                </h3>

                <input
                    placeholder="Label name"
                    value={newLabelName}
                    onChange={(e) =>
                        setNewLabelName(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: ".75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        boxSizing: "border-box",
                        marginBottom: "12px",
                    }}
                />

                <input
                    type="color"
                    value={newLabelColor}
                    onChange={(e) =>
                        setNewLabelColor(e.target.value)
                    }
                    style={{
                        width: "70px",
                        height: "40px",
                        marginBottom: "16px",
                        cursor: "pointer",
                    }}
                />

                <button
                    type="button"
                    onClick={handleCreateLabel}
                    style={{
                        display: "block",
                        padding: ".75rem 1.5rem",
                        borderRadius: "8px",
                        border: "none",
                        background: "#2563eb",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer",
                        marginBottom: "2rem",
                    }}
                >
                    Create Label
                </button>

                <hr
                    style={{
                        margin: "24px 0",
                    }}
                />

                <h3
                    style={{
                        marginBottom: "12px",
                        color: "#1f2937",
                    }}
                >
                    Manage Labels
                </h3>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        marginBottom: "2rem",
                    }}
                >
                    {labels.map((label) => (
                        <div
                            key={label.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                <div
                                    style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        background: label.color,
                                    }}
                                />

                                <span>{label.name}</span>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleUpdateLabel(label)
                                    }
                                    style={{
                                        border: "none",
                                        background: "#f3f4f6",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                    }}
                                >
                                    ✏️
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDeleteLabel(label.id)
                                    }
                                    style={{
                                        border: "none",
                                        background: "#fee2e2",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px",
                    }}
                >
                    <button
                        onClick={handleDelete}
                        style={{
                            padding: ".75rem 1.5rem",
                            borderRadius: "8px",
                            border: "none",
                            background: "#dc2626",
                            color: "#fff",
                            fontWeight: 600,
                            cursor: "pointer",
                            marginRight: "auto",
                        }}
                    >
                        Delete Card
                    </button>

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
                        onClick={handleSave}
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
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardEditModal