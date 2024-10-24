import React, { useContext, useEffect, useState } from 'react'
import { ITask } from '../../../../interfaces/IApp';
import { Button, Drawer, Select, Space, Table, TableProps, Tag, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, FileOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { UIContext } from '../../../../context/UIContext';
import { _action, TaskContext } from '../../../../context/task/TaskContext';
import { NoteIndex } from './notes/NoteIndex';

export const SubTaskList = () => {
    const {loading} = useContext(UIContext);
    const {subItems: items, task, getByParent, setTask, action, setAction, update, remove} = useContext(TaskContext);
    const [open, setOpen] = useState(false);

    const changeSelect = async(value: string, item: ITask) => {
        const values = {
            ...item,
            status: value
        }
        
        update(values)
    }

    useEffect(() => {
      if(!task?.parent_id) getByParent(task?.id!)
    }, [task])
    

    //columnas para mostrar en datatable
  const columns: TableProps<ITask>['columns']  = [
    { title: 'Nombre', 
      dataIndex: 'name', 
      key: 'name'},
    { title: 'Descripción', dataIndex: 'description', key: 'description' },
    { title: 'Fecha inicio', dataIndex: 'start_date', key: 'start_date' },
    { title: 'Fecha fin', dataIndex: 'end_date', key: 'end_date' },
    { title: 'Horas estimadas', dataIndex: 'estimated_hours', key: 'estimated_hours' },
    { title: 'horas reales', dataIndex: 'hours', key: 'hours' },
    {
      title: 'Estado',
          key: 'status',
          dataIndex: 'status',
          render: (_:any, record: ITask) => (
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
      title: 'Acciones',
      dataIndex: 'acciones',
      render: (_: string, record:ITask) => (
        <Space>
            <Tooltip title="Agregar nota o comentario">
            <Button onClick={() => showDrawer(record)} type='default' shape="circle" icon={<FileOutlined />}/>
          </Tooltip>
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
    const edit = (record: ITask) => {
        setTask(record);
        setAction(_action.EDIT_SUB_TASK);
    }
    
      //función para remover registro
      const removeItem = (record:ITask) => {
        setAction(_action.REMOVE_SUB_TASK);
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
            remove(record);
          }
        })
      }

      const showDrawer = (task: ITask) => {
        setTask(task)
        setOpen(true);
      };
    
    const onClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Drawer width={900} title={"Notas y comentarios "+task?.name} onClose={onClose} open={open}>
                <NoteIndex />
            </Drawer>
            {
                (action === _action.EDIT_SUB_TASK || action === _action.NEW_SUB_TASK || action === _action.REMOVE_SUB_TASK) && 
                <Table
                    rowKey="id" 
                    columns={columns}
                    loading={loading}
                    size='small'
                    dataSource={items}
                    scroll={{x:20}}
                    /* expandable={{
                        expandedRowRender: record => 
                            <p style={{ margin: 0 }}>{record.os}
                        </p>,
                        }} */ />
            }
        </div>
    )
}
