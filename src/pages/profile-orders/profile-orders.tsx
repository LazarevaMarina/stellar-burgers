import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { RootState, useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/reducers/ingredientsReducer';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state: RootState) => state.feed.orders);

  const ingredients = useSelector((state: RootState) => state.ingredients.data);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  return <ProfileOrdersUI orders={orders} />;
};
