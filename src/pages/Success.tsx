import { useEffect } from "react";
import { useCart } from "../hooks/useCart";

const Success: React.FC = () => {
  const { dispatch } = useCart();

  useEffect(() => {
    dispatch({ type: "CLEAR_CART" });
  }, [dispatch]);

  return (
    <div>
      <h1>🎉 Payment Successful!</h1>
      <p>Thank you for your order.</p>
    </div>
  );
};
export default Success;
