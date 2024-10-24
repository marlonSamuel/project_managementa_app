import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Divider, Form, Input, Row, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { _action, TaskContext } from '../../../../context/task/TaskContext';
import { SaveOutlined } from '@ant-design/icons';
import { AuthContext } from '../../../../context/auth/AuthContext';
import { useUser } from '../../../../hooks/useUser';
import { _IUser } from '../../../../interfaces/IApp';
import { UIContext } from '../../../../context/UIContext';
import { useParams } from 'react-router-dom';
const { Option } = Select;

export const CreateOrEdit = () => {
    const { milestone_id } = useParams();

    const [form] = Form.useForm();
    const {loading} = useContext(UIContext);
    const {task, create, update, getByParent, action} = useContext(TaskContext);
    const {user} = useContext(AuthContext);
    const [sdisabled, setSdisabled] = useState(false);

    const {items : users, getAll : getUsers} = useUser();

    
  useEffect(() => {
    getUsers();
  }, [])

  useEffect(() => {
    console.log(action)
    form.resetFields();
    if(user?.role !== 'admin'){
        if(action === _action.NEW_TASK)  setSdisabled(false);
        if(action === _action.EDIT_TASK)  setSdisabled(false);
        if(action === _action.NEW_SUB_TASK)  setSdisabled(true);
        if(action === _action.EDIT_SUB_TASK)  setSdisabled(true);
    }
    
    if(action === _action.EDIT_TASK ||  action === _action.EDIT_SUB_TASK){
        console.log(task); 
        form.setFieldsValue(task);
    } 
  }, [action, task])
        
  //pre validación antes de en enviar.
  const validate = () => {
    form.validateFields().then(async(values) => {
        if(task){
            values.id = action === _action.NEW_SUB_TASK ? null : task.id
            values.parent_id = action === _action.NEW_SUB_TASK ? task.id : task?.parent_id
            values.status = task.status
            //values.assigned_to = user?.id
        }
        values.milestone_id = milestone_id

        if(action === _action.EDIT_TASK || action === _action.EDIT_SUB_TASK){
            update(values);  
        }else{
            create(values);  
        }

        if(action === _action.NEW_SUB_TASK) form.resetFields();
        
    }).catch(e=>{

    });
  }

    return (
        <div>
            <Form
            form={form}
            key="form"
            layout="vertical"
            name="form_in_modal"
            size='small'
            >
                <Row gutter={16}>
                    <Col className="gutter-row" xs={{span: 24}} lg={{span: 24}}>
                        <Form.Item
                            name="name"
                            key="name"
                            label="Nombre"
                            rules={[
                            {
                                required: true,
                                message: 'el campo nombre es requerido!',
                            },
                            ]}
                        >
                    <Input name='name' />
                    </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col className="gutter-row" xs={{span: 24}} lg={{span: 6}}>
                    <Form.Item
                        name="start_date"
                        key="start_date"
                        label="Fecha de inicio"
                        rules={[
                            {
                            required: true,
                            message: 'el campo fecha de inicio es requerido!',
                            },
                        ]}
                        >
                        <Input type='date' name='start_date' />
                    </Form.Item>
                    </Col>
                    <Col className="gutter-row" xs={{span: 24}} lg={{span: 6}}>
                    <Form.Item
                        name="end_date"
                        key="end_date"
                        rules={[
                            {
                            required: true,
                            message: 'el campo fecha de final es requerido!',
                            },
                        ]}
                        label="Fecha de final"
                        >
                        <Input type='date' name='end_date' />
                    </Form.Item>
                    </Col>

                    <Col className="gutter-row" xs={{span: 24}} lg={{span: 6}}>
                    <Form.Item
                        name="estimated_hours"
                        key="estimated_hours"
                        label="Horas estimadas"
                        rules={[
                            {
                            required: true,
                            message: 'el campo horas estimadas es requerido!',
                            },
                        ]}
                        >
                        <Input type='number'/>
                    </Form.Item>
                    </Col>

                    <Col className="gutter-row" xs={{span: 24}} lg={{span: 6}}>
                    <Form.Item
                        name="hours"
                        key="hours"
                        label="Horas reales"
                        >
                        <Input type='number'/>
                    </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col className="gutter-row" xs={{span: 24}} lg={{span: 16}}>
                        <Form.Item
                            name="description"
                            key="description"
                            label="Descripción"
                            rules={[
                            {
                                required: true,
                                message: 'el campo descripción es requerido!',
                            },
                            ]}
                        >
                            <TextArea rows={3} />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" xs={{span: 24}} lg={{span: 8}}>
                        <Form.Item
                            name="assigned_to"
                            key="assigned_to"
                            label="Asignado a"
                            rules={[
                                {
                                required: true,
                                message: 'asignar usuario es requerido!',
                                },
                            ]}
                            >
                            <Select
                                        key='s1'
                                        disabled = {sdisabled}
                                        placeholder="Asignado a"
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
                        </Col>
                </Row>
                <Button
                    key="save"
                    size='small'
                    onClick={validate}
                    icon={<SaveOutlined />}
                    type='primary'
                    style={{ float: 'right' }} // Aquí usamos float para alinear a la derecha
                >
                    Guardar
            </Button>
            </Form>
            <Divider></Divider>
        </div>
    )
}
