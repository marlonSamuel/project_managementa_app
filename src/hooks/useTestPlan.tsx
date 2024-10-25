import React, { useContext, useState } from 'react'
import api from '../api/axios';
import { UIContext } from '../context/UIContext';
import { ITestPlan } from '../interfaces/IApp';
import { notificationMessage } from '../helpers/shared';
import { ProjectContext } from '../context/project/ProjectContext';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth/AuthContext';


export const useTestPlan = () => {
    const location = useLocation();

   //loading para el datatable
   const {setLoading} = useContext(UIContext);
    //llenar lista
    const [items, setItems] = useState<ITestPlan[]>([]);
    const {project} = useContext(ProjectContext);
    const [item, setItem] = useState<ITestPlan | null>(null);
    const {user} = useContext(AuthContext);
    
    const _getAll = async(user_id = 0) => {
        let url = '/testplans?user_id='+user_id;
        setLoading(true);
        await api.get<ITestPlan[]>(url).then(r=> {
            setItems(r.data);
        }).catch(e=>{
            
        });
        setLoading(false);
    }
    //lista inicial de data
    const getAll = async() => {
        let url = '/testplans/'+project?.id;
        setLoading(true);
        await api.get<ITestPlan[]>(url).then(r=> {
            setItems(r.data);
        }).catch(e=>{
            
        });
        setLoading(false);
    } 

    
    //lista inicial de data
    const getById = async(id:number) => {
        setLoading(true);
        await api.get<ITestPlan>('/testplans/getById/'+id).then(r=> {
            setItem(r.data);
        }).catch(e=>{
            
        });
        setLoading(false);
    } 

    //crear registro
    const create = async(data: ITestPlan) => {
        let resp = false;
        setLoading(true);
        await api.post(`/testplans`, data).then(r=> {
            notificationMessage('success','Éxito','Plan de prueba creado con éxito');
            resp = true;
            //getAll();
        }).catch(e=>{
            notificationMessage('error','Error',e.error);
        });
        setLoading(false);
        return resp;
    }

    //actualizar registro
    const update = async(data: ITestPlan) => {
        let resp = false;
        setLoading(true);
        await api.put(`/testplans/${data.id}`,data).then(r=> {
            notificationMessage('success','Éxito','Plan de prueba  actualizado con éxito');
            resp = true;
            //getAll();
        }).catch(e=>{
            notificationMessage('error','Error',e.error);
        });
        setLoading(false);
        return resp;
    }

    //eliminar registro
    const remove = async(id:number) => {
        let resp = false;
        setLoading(true);
        await api.delete(`/testplans/${id}`).then(r=> {
            notificationMessage('success','Éxito','Plan de prueba eliminado con éxito');
            resp = true;
            //getAll();
        }).catch(e=>{
            notificationMessage('error','Error',e.error);
        });
        setLoading(false);
        return resp;
    }

    return {
        items,
        create,
        update,
        remove,
        getAll,
        _getAll,
        getById,
        item
    }
}
