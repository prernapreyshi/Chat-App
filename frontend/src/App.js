import React, { useState } from 'react';
import ChatRoom from './components/ChatRoom';

export default function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (username.trim() && room.trim()) {
      setJoined(true);
    }
  };

  if (!joined) {
    return (
      <div className="login-container">
        <h2>Join Chat</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room"
          value={room}
          onChange={e => setRoom(e.target.value)}
        />
        <button onClick={handleJoin} disabled={!username.trim() || !room.trim()}>
          Join
        </button>
      </div>
    );
  }

  return <ChatRoom username={username} room={room} />;
}
