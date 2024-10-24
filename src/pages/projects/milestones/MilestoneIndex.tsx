import React, { useContext, useEffect, useState } from 'react'
import { IMilestone } from '../../../interfaces/IApp';
import { Button, Col, Row, Select, Space, Table, Tag, Tooltip } from 'antd';
import Swal from 'sweetalert2';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { UIContext } from '../../../context/UIContext';
import { useMilestone } from '../../../hooks/useMilestone';
import { CreateOrEdit } from './CreateOrEdit';
import { TableProps } from 'antd/lib';
import { useNavigate } from 'react-router-dom';


const initialState : IMilestone = {
  id: 0,
  project_id: 0,
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  status: 'p'
}


export const MilestoneIndex = () => {
  const history = useNavigate();
  //llamar hook para application
  const {loading} = useContext(UIContext);
  const {items, remove, getAll, update} = useMilestone();

  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<IMilestone>(initialState);

  //columnas para mostrar en datatable
  const columns: TableProps<IMilestone>['columns']  = [
    { title: 'Nombre', 
      dataIndex: 'name', 
      key: 'name',
      render: (_, record) => <Button type='link' onClick={()=>selectMilestone(record)}>{record.name}</Button>,
     },
    { title: 'Descripción', dataIndex: 'description', key: 'description' },
    { title: 'Fecha inicio', dataIndex: 'start_date', key: 'start_date' },
    { title: 'Fecha fin', dataIndex: 'end_date', key: 'end_date' },
    {
      title: 'Estado',
          key: 'status',
          dataIndex: 'status',
          render: (_:any, record: IMilestone) => (
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
      render: (_: string, record:IMilestone) => (
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

  useEffect(() => {
    getAll();
  }, []);

  const selectMilestone = (milestone: IMilestone) => {
    history('/tasks/'+milestone.id)
  }

  //salir de modal evaluar si es cancelar o registro exitoso
  const onFinish = (success:boolean) => {
    console.log("onfinsh");
    setVisible(false);
    setFormData(initialState);
    if(success) getAll();
  }

  const changeSelect = async(value: string, item: IMilestone) => {
    const values = {
        ...item,
        status: value
    }
    const resp = await update(values);
    if(resp) getAll();
}

  //función para mandar abrir el modal en modo edición
  const edit = (record: IMilestone) => {
    setFormData(record);
    setVisible(true);
  }

  //función para remover registro
  const removeItem = (record:IMilestone) => {
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
        const resp = await remove(record.id);
        if(resp) getAll();
      }
    })
  }

  return (
    <div>
    <CreateOrEdit 
      visible={visible}
      onFinish={onFinish}
      formData={formData}
    />
      <Row >
          <Button onClick={()=>{setVisible(true)}}  icon={<PlusCircleOutlined />} size='small' type="primary">
                 Nuevo 
              </Button>
      </Row>
      
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
  </div>
  )
}
