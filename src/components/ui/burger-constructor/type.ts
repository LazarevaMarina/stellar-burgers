import { TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: any;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onRemoveIngredient: (index: number) => void; 
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
