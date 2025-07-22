import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to='/login' state={{ from: location }} />
  );
};

export default ProtectedRoute;
