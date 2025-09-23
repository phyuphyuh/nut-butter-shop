import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import CartIcon from '../../Cart/Cart/CartIcon/CartIcon';
import UserMenu from '../../UserMenu/UserMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './Header.scss';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <header className="header">
      <div className="nav">
        <div className="nav-logo">
          <NavLink to="/">
            <div className="logo">Blue Jar Folks</div>
            <div className="tagline">So real, it's nuts!</div>
          </NavLink>
        </div>

        <div className="header-actions">
          <UserMenu />
          <CartIcon />
        </div>

        <nav className={`menu ${menuOpen ? 'responsive' : ''}`}>
          <ul>
            <li>
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop" className={({ isActive }) => isActive ? 'active' : ''}>
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
                Contact
              </NavLink>
            </li>

            <li className="icon">
              <a onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <hr className="top-hr" />
    </header>
  );
};

export default Header;
