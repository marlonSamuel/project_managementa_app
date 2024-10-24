import { createContext, useContext, useEffect, useReducer, useState } from "react";

import { IUser, IAuth, ILoginData } from "../../interfaces/IAuth";

import api from "../../api/axios";
import { IProject } from "../../interfaces/IProject";
import { IMetric, IResponse } from "../../interfaces/IApp";
import { UIContext } from "../UIContext";

export interface ProjectContextProps {
    items: IProject[];
    create: (data: IProject) => void;
    update: (data: IProject) => void;
    remove: (data: IProject) => void;
    getByEnviroment: (env: string) => void;
    getAll: () => void;
    getById: (id: number) => void;
    key: string;
    setKey: (key: string) => void;
    project: IProject | undefined;
    setProject: (project: IProject) => void;
    getMetrics: (project_id: any) => void;
    metrics: IMetric;
}


export const ProjectContext = createContext({} as ProjectContextProps);

export const ProjectProvider = ({ children }: any) => {

    const [items, setItems] = useState<IProject[]>([]);
    const [project, setProject] = useState<IProject>();
    const {setLoading} = useContext(UIContext);
    const [key, setKey] = useState<string>('d');
    const [metrics, setMetrics] = useState<IMetric>({
        tasks: [],
        tests: [],
        dev: 0,
        prod: 0,
        qa: 0,
        pendings: 0,
        inprogress: 0,
        completed: 0
    });

    useEffect(() => {
       //getByEnviroment('d');
    }, [])

    //obtener todos los registros
    const getAll = async() => {
        setLoading(true);
        await api.get<IProject[]>('/projects').then(r=>{
            setItems(r.data);
        }).catch(e=> {
            console.log(e)
        });
        setLoading(false);
    }

    //obtener todos los registros
    const getById = async(id: number) => {
        setLoading(true);
        await api.get<IProject>('/projects/'+id).then(r=>{
            setProject(r.data);
        }).catch(e=> {
            console.log(e)
        });
        setLoading(false);
    }

    //obtener todos los registros
    const getMetrics = async(project_id?: any) => {
        setLoading(true);
        let url = '/projects/metrics/dash';
        if(project_id) url+='?project_id='+project_id;

        await api.get(url).then(r=>{
            setMetrics(r.data);
        }).catch(e=> {
            console.log(e)
        });
        setLoading(false);
    }

    //obtener todos los registros
    const getByEnviroment = async(env: string) => {
        setLoading(true);
        await api.get<IProject[]>('/projects/env/'+env).then(r=>{
            setItems(r.data);
        }).catch(e=> {
            console.log(e)
        });
        setLoading(false);
    }
    
    //crear registro
    const create = async(data: IProject) => {
        setLoading(true);
        await api.post<IResponse>('/projects',data).then(r=>{
            getByEnviroment('d');
        }).catch(e=> {
            console.log(e)
        });
        setLoading(false);
    }

    //crear registro
    const update = async(data: IProject) => {
        setLoading(true);
        await api.put<IResponse>('/projects/'+data.id,data).then(r=>{
            getByEnviroment(data.enviroment!);
            setKey(data.enviroment!)
        }).catch(e=> {
            console.log(e)
        });
        setLoading(false);
    }

    //crear registro
    const remove = async(data: IProject) => {
        setLoading(true);
        await api.delete<IResponse>('/projects/'+data.id).then(r=>{
            getByEnviroment(data.enviroment!);
        }).catch(e=> {
            console.log(e)
        });
        setLoading(false);
    }

    return (
        <ProjectContext.Provider value={{
           items,
           create,
           update,
           remove,
           getByEnviroment,
           key,
           setKey,
           project,
           setProject,
           getAll,
           getMetrics,
           metrics,
           getById
        }}>
            { children }
        </ProjectContext.Provider>
    )
}
