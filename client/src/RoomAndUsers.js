import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RoomAndUsers({ socket, username, room }) {
  const navigate = useNavigate();

  const [roomUsers, setRoomUsers] = useState([]);

  useEffect(() => {
    socket.on('chatroom_users', (data) => {
      console.log(data);
      setRoomUsers(data);
    });
    return () => socket.off('chatroom_users');
  }, [socket, roomUsers]);

  const leaveRoom = () => {
    const date = Date.now();
    socket.emit('leave_room', { username, room, date });
    navigate('/', { replace: true });
  };

  console.log('room users:', roomUsers);
  return (
    <div>
      <p>Users in the room:</p>
      {roomUsers?.map((user) => (
        <p key={user.id}>
          <strong>- {user.username}</strong>
        </p>
      ))}
      <button onClick={leaveRoom}>Leave Room</button>
    </div>
  );
}

export default RoomAndUsers;
