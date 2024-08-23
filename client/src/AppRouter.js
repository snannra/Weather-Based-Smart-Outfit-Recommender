import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import setAuthToken from './utils/setAuthToken';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import OutfitRecommendation from './components/OutfitRecommendation';
import PrivateRoute from './components/PrivateRoute';

const AppRouter = () => {

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthToken(token);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route 
                    path="/" 
                    element={<Navigate to="/login" />} 
                />
                <Route 
                    path="/login" 
                    element={<Login />} 
                />
                <Route 
                    path="/signup" 
                    element={<Signup />} 
                />
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/outfitrecommendation" 
                    element={<OutfitRecommendation />} 
                />
            </Routes>
        </Router>
    );
};

export default AppRouter;