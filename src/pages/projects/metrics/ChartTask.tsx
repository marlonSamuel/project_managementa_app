import { Card } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { Pie } from '@ant-design/charts';
import { ProjectContext } from '../../../context/project/ProjectContext';

export const ChartTask = () => {

    const {metrics} = useContext(ProjectContext);

    const [data, setData] = useState<any>([])

      useEffect(() => {
        if(metrics.tasks.length > 0){
          setData([
            {type: "Pendientes", tareas: Number(metrics.tasks[0].pending_tasks)},
            {type: "En progreso", tareas: Number(metrics.tasks[0].inprogress_tasks)},
            {type: "Completadas", tareas: Number(metrics.tasks[0].completed_tasks)},
            {type: "Detenidas", tareas: Number(metrics.tasks[0].stopped_tasks)}
          ])
        }
        if(metrics.tests.length > 0){
          
        }
      }, [metrics])
  
      const config = {
        appendPadding: 10,
        data,
        angleField: 'tareas',
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
        <Card title="TAREAS">
              <Pie {...config}/>
        </Card>
    </div>
  )
}
