import { Card, Table, TableProps, Timeline } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { UIContext } from '../../../context/UIContext';
import { IIntegration, IJobStep, IWorkflowJob } from '../../../interfaces/IApp';
import { ProjectContext } from '../../../context/project/ProjectContext';
import { ClockCircleOutlined } from '@ant-design/icons';
import { TimeLineItemProps } from 'antd/es/timeline/TimelineItem';


export const WorkflowIndex = () => {

    const {loading} = useContext(UIContext);
    const {project} = useContext(ProjectContext);
    const [data, setData] = useState<IWorkflowJob[]>([]);   
    const [itemsTimeLine, setItemsTimeLine] = useState([]); 

    useEffect(() => {
      setData(project?.workflow_jobs!)
    }, [project])

    const columns: TableProps<IWorkflowJob>['columns'] = [
        {
          title: 'Nombre del CI',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'ID job',
          dataIndex: 'job_id',
          key: 'job_id',
        },
        {
          title: 'Run id',
          dataIndex: 'run_id',
          key: 'run_id',
        },
        {
            title: 'Nombre del flujo',
            dataIndex: 'workflow_name',
            key: 'workflow_name',
        },
        {
            title: 'Fecha inicio',
            dataIndex: 'started_at',
            key: 'started_at',
        },
        {
            title: 'Fecha termina',
            dataIndex: 'completed_at',
            key: 'completed_at',
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Conclusión',
            dataIndex: 'conclusion',
            key: 'conclusion',
        },
        {
            title: 'Url del commit',
            dataIndex: 'commitUrl',
            key: 'commitUrl', 
            render: (_: string, record:IWorkflowJob) => (
                <a href={record.html_url} target='blank'>ver flujo</a>
              )  
        }
    ];

    const setItems = (records: IJobStep[] = []) => {
        
        const items: TimeLineItemProps[] = [];
    
        if (!Array.isArray(records)) {
            console.error("Expected 'records' to be an array");
            return items; // Devuelve un arreglo vacío si records no es un arreglo
        }
    
        records.forEach(record => {
            const _rec = {
                dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
                color: record.conclusion === 'failure' ? 'red' : 'blue',
                children: <>
                    <p>nombre: {record.name}</p>
                    <p>estado: {record.status}</p>
                    <p>conclusion: {record.conclusion}</p>
                    <p>inicio: {record.started_at}</p>
                    <p>completado: {record.completed_at}</p>
                </>,
            };
            items.push(_rec);
        });
    
        return items;
    };

  return (
    <div>
        <Table<IWorkflowJob> 
            loading={loading}  
            scroll={{x:20}} size="small" 
            columns={columns} dataSource={data} 
            expandable={{
                expandedRowRender: record => 
                      <Card style={{border: '1px solid blue', marginLeft: 40}} title="Detalle de pasos">
                        <Timeline
                            items={setItems(JSON.parse(record.steps))}
                        >

                        </Timeline>
                      </Card>
                }}
            />
    </div>
  )
}
