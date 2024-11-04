// Import necessary libraries
import React, { useEffect, useState } from 'react';
import './App.css';
import ChatBox from './components/ChatBox';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import io from 'socket.io-client';

let socket; // Declare socket variable

function App() {
  const [username, setUsername] = useState(null); // Stores the logged-in username
  const users = ['user1', 'user2', 'user3'];

  useEffect(() => {
    if (username) {
      // Establish socket connection and pass userId in query
      socket = io('http://localhost:5000', {
        query: { userId: username }, // Pass userId from the logged-in user
      });

      socket.on("connect", () => {
        console.log("Socket connected for user:", username);
      });

      return () => {
        socket.disconnect(); // Clean up on unmount
        console.log("Socket disconnected for user:", username);
      };
    }
  }, [username]);

  const handleLogin = (name) => {
    setUsername(name); // Set username on login
    // Update the URL query to include the logged-in user ID
    window.history.pushState({}, '', `/?userId=${name}`);
  };

  return (
    <div className="App">
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <Sidebar className="sidebar" users={users} currentUserId={username} />
          <ChatBox className="chatbox" currentUserId={username} socket={socket} /> {/* Pass socket instance */}
        </>
      )}
    </div>
  );
}

export default App;
