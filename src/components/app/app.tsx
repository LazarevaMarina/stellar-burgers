import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
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
import PublicRoute from '../PublicRoute';
import { OrderDetails } from '../order-details';
import { getUserData } from '../../services/reducers/authReducer';
import { fetchOrders } from '../../services/reducers/feedReducer';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const state = location.state as { background?: Location };

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
    dispatch(fetchOrders());
  }, []);

  return (
    <div className='App'>
      <AppHeader />
      {/* Основные маршруты */}
      <Routes location={state?.background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/order/details/:number' element={null} />
        <Route path='*' element={<NotFound404 />} />
        <Route
          path='/login'
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path='/register'
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <ResetPassword />
            </PublicRoute>
          }
        />

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
      </Routes>

      {/* Модальные окна */}
      <Routes>
        <Route
          path='/order/details/:number'
          element={
            <Modal title='' onClose={handleCloseModal}>
              <OrderDetails />
            </Modal>
          }
        />
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
          path='/profile/orders/:number'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Modal
                title={`#${orderData?.number?.toString() || 'Order Info'}`}
                onClose={handleCloseModal}
              >
                <OrderInfo />
              </Modal>
            </ProtectedRoute>
          }
        />
      </Routes>

      {state?.background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Ingredient Details' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
