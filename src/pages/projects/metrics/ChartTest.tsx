import { Card, Col, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { Pie } from '@ant-design/charts';
import { ProjectContext } from '../../../context/project/ProjectContext';

export const ChartTest = () => {

    const {metrics} = useContext(ProjectContext);

    const [data, setData] = useState<any>([])
    const [dataBugs, setDataBugs] = useState<any>([])

      useEffect(() => {
        if(metrics.tests.length > 0){
          setData([
            {type: "Pendientes", casos: Number(metrics.tests[0].pending_cases)},
            {type: "Exito", casos: Number(metrics.tests[0].success_cases)},
            {type: "Fallidos", casos: Number(metrics.tests[0].fail_cases)}
          ])

          setDataBugs([
            {type: "Pendientes", bugs: Number(metrics.tests[0].pending_defects)},
            {type: "En progreso", bugs: Number(metrics.tests[0].inprogress_defects)},
            {type: "Completados", bugs: Number(metrics.tests[0].completed_defects)},
            {type: "Re abiertos", bugs: Number(metrics.tests[0].reopens_defects)}
          ])

        }
      }, [metrics])

      useEffect(() => {
        console.log(data)
      }, [data])
      
  
      const config = {
        appendPadding: 10,
        data,
        angleField: 'casos',
        colorField: 'type',
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
            <Card title="CASOS DE PRUEBA">
                <Pie {...config}/>
          </Card>
          </Col>
          <Col xs={{span: 24}} lg={{span: 12}}>
          <Card title="BUGS">
                <Pie {...{...config, data: dataBugs, angleField: 'bugs'}}/>
          </Card>
          </Col>
        </Row>
    </div>
  )
}
