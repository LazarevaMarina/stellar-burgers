import { useSelector, useDispatch } from 'react-redux';
import { FC, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  removeBurgerIngredient,
  makeOrder,
  setOrderNumber
} from '../../services/reducers/burgerReducer';
import { RootState } from '../../services/store';
import { orderBurgerApi } from '@api';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const { constructorItems, orderRequest, orderModalData } = useSelector(
    (state: any) => ({
      constructorItems: state.burger.constructorItems,
      orderRequest: state.burger.orderRequest,
      orderModalData: state.burger.orderModalData
    })
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
    dispatch(makeOrder(ingredientIds) as any);

    try {
      const res = await orderBurgerApi(ingredientIds);
      if (res.success) {
        dispatch(setOrderNumber(res.order.number));
        navigate(`/order/details/${res.order.number}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeOrderModal = () => {}; //вернуться к этому вопросу

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
