import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, FileOutlined, HomeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { Button, Card, Divider, Modal, Row, Select, Space, Spin, Table, Tag, Tooltip } from 'antd';

import { TableProps } from 'antd/lib';
import Swal from 'sweetalert2';
import { _IUser, IDefect, ITestCase } from '../../../../../../interfaces/IApp';
import { useDefect } from '../../../../../../hooks/useDefect';
import { UIContext } from '../../../../../../context/UIContext';
import { CreateOrEdit } from './CreateOrEdit';
import { AuthContext } from '../../../../../../context/auth/AuthContext';

const initialState : IDefect = {
    id: 0,
    test_case_id: 0,
    description: '',
    status: 'p',
    assigned_to: 0,
    severity: 'l'
}

interface IForm {
    testcase: ITestCase | null,
}
  

export const DefectIndex = ({ testcase } : IForm) => {
    const history = useNavigate();
    const {getAll, remove, update, items, _getAll} = useDefect();
    const {loading} = useContext(UIContext);
    const [visible, setVisible] = useState(false);
    const {user} = useContext(AuthContext);

    const [formData, setFormData] = useState<IDefect>(initialState);

    useEffect(() => {
      if(user?.role === 'admin' || user?.role === 'tester'){
        if(testcase){
          getAll(testcase?.id)
        }else{
          _getAll()
        } 
      }else{
        _getAll(user?.id)
      }
        
      }, [testcase]);

      //columnas para mostrar en datatable
  const columns: TableProps<IDefect>['columns']  = [
    { title: 'Descripción', dataIndex: 'description', key: 'description' },
    { title: 'Asignado a', dataIndex: 'assigned_to', key: 'assigned_to',
      render: (_:any, record: IDefect) => (
        <>
          {record.assigned?.first_name + ' '+record.assigned?.last_name}
        </>
      ),
    },
    {
        title: 'Tipo de bug',
        key: 'severity',
        dataIndex: 'severity',
        render: (_:any, record: IDefect) => (
            <>

        <Select
            value={record.severity}
            disabled={!testcase}
            style={{ width: 120 }}
            onChange={(v)=>changeSelectType(v, record)}
            options={[
                { value: 'l', label: <Tag color='gray'>Bajo</Tag> },
                { value: 'm', label: <Tag color='yellow'>Medio</Tag> },
                { value: 'h', label: <Tag color='red'>alto</Tag> },
                { value: 'c', label: <Tag color='red'>critico</Tag> },
            ]}
            />
            </>
          ),
    },
    {
      title: 'Estado',
          key: 'status',
          dataIndex: 'status',
          render: (_:any, record: IDefect) => (
            <>

          <Select
              value={record.status}
              style={{ width: 120 }}
              onChange={(v)=>changeSelect(v, record)}
              options={[
                  { value: 'p', label: <Tag color='gray'>pendiente</Tag> },
                  { value: 'i', label: <Tag color='yellow'>en progreso</Tag> },
                  { value: 'c', label: <Tag color='green'>terminado</Tag> },
                  { value: 'r', label: <Tag color='red'>reabierto</Tag> },
              ]}
              />
            </>
          ),
    },
    { title: 'Fecha de resolución', dataIndex: 'resolve_date', key: 'resolve_date' },
    { title: 'Horas', dataIndex: 'hours', key: 'hours' },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      render: (_: string, record:IDefect) => (
        <Space>
          {testcase &&
            <>
               <Tooltip title="editar">
              <Button  onClick={() => edit(record)} type='primary' shape="circle" icon={<EditOutlined />} />
              </Tooltip>
              <Tooltip title="eliminar">
                <Button onClick={() => removeItem(record)} type='primary' shape="circle" icon={<DeleteOutlined />} danger/>
              </Tooltip>
            </>
          }
         
        </Space>
      )   
    },
  ];

  //salir de modal evaluar si es cancelar o registro exitoso
  const onFinish = (success:boolean) => {
    console.log("onfinsh");
    if(success) getAll(testcase?.id!)
  }

  const changeSelectType = async(value: string, item: IDefect) => {
    const values = {
        ...item,
        severity: value
    }
    const resp = await update(values);
    if(resp) getAll(testcase?.id!)
}

  const changeSelect = async(value: string, item: IDefect) => {
    let values = {
        ...item,
        status: value
    }

    if(value !== 'c'){
      const resp = await update(values);
      if(resp) {
        testcase ? getAll(testcase?.id!) : _getAll()
      }
    }else{
      Swal.fire({
        title: 'Formulario de actualización',
        html: `
           <label for="dateInput">Fecha de resolución:</label>
            <input type="date" id="dateInput" class="swal2-input" style="width: 80%;" />
            <label for="numberInput">Horas:</label>
            <input type="number" id="numberInput" class="swal2-input" style="width: 80%;" />
          `,
        focusConfirm: false,
        preConfirm: () => {
          const dateValue = (document.getElementById('dateInput') as HTMLInputElement).value;
          const numberValue = (document.getElementById('numberInput') as HTMLInputElement).value;
      
          if (!dateValue || !numberValue) {
            Swal.showValidationMessage('Ambos campos son obligatorios');
            return;
          }
      
          return { date: dateValue, number: numberValue };
        }
      }).then(async(result) => {
        if (result.isConfirmed) {
             values = {
              ...values,
              resolve_date: result.value.date,
              hours: result.value.number
             }
             const resp = await update(values);
            if(resp) {
              testcase ? getAll(testcase?.id!) : _getAll()
            }
        }
      });
    }
}

  //función para mandar abrir el modal en modo edición
  const edit = (record: IDefect) => {
    setFormData(record);
  }

  //función para remover registro
  const removeItem = (record:IDefect) => {
    Swal.fire({
      title: 'Esta seguro de eliminar bug ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then(async(result) => {
      if(result.isConfirmed){
        const resp = await remove(record.id);
      }
    })
  }

  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  const handleExpand = (expanded: boolean, record: any) => {
    // Si se expande, establece la fila expandida; si se colapsa, elimina la clave
    setExpandedRowKeys(expanded ? [record.id] : []);
};

    return (
        <div>
            {
              testcase ?
              <CreateOrEdit onFinish={onFinish} item={testcase} formData={formData} />
              : <>
                <Title level={2}>LISTA DE MIS BUGS</Title>
                    <Divider style={{  borderColor: '#1677ff' }}></Divider>
              </> 
            }
                 
            <Table
                rowKey="id" 
                columns={columns}
                loading={loading}
                size='small'
                dataSource={items}
                scroll={{x:20}}
                expandable={{
                  expandedRowRender: record => 
                        <Card style={{border: '1px solid blue', marginLeft: 40}} title="Información del bug">
                          <p><b>Descripcion:</b> {record.description}</p>
                          <p><b>Proyecto:</b> {record.testcase?.testscenario?.testplan?.project?.name}</p>
                          <p><b>Plan de pruebas:</b> {record.testcase?.testscenario?.testplan?.name}</p>
                          <p><b>Escenario de pruebas:</b> {record.testcase?.testscenario?.name}</p>
                          <p><b>Caso de prueba:</b> {record.testcase?.name}</p>
                        </Card>,
                        expandedRowKeys: expandedRowKeys, // Controla las filas expandidas
                        onExpand: handleExpand // Manejador para actualizar el estado
                  }}
            />
        </div>
    )
}
