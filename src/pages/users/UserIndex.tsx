import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Divider, Row, Select, Space, Table, Tag, Tooltip } from 'antd';
import Swal from 'sweetalert2';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { CreateOrEdit } from './CreateOrEdit';
import { TableProps } from 'antd/lib';
import { useNavigate } from 'react-router-dom';
import { _IUser } from '../../interfaces/IApp';
import { UIContext } from '../../context/UIContext';
import { useUser } from '../../hooks/useUser';
import Title from 'antd/es/typography/Title';
const { Option } = Select;


const initialState : _IUser = {
  id: 0,
  first_name: '',
  second_last_name: '',
  last_name: '',
  second_name: '',
  birthday: '',
  role: '',
  password: '',
  email: ''
}


export const UserIndex = () => {
  const history = useNavigate();
  //llamar hook para application
  const {loading} = useContext(UIContext);
  const {items, remove, getAll, update} = useUser(); 

  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<_IUser>(initialState);

  //columnas para mostrar en datatable
  const columns: TableProps<_IUser>['columns']  = [
    { title: 'Nombre', 
      dataIndex: 'name', 
      key: 'name',
      render: (_:any, record: _IUser) => (
        <>
            {record.first_name+' '+record.last_name}
        </>
      ),
     },
    { title: 'Fecha de nacimiento', dataIndex: 'birthday', key: 'birthday' },
    { title: 'Correo electronico', dataIndex: 'email', key: 'email' },
    { title: 'Rol', dataIndex: 'role', key: 'role'},
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      render: (_: string, record:_IUser) => (
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


  //salir de modal evaluar si es cancelar o registro exitoso
  const onFinish = (success:boolean) => {
    console.log("onfinsh");
    setVisible(false);
    setFormData(initialState);
    if(success) getAll();
  }

  //función para mandar abrir el modal en modo edición
  const edit = (record: _IUser) => {
    setFormData(record);
    setVisible(true);
  }

  //función para remover registro
  const removeItem = (record:_IUser) => {
    Swal.fire({
      title: 'Esta seguro de eliminar registro '+record.first_name+' '+record.last_name +' ?',
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
      <Title level={2}>USUARIOS</Title>
      <Button onClick={()=>{setVisible(true)}} icon={<PlusCircleOutlined />} size='small' type="primary">
          Nuevo 
      </Button>
      <Divider style={{  borderColor: '#1677ff' }}></Divider>
      
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

