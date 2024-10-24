import { Popconfirm, Space } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import api from '../api/axios';
import { UIContext } from '../context/UIContext';
import { ITestCase } from '../interfaces/IApp';
import { notificationMessage } from '../helpers/shared';
import { ProjectContext } from '../context/project/ProjectContext';


export const useTestCase = () => {
   //loading para el datatable
   const {setLoading} = useContext(UIContext);
    //llenar lista
    const [items, setItems] = useState<ITestCase[]>([]);
    const {project} = useContext(ProjectContext);
    
    //lista inicial de data
    const getAll = async(scenario_id:number) => {
        setLoading(true);
        await api.get<ITestCase[]>('/testcases/'+scenario_id).then(r=> {
            setItems(r.data);
        }).catch(e=>{
            
        });
        setLoading(false);
    } 

    //crear registro
    const create = async(data: ITestCase) => {
        let resp = false;
        setLoading(true);
        await api.post(`/testcases`, data).then(r=> {
            notificationMessage('success','Éxito','Caso de prueba creado con éxito');
            resp = true;
            //getAll();
        }).catch(e=>{
            notificationMessage('error','Error',e.error);
        });
        setLoading(false);
        return resp;
    }

    //actualizar registro
    const update = async(data: ITestCase) => {
        let resp = false;
        setLoading(true);
        await api.put(`/testcases/${data.id}`,data).then(r=> {
            notificationMessage('success','Éxito','Caso de prueba  actualizado con éxito');
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
        await api.delete(`/testcases/${id}`).then(r=> {
            notificationMessage('success','Éxito','Caso de prueba  eliminado con éxito');
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
        getAll
    }
}
