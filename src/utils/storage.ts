export const saveToLocalStorage = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Ошибка сохранения в localStorage', e);
    }
  };
  
  export const loadFromLocalStorage = (key: string) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Ошибка загрузки из localStorage', e);
      return null;
    }
  };
  
  export const removeFromLocalStorage = (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Ошибка удаления из localStorage', e);
    }
  };
  