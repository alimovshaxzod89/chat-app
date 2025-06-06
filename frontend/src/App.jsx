import React, { useEffect } from 'react';
import {createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import {Loader} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore.js';
import { useThemeStore } from './store/useThemeStore.js';
import RootLayout from './layout/RootLayout';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();

  console.log(onlineUsers);
  

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth) return(
    <div className='flex justify-center items-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  )
  

  const router = createBrowserRouter([
    { 
      path: '/',
      element: <RootLayout />,
      children: [
        { path: '/', element: authUser ?  <HomePage /> : <Navigate to="/login" /> },
        { path: '/signup', element: !authUser ?  <SignUpPage /> : <Navigate to="/" /> },
        { path: '/login', element: !authUser ?  <LoginPage /> : <Navigate to="/" /> },
        { path: '/settings', element: authUser ? <SettingsPage /> : <Navigate to="/login" /> },
        { path: '/profile', element: authUser ?  <ProfilePage /> : <Navigate to="/login" /> },
      ],
    },
    
  ]);
  return (
    <div data-theme={theme}>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
};

export default App;
