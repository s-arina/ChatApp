import React from 'react';
import { useNavigate } from 'react-router-dom';

function LeaveRoom({ socket, username, room }) {
  const navigate = useNavigate();

  const leaveRoom = () => {
    const date = Date.now();
    socket.emit('leave_room', { username, room, date });
    navigate('/', { replace: true });
  };

  return (
    <button onClick={leaveRoom} className='leave-btn'>
      Leave Room
    </button>
  );
}

export default LeaveRoom;
