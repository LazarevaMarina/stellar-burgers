import burgerReducer, {
    addBurgerIngredient,
    clearConstructorItems,
    removeBurgerIngredient,
    moveIngredientUp,
    moveIngredientDown
} from '../burgerReducer';
import { nanoid } from 'nanoid';
import { TIngredient } from '../../../utils/types';

type TConstructorIngredient = TIngredient & { uniqueId: string };
  
describe('burgerReducer', () => {
    const initialState = {
        constructorItems: {
            bun: null,
            ingredients: [],
        },
        orderRequest: false,
        orderModalData: null,
        orderNumber: null,
    };
  
    const bun: TIngredient = {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 10,
        fat: 10,
        carbohydrates: 20,
        calories: 200,
        price: 100,
        image_mobile: '',
        image_large: '',
        image: '',
    };
  
    const sauce: TIngredient = {
        _id: '2',
        name: 'Соус',
        type: 'sauce',
        proteins: 5,
        fat: 5,
        carbohydrates: 10,
        calories: 100,
        price: 50,
        image_mobile: '',
        image_large: '',
        image: '',
    };
  
    it('должен сохранить булку, если добавлен ингредиент типа "bun"', () => {
        const state = burgerReducer(
          initialState,
          addBurgerIngredient({ ...bun, uniqueId: nanoid() } as TConstructorIngredient)
        );
      
        expect(state.constructorItems.bun).toMatchObject(bun);
        expect(state.constructorItems.ingredients).toEqual([]);
    });
  
    it('должен очищать конструктор по clearConstructorItems', () => {
      const filledState = {
        ...initialState,
        constructorItems: {
          bun,
          ingredients: [{ ...sauce, uniqueId: 'id1' }],
        },
      };
      const state = burgerReducer(filledState, clearConstructorItems());
      expect(state.constructorItems).toEqual({ bun: null, ingredients: [] });
    });

    it('должен удалить ингредиент по индексу', () => {
        const filledState = {
          constructorItems: {
            bun: null,
            ingredients: [
              { ...sauce, uniqueId: '1' },
              { ...sauce, uniqueId: '2' },
              { ...sauce, uniqueId: '3' }
            ]
          },
          orderRequest: false,
          orderModalData: null,
          orderNumber: null
        };
      
        const state = burgerReducer(
          filledState,
          removeBurgerIngredient(1)
        );
      
        expect(state.constructorItems.ingredients).toEqual([
          { ...sauce, uniqueId: '1' },
          { ...sauce, uniqueId: '3' }
        ]);
      });

      it('должен переместить ингредиент вверх по индексу', () => {
        const filledState = {
          ...initialState,
          constructorItems: {
            bun: null,
            ingredients: [
              { ...sauce, uniqueId: '1' },
              { ...sauce, uniqueId: '2' },
              { ...sauce, uniqueId: '3' },
            ],
          },
        };
      
        const state = burgerReducer(
          filledState,
          moveIngredientUp({ index: 2 }) // перемещаем элемент с индексом 2 на индекс 1
        );
      
        expect(state.constructorItems.ingredients).toEqual([
          { ...sauce, uniqueId: '1' },
          { ...sauce, uniqueId: '3' },
          { ...sauce, uniqueId: '2' },
        ]);
      });
    
      it('должен переместить ингредиент вниз по индексу', () => {
        const filledState = {
          ...initialState,
          constructorItems: {
            bun: null,
            ingredients: [
              { ...sauce, uniqueId: '1' },
              { ...sauce, uniqueId: '2' },
              { ...sauce, uniqueId: '3' },
            ],
          },
        };
      
        const state = burgerReducer(
          filledState,
          moveIngredientDown({ index: 0 }) // перемещаем первый элемент вниз
        );
      
        expect(state.constructorItems.ingredients).toEqual([
          { ...sauce, uniqueId: '2' },
          { ...sauce, uniqueId: '1' },
          { ...sauce, uniqueId: '3' },
        ]);
      });
  });
