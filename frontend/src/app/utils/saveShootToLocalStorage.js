// This function saves a new shoot to local storage and updates the Zustand store
import useShootStore from "../store/useShootStore";
import { nanoid } from 'nanoid';

export default async function saveShootToLocalStorage(
  title,
  type,
  checklist,
  template
) {
  try {
    const id = nanoid();
    const newShoot = {
      id,
      title,
      date: new Date().toLocaleDateString(),
      type,
      checklist,
      template,
    };

    const store = useShootStore.getState();
    const savedId = await store.addShoot(newShoot);
    return savedId;
  } catch (error) {
    console.error('Error in saveShootToLocalStorage:', error);
    throw error;
  }
}
