import { CheckCircleFilled, ClockCircleFilled, DislikeFilled, DislikeOutlined, FileOutlined, LikeOutlined } from '@ant-design/icons'
import { Card, Col, Divider, Row, Statistic } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { ProjectContext } from '../../../context/project/ProjectContext'
import { UIContext } from '../../../context/UIContext'
import { MetricTask, MetricTest } from '../../../interfaces/IApp'
import { Pie } from '@ant-design/charts';
import { ChartTask } from './ChartTask'
import { ChartTest } from './ChartTest'

export const MetricsIndex = () => {

  const {metrics} = useContext(ProjectContext);
  const {loading} = useContext(UIContext);
  const [tasks, setTasks] = useState<MetricTask>();
  const [test, setTests] = useState<MetricTest>();

  useEffect(() => {
    if(metrics.tasks.length > 0){
      setTasks(metrics.tasks[0]);
    }
    if(metrics.tests.length > 0){
      setTests(metrics.tests[0]);
    }
  }, [metrics])
  
  const total = (...args: number[]): number => {
    console.log(...args)
    return args.reduce((acc, curr) => Number(acc) + Number(curr), 0);
  };

  return (
    <div>
      <Card title="Desarrollo" hoverable loading={loading}>
        <Row gutter={16}>
            <Col xs={{span: 24}} lg={{span: 8}}>
              <Statistic title="TOTAL DE TAREAS" value={tasks?.total_tasks} prefix={<FileOutlined />} />
            </Col>
            <Col xs={{span: 24}} lg={{span: 8}}>
              <Statistic title="TAREAS COMPLETADAS" value={tasks?.completed_tasks} prefix={<CheckCircleFilled style={{color: 'green'}} />} suffix={"/"+tasks?.total_tasks} />
            </Col>
            <Col xs={{span: 24}} lg={{span: 8}}>
              <Statistic title="TAREAS SIN COMPLETAR" value={total(tasks?.inprogress_tasks!, tasks?.pending_tasks!, tasks?.stopped_tasks!)} prefix={<DislikeFilled style={{color: 'red'}} />} suffix={"/"+tasks?.total_tasks} />
            </Col>
        </Row>
        <Row>
          <Col xs={{span: 24}} lg={{span: 12}}>
            <ChartTask />
          </Col>
        </Row>

      </Card>
      <Card title="Control de calidad" hoverable loading={loading}>

      <Row gutter={16}>
            <Col xs={{span: 24}} lg={{span: 6}}>
              <Statistic title="TOTAL DE CASOS DE PRUEBA" value={test?.total_cases} prefix={<FileOutlined />} />
            </Col>
            <Col xs={{span: 24}} lg={{span: 6}}>
              <Statistic title="CASOS DE PRUEBA PENDIENTES" value={test?.pending_cases} prefix={<ClockCircleFilled />} />
            </Col>
            <Col xs={{span: 24}} lg={{span: 6}}>
              <Statistic title="CASOS DE PRUEBA CON EXITO" value={test?.success_cases} prefix={<CheckCircleFilled style={{color: 'green'}} />} />
            </Col>
            <Col xs={{span: 24}} lg={{span: 6}}>
              <Statistic title="CASOS DE PRUEBA FALLIDOS" value={test?.fail_cases} prefix={<DislikeFilled style={{color: 'red'}} />} />
            </Col>
      </Row>
      <Divider />
        <Row gutter={16}>
            <Col xs={{span: 24}} lg={{span: 6}}>
              <Statistic title="TOTAL DE BUGS" value={test?.total_defects} prefix={<DislikeFilled />} />
            </Col>
            <Col xs={{span: 24}} lg={{span: 6}}>
              <Statistic title="BUGS SIN RESOLVER" value={total(test?.pending_defects!, test?.inprogress_defects!, test?.reopens_defects!)} 
                        prefix={<DislikeFilled style={{color: 'red'}} />} suffix={"/ "+test?.total_defects} />
            </Col>
            <Col xs={{span: 24}} lg={{span: 6}}>
              <Statistic title="BUGS RESUELTOS" value={test?.completed_defects} prefix={<CheckCircleFilled style={{color: 'green'}} />} suffix={"/ " +test?.total_defects}/>
            </Col>
        </Row>
        
          <ChartTest />
      </Card>
    </div>
  )
}
