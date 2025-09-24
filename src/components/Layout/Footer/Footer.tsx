import { Link } from 'react-router-dom';
import { useState } from 'react';
import SubscribeModal from '../../Newsletter/SubscribeModal';
import './Footer.scss';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setIsLoading(true);

    // Simulate API call (you can replace this with actual API call later)
    setTimeout(() => {
      setShowModal(true);
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
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
          <form onSubmit={handleSubscribe}>
            <input
              className="footer-email"
              type="email"
              name="email"
              placeholder="enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <p className="footer-email-error"></p>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'subscribing...' : 'get on our list'}
            </button>
          </form>
        </div>
      </footer>

      <SubscribeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default Footer;
