import { Card, Col, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { Column, Bar } from '@ant-design/charts';
import { ProjectContext } from '../../../../context/project/ProjectContext';
import { MetricTask } from '../../../../interfaces/IApp';
import { UIContext } from '../../../../context/UIContext';

const predefinedColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#87ceeb']

export const ProjectTaskChart = () => {
  const {loading} = useContext(UIContext);
    const {metrics} = useContext(ProjectContext);

    const [data, setData] = useState<MetricTask[]>([]);

    useEffect(() => {
        const convertedData = metrics.tasks.map(task => ({
            ...task,
            total_hours: Number(task.total_hours), // Convierte total_hours a Number
            total_tasks: Number(task.total_tasks)
          }));

          setData(convertedData)
          console.log(data)

    }, [metrics]);

    const colors = data.map((_, index) => predefinedColors[index % predefinedColors.length]);
  
    const config = {
        data: data,
        width: 800,
        height: 400,
        autoFit: false,
        xField: 'name',
        yField: 'total_tasks',
        point: {
          size: 5,
          shape: 'diamond',
        },
        label: {
          style: {
            fill: 'black',
          },
        },
    };
  

  return (
    <div>
       <Row>
            <Col xs={{span: 24}} lg={{span: 12}}>
                <Card title="TOTAL DE TAREAS" hoverable loading={loading}>
                    <Column {...config}/>
            </Card>
          </Col>
          <Col xs={{span: 24}} lg={{span: 12}}>
                <Card title="TOTAL DE HORAS EN TAREAS" hoverable loading={loading}>
                    <Column {...{...config, yField: 'total_hours'}}/>
            </Card>
          </Col>
        </Row>
    </div>
  )
}
