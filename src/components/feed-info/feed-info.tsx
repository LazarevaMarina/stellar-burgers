import React, { FC, memo } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector, RootState } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = memo(() => {
    const orders = useSelector((state: RootState) => state.feed.orders);
    const total = useSelector((state: RootState) => state.feed.total);
    const totalToday = useSelector((state: RootState) => state.feed.totalToday);

    const readyOrders = getOrders(orders, 'done');
    const pendingOrders = getOrders(orders, 'pending');

    return (
      <FeedInfoUI
        readyOrders={readyOrders.length ? readyOrders : [0]}
        pendingOrders={pendingOrders.length ? pendingOrders : [0]}
        feed={{
          total: total || 0,
          totalToday: totalToday || 0
        }} 
      />
    );
  }
);
