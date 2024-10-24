import React, { useContext, useState } from 'react'
import api from '../api/axios';
import { UIContext } from '../context/UIContext';
import { notificationMessage } from '../helpers/shared';
import { INote } from '../interfaces/IApp';


export const useNote = () => {
   //loading para el datatable
   const {setLoading} = useContext(UIContext);
    //llenar lista
    const [items, setItems] = useState<INote[]>([]);
    
    //lista inicial de data
    const getAll = async(task_id: number) => {
        setLoading(true);
        await api.get<INote[]>('/notes/'+task_id).then(r=> {
            setItems(r.data);
        }).catch(e=>{
            
        });
        setLoading(false);
    } 

    //crear registro
    const create = async(data: INote) => {
        let resp = false;
        setLoading(true);
        await api.post(`/notes`, data).then(r=> {
            notificationMessage('success','Éxito','Comentario enviado con éxito');
            resp = true;
        }).catch(e=>{
            notificationMessage('error','Error',e.error);
        });
        setLoading(false);
        return resp;
    }

    //actualizar registro
    const update = async(data: INote) => {
        let resp = false;
        setLoading(true);
        await api.put(`/notes/${data.id}`,data).then(r=> {
            notificationMessage('success','Éxito','Comentario actualizado con éxito');
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
        await api.delete(`/notes/${id}`).then(r=> {
            notificationMessage('success','Éxito','Comentario eliminado con éxito');
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
        getAll
    }
}
