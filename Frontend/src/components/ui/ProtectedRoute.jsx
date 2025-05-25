import { jwtDecode } from 'jwt-decode';
import React, { use, useEffect, useState } from 'react'
import api from '../../api';
import Spinner from '../ui/Spinner';
import { Navigate, useLocation } from 'react-router-dom';


const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    const location =useLocation();

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);

    async function refreshToken() {
        const refresh_token = localStorage.getItem("refresh");
        try {
            const res = await api.post("token/refresh/", { refresh: refresh_token });
            if (res.status === 200) {
                localStorage.setItem("access", res.data.access);
                setIsAuthorized(true);
            }
            else {
                setIsAuthorized(false);
            }
        }
        catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    }


    async function auth() {
        const token = localStorage.getItem("access");
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        const decoded = jwtDecode(token);
        const expiry_date = decoded.exp;
        const current_time = Date.now() / 1000;

        if (current_time > expiry_date) {
            await refreshToken();
        }
        else {
            setIsAuthorized(true);
        }

    }

    if (isAuthorized === null) {
        return (
            <Spinner />
        )
    }




    return (
         isAuthorized? children: <Navigate to="/login" state={{ from: location }} replace/> 
    );

};






export default ProtectedRoute