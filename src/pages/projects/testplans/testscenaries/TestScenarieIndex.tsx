import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { UIContext } from '../../../../context/UIContext';
import { DeleteOutlined, EditOutlined, FileOutlined, HomeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { ProjectContext } from '../../../../context/project/ProjectContext';
import { BreadCrubPage } from '../../../shared/BreadCrubPage';
import Title from 'antd/es/typography/Title';
import { Button, Card, Divider, Row, Select, Space, Table, Tag, Tooltip } from 'antd';
import { useTestScenarie } from '../../../../hooks/useTestScenarie';
import { ITestScenarie } from '../../../../interfaces/IApp';
import { TableProps } from 'antd/lib';
import Swal from 'sweetalert2';
import { CreateOrEdit } from './CreateOrEdit';
import { useTestPlan } from '../../../../hooks/useTestPlan';
import { TestCaseIndex } from './testcases/TestCaseIndex';
import { AuthContext } from '../../../../context/auth/AuthContext';

const initialState : ITestScenarie = {
    id: 0,
    testplan_id: 0,
    name: '',
    description: '',
    status: 'p'
  }
  

export const TestScenarieIndex = () => {
    const history = useNavigate();

    const {setRoutesBC,loading} = useContext(UIContext);
    const {project, getById: getProject} = useContext(ProjectContext);
    const { user } = useContext(AuthContext);
    const {getAll, remove, update, items} = useTestScenarie();
    const {item, getById} = useTestPlan();

    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState<ITestScenarie>(initialState);

    const { testplan_id } = useParams();

    useEffect(() => {
        getAll(parseInt(testplan_id!));
        getById(parseInt(testplan_id!));

      }, [testplan_id]);

      useEffect(() => {
        if(user?.role !== 'admin' && item){
          console.log(item)
          getProject(item?.project_id!)
        }
      }, [item]);


    useEffect(()=>{
      if(user?.role === 'admin'){
          setRoutesBC([
            {path: '/projects', key: 'project',name: 'Proyectos',last: false, icon: <HomeOutlined />},
            {path: '/projects/subitems', key: 'project-name', name: project?.name!, last: false, icon: <FileOutlined />},
            {path: '#', key: 'test-plan', name: 'Plan de pruebas', last: true, icon: <FileOutlined />},
        ])
      }else{
        setRoutesBC([
          {path: '/test-plan', key: 'test-plan', name: 'Mis planes de prueba', last: false, icon: <FileOutlined />},
          {path: '#', key: 'test-plan', name: 'Plan de prueba', last: true, icon: <FileOutlined />},
      ])
      }
        
    },[item]);

      //columnas para mostrar en datatable
  const columns: TableProps<ITestScenarie>['columns']  = [
    { title: 'Nombre', 
      dataIndex: 'name', 
      key: 'name'},
    { title: 'Descripción', dataIndex: 'description', key: 'description' },
    {
      title: 'Estado',
          key: 'status',
          dataIndex: 'status',
          render: (_:any, record: ITestScenarie) => (
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
      render: (_: string, record:ITestScenarie) => (
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

  const selectTestScenearie = (milestone: ITestScenarie) => {
    
  }

  //salir de modal evaluar si es cancelar o registro exitoso
  const onFinish = (success:boolean) => {
    console.log("onfinsh");
    setVisible(false);
    setFormData(initialState);
    if(success) getAll(parseInt(testplan_id!));
  }

  const changeSelect = async(value: string, item: ITestScenarie) => {
    const values = {
        ...item,
        status: value
    }
    const resp = await update(values);
    if(resp) getAll(parseInt(testplan_id!));
}

  //función para mandar abrir el modal en modo edición
  const edit = (record: ITestScenarie) => {
    setFormData(record);
    setVisible(true);
  }

  //función para remover registro
  const removeItem = (record:ITestScenarie) => {
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
        if(resp) getAll(parseInt(testplan_id!));
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
            <BreadCrubPage />
            <Title level={5}>PROYECTO: {project?.name}</Title>
            <Title style={{margin: 0}} level={5}>PLAN DE PRUEBAS: {item?.name}</Title>
            <Divider style={{  borderColor: '#1677ff' }}>
            <Title  style={{margin: 0}} level={4}>LISTA DE ESCENARIOS DE PRUEBA</Title></Divider>

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
                    expandable={{
                        expandedRowRender: record => 
                              <Card style={{border: '1px solid blue', marginLeft: 40}} title="Casos de prueba">
                                <TestCaseIndex item={record!} />
                              </Card>,
                              expandedRowKeys: expandedRowKeys, // Controla las filas expandidas
                              onExpand: handleExpand // Manejador para actualizar el estado
                        }}
                    />

        </div>
    )
}
