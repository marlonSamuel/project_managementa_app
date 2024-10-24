import React, { useContext, useEffect, useState } from 'react'
import { ProjectContext } from '../../context/project/ProjectContext'
import { Descriptions, Progress } from 'antd';
import { MetricTask, MetricTest } from '../../interfaces/IApp';

export const InfoProject = () => {

    const {project, getMetrics, metrics} = useContext(ProjectContext);
    const [tasks, setTasks] = useState<MetricTask>();
    const [test, setTests] = useState<MetricTest>();
    const [progress, setProgress] = useState<any>();

    useEffect(()=>{
        if(project) getMetrics(project.id);
    },[])

    useEffect(() => {
        if(project) getMetrics(project.id);
      }, [project])
    
      useEffect(() => {
        if(metrics.tasks.length > 0){
          setTasks(metrics.tasks[0]);
        }
        if(metrics.tests.length > 0){
          setTests(metrics.tests[0]);
        }
        _progress();
    }, [metrics])

    const _progress = () => {
        const total = tasks?.total_tasks! + test?.total_cases!
        const completed = Number(tasks?.completed_tasks!) + Number(test?.success_cases!)
        const res = ((completed * 100) / total).toFixed(2);

        setProgress(res);
    }

  return (
    <div>
        <Descriptions title="Detalle">
            <Descriptions.Item label="Nombre">{project?.name}</Descriptions.Item>
            <Descriptions.Item label="Fecha inicio">{project?.start_date}</Descriptions.Item>
            <Descriptions.Item label="Fecha fin">{project?.end_date}</Descriptions.Item>
            <Descriptions.Item label="Ambiente">{project?.enviroment === 'd' ? 'DESARROLLO' : (project?.enviroment==='q' ? 'QA' : 'PRODUCCION')}</Descriptions.Item>
            <Descriptions.Item label="Progreso">
                <Progress percent={progress}  percentPosition={{ align: 'center', type: 'inner' }} size={[200, 15]} />
            </Descriptions.Item>
            <Descriptions.Item label="Descripción">
                {project?.description}
            </Descriptions.Item>
        </Descriptions>
    </div>
  )
}
