import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { RootState } from 'src/services/store';
import { TIngredient } from 'src/utils/types';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>(); // Получение id из маршрута
  const ingredient = useSelector((state: RootState) =>
    state.ingredients.data.find((item: TIngredient) => item._id === id)
  );

  if (!ingredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredient} />;
};
