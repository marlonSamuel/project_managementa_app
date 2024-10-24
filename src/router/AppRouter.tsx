import { Route, Routes } from 'react-router-dom';
import { AuthRouter } from './AuthRouter';
import { PrivateRouter } from './PrivateRouter';
import { PublicRouter } from './PublicRouter';
import { HeaderRouter } from './HeaderRouter';
import { IndexPage } from '../pages/projects/IndexPage';
import { useContext } from 'react';
import { AuthContext } from '../context/auth/AuthContext';

export const AppRouter = () => {
    //obtener estado de autenticación.
    const {logged} = useContext(AuthContext);

    return (
        <Routes>
            <Route
                path="/*"
                element={
                    <PublicRouter isAuthenticated={logged}>
                        <HeaderRouter />
                    </PublicRouter>
                }
            />
            <Route
                path="/auth/*"
                element={
                    <PrivateRouter isAuthenticated={logged}>
                        <AuthRouter />
                    </PrivateRouter>
                }
            />

            <Route path="*" element={<IndexPage />} />
        </Routes>
  )
}