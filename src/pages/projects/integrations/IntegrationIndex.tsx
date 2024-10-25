import { Button, Divider, Progress, Select, Space, Table, TableProps, Tag, Tooltip } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { UIContext } from '../../../context/UIContext';
import { IIntegration } from '../../../interfaces/IApp';
import { ProjectContext } from '../../../context/project/ProjectContext';

export const IntegrationIndex = () => {

    const history = useNavigate();

    const [visible, setVisible] = useState(false);
    const {loading} = useContext(UIContext);
    const {project} = useContext(ProjectContext);
    const [data, setData] = useState<IIntegration[]>([]);    

    useEffect(() => {
      setData(project?.integrations!)
    }, [project])

    const columns: TableProps<IIntegration>['columns'] = [
        {
          title: 'Nombre repositorio',
          dataIndex: 'repositoryName',
          key: 'repositoryName',
        },
        {
          title: 'Push user',
          dataIndex: 'pusherName',
          key: 'pusherName',
        },
        {
          title: 'Mensaje del commit',
          dataIndex: 'commitMessage',
          key: 'commitMessage',
        },
        {
            title: 'ID Commit',
            dataIndex: 'commitId',
            key: 'commitId',
        },
        {
            title: 'Fecha del commit',
            dataIndex: 'commitTimestamp',
            key: 'commitTimestamp',
            width: '15%'
        },
        {
            title: 'Url del commit',
            dataIndex: 'commitUrl',
            key: 'commitUrl', 
            render: (_: string, record:IIntegration) => (
                <a href={record.commitUrl} target='blank'>ver commit</a>
              )  
        }
    ];



  return (
    <div>
        <Table<IIntegration> 
            loading={loading}  
            scroll={{x:20}} size="small" 
            columns={columns} dataSource={data} />
    </div>
  )
}
