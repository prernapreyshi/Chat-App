const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// In-memory data storage
const rooms = {}; 
// rooms = {
//   roomName: {
//     users: { socketId: username },
//     history: [{ id, username, type, content, timestamp }]
//   }
// }

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    rooms[room] = rooms[room] || { users: {}, history: [] };
    rooms[room].users[socket.id] = username;

    // Send chat history to the new user
    socket.emit('history', rooms[room].history);

    // Notify all users in room about new user
    io.to(room).emit('userList', Object.values(rooms[room].users));
    io.to(room).emit('systemMessage', `${username} joined the room.`);
  });

  socket.on('sendMessage', ({ room, message }) => {
    const msg = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2),
      username: rooms[room].users[socket.id],
      ...message,
      timestamp: new Date().toISOString(),
    };
    rooms[room].history.push(msg);
    io.to(room).emit('message', msg);
  });

  socket.on('typing', ({ room, username }) => {
    socket.to(room).emit('typing', username);
  });

  // Update message
  socket.on('updateMessage', ({ room, id, newContent }) => {
    if (!rooms[room]) return;
    const msgIndex = rooms[room].history.findIndex((m) => m.id === id);
    if (msgIndex !== -1) {
      rooms[room].history[msgIndex].content = newContent;
      io.to(room).emit('messageUpdated', rooms[room].history[msgIndex]);
    }
  });

  // Delete message
  socket.on('deleteMessage', ({ room, id }) => {
    if (!rooms[room]) return;
    rooms[room].history = rooms[room].history.filter((m) => m.id !== id);
    io.to(room).emit('messageDeleted', id);
  });

  socket.on('disconnecting', () => {
    // Remove user from all rooms
    for (const room of socket.rooms) {
      if (rooms[room]) {
        const username = rooms[room].users[socket.id];
        delete rooms[room].users[socket.id];
        io.to(room).emit('userList', Object.values(rooms[room].users));
        io.to(room).emit('systemMessage', `${username} left the room.`);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
