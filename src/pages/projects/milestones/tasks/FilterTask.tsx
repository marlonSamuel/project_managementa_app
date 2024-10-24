import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Input, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useUser } from '../../../../hooks/useUser';
import { ProjectContext } from '../../../../context/project/ProjectContext';
import { getRenderPropValue } from 'antd/es/_util/getRenderPropValue';
import { _IUser } from '../../../../interfaces/IApp';
import { UIContext } from '../../../../context/UIContext';
import { IProject } from '../../../../interfaces/IProject';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../../context/auth/AuthContext';
import { TaskContext } from '../../../../context/task/TaskContext';

const { Option } = Select;

export const FilterTask = () => {
    const { milestone_id } = useParams();

    const [form] = Form.useForm();
    const {loading} = useContext(UIContext);
    const {items: users, getAll: getUsers} = useUser();
    const {items: projects, getAll: getProjects} = useContext(ProjectContext);
    const {user} = useContext(AuthContext);
    const {getByMilestone, getAll, setFilters, filter} = useContext(TaskContext);

    useEffect(() => {
      getUsers();
      getProjects();
      console.log(milestone_id)
    }, [])

    useEffect(()=>{
        if(user?.role === 'admin'){
            if(milestone_id){
                getByMilestone(parseInt(milestone_id));
            }else{
                getAll();
            }
        }
    },[filter])

      //pre validación antes de en enviar.
  const finish = () => {
    const values = form.getFieldsValue();
    setFilters(values);
   
  }
    

    return (
        <div>
            <Form
                layout='inline'
                form={form}
                >
                    {!milestone_id && 
                    <Form.Item name='project_id' style={{width: 300}}>
                        <Select
                                    key='s1'
                                    placeholder="Projecto"
                                    loading={loading}
                                    showSearch
                                    filterOption={(input: any, option: any) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    allowClear
                                    >
                                    {
                                        projects.map((c: IProject) => (
                                        <Option key={c.id} value={c.id}>{c.name}</Option>
                                        ))
                                    }
                                    </Select>
                        </Form.Item>
                    }
                
                <Form.Item style={{width: 300}} name='user_id'>
                        <Select
                            key='s2'
                            placeholder="Usuario"
                            loading={loading}
                            showSearch
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            allowClear
                            >
                            {
                                users.map((c: _IUser) => (
                                <Option key={c.id} value={c.id}>{c.first_name+' '+c.last_name}</Option>
                                ))
                            }
                            </Select>
                </Form.Item>
                <Form.Item>
                    <Button onClick={finish} type="primary" icon={<FilterOutlined />}></Button>
                </Form.Item>
                </Form>
        </div>
    )
}
