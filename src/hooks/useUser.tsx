import React, { useContext, useState } from 'react'
import api from '../api/axios';
import { UIContext } from '../context/UIContext';
import { notificationMessage } from '../helpers/shared';
import { _IUser } from '../interfaces/IApp';

export const useUser = () => {
   //loading para el datatable
   const {setLoading} = useContext(UIContext);
    //llenar lista
    const [items, setItems] = useState<_IUser[]>([]);
    
    //lista inicial de data
    const getAll = async(page=0) => {
        setLoading(true);
        await api.get<_IUser[]>('/users').then(r=> {
            setItems(r.data);
        }).catch(e=>{
            
        });
        setLoading(false);
    } 

    //crear registro
    const create = async(data: _IUser) => {
        let resp = false;
        setLoading(true);
        await api.post(`/users`, data).then(r=> {
            notificationMessage('success','Éxito','Usuario creado con éxito');
            resp = true;
            getAll();
        }).catch(e=>{
            notificationMessage('error','Error',e.error);
        });
        setLoading(false);
        return resp;
    }

    //actualizar registro
    const update = async(data: _IUser) => {
        let resp = false;
        setLoading(true);
        await api.put(`/users/${data.id}`,data).then(r=> {
            notificationMessage('success','Éxito','Usuario actualizado con éxito');
            resp = true;
            getAll();
        }).catch(e=>{
            notificationMessage('error','Error',e.error);
        });
        setLoading(false);
        return resp;
    }

    const UpdatePassword = async(data: any) => {
        let resp = false;
        setLoading(true);
        await api.put(`/users/update_password/${data.id}`,data).then(r=> {
            notificationMessage('success','Éxito','Constraseña actualizada con éxito');
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
        await api.delete(`/users/${id}`).then(r=> {
            notificationMessage('success','Éxito','Usuario eliminado con éxito');
            resp = true;
            getAll();
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
        UpdatePassword
    }
}
