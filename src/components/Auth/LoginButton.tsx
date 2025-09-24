import { useAuth } from '../../hooks/useAuth';

interface LoginButtonProps {
  mode?: 'login' | 'signup';
  children?: React.ReactNode;
  className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  mode = 'login',
  children,
  className
}) => {
  const { loginWithRedirect, isLoading } = useAuth();

  const handleClick = () => {
    loginWithRedirect();
  };

  const defaultText = mode === 'signup' ? 'Create Account' : 'Log In';
  const defaultClassName = mode === 'signup' ? 'signup-button' : 'login-button';

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`auth-button ${defaultClassName} ${className || ''}`}
    >
      {isLoading ? 'Loading...' : (children || defaultText)}
    </button>
  );
};

export default LoginButton;
