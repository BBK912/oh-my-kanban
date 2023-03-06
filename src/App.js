/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import KanbanBoard from "./KanbanBoard";
import KanbanCard from "./KanbanCard";
import KanbanColumn from "./KanbanColumn";
import KanbanNewCard from "./KanbanNewCard";
const COLUMN_BG_COLORS = {
  loading: "#E3E3E3",
  todo: "#C9AF97",
  ongoing: "#FFE799",
  done: "#C0E8BA",
};

const DATA_STORE_KEY = "kanban-data-store";
const COLUMN_KEY_TODO = "todo";
const COLUMN_KEY_ONGOING = "ongoing";
const COLUMN_KEY_DONE = "done";

function App() {
  const [showAdd, setShowAdd] = useState(false);
  const handleAdd = (e) => {
    setShowAdd(true);
  };
  const handleSumbit = (title) => {
    setTodoList((currentTodoList) => [
      { title, status: new Date().toString() },
      ...currentTodoList,
    ]);
    setShowAdd(false);
  };
  const [todoList, setTodoList] = useState([]);
  const [ongoingList, setOngoingList] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem(DATA_STORE_KEY);
    setTimeout(() => {
      if (data) {
        const kanbanColumnData = JSON.parse(data);
        setTodoList(kanbanColumnData.todoList);
        setOngoingList(kanbanColumnData.ongoingList);
        setDoneList(kanbanColumnData.doneList);
      }
      setIsLoading(false);
    }, 1000);
  }, []);
  const handleSaveAll = () => {
    const data = JSON.stringify({
      todoList,
      ongoingList,
      doneList,
    });
    localStorage.setItem(DATA_STORE_KEY, data);
  };

  const handleDrop = (evt) => {
    if (
      !draggedItem ||
      !dragSource ||
      !dragTarget ||
      dragSource === dragTarget
    ) {
      return;
    }

    const updaters = {
      [COLUMN_KEY_TODO]: setTodoList,
      [COLUMN_KEY_ONGOING]: setOngoingList,
      [COLUMN_KEY_DONE]: setDoneList,
    };
    if (dragSource) {
      updaters[dragSource]((current) => {
        return current.filter((item) => !Object.is(item, draggedItem));
      });
    }
    if (dragTarget) {
      updaters[dragTarget]((current) => {
        return [draggedItem, ...current];
      });
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          我的看板 <button onClick={handleSaveAll}>保存所有卡片</button>
        </h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanbanBoard>
        {isLoading ? (
          <KanbanColumn
            title="读取中..."
            bgColor={COLUMN_BG_COLORS.loading}
          ></KanbanColumn>
        ) : (
          <>
            <KanbanColumn
              className="column-todo"
              bgColor={COLUMN_BG_COLORS.todo}
              title={
                <>
                  待处理
                  <button onClick={handleAdd} disabled={showAdd}>
                    &#8853; 添加新卡片
                  </button>
                </>
              }
              setIsDragSource={(isSrc) =>
                setDragSource(isSrc ? COLUMN_KEY_TODO : null)
              }
              setIsDragTarget={(isTarget) =>
                setDragTarget(isTarget ? COLUMN_KEY_TODO : null)
              }
              onDrop={handleDrop}
            >
              {showAdd && <KanbanNewCard onSubmit={handleSumbit} />}
              {todoList.map((props, i) => (
                <KanbanCard
                  key={i}
                  {...props}
                  onDragStart={() => setDraggedItem(props)}
                ></KanbanCard>
              ))}
            </KanbanColumn>
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
            >
              {ongoingList.map((props, i) => (
                <KanbanCard
                  key={i}
                  {...props}
                  onDragStart={() => setDraggedItem(props)}
                ></KanbanCard>
              ))}
            </KanbanColumn>
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
            >
              {doneList.map((props, i) => (
                <KanbanCard
                  key={i}
                  {...props}
                  onDragStart={() => setDraggedItem(props)}
                ></KanbanCard>
              ))}
            </KanbanColumn>
          </>
        )}
      </KanbanBoard>
    </div>
  );
}

export default App;
