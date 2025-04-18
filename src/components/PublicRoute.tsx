import { Navigate } from 'react-router-dom';
import { FC, ReactElement } from 'react';

type PublicRouteProps = {
  isAuthenticated: boolean;
  children: ReactElement;
};

const PublicRoute: FC<PublicRouteProps> = ({ isAuthenticated, children }) =>
  isAuthenticated ? <Navigate to='/profile' replace /> : children;

export default PublicRoute;
