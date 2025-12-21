import { useState } from "react";

export default function useCycle<T>(...args: T[]) {
  const [currentIndex, setIndex] = useState(0);

  const changeIndex = () => {
    const newIndex = (currentIndex + 1) % args.length;
    setIndex(newIndex);
  };

  return [args[currentIndex], changeIndex];
}
