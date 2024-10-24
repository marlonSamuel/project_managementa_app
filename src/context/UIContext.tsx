import {createContext, useEffect, useState} from 'react';
import { IBreadCrub } from '../pages/shared/BreadCrubPage';
//import { IBreadCrub } from '../components/shared/BreadCrubPage';
//import { initBEforeUnLoad } from '../helpers/shared';

//interface con los atributos necesarios para manejar el ui context
export interface UIContextProps {
    loading: boolean,
    setLoading: (action: boolean) => void;
    routesBC: IBreadCrub[],
    setRoutesBC: (action: IBreadCrub[]) => void;
    showExitPrompt: boolean;
    setShowExitPrompt: (action: boolean) => void;
}
//crear context
export const UIContext = createContext({} as UIContextProps);
//crear el provider
export const UIProvider = ({ children }: any) => {
    //definir los estados necesarios para el ui
    const [loading, setLoading] = useState(false);
    const [routesBC, setRoutesBC] = useState<IBreadCrub[]>([]);
    const [showExitPrompt, setShowExitPrompt] = useState(false);

    window.onload = function() {
        //initBEforeUnLoad(showExitPrompt);
    };

    useEffect(() => {
        //initBEforeUnLoad(showExitPrompt);
    }, [showExitPrompt]);

    return (
        <UIContext.Provider value={{
            loading,
            setLoading,
            routesBC,
            setRoutesBC,
            showExitPrompt, 
            setShowExitPrompt
        }}>
            {children}
        </UIContext.Provider>
    )
}
