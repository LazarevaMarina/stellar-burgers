import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderDetailsUI } from '@ui';
import { useSelector } from 'react-redux';

export const OrderDetails: FC = () => {
  const orderNumber = useSelector((state: any) => state.burger.orderNumber);

  if (!orderNumber) {
    return <Preloader />;
  }

  return <OrderDetailsUI orderNumber={orderNumber} />;
};
