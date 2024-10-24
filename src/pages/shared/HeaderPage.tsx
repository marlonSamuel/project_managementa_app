import { BarChartOutlined, FileAddOutlined, HomeOutlined, LogoutOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { Avatar, Button, Menu, Tooltip } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import React, { useContext, useEffect, useState } from 'react'
import logo from '../../assets/logo.png'; // Asegúrate de que la ruta sea correcta
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/auth/AuthContext'
import { Link } from 'react-router-dom'

const _items = [
    {key: 0, label: "DASHBOARD", icon: <BarChartOutlined />, path: '/'},
    {key: 1, label: "PROYECTOS", icon: <HomeOutlined />, path: '/projects'},
    {key: 2, label:  "MIS TAREAS", icon: <FileAddOutlined/>, path: '/tasks' },
    {key: 3, label:  "MIS BUGS", icon: <FileAddOutlined/>, path: '/bugs' },
    {key: 4, label:  "MIS PLANES DE PRUEBA", icon: <FileAddOutlined/>, path: '/test-plan' },
    {key: 5, label: "USUARIO", icon: <UsergroupAddOutlined />, path: '/users' },
]

const _itemsQa = [
    {key: 0, label: "DASHBOARD", icon: <BarChartOutlined />, path: '/'},
    {key: 4, label:  "MIS PLANES DE PRUEBA", icon: <FileAddOutlined/>, path: '/test-plan' },
]

const _itemsDev = [
    {key: 0, label: "DASHBOARD", icon: <BarChartOutlined />, path: '/'},
    {key: 2, label:  "MIS TAREAS", icon: <FileAddOutlined/>, path: '/tasks' },
    {key: 3, label:  "MIS BUGS", icon: <FileAddOutlined/>, path: '/bugs' },
]

export const HeaderPage = () => {
    const navigate = useNavigate();

    const {logged, user, logout} = useContext(AuthContext);
    const [items, setItems] = useState<any>(_items);


    useEffect(()=>{
        if(user?.role === 'admin'){
            setItems(_items);
        }
        if(user?.role === 'tester'){
            setItems(_itemsQa);
        }
        if(user?.role === 'dev'){
            setItems(_itemsDev);
        }
    },[user])

        // Maneja el click en el menú para navegar
        const onClick = (e:any) => {
            const selectedItem = items.find((item: any) => item.key === parseInt(e.key));
            if (selectedItem) {
                navigate(selectedItem.path); // Navega a la ruta correspondiente
            }
        };

    return (
        <Header  style={{ alignItems: 'center', display: logged ? 'flex' : 'none' }}>
        <Avatar
                    src={logo}
                    alt="Logo"
                    style={{ height: '50px', width:'50px', marginRight: '16px' }} // Ajusta el tamaño y el margen según sea necesario
                />
            
            <Menu
            theme="dark"
            onClick={onClick}
            mode="horizontal"
            defaultSelectedKeys={['0']}
            items={items}
            style={{ flex: 1, minWidth: 0 }}
            />

            <Title style={{color: 'white', margin: '20px'}} level={5}> <Link style={{color: 'white'}}  to={'/perfil'}>{user?.names+' '+user?.last_names}</Link></Title>
            <Tooltip title="Cerrar sesión"
            >
                <Button type='primary' onClick={logout}
                    icon={<LogoutOutlined />}
                />
            </Tooltip>
            
        </Header>
    )
}
