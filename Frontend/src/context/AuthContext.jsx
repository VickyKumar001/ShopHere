import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import api from "../api";


export const AuthContext = createContext(false)

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username , setUsername] = useState("");


    function get_username(){
        api.get('get_username').then(res => {
            console.log(res.data)
            setUsername(res.data.username)
        })

        .catch(err => console.log(err.message));
    }

    const handleAuth = () => {
        const token = localStorage.getItem('access');
        if (token) {
            const decoded = jwtDecode(token);
            const expiry_date = decoded.exp;
            const current_time = Date.now() / 1000;
            if (expiry_date >= current_time) {
                setIsAuthenticated(true);
            }
        }
    };

    useEffect(() => {
        handleAuth();
        get_username();
    }, []);

    const authValues = {
        isAuthenticated,
        setIsAuthenticated,
        get_username,
        username
    };

    return (
        <AuthContext.Provider value={authValues}>
            {children}
        </AuthContext.Provider>
    )
}