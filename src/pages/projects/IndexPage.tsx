import { Button, Divider, Grid, Tabs, TabsProps } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useContext, useEffect, useState } from 'react'
import { ListPage } from './ListPage';
import { ProjectContext } from '../../context/project/ProjectContext';
import {  PlusCircleOutlined } from '@ant-design/icons';
import { CreateOrEdit } from './CreateOrEdit';
import { IProject } from '../../interfaces/IProject';
const { useBreakpoint } = Grid;

export const initialState : IProject = {
  id: 0,
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  status: 'd',
  repository_name: '',
  url_repository: ''
}

export const IndexPage = () => {

    // Usamos un estado para manejar el ambiente actual
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState<IProject>(initialState);
    const {getByEnviroment, key, setKey} = useContext(ProjectContext);
    
    const [title, setTitle] = useState<string>("PROYECTOS EN DESARROLLO");

    const [tabPosition, setTabPosition] = useState<TabsProps['tabPosition']>('left');
    const screens = useBreakpoint();

    useEffect(()=>{
      onChange('d');
    },[])
  
    useEffect(() => {
      // Cambia a posición "top" si el tamaño de pantalla es xs, de lo contrario "left"
      setTabPosition(screens.xs ? 'top' : 'left');
    }, [screens.xs]);

    const onChange = (key: string) => {
      if(key==='d') {setKey(key); setTitle("PROYECTOS EN DESARROLLO")};
      if(key==='q') {setKey(key); setTitle("PROYECTOS EN QA")};
      if(key==='p') {setKey(key); setTitle("PROYECTOS EN PRODUCCION")};
      getByEnviroment(key)
    };
  
  const items: TabsProps['items'] = [
    {
      key: 'd',
      label: 'Desarrollo',
      children:<> <Divider style={{  borderColor: '#1677ff' }}>{title}</Divider> <ListPage/></>,
    },
    {
      key: 'q',
      label: 'QA',
      children: <> <Divider style={{  borderColor: '#1677ff' }}>{title}</Divider> <ListPage/></>,
    },
    {
      key: 'p',
      label: 'Producción',
      children: <> <Divider style={{  borderColor: '#1677ff' }}>{title}</Divider> <ListPage/></>,
    },
  ];

  return (
    <div>
      <CreateOrEdit 
            visible={visible}
            onFinish={setVisible}
            formData={formData}
      />

      <Title level={2}>PROYECTOS</Title>
      <Button onClick={()=>{setVisible(true)}} icon={<PlusCircleOutlined />} size='small' type="primary">
          Nuevo 
      </Button>
      <Divider style={{  borderColor: '#1677ff' }}></Divider>
      <Tabs 
        tabPosition={tabPosition}
        activeKey={key}
        items={items} 
        onChange={onChange} />

    </div>
  )
}
