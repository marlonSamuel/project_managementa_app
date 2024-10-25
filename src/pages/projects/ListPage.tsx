import { Button, Divider, Progress, Select, Space, Table, TableProps, Tag, Tooltip } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { IProject } from '../../interfaces/IProject';
import { ProjectContext } from '../../context/project/ProjectContext';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { UIContext } from '../../context/UIContext';
import { initialState } from './IndexPage';
import { CreateOrEdit } from './CreateOrEdit';
import { useNavigate } from 'react-router-dom';


export const ListPage = () => {

    const history = useNavigate();

    const [formData, setFormData] = useState<IProject>(initialState);
    const [visible, setVisible] = useState(false);
    const {items, update, remove, setProject} = useContext(ProjectContext);
    const {loading} = useContext(UIContext);

    const [data, setData] = useState<IProject[]>([]);    

    const changeSelect = (value: string, item: IProject) => {
        const values = {
            ...item,
            status: value
        }
        update(values);
    }

    const changeEnv = (value: string, item: IProject) => {
        const values = {
            ...item,
            enviroment: value
        }
        update(values);
    }

    const selectProject = (project: IProject) => {
      setProject(project);
      history('/projects/subitems')
    }

    const columns: TableProps<IProject>['columns'] = [
        {
          title: 'Proyecto',
          dataIndex: 'name',
          key: 'name',
          filters: items.map(obj => ({text: obj.name, value: obj.name})),
          filterMode: 'tree',
          filterSearch: true,
          onFilter: (value, record) => record.name.includes(value as string),
          width: '30%',
          render: (_, record) => <Button type='link' onClick={()=>selectProject(record)}>{record.name}</Button>,
        },
        {
          title: 'Descripcion',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'Fecha inicio',
          dataIndex: 'start_date',
          key: 'start_date',
        },
        {
            title: 'Fecha fin',
            dataIndex: 'end_date',
            key: 'end_date',
        },
        {
          title: 'Repositorio',
          dataIndex: 'repository_name',
          key: 'repository_name',
      },
      {
        title: 'Url del repositorio',
        dataIndex: 'url_repository',
        key: 'url_repository',
        render: (_, record: IProject) => (
          <>
            <a href={record.url_repository} target='blank'>ir a repositorio</a>
          </>
        ),
    },
        {
        title: 'Estado',
            key: 'status',
            dataIndex: 'status',
            render: (_, record: IProject) => (
              <>

            <Select
                value={record.status}
                style={{ width: 120 }}
                onChange={(v)=>changeSelect(v, record)}
                options={[
                    { value: 'p', label: <Tag color='gray'>pendiente</Tag> },
                    { value: 'i', label: <Tag color='yellow'>en progreso</Tag> },
                    { value: 'c', label: <Tag color='green'>terminado</Tag> },
                    { value: 's', label: <Tag color='red'>detenido</Tag> },
                ]}
                />
              </>
            ),
        },
        {
            title: 'Ambiente',
            key: 'enviroment',
            dataIndex: 'enviroment',
            render: (_, record: IProject) => (
                <>

            <Select
                value={record.enviroment}
                style={{ width: 120 }}
                onChange={(v)=>changeEnv(v, record)}
                options={[
                    { value: 'd', label: <Tag color='blue'>Desarrollo</Tag> },
                    { value: 'q', label: <Tag color='yellow'>QA</Tag> },
                    { value: 'p', label: <Tag color='green'>Producción</Tag> },
                ]}
                />
                </>
            ),
        },
        {
            title: 'Acciones',
            dataIndex: 'acciones',
            render: (_: string, record:IProject) => (
              <Space>
                <Tooltip title="editar">
                  <Button  onClick={() => edit(record)} type='primary' shape="circle" icon={<EditOutlined />} />
                </Tooltip>
                <Tooltip title="eliminar">
                  <Button onClick={() => removeItem(record)} type='primary' shape="circle" icon={<DeleteOutlined />} danger/>
                </Tooltip>
              </Space>
            )   
          },
      ];
    
    //función para mandar abrir el modal en modo edición
    const edit = (record: IProject) => {
        console.log(record)
        setFormData(record);
        setVisible(true);
    }
    
    //función para remover registro
    const removeItem = (record:IProject) => {
        Swal.fire({
            title: 'Esta seguro de eliminar registro '+record.name+' ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then(async(result) => {
            if(result.isConfirmed){
                remove(record)
            }
        })
    }

  return (
    <div>
        <CreateOrEdit 
            visible={visible}
            onFinish={setVisible}
            formData={formData}
      />
        
        <Table<IProject> 
            loading={loading}  
            scroll={{x:20}} size="small" 
            columns={columns} dataSource={items} />
    </div>
  )
}
