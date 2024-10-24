import React, { useContext } from 'react'
import { TaskProvider } from '../../../../context/task/TaskContext'
import { TaskIndex } from './TaskIndex'
import { UIContext } from '../../../../context/UIContext'
import { loadingIcon } from '../../../../helpers/shared';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export const TaskMainProvider = () => {
  const {loading} = useContext(UIContext);
  return (
    <Spin spinning={loading} size="large" tip="cargando..." indicator={loadingIcon()}>
      <TaskProvider>
          <TaskIndex />
      </TaskProvider>
    </Spin>
  )
}
