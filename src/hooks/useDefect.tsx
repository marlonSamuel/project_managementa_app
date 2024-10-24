import React, { useContext, useState } from 'react'
import api from '../api/axios';
import { UIContext } from '../context/UIContext';
import { notificationMessage } from '../helpers/shared';
import { IDefect } from '../interfaces/IApp';


export const useDefect = () => {
   //loading para el datatable
   const {setLoading} = useContext(UIContext);
    //llenar lista
    const [items, setItems] = useState<IDefect[]>([]);
    
    //lista inicial de data
    const getAll = async(testcase_id: number) => {
        setLoading(true);
        await api.get<IDefect[]>('/defects/'+testcase_id).then(r=> {
            setItems(r.data);
        }).catch(e=>{
            
        });
        setLoading(false);
    }
    
    //lista inicial de data
    const _getAll = async() => {
        setLoading(true);
        await api.get<IDefect[]>('/defects').then(r=> {
            setItems(r.data);
        }).catch(e=>{
            
        });
        setLoading(false);
    } 

    //crear registro
    const create = async(data: IDefect) => {
        let resp = false;
        setLoading(true);
        await api.post(`/defects`, data).then(r=> {
            notificationMessage('success','Éxito','Bug creado con éxito');
            resp = true;
        }).catch(e=>{
            notificationMessage('error','Error',e.error);
        });
        setLoading(false);
        return resp;
    }

    //actualizar registro
    const update = async(data: IDefect) => {
        let resp = false;
        setLoading(true);
        await api.put(`/defects/${data.id}`,data).then(r=> {
            notificationMessage('success','Éxito','Bug actualizado actualizado con éxito');
            resp = true;
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
        await api.delete(`/defects/${id}`).then(r=> {
            notificationMessage('success','Éxito','Bug creado eliminado con éxito');
            resp = true;
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
        _getAll
    }
}
