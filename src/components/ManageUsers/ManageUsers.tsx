// ManageUsers.tsx
import React, { useEffect, useState } from 'react';
import { getAllUsers, makeAdminUser, removeAdminUser, blockUser, unblockUser } from '../../services/users.services.ts';
import { AppUser } from '../../common/interfaces.ts';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<Array<AppUser>>([]);

  useEffect(() => {
    // Fetch all users when the component mounts
    getAllUsers().then((snapshots) => {
      const usersData: AppUser[] = snapshots.map(snapshot => snapshot.val());
      setUsers(usersData);
    });
  }, []);

  const handleMakeAdmin = (username: string) => {
    makeAdminUser(username).then(() => {
      console.log(`${username} is now an admin.`);
    });
  };

  const handleRemoveAdmin = (username: string) => {
    removeAdminUser(username).then(() => {
      console.log(`${username} is no longer an admin.`);
    });
  };

  const handleBlockUser = (username: string) => {
    blockUser(username).then(() => {
      console.log(`${username} is blocked.`);
    });
  };

  const handleUnblockUser = (username: string) => {
    unblockUser(username).then(() => {
      console.log(`${username} is unblocked.`);
    });
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.username}>
            {user.username} - {user.role}
            <button onClick={() => handleMakeAdmin(user.username)}>Make Admin</button>
            <button onClick={() => handleRemoveAdmin(user.username)}>Remove Admin</button>
            <button onClick={() => handleBlockUser(user.username)}>Block User</button>
            <button onClick={() => handleUnblockUser(user.username)}>Unblock User</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
