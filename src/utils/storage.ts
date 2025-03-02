const STORAGE_KEY = 'draggable-list-items';

export const saveListToStorage = (items: ListItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getListFromStorage = (): ListItem[] | null => {
  try {
    const items = localStorage.getItem(STORAGE_KEY);
    return items ? JSON.parse(items) : null;
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return null;
  }
};