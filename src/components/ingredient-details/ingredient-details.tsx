import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { fetchIngredients } from '../../services/reducers/ingredientsReducer';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { TIngredient } from 'src/utils/types';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const ingredients = useSelector((state: RootState) => state.ingredients.data);
  const isLoading = useSelector(
    (state: RootState) => state.ingredients.isLoading
  );

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const ingredient = ingredients.find((item: TIngredient) => item._id === id);

  if (!ingredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredient} />;
};
