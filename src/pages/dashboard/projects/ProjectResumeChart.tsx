import { Card, Col, Row, Statistic } from 'antd'
import React, { useContext } from 'react'
import { UIContext } from '../../../context/UIContext'
import { BankFilled } from '@ant-design/icons';
import { ProjectChart } from './ProjectChart';
import { ProjectTaskChart } from './tasks/ProjectTaskChart';
import { ProjectTestChart } from './tests/ProjectTestChart';
import { ProjectContext } from '../../../context/project/ProjectContext';

export const ProjectResumeChart = () => {
    const {loading} = useContext(UIContext);
    const {metrics} = useContext(ProjectContext);

  return (
    <div>
        <Row>
            <Col xs={{span: 24}} lg={{span: 12}}>
                <Card title="PROYECTOS / AMBIENTES" hoverable loading={loading}>
                    <Row gutter={16}>
                        <Col xs={{span: 24}} lg={{span: 8}}>
                            <Statistic title="PROYECTOS EN DESARROLLO" value={metrics.dev} /> 
                        </Col>
                        <Col xs={{span: 24}} lg={{span: 8}}>
                            <Statistic title="PROYECTOS EN QA" value={metrics.qa} /> 
                        </Col>
                        <Col xs={{span: 24}} lg={{span: 8}}>
                            <Statistic title="PROYECTOS EN PRODUCCIÓN" value={metrics.prod} /> 
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col xs={{span: 24}} lg={{span: 12}}>
                <Card title="PROYECTOS / ESTADO" hoverable loading={loading}>
                    <Row gutter={16}>
                        <Col xs={{span: 24}} lg={{span: 8}}>
                            <Statistic title="PROYECTOS PENDIENTES" value={metrics.pendings} /> 
                        </Col>
                        <Col xs={{span: 24}} lg={{span: 8}}>
                            <Statistic title="PROYECTOS EN PROCESO" value={metrics.inprogress} /> 
                        </Col>
                        <Col xs={{span: 24}} lg={{span: 8}}>
                            <Statistic title="PROYECTOS TERMINADOS" value={metrics.completed} /> 
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <ProjectChart />
        <ProjectTaskChart />
        <ProjectTestChart />
       
    </div>
  )
}
