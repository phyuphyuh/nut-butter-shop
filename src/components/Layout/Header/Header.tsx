import { useState } from 'react';
import { Link } from 'react-router-dom';
import CartIcon from '../../Cart/Cart/CartIcon/CartIcon';
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
          <Link to="/">
            <div className="logo">Blue Jar Folks</div>
            <div className="tagline">So real, it's nuts!</div>
          </Link>
        </div>

        <CartIcon />

        <nav className={`menu ${menuOpen ? 'responsive' : ''}`}>
          <ul>
            <li className="highlight"><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
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
