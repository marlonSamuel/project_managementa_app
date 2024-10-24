import { Popconfirm, Space } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import api from '../api/axios';
import { UIContext } from '../context/UIContext';
import { ITestScenarie } from '../interfaces/IApp';
import { notificationMessage } from '../helpers/shared';
import { ProjectContext } from '../context/project/ProjectContext';


export const useTestScenarie = () => {
   //loading para el datatable
   const {setLoading} = useContext(UIContext);
    //llenar lista
    const [items, setItems] = useState<ITestScenarie[]>([]);
    const {project} = useContext(ProjectContext);
    
    //lista inicial de data
    const getAll = async(testplan_id:number) => {
        setLoading(true);
        await api.get<ITestScenarie[]>('/testscenaries/'+testplan_id).then(r=> {
            setItems(r.data);
        }).catch(e=>{
            
        });
        setLoading(false);
    } 

    //crear registro
    const create = async(data: ITestScenarie) => {
        let resp = false;
        setLoading(true);
        await api.post(`/testscenaries`, data).then(r=> {
            notificationMessage('success','Éxito','escenario de prueba creado con éxito');
            resp = true;
            //getAll();
        }).catch(e=>{
            notificationMessage('error','Error',e.error);
        });
        setLoading(false);
        return resp;
    }

    //actualizar registro
    const update = async(data: ITestScenarie) => {
        let resp = false;
        setLoading(true);
        await api.put(`/testscenaries/${data.id}`,data).then(r=> {
            notificationMessage('success','Éxito','escenario de prueba  actualizado con éxito');
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
        await api.delete(`/testscenaries/${id}`).then(r=> {
            notificationMessage('success','Éxito','escenario de prueba  eliminado con éxito');
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
