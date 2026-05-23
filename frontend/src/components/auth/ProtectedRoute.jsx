import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading, isAdmin } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loading fullPage text="Đang xác thực quyền truy cập..." />;
    }

    if (!user) {
        // Redirect to appropriate login page
        const redirectPath = requiredRole === 'admin' ? '/admin/login' : '/login';
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    if (requiredRole === 'admin' && !isAdmin) {
        // If they are logged in but not an admin, silently redirect to Admin Login
        // The error will only show if they try to log in from there
        return <Navigate 
            to="/admin/login" 
            state={{ from: location }} 
            replace 
        />;
    }

    return children;
};

export default ProtectedRoute;
