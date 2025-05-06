import ingredientsReducer from '../ingredientsReducer'
import { fetchIngredients } from '../ingredientsReducer'

describe('ingredientsReducer', () => {
  const initialState = {
    data: [],
    isLoading: false,
    error: null,
  }

  it('должен установить isLoading: true при fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type }
    const state = ingredientsReducer(initialState, action)
    expect(state.isLoading).toBe(true)
    expect(state.error).toBe(null)
  })

  it('должен записать данные при fetchIngredients.fulfilled', () => {
    const mockIngredients = [
      { _id: '1', name: 'Булка', type: 'bun', price: 100 },
      { _id: '2', name: 'Соус', type: 'sauce', price: 50 }
    ]
    const action = { type: fetchIngredients.fulfilled.type, payload: mockIngredients }
    const state = ingredientsReducer(initialState, action)
    expect(state.data).toEqual(mockIngredients)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBe(null)
  })

  it('должен записать ошибку при fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      payload: 'Ошибка загрузки'
    }
    const state = ingredientsReducer(initialState, action)
    expect(state.error).toBe('Ошибка загрузки')
    expect(state.isLoading).toBe(false)
  })
})
