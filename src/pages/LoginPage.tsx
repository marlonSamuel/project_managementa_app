import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row } from 'antd';

import logo from '../assets/logo.png'; // Asegúrate de que la ruta sea correcta
import fondo from '../assets/fondo.jpg';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/auth/AuthContext';
import Swal from 'sweetalert2';
import Title from 'antd/es/typography/Title';

interface IForm {
    email: string;
    password: string;
}

export const LoginPage = () => {

    const {login, errorMessage, removeError} = useContext(AuthContext);

    useEffect(() => {
        if(errorMessage.length == 0) return;
            Swal.fire('Error', errorMessage,'error');
        removeError();
  
      }, [errorMessage])

    const onFinish = async(data: IForm) => {
        const resp =  await login(data);
    };

    return (
        <div className='main-login'>
        <Row >
            <Col>
            <Card
                size='small'
                style={{ width: 350, padding: 4}}
                cover={
                    <img
                        style={{height: 200}}
                        alt="logo"
                        src={logo}
                    />
                }
            >
                <Title level={5}>INICIA SESIÓN PARA CONTINUAR </Title><hr />
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'el email es requerido!' }]}
                    >
                        <Input type='email' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Constraseña es requerida!' }]}
                    >
                        <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="contraseña"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button style={{width: '100%'}} type="primary" htmlType="submit" className="login-form-button">
                        Ingresar
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            </Col>
        </Row>
        </div>
          
  )
}