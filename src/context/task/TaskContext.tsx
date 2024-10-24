import { createContext, useContext, useEffect, useReducer, useState } from "react";

import { IUser, IAuth, ILoginData } from "../../interfaces/IAuth";

import api from "../../api/axios";
import { IResponse, ITask } from '../../interfaces/IApp';
import { UIContext } from "../UIContext";
import { useParams } from "react-router-dom";

export interface TaskContextProps {
    items: ITask[];
    subItems: ITask[];
    create: (data: ITask) => void;
    update: (data: ITask) => void;
    remove: (data: ITask) => void;
    getByMilestone: (milestone_id: number ) => void;
    getByParent: (parent_id: number ) => void;
    getAll: ( ) => void;
    task: ITask | undefined;
    setTask: (Task: ITask | undefined) => void;
    action: _action;
    setAction: (action: _action) => void;
    setItems: (items: ITask[]) => void;
    setFilters: (filters: {user_id: any, project_id: any}) => void;
    filter: any;
}

export enum _action {
    NEW_TASK = 'nt',
    EDIT_TASK = 'et',
    NEW_SUB_TASK = 'nst',
    EDIT_SUB_TASK = 'est',
    LIST_TASK = 'lt',
    REMOVE_TASK = 'rt',
    REMOVE_SUB_TASK = 'rst'
}

export const TaskContext = createContext({} as TaskContextProps);

export const TaskProvider = ({ children }: any) => {

    const { milestone_id } = useParams();

    const [items, setItems] = useState<ITask[]>([]);
    const [subItems, setSubItems] = useState<ITask[]>([]);
    const [task, setTask] = useState<ITask>();
    const {setLoading} = useContext(UIContext);
    const [action, setAction] = useState<_action>(_action.NEW_TASK);
    const [filter, setFilters] = useState({
        user_id: undefined,
        project_id: undefined
    })

    //obtener todos los registros
    const getAll = async() => {
        setLoading(true);
        await api.get<ITask[]>('/tasks?user_id='+filter.user_id+'&project_id='+filter.project_id).then(r=>{
            setItems(r.data);
        }).catch(e=> {
            console.log(e)
        });
        setLoading(false);
    }

    //obtener todos los registros
    const getByMilestone = async(milestone_id: number) => {
        setLoading(true);
        await api.get<ITask[]>('/tasks/'+milestone_id+'?user_id='+filter.user_id+'&project_id='+filter.project_id).then(r=>{
            setItems(r.data);
        }).catch(e=> {
            console.log(e)
        });
        setLoading(false);
    }

    //obtener todos los registros
    const getByParent = async(parent_id: number) => {
        setLoading(true);
        await api.get<ITask[]>('/tasks/childs/'+parent_id+'?user_id='+filter.user_id+'&project_id='+filter.project_id).then(r=>{
            setSubItems(r.data);
        }).catch(e=> {
            console.log(e)
        });
        setLoading(false);
    }
    
    //crear registro
    const create = async(data: ITask) => {
        setLoading(true);
        await api.post<IResponse>('/tasks',data).then(r=>{
            data.parent_id ? getByParent(data.parent_id) : (milestone_id ? getByMilestone(data.milestone_id) : getAll())
            if(action === _action.NEW_TASK) setAction(_action.LIST_TASK)
        }).catch(e=> {
            console.log(e)
        });
        setLoading(false);
    }

    //crear registro
    const update = async(data: ITask) => {
        setLoading(true);
        await api.put<IResponse>('/tasks/'+data.id,data).then(r=>{
            data.parent_id ? getByParent(data.parent_id) : (milestone_id ? getByMilestone(data.milestone_id) : getAll())
            if(action === _action.EDIT_TASK) setAction(_action.LIST_TASK)
        }).catch(e=> {
            console.log(e)
        });
        setLoading(false);
    }

    //crear registro
    const remove = async(data: ITask) => {
        setLoading(true);
        await api.delete<IResponse>('/tasks/'+data.id).then(r=>{
            data.parent_id ? getByParent(data.parent_id) : (milestone_id ? getByMilestone(data.milestone_id) : getAll())
            if(action === _action.REMOVE_TASK) setAction(_action.LIST_TASK)
        }).catch(e=> {
            console.log(e)
        });
        setLoading(false);
    }

    return (
        <TaskContext.Provider value={{
           items,
           setItems,
           subItems,
           create,
           update,
           remove,
           getByMilestone,
           getByParent,
           getAll,
           task,
           setTask,
           action,
           setAction,
           setFilters,
           filter
        }}>
            { children }
        </TaskContext.Provider>
    )
}
