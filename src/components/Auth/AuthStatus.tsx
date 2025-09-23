import { useAuth } from '../../hooks/useAuth';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const AuthStatus: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="auth-loading">Loading...</div>;
  }

  return (
    <div className="auth-status">
      {isAuthenticated ? (
        <div className="authenticated-user">
          <span className="user-greeting">
            Hello, {user?.name?.split(' ')[0] || user?.email}!
          </span>
          <LogoutButton />
        </div>
      ) : (
        <LoginButton />
      )}
    </div>
  );
};

export default AuthStatus;
