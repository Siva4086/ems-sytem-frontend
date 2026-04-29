import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children, value }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    const refreshSession = async () => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            setUser(null);
            setToken(null);
            setLoading(false);
            return;
        }
        try {
            const {data} = await api.get("/auth/session");    
            setUser(data.user);
            setToken(storedToken); 
            localStorage.setItem("token", storedToken);
        } catch (error) {
            setUser(null);
            setToken(null);
            //Token is invalid ,Clear it
            localStorage.removeItem("token");
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {   
        refreshSession();
    }, []);

    const login = async (email, password, role_type) => {
        try {
            const { data } = await api.post("/auth/login", { email, password, role_type });
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setUser(data.user);
            return data.user;
        } catch (error) {
            throw error;
        }
    }

    const logout = async () => {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    }

    value = {user,token,loading, login, logout, refreshSession};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}       
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if(!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}   


        