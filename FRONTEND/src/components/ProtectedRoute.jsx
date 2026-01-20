import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, loading, roles } = useAuth();

  console.log('ProtectedRoute - Auth state:', { isAuthenticated, loading, roles, requiredRoles });

  if (loading) {
    console.log('ProtectedRoute - Still loading...');
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has required roles
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => 
      roles.includes(role) || roles.includes(`ROLE_${role.toUpperCase()}`)
    );
    
    console.log('ProtectedRoute - Role check:', { requiredRoles, userRoles: roles, hasRequiredRole });
    
    if (!hasRequiredRole) {
      console.log('ProtectedRoute - Access denied, redirecting to unauthorized');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('ProtectedRoute - Access granted, rendering children');
  return children;
};

export default ProtectedRoute;
