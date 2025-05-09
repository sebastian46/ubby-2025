import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://ubbi.fromseb.com:5000/api';

function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`);
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/users`, { name: newUserName });
      setUsers([...users, response.data]);
      setNewUserName('');
      
      // Automatically log in as the newly created user
      onSelectUser(response.data);
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user');
    }
  };
  
  const handleUserClick = (user) => {
    setConfirmUser(user);
  };
  
  const handleConfirmLogin = () => {
    onSelectUser(confirmUser);
    setConfirmUser(null);
  };
  
  const handleCancelLogin = () => {
    setConfirmUser(null);
  };

  if (loading) return <div className="text-center py-4 dark:text-gray-300">Loading users...</div>;
  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Select or Create Profile</h2>
      
      <form onSubmit={handleCreateUser} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Enter your name"
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            maxLength={30}
            required
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Profile
          </button>
        </div>
      </form>
      
      <h3 className="font-medium mb-2">Existing Profiles</h3>
      {users.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No profiles yet. Create one to get started.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {users.map(user => (
            <div 
              key={user.id}
              onClick={() => handleUserClick(user)}
              className="bg-gray-100 dark:bg-gray-700 p-3 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <p className="font-medium truncate" title={user.name}>{user.name}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Confirmation Modal */}
      {confirmUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Login</h3>
            <p className="mb-6 break-words">
              Are you sure you want to log in as <strong className="break-all">{confirmUser.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={handleCancelLogin}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList; 