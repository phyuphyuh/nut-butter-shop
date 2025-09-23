import { useAuth } from '../../hooks/useAuth';

const LogoutButton: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <button
      onClick={() => logout()}
      className="auth-button logout-button"
    >
      Log Out {user?.name && `(${user.name})`}
    </button>
  );
};

export default LogoutButton;
