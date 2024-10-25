import React, { useContext, useEffect, useState } from 'react'
import { _IUser, ITestPlan } from '../../../interfaces/IApp';
import { Button, Col, Divider, Row, Select, Space, Table, Tag, Tooltip } from 'antd';
import Swal from 'sweetalert2';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { UIContext } from '../../../context/UIContext';
import { useTestPlan } from '../../../hooks/useTestPlan';
import { CreateOrEdit } from './CreateOrEdit';
import { TableProps } from 'antd/lib';
import { useUser } from '../../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/auth/AuthContext';
import Title from 'antd/es/typography/Title';
const { Option } = Select;


const initialState : ITestPlan = {
  id: 0,
  project_id: 0,
  name: '',
  description: '',
  acceptance_criteria: '',
  status: 'p'
}


export const TestPlanIndex = () => {
  const history = useNavigate();
  //llamar hook para application
  const {loading} = useContext(UIContext);
  const {user} = useContext(AuthContext);
  const {items, remove, getAll, update, _getAll} = useTestPlan();
  const {items: users, getAll: getUsers} = useUser(); 

  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<ITestPlan>(initialState);

  //columnas para mostrar en datatable
  const columns: TableProps<ITestPlan>['columns']  = [
    { title: 'Nombre', 
      dataIndex: 'name', 
      key: 'name',
      render: (_, record) => <Button type='link' onClick={()=>selectTestPlan(record)}>{record.name}</Button>,
     },
    { title: 'Descripción', dataIndex: 'description', key: 'description' },
    { title: 'Criterios de aceptación', dataIndex: 'acceptance_criteria', key: 'acceptance_criteria' },
    { title: 'Creado por', dataIndex: 'created_by', key: 'created_by',
      render: (_:any, record: ITestPlan) => (
        <>
            {record.createdBy?.first_name+' '+record.createdBy?.last_name}
        </>
      ),
     },
     { title: 'Asignado a', dataIndex: 'assigned_to', key: 'assigned_to',
      render: (_:any, record: ITestPlan) => (
        <>

          <Select
            showSearch
            defaultValue={record.assigned_to}
            onChange={(v)=>selectAssigned(v,record)}
            style={{ width: 150 }}
            filterOption={(input: any, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            allowClear
            >
            {
                users.map((c: _IUser) => (
                  <Option key={c.id} value={c.id}>{c.first_name+' '+c.last_name}</Option>
                ))
            }
            </Select>
        </>
      ),
     },
    {
      title: 'Estado',
          key: 'status',
          dataIndex: 'status',
          render: (_:any, record: ITestPlan) => (
            <>

          <Select
              value={record.status}
              style={{ width: 120 }}
              onChange={(v)=>changeSelect(v, record)}
              options={[
                  { value: 'p', label: <Tag color='gray'>pendiente</Tag> },
                  { value: 'i', label: <Tag color='yellow'>en progreso</Tag> },
                  { value: 'f', label: <Tag color='green'>terminado</Tag> },
                  { value: 'd', label: <Tag color='red'>detenido</Tag> },
              ]}
              />
            </>
          ),
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      render: (_: string, record:ITestPlan) => (
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
    if(user?.role === 'admin'){
      getAll();
    }else{
      _getAll(user?.id);
    }
    
    getUsers();
  }, []);

  const selectTestPlan = (TestPlan: ITestPlan) => {
    history('/testscenaries/'+TestPlan.id)
  }

  const selectAssigned = async (value: number, item: ITestPlan) => {
    const values = {
      ...item,
      assigned_to: value
  }
  const resp = await update(values);
  if(resp) getAll();
  }

  //salir de modal evaluar si es cancelar o registro exitoso
  const onFinish = (success:boolean) => {
    console.log("onfinsh");
    setVisible(false);
    setFormData(initialState);
    if(success) getAll();
  }

  const changeSelect = async(value: string, item: ITestPlan) => {
    const values = {
        ...item,
        status: value
    }
    const resp = await update(values);
    if(resp) getAll();
  }

  //función para mandar abrir el modal en modo edición
  const edit = (record: ITestPlan) => {
    setFormData(record);
    setVisible(true);
  }

  //función para remover registro
  const removeItem = (record:ITestPlan) => {
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
      <Row>
        {
          user?.role === 'tester' &&
          <Divider style={{  borderColor: '#1677ff' }}><Title level={5}>LISTA DE MIS PLANES DE PRUEBAS</Title></Divider>
        }

        {
          user?.role === 'admin' &&
          <Button onClick={()=>{setVisible(true)}}  icon={<PlusCircleOutlined />} size='small' type="primary">
            Nuevo 
          </Button>
        }
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
