import { CheckCircleFilled, DeleteOutlined, DislikeFilled, EditOutlined, FileOutlined, PlusCircleFilled } from '@ant-design/icons'
import { Button, Divider, Modal, Row, Select, Space, Table, Tag, Tooltip } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { ITestCase, ITestScenarie } from '../../../../../interfaces/IApp'
import { TableProps } from 'antd/lib'
import { UIContext } from '../../../../../context/UIContext'
import { CreateOrEdit } from './CreateOrEdit'
import { useTestCase } from '../../../../../hooks/useTestCase'
import { useTestScenarie } from '../../../../../hooks/useTestScenarie'
import Swal from 'sweetalert2'
import { notificationMessage } from '../../../../../helpers/shared'
import { DefectIndex } from './defects/DefectIndex'

interface IData {
    item: ITestScenarie
  }

  const initialState : ITestCase = {
    id: 0,
    scenario_id: 0,
    name: '',
    description: '',
    status: 'p',
    expected_result: '',
    test_data: ''
  }

export const TestCaseIndex = ({item}: IData) => {

    console.log(item)
  const {loading} = useContext(UIContext);
  
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<ITestCase>(initialState);
  const {getAll, remove, update, items} = useTestCase();
  const {getAll: getScenaries} = useTestScenarie();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testcase, setTestCase] = useState<ITestCase | null>(null)

  useEffect(() => {
    getAll(item.id)
  }, [item])

    //columnas para mostrar en datatable
    const columns: TableProps<ITestCase>['columns']  = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Nombre', 
            dataIndex: 'name', 
            key: 'name'},
        { title: 'Descripción', dataIndex: 'description', key: 'description' },
        { title: 'Datos de prueba', dataIndex: 'test_data', key: 'test_data' },
        { title: 'Resultado esperado', dataIndex: 'expected_result', key: 'expected_result' },
        { title: 'Resultado', dataIndex: 'actual_result', key: 'actual_result' },
        {title: 'Tipo de ejecución', dataIndex: 'execution_type', key: 'execution_type',
            render: (_,record) => (
                <>{record.execution_type === 'm' ? 'Manual' : 'Automatica'}</>
            ),
        },
        {
            title: 'Estado',
                key: 'status',
                dataIndex: 'status',
                render: (_:any, record: ITestCase) => (
                <>
    
                <Select
                    value={record.status}
                    style={{ width: 120 }}
                    onChange={(v)=>changeSelect(v, record)}
                    options={[
                        { value: 'p', label: <Tag color='gray'>pendiente</Tag> },
                        { value: 's', label: <Tag color='green'>Éxito</Tag> },
                        { value: 'f', label: <Tag color='red'>Falló</Tag> },
                    ]}
                    />
                </>
                ),
        },
        {
            title: 'Acciones',
            dataIndex: 'acciones',
            render: (_: string, record:ITestCase) => (
            <Space>
                <Tooltip title="Historial de ejecuciones">
                    <Button  onClick={() => executionHistory(record)} type='default' shape="circle" icon={<FileOutlined />} />
                </Tooltip>
                <Tooltip title="Agregar bug o defecto">
                    <Button  onClick={() => bug(record)} style={{color: 'gray'}} shape="circle" icon={<DislikeFilled />} />
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

        const changeSelect = async(value:string, record: ITestCase) => {
            Swal.fire({
                title: 'Esta seguro de cambiar estado registro '+record.name+' ?',
                inputLabel: 'Digite resultado',
                input: "text",
                inputValue: record.actual_result,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                preConfirm : async(v) => {
                    if(!v && value !== 'p') {
                        notificationMessage('error','Error','Por favor, digite un resultado');
                        return false;
                    }
                    record.actual_result = v;
                }
              }).then(async(result) => {
                console.log(result)
                if(result.isConfirmed){
                    const values = {
                        ...record,
                        status: value
                    }
                    const resp = await update(values);
                    if(resp) getAll(record.scenario_id);
                }
            })
        }

        const edit = (record: ITestCase) =>{
            setFormData(record);
            setVisible(true);
        }

        const removeItem = (record: ITestCase) =>{
            Swal.fire({
                title: 'Digite resultado de la prueba',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar'
              }).then(async(result) => {
                if(result.isConfirmed){
                  const resp = await remove(record.id);
                  if(resp) getAll(item.id);
                }
              })
        }

        const _new = () => {
            setFormData({...initialState,scenario_id: item.id});
            setVisible(true);
        }

          //salir de modal evaluar si es cancelar o registro exitoso
        const onFinish = (success:boolean) => {
            console.log("onfinsh");
            setVisible(false);
            setFormData(initialState);
            if(success) getAll(item.id)
        }

        //ver historial de jecuciones
        const executionHistory = (record: ITestCase) => {

        }

        const bug = async(record: ITestCase) => {
            setTestCase(record);
            setIsModalOpen(true);
        }

        const handleOk = () => {
            setIsModalOpen(false);
        };
        
          const handleCancel = () => {
            setIsModalOpen(false);
        };
        
  
  return (
    <div>
            <Modal width={1400} title={"Bugs o defectos "+testcase?.name} open={isModalOpen} footer={false} onCancel={handleCancel}>
                <DefectIndex testcase={testcase} />
            </Modal>

            <CreateOrEdit 
                visible={visible}
                onFinish={onFinish}
                formData={formData}
            />

            <Row>
                <Space>
                    <Button onClick={()=>_new()} size='small' type='primary' icon={<PlusCircleFilled />}> Nuevo</Button>
                </Space>
            </Row>
            <Table
                    rowKey="id" 
                    columns={columns}
                    loading={loading}
                    size='small'
                    dataSource={items}
                    scroll={{x:20}}
            />
       
    </div>
  )
}
