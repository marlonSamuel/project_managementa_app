import React from 'react'

import { Breadcrumb, Layout, theme } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import { HeaderPage } from './shared/HeaderPage';
import { AppRouter } from '../router/AppRouter';

export const DefaultPage = () => {

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

  return (
    <Layout>
        <HeaderPage />
      <Content style={{ padding: '0 48px' }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
        <AppRouter />  
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Gestión de proyectos ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}
