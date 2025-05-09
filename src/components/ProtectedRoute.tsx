import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../services/store';

interface ProtectedRouteProps {
  children: JSX.Element;
  isAuthenticated: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  children
}) => {
  if (isAuthenticated) {
    return <>{children}</>;
  }
};

export default ProtectedRoute;
