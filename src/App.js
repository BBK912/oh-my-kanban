/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import logo from './logo.svg';
import './App.css';

const KanbanBoard = ({ children }) => {
    return (
        <main
            css={css`
                flex: 10;
                display: flex;
                flex-direction: row;
                gap: 1rem;
                margin: 0 1rem 1rem;
            `}
        >
            {children}
        </main>
    );
};

const KanbanColumn = ({
    children,
    className,
    title,
    bgColor,
    setIsDragSource = () => {},
    setIsDragTarget = () => {},
    onDrop,
}) => {
    return (
        <section
            onDragStart={() => setIsDragSource(true)}
            onDragOver={(evt) => {
                evt.preventDefault();
                evt.dataTransfer.dropEffect = 'move';
                setIsDragTarget(true)
            }}
            onDragLeave={(evt) => {
                evt.preventDefault();
                evt.dataTransfer.dropEffect = 'none';
                setIsDragTarget(false)
            }}
            onDrop={(evt) => {
                evt.preventDefault();
                onDrop && onDrop(evt);
            }}
            onDragEnd={(evt) => {
                evt.preventDefault();
                setIsDragSource(false);
                setIsDragTarget(false);
            }}
            css={css`
                flex: 1 1;
                display: flex;
                flex-direction: column;
                border: 1px solid gray;
                border-radius: 1rem;
                background-color: ${bgColor};
                & > h2 {
                    margin: 0.6rem 1rem;
                    padding-bottom: 0.6rem;
                    border-bottom: 1px solid gray;
                    & > button {
                        float: right;
                        margin-top: 0.2rem;
                        padding: 0.2rem 0.5rem;
                        border: 0;
                        border-radius: 1rem;
                        height: 1.8rem;
                        line-height: 1rem;
                        font-size: 1rem;
                    }
                }
                & > ul {
                    flex: 1;
                    flex-basis: 0;
                    margin: 1rem;
                    padding: 0;
                    overflow: auto;
                }
            `}
            className={className}
        >
            <h2>{title}</h2>
            <ul>{children}</ul>
        </section>
    );
};
const kanbanCardStyles = css`
    margin-bottom: 1rem;
    padding: 0.6rem 1rem;
    border: 1px solid gray;
    border-radius: 1rem;
    list-style: none;
    background-color: rgba(255, 255, 255, 0.4);
    text-align: left;
    &:hover {
        box-shadow: 0 0.2em 0.2em rgba(0, 0, 0, 0.2), inset 0 1px #fff;
    }
`;
const kanbanCardTitleStyles = css`
    min-height: 3rem;
`;
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const UPDATE_INTERVAL = MINUTE;
const KanbanCard = ({ title, status, onDragStart }) => {
    const [displayTime, setDisplayTime] = useState(status);
    useEffect(() => {
        const updateDisplayTime = () => {
            const timePassed = new Date() - new Date(status);
            let relativeTime = '刚刚';
            if (MINUTE <= timePassed && timePassed < HOUR) {
                relativeTime = `${Math.ceil(timePassed / MINUTE)} 分钟前`;
            } else if (HOUR <= timePassed && timePassed < DAY) {
                relativeTime = `${Math.ceil(timePassed / HOUR)} 小时前`;
            } else if (DAY <= timePassed) {
                relativeTime = `${Math.ceil(timePassed / DAY)} 天前`;
            }
            setDisplayTime(relativeTime);
        };
        const intervalId = setInterval(updateDisplayTime, UPDATE_INTERVAL);
        updateDisplayTime();
        return function cleanup() {
            clearInterval(intervalId);
        };
    }, [status]);
    const handleDragStart = (evt) => {
        evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.setData('text/plain', title);
        onDragStart && onDragStart(evt);
    };
    return (
        <li css={kanbanCardStyles} draggable onDragStart={handleDragStart}>
            <div css={kanbanCardTitleStyles}>{title}</div>
            <div
                css={css`
                    text-align: right;
                    font-size: 0.8rem;
                    color: #333;
                `}
            >
                {displayTime}
            </div>
        </li>
    );
};

const KanbanNewCard = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const inputRef = useRef(null);
    const handleChange = (e) => {
        setTitle(e.target.value);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSubmit(title);
            setTitle('');
        }
    };
    useEffect(() => {
        inputRef.current.focus();
    }, []);
    return (
        <li css={kanbanCardStyles}>
            <h3>添加新卡片</h3>
            <div
                css={css`
                    ${kanbanCardTitleStyles}
                    & > input[type="text"] {
                        width: 80%;
                    }
                `}
            >
                <input
                    type="text"
                    ref={inputRef}
                    value={title}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </li>
    );
};
const COLUMN_BG_COLORS = {
    loading: '#E3E3E3',
    todo: '#C9AF97',
    ongoing: '#FFE799',
    done: '#C0E8BA',
};

const DATA_STORE_KEY = 'kanban-data-store';
const COLUMN_KEY_TODO = 'todo';
const COLUMN_KEY_ONGOING = 'ongoing';
const COLUMN_KEY_DONE = 'done';

function App() {
    const [showAdd, setShowAdd] = useState(false);
    const handleAdd = (e) => {
        setShowAdd(true);
    };
    const handleSumbit = (title) => {
        setTodoList((currentTodoList) => [
            { title, status: new Date() },
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

    const handleDrop= (evt) => {
        if (!draggedItem || !dragSource || !dragTarget || dragSource  === dragTarget) {
            return;
        }

        const updaters = {
            [COLUMN_KEY_TODO]: setTodoList,
            [COLUMN_KEY_ONGOING]: setOngoingList,
            [COLUMN_KEY_DONE]: setDoneList,
        }
        if (dragSource) {
            updaters[dragSource]((current) => {
                return current.filter(item => !Object.is(item, draggedItem))
            })
        }
        if (dragTarget){
            updaters[dragTarget]((current) => {
                return [draggedItem, ...current];
            })
        }
    }
    return (
        <div className="App">
            <header className="App-header">
                <h1>
                    我的看板{' '}
                    <button onClick={handleSaveAll}>保存所有卡片</button>
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
                                    <button
                                        onClick={handleAdd}
                                        disabled={showAdd}
                                    >
                                        &#8853; 添加新卡片
                                    </button>
                                </>
                            }
                            setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_TODO : null)}
                            setIsDragTarget={(isTarget) => setDragTarget(isTarget ? COLUMN_KEY_TODO : null)}
                            onDrop={handleDrop}
                        >
                            {showAdd && (
                                <KanbanNewCard onSubmit={handleSumbit} />
                            )}
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
                            setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_ONGOING : null)}
                            setIsDragTarget={(isTarget) => setDragTarget(isTarget ? COLUMN_KEY_ONGOING : null)}
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
                            setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_DONE : null)}
                            setIsDragTarget={(isTarget) => setDragTarget(isTarget ? COLUMN_KEY_DONE : null)}
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
