import React, { useState } from 'react';

export default function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const handleSend = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onSend({ type: 'image', content: reader.result });
      };
      reader.readAsDataURL(file);
      setFile(null);
    } else if (text.trim()) {
      onSend({ type: 'text', content: text.trim() });
    }
    setText('');
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    onTyping();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (text.trim() || file)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        placeholder="Type a message"
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleSend} disabled={!text.trim() && !file}>
        Send
      </button>
    </div>
  );
}
