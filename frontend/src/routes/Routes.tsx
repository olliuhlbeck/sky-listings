import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/HomePage/HomePage';
import LoginPage from '../pages/LoginPage/LoginPage';
import BrowseProperties from '../pages/BrowsePropertiesPage/BrowsePropertiesPage';
import MyProperties from '../pages/MyPropertiesPage/MyPropertiesPage';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import AddProperty from '../pages/AddPropertyPage/AddPropertyPage';
import ProtectedRoute from '../components/AuthComponents/ProtectedRoute';
import ProfilePage from '../pages/ProfilePage/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'home', element: <Navigate to='/' /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'browseProperties', element: <BrowseProperties /> },
      {
        path: 'myProperties',
        element: (
          <ProtectedRoute>
            <MyProperties />
          </ProtectedRoute>
        ),
      },
      {
        path: 'addProperty',
        element: (
          <ProtectedRoute>
            <AddProperty />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profilePage',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <ErrorPage errorCode={404} /> },
    ],
  },
]);
