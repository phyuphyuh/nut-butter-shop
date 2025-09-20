import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* Footer Links */}
      <div className="footer-links">
        <ul>
          <li>
            <Link to="/shop">Products</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>

      {/* Footer Logo */}
      <Link to="/" className="footer-logo">
        <div className="logo">Blue Jar Folks</div>
        <div className="tagline">So real, it's nuts!</div>
        <div className="copyright">
          &copy;2019 Blue Jar Folks. All rights reserved.
        </div>
      </Link>

      {/* Subscribe Form */}
      <div className="subscribe">
        <form action="/subscribe" method="GET">
          <input
            className="footer-email"
            type="email"
            name="email"
            placeholder="enter email"
          />
          <p className="footer-email-error"></p>
          <button type="submit">get on our list</button>
        </form>
      </div>
    </footer>
  );
};

export default Footer;
