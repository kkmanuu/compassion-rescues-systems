import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Compassion Rescue</Link>
      </div>
      <div className="navbar-menu">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/cases">Cases</Link>
            {user.role === 'admin' && <Link to="/reports">Reports</Link>}
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/emergency" className="emergency-btn">Emergency</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;