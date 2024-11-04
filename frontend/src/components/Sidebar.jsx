import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import '../App.css'; // Import the CSS file

function Sidebar({ users }) {
  const dispatch = useDispatch();

  // No need to initialize the socket connection here, as it’s already done in socket.js

  const handleClick = (user) => {
    // Dispatch the selected user to Redux
    dispatch(setSelectedUser(user));
  };

  return (
    <div>
      <ul>
        {users.map((user, index) => (
          <li key={index} onClick={() => handleClick(user)} className="clickable-item">
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
