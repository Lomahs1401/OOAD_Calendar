import React from 'react'
import { Navigate } from 'react-router-dom'
import { UserAuth } from './AuthContext'
import Login from '../pages/Login/Login';

const ProtectedRoute = ({ children }) => {

    const { user } = UserAuth();
    if (user === null) {
        return <Navigate to={<Login />} />
    }
    return children
}

export default ProtectedRoute