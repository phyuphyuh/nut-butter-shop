import { useEffect } from "react";
import { useCart } from "../../hooks/useCart";
import './Success.scss';

const Success: React.FC = () => {
  const { dispatch } = useCart();

  useEffect(() => {
    dispatch({ type: "CLEAR_CART" });
  }, [dispatch]);

  return (
    <div className="success-container">
      <div className="success-confirmation">
        <h2>🎉 Payment Successful!</h2>
        <p>Thank you for your order.</p>
      </div>
    </div>
  );
};
export default Success;
