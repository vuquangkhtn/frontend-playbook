export default function makeCounter(initialValue: number = 0): () => number {
  let counter = initialValue;

  return () => {
    const prevCounter = counter;
    counter = counter + 1;
    
    return prevCounter;
  };
}
