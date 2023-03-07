/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { css } from "@emotion/react";
import KanbanColumn from "./KanbanColumn";
const kanbanBoardStyle = css`
  flex: 10;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin: 0 1rem 1rem;
`;
const COLUMN_BG_COLORS = {
  loading: "#E3E3E3",
  todo: "#C9AF97",
  ongoing: "#FFE799",
  done: "#C0E8BA",
};

export const COLUMN_KEY_TODO = "todo";
export const COLUMN_KEY_ONGOING = "ongoing";
export const COLUMN_KEY_DONE = "done";
export default function KanbanBoard({
  isLoading,
  todoList,
  ongoingList,
  doneList,
  onAdd,
  onRemove,
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);
  const handleDrop = (evt) => {
    if (
      !draggedItem ||
      !dragSource ||
      !dragTarget ||
      dragSource === dragTarget
    ) {
      return;
    }

    if (dragSource) {
      onRemove(dragSource, draggedItem);
    }
    if (dragTarget) {
      onAdd(dragTarget, draggedItem);
    }
  };
  return (
    <main css={kanbanBoardStyle}>
      {isLoading ? (
        <KanbanColumn
          title="读取中..."
          bgColor={COLUMN_BG_COLORS.loading}
        ></KanbanColumn>
      ) : (
        <>
          <KanbanColumn
            canAddnew
            className="column-todo"
            bgColor={COLUMN_BG_COLORS.todo}
            title="待处理"
            setIsDragSource={(isSrc) =>
              setDragSource(isSrc ? COLUMN_KEY_TODO : null)
            }
            setIsDragTarget={(isTarget) =>
              setDragTarget(isTarget ? COLUMN_KEY_TODO : null)
            }
            onAdd={onAdd.bind(null, COLUMN_KEY_TODO)}
            onDrop={handleDrop}
            onRemove={onRemove.bind(null, COLUMN_KEY_TODO)}
            setDraggedItem={setDraggedItem}
            cardList={todoList}
          ></KanbanColumn>
          <KanbanColumn
            className="column-ongoing"
            title="进行中"
            bgColor={COLUMN_BG_COLORS.ongoing}
            setIsDragSource={(isSrc) =>
              setDragSource(isSrc ? COLUMN_KEY_ONGOING : null)
            }
            setIsDragTarget={(isTarget) =>
              setDragTarget(isTarget ? COLUMN_KEY_ONGOING : null)
            }
            onDrop={handleDrop}
            onRemove={onRemove.bind(null, COLUMN_KEY_ONGOING)}
            setDraggedItem={setDraggedItem}
            cardList={ongoingList}
          ></KanbanColumn>
          <KanbanColumn
            className="column-done"
            title="已完成"
            bgColor={COLUMN_BG_COLORS.done}
            setIsDragSource={(isSrc) =>
              setDragSource(isSrc ? COLUMN_KEY_DONE : null)
            }
            setIsDragTarget={(isTarget) =>
              setDragTarget(isTarget ? COLUMN_KEY_DONE : null)
            }
            onDrop={handleDrop}
            onRemove={onRemove.bind(null, COLUMN_KEY_DONE)}
            setDraggedItem={setDraggedItem}
            cardList={doneList}
          ></KanbanColumn>
        </>
      )}
    </main>
  );
}
