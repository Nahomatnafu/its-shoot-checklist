// This function saves a new shoot to local storage and updates the Zustand store
import useShootStore from "../store/useShootStore";

// Simple short ID generator (e.g., "abc1234")
const generateId = () => Math.random().toString(36).substring(2, 10);

export default function saveShootToLocalStorage(
  title,
  type,
  checklist,
  template
) {
  const id = generateId();
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
