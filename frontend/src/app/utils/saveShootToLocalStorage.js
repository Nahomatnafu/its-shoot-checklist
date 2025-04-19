// This function saves a new shoot to local storage and updates the Zustand store
import useShootStore from "../store/useShootStore";
import { nanoid } from 'nanoid';

export default function saveShootToLocalStorage(
  title,
  type,
  checklist,
  template
) {
  const id = nanoid();
  const newShoot = {
    id,
    title,
    date: new Date().toLocaleDateString(),
    type,
    checklist,
    template,
  };

  const store = useShootStore.getState(); // Access Zustand outside React

  store.addShoot(newShoot); // Add to Zustand + localStorage
  return id;
}
