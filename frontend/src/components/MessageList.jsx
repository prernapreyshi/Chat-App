import React, { useState } from 'react';

export default function MessageList({ messages, username, onEdit, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const startEdit = (msg) => {
    setEditId(msg.id);
    setEditText(msg.content);
  };

  const submitEdit = () => {
    if (editText.trim()) {
      onEdit(editId, editText.trim());
      setEditId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  return (
    <div className="messages">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message-bubble ${
            msg.username === username ? 'own' : msg.type === 'system' ? 'system' : ''
          }`}
        >
          {msg.type !== 'system' && <div className="message-user">{msg.username}</div>}

          {editId === msg.id ? (
            <>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                className="edit-textarea"
              />
              <button onClick={submitEdit}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              {msg.type === 'text' && <div className="message-text">{msg.content}</div>}
              {msg.type === 'image' && (
                <img src={msg.content} alt="sent pic" className="message-image" />
              )}
              {msg.type === 'system' && <em className="message-text">{msg.content}</em>}
              <div className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              {msg.username === username && msg.type !== 'system' && (
                <div className="message-actions">
                  <button onClick={() => startEdit(msg)}>Edit</button>
                  <button onClick={() => onDelete(msg.id)}>Delete</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
