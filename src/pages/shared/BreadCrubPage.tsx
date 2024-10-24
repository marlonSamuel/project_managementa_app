import { BarChartOutlined, HomeOutlined } from '@ant-design/icons'
import { Breadcrumb } from 'antd'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UIContext } from '../../context/UIContext'

//interface con atributos para el breadcrub
export interface IBreadCrub {
    path: string,
    key: string,
    name: string,
    last: boolean,
    icon: any
}

export const BreadCrubPage = () => {
    //importar routes desde el context ui
    const {routesBC} = useContext(UIContext);
    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item key='dashboard'>
                    <BarChartOutlined />
                    <Link to='/'>Dashboard</Link>
                </Breadcrumb.Item>
                {routesBC.map(x => (
                    !x.last ?
                    <Breadcrumb.Item key={x.key}>
                        {x.icon}
                        <Link to={x.path}>{x.name}</Link>
                    </Breadcrumb.Item>
                    :
                    <Breadcrumb.Item key={x.key}>
                        {x.icon} {x.name}
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
        </div>
    
    )
}