import { FC, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { fetchOrderById } from '../../services/reducers/orderReducer';
import { RootState, AppDispatch } from '../../services/store';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { number } = useParams<{ number: string }>();

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderById(number));
    }
  }, [number, dispatch]);

  const orderData = useSelector((state: RootState) => state.order.order);
  const ingredients = useSelector((state: RootState) => state.ingredients.data);

  const date = orderData ? new Date(orderData.createdAt) : new Date();

  type TIngredientsWithCount = {
    [key: string]: TIngredient & { count: number };
  };

  const ingredientsInfo = orderData?.ingredients.reduce(
    (acc: TIngredientsWithCount, item: string) => {
      const ingredient = ingredients.find((ing) => ing._id === item);
      if (ingredient) {
        if (!acc[item]) {
          acc[item] = { ...ingredient, count: 1 };
        } else {
          acc[item].count++;
        }
      }
      return acc;
    },
    {} as TIngredientsWithCount
  ) || {} as TIngredientsWithCount;

  const total = Object.values(ingredientsInfo || {}).reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );

  if (!orderData) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={{ ...orderData, ingredientsInfo, date, total }} />;
};
