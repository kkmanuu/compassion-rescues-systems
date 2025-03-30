import { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Navbar from './Navbar';


const MainLayout = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="app-layout">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="content-wrapper">
       
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;