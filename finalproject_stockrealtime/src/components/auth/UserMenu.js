import React, { useContext } from 'react';
import { auth } from '../../firebase';
import { UserContext } from '../../UserContext';

const UserMenu = () => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    auth.signOut().then(() => setUser(null));
  };

  return user ? (
    <div style={{ textAlign: 'right', padding: '0 1rem' }}>
      <p> {user.displayName}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  ) : null;
};

export default UserMenu;
