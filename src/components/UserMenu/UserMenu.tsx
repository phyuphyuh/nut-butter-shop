import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './UserMenu.scss';

const UserMenu: React.FC = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <div
        onClick={loginWithRedirect}
        className="menu-login-button"
        aria-label="Login"
      >
        <FontAwesomeIcon icon={faUser} />
      </div>
    );
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        {user?.picture ? (
          <img src={user.picture} alt="Profile" className="user-avatar" />
        ) : (
          <div className="user-avatar-placeholder">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
        )}
        <FontAwesomeIcon icon={faChevronDown} className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-info">
            <p className="user-name">{user?.name || 'User'}</p>
            <p className="user-email">{user?.email}</p>
          </div>

          <Link
            to="/profile"
            className="menu-item"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faUser} />
            My Profile
          </Link>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="menu-item logout"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
