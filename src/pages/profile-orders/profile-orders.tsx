import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { RootState, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const orders = useSelector((state: RootState) => state.feed.orders);

  return <ProfileOrdersUI orders={orders} />;
};
