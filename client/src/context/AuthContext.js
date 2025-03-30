import { createContext } from 'react';

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  socket: null
});

export default AuthContext;