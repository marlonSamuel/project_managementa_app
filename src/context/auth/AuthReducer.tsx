import { IUser } from "../../interfaces/IAuth";

export interface IAuthState {
    errorMessage: string;
    logged: boolean;
    user: IUser | null;
    token: string | null;
};

type AuthAction = 
    | { type: 'login', payload: {token: string, user: IUser}}
    | { type: 'logout'}
    | { type: 'addError', payload: string}
    | { type: 'removeError'}


//generar estado
export const authReducer = (state: IAuthState, action: AuthAction): IAuthState =>{
    switch (action.type) {
        case 'login':
            return {
                ...state,
                logged: true,
                token: action.payload.token,
                user: action.payload.user
            }
        
        case 'logout':
            return {
                ...state,
                logged: false,
                user: null
            }
        
        case 'addError':
            return {
                ...state,
                errorMessage: action.payload,
            }
        
        case 'removeError':
            return {
                ...state,
                errorMessage: '',
            }
    
        default:
            return state;
    }
}
