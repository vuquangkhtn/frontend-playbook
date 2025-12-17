import { useState } from "react";

export interface UseSetReturn<T> {
  set: Readonly<Set<T>>;
  add: (key: T) => void;
  remove: (key: T) => void;
  toggle: (key: T) => void;
  reset: () => void;
  clear: () => void;
}

export default function useSet<T>(
  initialState = new Set<T>(),
): UseSetReturn<T> {
  const [store, setStore] = useState(initialState);
  return {
    set: store,
    add: (key: T) => {
      const newStore = new Set(store);
      newStore.add(key);
      setStore(newStore);
    },
    remove: (key: T) => {
      const newStore = new Set(store);
      newStore.delete(key);
      setStore(newStore);
    },
    toggle: (key: T) => {
      const newStore = new Set(store);
      if (newStore.has(key)) {
        newStore.delete(key);
      } else {
        newStore.add(key);
      }
      setStore(newStore);
    },
    reset: () => {
      setStore(initialState);
    },
    clear: () => {
      setStore(new Set());
    },
  };
}
