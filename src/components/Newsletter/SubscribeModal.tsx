import './SubscribeModal.scss';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>

        <div className="success-message">
          <h2>🎉 Welcome to #bluefolks!</h2>
          <p>
            Hi there! We are so glad you're here. Now that you're subscribed,
            you'll receive monthly updates from us about the happenings in our
            community as well as special insights and offers that are exclusive
            to <strong>#bluefolks</strong>.
          </p>
          <p className="cheers">Cheers! 🥜</p>
        </div>
      </div>
    </div>
  );
};

export default SubscribeModal;
