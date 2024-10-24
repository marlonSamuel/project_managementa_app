import { createContext, useContext, useEffect, useReducer, useState } from "react";

import { IUser, IAuth, ILoginData } from "../../interfaces/IAuth";

import { authReducer, IAuthState } from "./AuthReducer";
import api from "../../api/axios";

export interface AuthContextProps {
    errorMessage: string;
    user: IUser | null;
    logged: boolean;
    token: string | null;
    login: (loginData: ILoginData) => void;
    logout: () => void;
    removeError: () => void;
}

export const initialState: IAuthState = {
    logged: false,
    user: null,
    errorMessage: '',
    token: null
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const logged = localStorage.getItem('logged');
        if(logged){
            checkToken();
        }
        
    }, [])

    //verificar si existe token activo
    const checkToken = async() => {
        const token = await localStorage.getItem('token');

        //no token, no autenticadl
        if(!token) return;

        //hay token
        await api.get<IAuth>('/users/me').then(r=> {
            dispatch({
                type: 'login',
                payload: {
                    token: token,
                    user: r.data.user
                }
            });
        }).catch(e=>{
            dispatch({
                type: 'addError',
                payload: e.error
            })
        });

        
    }

    //disparar estado login
    const login = async( {email, password} : ILoginData ) => {
        await api.post<IAuth>('/users/login',{email, password}).then(r=>{
            localStorage.setItem('logged','true');
            localStorage.setItem('token',r.data.token);
            dispatch({
                type: 'login',
                payload: {
                    token: r.data.token,
                    user: r.data.user
                }
            });
        }).catch(e=> {
            dispatch({
                type: 'addError',
                payload: e.message
            })
        });
    }

    //disparar estado logout
    const logout = () => {
        dispatch({type: 'logout'});
        localStorage.removeItem('logged');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        return true;
    }

    const removeError = () => {
        dispatch({
            type: 'removeError'
        })
    }

    return (
        <AuthContext.Provider value={{
            ...state,
            login,
            logout,
            removeError
        }}>
            { children }
        </AuthContext.Provider>
    )
}
