import { LockOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Row, Layout } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useContext } from 'react'
import { AuthContext } from '../../context/auth/AuthContext';
import { useUser } from '../../hooks/useUser';
import { _IUser } from '../../interfaces/IApp';

export const UpdatePassword = () => {
    const [form] = Form.useForm();
    const {user} = useContext(AuthContext);
    const {UpdatePassword} = useUser();

        //pre validación antes de en enviar.
        const validate = () => {
            form.validateFields().then(async(values) => {
                UpdatePassword({id: user?.id, password: values.password});
            }).catch(e=>{
        
            });
        }
  return (
    <div>

        <Title level={2}>ACTUALIZAR CONTRASEÑA</Title>
        <Divider style={{  borderColor: '#1677ff' }}></Divider>

        <Form
          form={form}
          key="form"
          layout="horizontal"
          name="form_in_modal"
          size='small'
        >
            <Row gutter={24}>
                        <Col className="gutter-row" xs={{span: 24}} lg={{span: 9}}>
                        <Form.Item
                                name="password"
                                key="password"
                                label="Contraseña"
                                rules={[{ required: true, message: 'Constraseña es requerida!' }, {min: 6, message: 'La contraseña debe tener al menos 6 caracteres'}]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="contraseña"
                                />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" xs={{span: 24}} lg={{span: 9}}>
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
                        <Col className="gutter-row" xs={{span: 24}} lg={{span: 6}}>
                            <Button
                                    key="save"
                                    size='small'
                                    onClick={validate}
                                    icon={<SaveOutlined />}
                                    type='primary'// Aquí usamos float para alinear a la derecha
                                >
                                    Cambiar
                            </Button>
                        </Col>
            </Row>
        </Form>
    </div>
  )
}
