import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'src/services/store';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState } from 'react';
import { getFeedsApi } from '../../utils/burger-api';
import { fetchFeeds } from '../../services/reducers/feedReducer';

export const Feed: FC = () => {
  const dispatch: AppDispatch = useDispatch();

  // Загрузка заказов при монтировании компонента
  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const orders: TOrder[] = useSelector((state: RootState) => state.feed.orders);
  const isLoading = useSelector((state: RootState) => state.feed.isLoading);

  if (isLoading) {
    return <Preloader />;
  }
  // Функция для обновления заказов
  const handleGetAllFeeds = () => {
    dispatch(fetchFeeds());
  };

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        handleGetAllFeeds();
      }}
    />
  );
};
