import { Popconfirm, Space } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import api from '../api/axios';
import { UIContext } from '../context/UIContext';
import { ITask } from '../interfaces/IApp';
import { notificationMessage } from '../helpers/shared';
import { ProjectContext } from '../context/project/ProjectContext';
import { useParams } from 'react-router-dom';


export const useTask = () => {

   //loading para el datatable
   const {setLoading} = useContext(UIContext);
    //llenar lista
    const [items, setItems] = useState<ITask[]>([]);
    const {project} = useContext(ProjectContext);
    
    //lista inicial de data
    const getAll = async() => {
        setLoading(true);
        await api.get<ITask[]>('/tasks/').then(r=> {
            setItems(r.data);
        }).catch(e=>{
            
        });
        setLoading(false);
    } 

    //lista inicial de data
    const getByMilestone = async(milestone_id: number) => {
        setLoading(true);
        await api.get<ITask[]>('/tasks/'+milestone_id).then(r=> {
            setItems(r.data);
        }).catch(e=>{
            
        });
        setLoading(false);
    } 

    //crear registro
    const create = async(data: ITask) => {
        let resp = false;
        setLoading(true);
        await api.post(`/tasks`, data).then(r=> {
            notificationMessage('success','Éxito','Hitocreado con éxito');
            resp = true;
            //getAll();
        }).catch(e=>{
            notificationMessage('error','Error',e.error);
        });
        setLoading(false);
        return resp;
    }

    //actualizar registro
    const update = async(data: ITask) => {
        let resp = false;
        setLoading(true);
        await api.put(`/tasks/${data.id}`,data).then(r=> {
            notificationMessage('success','Éxito','Hito actualizado con éxito');
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
        await api.delete(`/tasks/${id}`).then(r=> {
            notificationMessage('success','Éxito','Hito eliminado con éxito');
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
        getByMilestone
    }
}
