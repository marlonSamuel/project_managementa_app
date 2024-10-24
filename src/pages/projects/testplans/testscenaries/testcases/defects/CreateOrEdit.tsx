import { Button, Col, Form, Input, Row, Select, Tag } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useContext, useEffect, useState } from 'react'
import { _IUser, IDefect, ITestCase } from '../../../../../../interfaces/IApp'
import { useUser } from '../../../../../../hooks/useUser';
import { SaveOutlined } from '@ant-design/icons';
import { UIContext } from '../../../../../../context/UIContext';
import { useDefect } from '../../../../../../hooks/useDefect';
const { Option } = Select;

interface IData {
  item: ITestCase | null,
  onFinish: (success: boolean)=> void,
  formData: IDefect
}

export const CreateOrEdit = ({item, onFinish, formData} : IData) => {

  const [form] = Form.useForm();
  const {getAll, items : users} = useUser();
  const {loading} = useContext(UIContext);
  const {create, update} = useDefect();
  
  useEffect(() => {
    getAll()
  }, [])

  useEffect(()=>{
    console.log('tescase: ',item)
  },[item])

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData])

    //pre validación antes de en enviar.
    const validate = () => {
      form.validateFields().then(async(values) => {
        let r = false;
        if(formData.id){
          values = {
            ...values,
            status: formData.status,
            id: formData.id
          }
          r = await update(values);
        }else{
          values.test_case_id = item?.id
          r = await create(values);
        }
        
        if(r){
          form.resetFields();
          onFinish(true);
        }
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
                              name="severity"
                              key="severity"
                              label="Tipo de bug"
                              rules={[
                                  {
                                  required: true,
                                  message: 'tipo de bug es requerido',
                                  },
                              ]}
                              >
                               <Select
                                    options={[
                                        { value: 'l', label: <Tag color='gray'>Bajo</Tag> },
                                        { value: 'm', label: <Tag color='yellow'>Medio</Tag> },
                                        { value: 'h', label: <Tag color='red'>alto</Tag> },
                                        { value: 'c', label: <Tag color='red'>critico</Tag> },
                                    ]}
                              />
                          </Form.Item>
                          </Col>
                </Row>

                <Row gutter={16}>
                  
                    
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

                        <Col className="gutter-row" xs={{span: 24}} lg={{span: 8}}>
                          <Form.Item
                              name="resolve_date"
                              key="resolve_date"
                              label="Fecha de resolución"
                              >
                              <Input type='date' name='resolve_date' />
                          </Form.Item>
                          </Col>

                          <Col className="gutter-row" xs={{span: 24}} lg={{span: 8}}>
                          <Form.Item
                              name="hours"
                              key="hours"
                              label="Tiempo de resolución (horas)"
                              >
                              <Input type='number'/>
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
    </div>
  )
}
