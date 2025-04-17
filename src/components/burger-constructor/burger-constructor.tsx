import { FC, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  removeBurgerIngredient,
  makeOrder,
  setOrderNumber,
  setOrderData
} from '../../services/reducers/burgerReducer';
import { RootState, useSelector, useDispatch } from '../../services/store';
import { orderBurgerApi } from '@api';
import { unwrapResult } from '@reduxjs/toolkit';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const constructorItems = useSelector(
    (state: RootState) => state.burger.constructorItems
  );
  const orderRequest = useSelector(
    (state: RootState) => state.burger.orderRequest
  );
  const orderModalData = useSelector(
    (state: RootState) => state.burger.orderModalData
  );

  const navigate = useNavigate();
  const isAuthenticated = !!useSelector((state: RootState) => state.auth.user);

  const onOrderClick = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/order' } });
      return;
    }

    if (constructorItems.ingredients.length === 0)
      return console.log('Вы не добавили ингредиенты');

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (item: TConstructorIngredient) => item._id
      ),
      constructorItems.bun._id
    ];

    try {
      const resultAction = await dispatch(makeOrder(ingredientIds));
      const order = unwrapResult(resultAction);
      dispatch(setOrderData(order));
    } catch (error) {
      console.log(error);
    }
  };

  const closeOrderModal = () => {
    dispatch(setOrderData(null));
  };

  const handleRemoveIngredient = (index: number) => {
    dispatch(removeBurgerIngredient(index));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      onRemoveIngredient={handleRemoveIngredient}
    />
  );
};
