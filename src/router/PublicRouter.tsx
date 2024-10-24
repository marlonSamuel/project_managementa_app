import React from 'react'
import { Navigate } from 'react-router-dom';

type props = {
    isAuthenticated: boolean,
    children: any
}

export const PublicRouter = ({ isAuthenticated, children }: props) => {
    return isAuthenticated ? children : <Navigate to="/auth/login" />;
}