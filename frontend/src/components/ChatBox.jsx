import React, { useState, useEffect } from 'react';
import socket from '../utils/socket.js'; // Import the socket instance
import { useSelector } from 'react-redux';

function ChatBox({ currentUserId }) {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const targetUserId = useSelector((state) => state.user.selectedUser);

  useEffect(() => {
    // Listen for private messages

    console.log(receivedMessages);
    
  const handlePrivateMessage = (data) => {
    console.log('Received message:', data); // Debugging line
    setReceivedMessages((prevMessages) => [
      ...prevMessages,
      `${data.from}: ${data.message}`,
    ]);
  };
  socket.on('privateMessage', handlePrivateMessage);

    // socket.on('privateMessage', (msg) => {
    //   console.log(msg);
    // });
    // Cleanup function to remove the listener when the component unmounts
    return () => {
      socket.off('privateMessage'); // Remove the listener
    };
  }, []); // Empty dependency array to run once
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (message && targetUserId) {
      // Emit message with `from` as loggedInUser and `to` as targetUserId
      socket.emit('privateMessage', {
        from: currentUserId,
        to: targetUserId,
        message: message,
      });
      setMessage(''); // Clear the message input
    }
  };

  return (
    <div>
      <div>Logged in as: {currentUserId}</div>
      <div>Target user: {targetUserId}</div>
      <div>
        {receivedMessages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatBox;
