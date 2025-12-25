export default function setCancellableInterval(
  callback: Function,
  delay?: number,
  ...args: Array<any>
): () => void {
  
  const timer = setInterval(callback, delay ?? 0, ...args);

  return () => {
    clearInterval(timer);
  }
}