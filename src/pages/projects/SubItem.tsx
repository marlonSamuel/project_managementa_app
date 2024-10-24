import { Divider, Grid, Tabs, TabsProps } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { MilestoneIndex } from './milestones/MilestoneIndex';
import { TestPlanIndex } from './testplans/TestPlanIndex';
import Title from 'antd/es/typography/Title';
import { ProjectContext } from '../../context/project/ProjectContext';
import { BarChartOutlined, FileOutlined, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { BreadCrubPage } from '../shared/BreadCrubPage';
import { UIContext } from '../../context/UIContext';
import { InfoProject } from './InfoProject';
import { MetricsIndex } from './metrics/MetricsIndex';

const {useBreakpoint} = Grid;

export const SubItem = () => {

  const {project} = useContext(ProjectContext);

  const {setRoutesBC} = useContext(UIContext);

  const [tabPosition, setTabPosition] = useState<TabsProps['tabPosition']>('left');
  const screens = useBreakpoint();

  useEffect(() => {
    // Cambia a posición "top" si el tamaño de pantalla es xs, de lo contrario "left"
    setTabPosition(screens.xs ? 'top' : 'left');
  }, [screens.xs]);

  useEffect(()=>{
    setRoutesBC([
        {path: '/projects', key: 'project',name: 'Proyectos',last: false, icon: <HomeOutlined />},
        {path: '#', key: 'project-name', name: project?.name!, last: true, icon: <FileOutlined />},
    ])
},[project]);

  const onChange = (key: string) => {
    console.log(key)
  }

  const items: TabsProps['items'] = [
    {
      key: 'i',
      label: <span><InfoCircleOutlined /> Información</span>,
      children:<> <Divider style={{  borderColor: '#1677ff' }}>INFORMACION DEL PROYECTO</Divider> <InfoProject/></>,
    },
    {
      key: 'h',
      label: <span><FileOutlined /> Hitos</span>,
      children:<> <Divider style={{  borderColor: '#1677ff' }}>HITOS</Divider> <MilestoneIndex/></>,
    },
    {
      key: 'p',
      label: <span><FileOutlined /> Plan de pruebas</span>,
      children: <> <Divider style={{  borderColor: '#1677ff' }}>PLAN DE PRUEBAS</Divider> <TestPlanIndex/></>,
    },
    {
      key: 'm',
      label: <span><BarChartOutlined /> Métricas</span>,
      children: <> <Divider style={{  borderColor: '#1677ff' }}>METRICAS</Divider> <MetricsIndex/></>,
    }
  ];

  return (
    <div>
        <Title level={2}>{project?.name}</Title>
        
        <BreadCrubPage />
        <Title level={5}>PROYECTO: {project?.name}</Title>
        <Divider style={{  borderColor: '#1677ff' }}></Divider>
        <Tabs 
          tabPosition={tabPosition}
          defaultActiveKey='i'
          items={items} 
          onChange={onChange} />
    </div>
  )
}
