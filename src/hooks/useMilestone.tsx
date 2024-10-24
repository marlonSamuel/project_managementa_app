import { Popconfirm, Space } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import api from '../api/axios';
import { UIContext } from '../context/UIContext';
import { IMilestone } from '../interfaces/IApp';
import { notificationMessage } from '../helpers/shared';
import { ProjectContext } from '../context/project/ProjectContext';


export const useMilestone = () => {
   //loading para el datatable
   const {setLoading} = useContext(UIContext);
    //llenar lista
    const [items, setItems] = useState<IMilestone[]>([]);
    const [item, setItem] = useState<IMilestone | null>(null);
    const {project} = useContext(ProjectContext);
    
    //lista inicial de data
    const getAll = async(page=0) => {
        setLoading(true);
        await api.get<IMilestone[]>('/milestones/'+project?.id).then(r=> {
            setItems(r.data);
        }).catch(e=>{
            
        });
        setLoading(false);
    } 

    //lista inicial de data
    const getById = async(id:number) => {
        setLoading(true);
        await api.get<IMilestone>('/milestones/milestone/'+id).then(r=> {
            setItem(r.data);
        }).catch(e=>{
            
        });
        setLoading(false);
    } 

    //crear registro
    const create = async(data: IMilestone) => {
        let resp = false;
        setLoading(true);
        await api.post(`/milestones`, data).then(r=> {
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
    const update = async(data: IMilestone) => {
        let resp = false;
        setLoading(true);
        await api.put(`/milestones/${data.id}`,data).then(r=> {
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
        await api.delete(`/milestones/${id}`).then(r=> {
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
        getById,
        item
    }
}
