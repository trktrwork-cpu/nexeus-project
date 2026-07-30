import { useEffect, useState } from "react";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  getBoards,
  getBoardLists,
  type Board,
  type BoardList,
} from "../../services/boardService";

import {
  getCards,
  moveCard,
  type Card,
} from "../../services/cardService";

import BoardColumn from "./BoardColumn";
import CardEditModal from "./CardEditModal";
import CreateCardModal from "./CreateCardModal";

console.log("NEW CardEditModal loaded");

const BoardPage = () => {
  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<BoardList[]>([]);
  const [cardsByList, setCardsByList] = useState<
    Record<number, Card[]>
  >({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [selectedListId, setSelectedListId] =
    useState<number | null>(null);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [selectedCard, setSelectedCard] =
    useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  useEffect(() => {
    const loadBoard = async () => {
      try {
        const boards = await getBoards();

        if (boards.length === 0) {
          setLoading(false);
          return;
        }

        const firstBoard = boards[0];

        setBoard(firstBoard);

        const boardLists = await getBoardLists(firstBoard.id);

        setLists(boardLists);

        const cardsMap: Record<number, Card[]> = {};

        for (const list of boardLists) {
          cardsMap[list.id] = await getCards(list.id);
        }

        setCardsByList(cardsMap);
      } catch (err) {
        console.error(err);
        setError("Failed to load board.");
      } finally {
        setLoading(false);
      }
    };

    loadBoard();
  }, []);

  const openCreateModal = (listId: number) => {
    setSelectedListId(listId);
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setSelectedListId(null);
  };

  const openEditModal = (card: Card) => {
    console.log("Opening modal", card);

    setSelectedCard(card);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setSelectedCard(null);
    setShowEditModal(false);
  };

  const handleCardUpdated = (updatedCard: Card) => {
    setCardsByList((prev) => {
      const updated = { ...prev };

      for (const listId of Object.keys(updated)) {
        updated[Number(listId)] = updated[
          Number(listId)
        ].map((card) =>
          card.id === updatedCard.id
            ? updatedCard
            : card,
        );
      }

      return updated;
    });

    setSelectedCard(updatedCard);
  };

  const handleCardDeleted = (cardId: number) => {
    setCardsByList((prev) => {
      const updated = { ...prev };

      for (const listId of Object.keys(updated)) {
        updated[Number(listId)] = updated[
          Number(listId)
        ].filter((card) => card.id !== cardId);
      }

      return updated;
    });

    closeEditModal();
  };

  const handleCardCreated = (newCard: Card) => {
    setCardsByList((prev) => ({
      ...prev,
      [newCard.list_id]: [
        ...(prev[newCard.list_id] ?? []),
        newCard,
      ],
    }));
  };

  const findListIdByCard = (cardId: number) => {
    for (const [listId, cards] of Object.entries(cardsByList)) {
      if (cards.some((card) => card.id === cardId)) {
        return Number(listId);
      }
    }

    return null;
  };

  const handleDragEnd = async (
    event: DragEndEvent,
  ) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = Number(active.id);
    const overId = Number(over.id);

    if (activeId === overId) {
      return;
    }

    const sourceListId = findListIdByCard(activeId);

    let destinationListId: number | null = null;

    if (typeof over.id === "string") {
      if (over.id.startsWith("list-")) {
        destinationListId = Number(
          over.id.replace("list-", ""),
        );
      }
    } else {
      destinationListId = findListIdByCard(
        Number(over.id),
      );
    }

    if (
      sourceListId === null ||
      destinationListId === null
    ) {
      return;
    }

    const sourceCards = [
      ...(cardsByList[sourceListId] ?? []),
    ];

    const destinationCards =
      sourceListId === destinationListId
        ? sourceCards
        : [
          ...(cardsByList[destinationListId] ?? []),
        ];

    const movingCard = sourceCards.find(
      (card) => card.id === activeId,
    );

    if (!movingCard) {
      return;
    }

    const sourceIndex = sourceCards.findIndex(
      (card) => card.id === activeId,
    );

    let destinationIndex =
      destinationCards.findIndex(
        (card) => card.id === overId,
      );

    if (destinationIndex === -1) {
      destinationIndex =
        destinationCards.length;
    }

    sourceCards.splice(sourceIndex, 1);

    const updatedCard = {
      ...movingCard,
      list_id: destinationListId,
    };

    if (sourceListId === destinationListId) {
      sourceCards.splice(
        destinationIndex,
        0,
        updatedCard,
      );
    } else {
      destinationCards.splice(
        destinationIndex,
        0,
        updatedCard,
      );
    }

    const updatedCardsByList = {
      ...cardsByList,
    };

    if (sourceListId === destinationListId) {
      updatedCardsByList[sourceListId] =
        destinationCards;
    } else {
      updatedCardsByList[sourceListId] =
        sourceCards;
      updatedCardsByList[destinationListId] =
        destinationCards;
    }

    setCardsByList(updatedCardsByList);

    try {
      await moveCard(
        activeId,
        destinationListId,
        destinationIndex,
      );
    } catch (error) {
      console.error(error);

      const cardsMap: Record<number, Card[]> =
        {};

      for (const list of lists) {
        cardsMap[list.id] = await getCards(
          list.id,
        );
      }

      setCardsByList(cardsMap);
    }
  };

  if (loading) {
    return <h2>Loading board...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!board) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <button
          onClick={() => {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
          }}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            padding: "0.6rem 1rem",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#ef4444",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>

        <h2>No boards found.</h2>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          padding: "2rem",
          backgroundColor: "#ffffff",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1
            style={{
              color: "#111827",
              fontSize: "2rem",
              fontWeight: "700",
              margin: 0,
            }}
          >
            {board.title}
          </h1>

          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              window.location.href = "/login";
            }}
            style={{
              padding: "0.6rem 1rem",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#ef4444",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        </div>

        {board.description && (
          <p
            style={{
              color: "#4b5563",
              marginBottom: "2rem",
            }}
          >
            {board.description}
          </p>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            width: "100%",
          }}
        >
          {lists.map((list) => (
            <BoardColumn
              key={list.id}
              list={list}
              cards={cardsByList[list.id] ?? []}
              onAddCard={openCreateModal}
              onCardClick={openEditModal}
            />
          ))}
        </div>

        {showCreateModal &&
          selectedListId !== null && (
            <CreateCardModal
              listId={selectedListId}
              onClose={closeCreateModal}
              onCreate={handleCardCreated}
            />
          )}

        {showEditModal && selectedCard && (
          <CardEditModal
            card={selectedCard}
            boardId={board.id}
            onClose={closeEditModal}
            onSave={handleCardUpdated}
            onDelete={handleCardDeleted}
          />
        )}
      </div>
    </DndContext >
  );
};

export default BoardPage;