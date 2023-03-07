/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import KanbanBoard, {
  COLUMN_KEY_DONE,
  COLUMN_KEY_ONGOING,
  COLUMN_KEY_TODO,
} from "./KanbanBoard";
import AdminContext from "./context/adminContext";
const DATA_STORE_KEY = "kanban-data-store";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [ongoingList, setOngoingList] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
  const updaters = {
    [COLUMN_KEY_TODO]: setTodoList,
    [COLUMN_KEY_ONGOING]: setOngoingList,
    [COLUMN_KEY_DONE]: setDoneList,
  };

  const handleAdd = (column, newCard) => {
    updaters[column]((currentStat) => [newCard, ...currentStat]);
  };
  const handleRemove = (column, cardToRemove) => {
    updaters[column]((currentStat) =>
      currentStat.filter((item) => item.title !== cardToRemove.title)
    );
  };
  const [isAdmin, setIsAdmin] = useState(false);
  const handleToggleAdmin = (evt) => {
    setIsAdmin(!isAdmin);
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          我的看板 <button onClick={handleSaveAll}>保存所有卡片</button>
          <label>
            <input
              type="checkbox"
              value={isAdmin}
              onChange={handleToggleAdmin}
            />
            管理员模式
          </label>
        </h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <AdminContext.Provider value={isAdmin}>
        <KanbanBoard
          isLoading={isLoading}
          todoList={todoList}
          ongoingList={ongoingList}
          doneList={doneList}
          onAdd={handleAdd}
          onRemove={handleRemove}
        ></KanbanBoard>
      </AdminContext.Provider>
    </div>
  );
}

export default App;
