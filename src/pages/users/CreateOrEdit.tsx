import { LoadingOutlined, LockOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import { useContext, useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { UIContext } from '../../context/UIContext';
import { useUser } from '../../hooks/useUser';
import { IUser } from '../../interfaces/IAuth';
import { _IUser } from '../../interfaces/IApp';

const { Option } = Select;


interface IForm {
  visible: boolean,
  onFinish: (success: boolean)=> void,
  formData: _IUser
}

export const CreateOrEdit = ({ visible, onFinish, formData }: IForm) => {

  const [form] = Form.useForm();
  const [title, setTitle] = useState('Nuevo registro');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const {loading} = useContext(UIContext);

  const {items, getAll, create, update, remove} = useUser();

  useEffect(() => {
        getAll();
  }, [])
  

  //evaluando para setear el titulo y la data a editar
  useEffect(() => {
    form.setFieldsValue(formData);
    setTitle( formData.id! > 0 ? 'Editar registro '+formData.first_name+' '+formData.last_name: 'Nuevo registro');
  }, [formData])
  
  const onCreate = async(values: _IUser) => {
    setConfirmLoading(true);
    if(formData.id == 0){
        const resp = await create(values);
        if(resp) onFinish(true);
    }else{
      values = {
        ...values,
        id: formData.id
      }
     const resp = await update(values);
     if(resp) onFinish(true);
    }
    setConfirmLoading(false);
  }
  
  //volver
  const onReturn = () => {
    form.resetFields();
    onFinish(false);
  }

  //pre validación antes de en enviar.
  const validate = () => {
    form.validateFields().then((values) => {
        //form.resetFields();
        onCreate(values);
    }).catch(e=>{

    });
  }

  return (
    
      <Modal
        open={visible}
        width={1200}
        forceRender
        title={title}
        footer={[
          <Spin key="spin" spinning={confirmLoading} size="large" tip="cargando...">
            <Button key="cancel" size='small' onClick={onReturn} icon={<UndoOutlined/>} type='primary' danger>
                  Volver
            </Button>,
            <Button key="save" size='small' onClick={validate} icon={<SaveOutlined/>} type='primary'>
              Guardar
            </Button>,
          </Spin>
        ]}
        onCancel={()=>onFinish(false)}
        onOk={validate}
      >
      
      <Form
          form={form}
          key="form"
          layout="vertical"
          name="form_in_modal"
          size='small'
        >
            <Row gutter={16}>
                <Col className="gutter-row" xs={{span: 24}} lg={{span: 12}}>
                    <Form.Item
                        name="first_name"
                        key="first_name"
                        label="Primer nombre"
                        rules={[
                        {
                            required: true,
                            message: 'el campo primer nombre es requerido!',
                        },
                        ]}
                    >
                <Input name='name' />
                </Form.Item>
                </Col>
                <Col className="gutter-row" xs={{span: 24}} lg={{span: 12}}>
                    <Form.Item
                        name="second_name"
                        key="second_name"
                        label="Segundo nombre"
                    >
                <Input name='second_name' />
                </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col className="gutter-row" xs={{span: 24}} lg={{span: 12}}>
                    <Form.Item
                        name="last_name"
                        key="last_name"
                        label="Primer apellido"
                        rules={[
                        {
                            required: true,
                            message: 'el campo primer apellido es requerido!',
                        },
                        ]}
                    >
                <Input name='name' />
                </Form.Item>
                </Col>
                <Col className="gutter-row" xs={{span: 24}} lg={{span: 12}}>
                    <Form.Item
                        name="second_last_name"
                        key="second_last_name"
                        label="Segundo apellido"
                    >
                <Input name='second_lastname' />
                </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col className="gutter-row" xs={{span: 24}} lg={{span: 12}}>
                    <Form.Item
                        name="email"
                        key="email"
                        label="Correo electronico"
                        rules={[
                        {
                            required: true,
                            message: 'el campo correo electronico es requerido!',
                        },
                        ]}
                    >
                <Input name='name' />
                </Form.Item>
                </Col>
                <Col className="gutter-row" xs={{span: 24}} lg={{span: 12}}>
                    <Form.Item
                        name="birthday"
                        key="birthday"
                        label="Fecha de nacimiento"
                        rules={[
                        {
                            required: true,
                            message: 'La fecha de nacimiento es requerida!',
                        },
                        ]}
                    >
                <Input type='date' />
                </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col className="gutter-row" xs={{span: 24}} lg={{span: 8}}>
                          <Form.Item
                              name="role"
                              key="role"
                              label="Rol"
                              rules={[
                                  {
                                  required: true,
                                  message: 'El campo rol es requerido!!!',
                                  },
                              ]}
                              >
                               <Select
                                    options={[
                                        { value: 'admin', label: "Admin"},
                                        { value: 'dev', label: "Desarrolador" },
                                        { value: 'tester', label: "tester" },
                                    ]}
                              />
                          </Form.Item>
                </Col>

                {
                    !formData.id &&
                    <>
                        <Col className="gutter-row" xs={{span: 24}} lg={{span: 8}}>
                        <Form.Item
                                name="password"
                                key="password"
                                label="Contraseña"
                                rules={[{ required: true, message: 'Constraseña es requerida!' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="contraseña"
                                />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" xs={{span: 24}} lg={{span: 8}}>
                        <Form.Item
                            name="confirmPassword"
                            key="confirmPassword"
                            label="Confirmar contraseña"
                            dependencies={['password']}
                            rules={[
                                {
                                    required: true,
                                    message: '¡Confirme su contraseña!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('¡Las contraseñas no coinciden!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Confirmar contraseña"
                            />
                        </Form.Item>
                        </Col>
                    </>

                }
            </Row>
        </Form>
      
      </Modal>
  )
}
