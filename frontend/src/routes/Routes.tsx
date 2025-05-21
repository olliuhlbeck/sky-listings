import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/HomePage/HomePage';
import Pagination from '../pages/Pagination/Pagination';
import LoginPage from '../pages/LoginPage/LoginPage';
import BrowseProperties from '../pages/BrowseProperties/BrowseProperties';
import MyProperties from '../pages/MyProperties/MyProperties';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'home', element: <Navigate to='/' /> },
      { path: 'pagination', element: <Pagination /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'browseProperties', element: <BrowseProperties /> },
      { path: 'myProperties', element: <MyProperties /> },
    ],
  },
]);
