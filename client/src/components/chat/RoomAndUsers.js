import React, { useEffect, useState } from 'react';

function RoomAndUsers({ socket }) {
  const [roomUsers, setRoomUsers] = useState([]);

  useEffect(() => {
    socket.on('chatroom_users', (data) => {
      console.log(data);
      setRoomUsers(data);
    });
    return () => socket.off('chatroom_users');
  }, [socket, roomUsers]);

  return (
    <div className='users'>
      <p>Users here:</p>
      {roomUsers?.map((user) => (
        <p key={user.id}>
          <strong>- {user.username}</strong>
        </p>
      ))}
    </div>
  );
}

export default RoomAndUsers;
