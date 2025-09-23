import { useAuth } from '../../hooks/useAuth';

const LoginButton: React.FC = () => {
  const { loginWithRedirect, isLoading } = useAuth();

  return (
    <button
      onClick={() => loginWithRedirect()}
      disabled={isLoading}
      className="auth-button login-button"
    >
      {isLoading ? 'Loading...' : 'Log In'}
    </button>
  );
};

export default LoginButton;
