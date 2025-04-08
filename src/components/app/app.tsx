import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ConstructorPage } from '@pages';
import { Feed } from '@pages';
import { Login } from '@pages';
import { Register } from '@pages';
import { ForgotPassword } from '@pages';
import { ResetPassword } from '@pages';
import { Profile } from '@pages';
import { ProfileOrders } from '@pages';
import { IngredientDetails } from '@components';
import { OrderInfo } from '@components';
import { AppHeader } from '@components';
import { Modal } from '@components';
import { NotFound404 } from '@pages';
import { RootState, useDispatch } from '../../services/store';

import ProtectedRoute from '../ProtectedRoute';
import { OrderDetails } from '../order-details';
import { getUserData } from '../../services/reducers/authReducer';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = !!useSelector((state: RootState) => state.auth.user);

  const handleOpenModal = (content: JSX.Element) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    navigate(-1);
  };

  const orderData = useSelector((state: RootState) => state.order.order);

  useEffect(() => {
    dispatch(getUserData());
  }, []);

  return (
    <div className='App'>
      <AppHeader />
      <Routes>
        {/* Основные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* Защищённые маршруты */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />

        {/* Модальные окна */}
        <Route
          path='/feed/:number'
          element={
            <Modal
              title={`#${orderData?.number?.toString() || 'Order Info'}`}
              onClose={handleCloseModal}
            >
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title='Ingredient Details' onClose={handleCloseModal}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <Modal
              title={`#${orderData?.number?.toString() || 'Order Info'}`}
              onClose={handleCloseModal}
            >
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/order/details/:number'
          element={
            <Modal title='' onClose={handleCloseModal}>
              <OrderDetails />
            </Modal>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
