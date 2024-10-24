import { Card, Col, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { Pie } from '@ant-design/charts';
import { ProjectContext } from '../../../context/project/ProjectContext';
import { UIContext } from '../../../context/UIContext';

export const ProjectChart = () => {

    const {metrics, getMetrics} = useContext(ProjectContext);
    const {loading} = useContext(UIContext);

    const [data, setData] = useState<any>([])
    const [dataStatus, setDataStatus] = useState<any>([])

    useEffect(()=>{
      getMetrics(null)
    },[]);


      useEffect(() => {
          setData([
            {label: "Desarrollo", proyectos: Number(metrics.dev)},
            {label: "QA", proyectos: Number(metrics.qa)},
            {label: "Producción", proyectos: Number(metrics.prod)}
          ])

          setDataStatus([
            {label: "Pendientes", proyectos: Number(metrics.pendings)},
            {label: "En progreso", proyectos: Number(metrics.inprogress)},
            {label: "Completados", proyectos: Number(metrics.completed)}
          ])
          console.log(data,'data')
      }, [metrics])

      
  
      const config = {
        appendPadding: 10,
        data,
        angleField: 'proyectos',
        colorField: 'label',
        height: 300,
        radius: 1,
        innerRadius: 0.6,
        label: {
          offset: '-30%',
          content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
          style: {
            fontSize: 14,
            textAlign: 'center',
          },
        },
        interactions: [{ type: 'element-active' }],
      };
      

  return (
    <div>
       <Row>
          <Col xs={{span: 24}} lg={{span: 12}}>
            <Card title="AMBIENTE" loading={loading} hoverable>
                <Pie {...config}/>
          </Card>
          </Col>
          <Col xs={{span: 24}} lg={{span: 12}}>
          <Card title="ESTADO">
                <Pie {...{...config, data: dataStatus}}/>
          </Card>
          </Col>
        </Row>
    </div>
  )
}
