/** @jsxImportSource @emotion/react */

import React, { useState, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import { kanbanCardStyles, kanbanCardTitleStyles } from './KanbanCard';

const newCardStyle = css`
                    ${kanbanCardTitleStyles}
                    & > input[type="text"] {
                        width: 80%;
                    }
                `;
export default function KanbanNewCard({ onSubmit }) {
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
                css={newCardStyle}
            >
                <input
                    type="text"
                    ref={inputRef}
                    value={title}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown} />
            </div>
        </li>
    );
}
