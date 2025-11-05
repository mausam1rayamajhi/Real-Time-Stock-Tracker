import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import { auth } from '../../firebase';
import './Navbar.css';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
      navigate('/');
    }).catch(err => {
      console.error("Logout error:", err);
    });
  };

  return (
    <nav className="navbar">
      <div>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </div>
      {user && (
        <div className="nav-user">
          <img src={user.photoURL} alt="avatar" />
          <span>{user.displayName}</span>
          <button className="button" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;