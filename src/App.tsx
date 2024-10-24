import React from 'react';
import { DefaultPage } from './pages/DefaultPage';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth/AuthContext';
import { UIProvider } from './context/UIContext';
import { ProjectProvider } from './context/project/ProjectContext';

function App() {
  return (
    <BrowserRouter>
    <UIProvider>
      
    <AuthProvider>
      <ProjectProvider>
        <DefaultPage />
      </ProjectProvider>
      </AuthProvider>
    </UIProvider>
    </BrowserRouter>
  );
}

export default App;
