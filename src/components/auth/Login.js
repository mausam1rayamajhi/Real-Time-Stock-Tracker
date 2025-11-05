import React, { useContext } from 'react';
import { auth, provider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { UserContext } from '../../UserContext';

const Login = () => {
  const { setUser } = useContext(UserContext);

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => setUser(result.user))
      .catch((error) => console.error("Login error:", error));
  };

  return (
    <button onClick={handleLogin}>
      Sign in with Google
    </button>
  );
};

export default Login;
