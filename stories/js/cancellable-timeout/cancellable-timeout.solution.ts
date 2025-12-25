export default function setCancellableTimeout(
  callback: Function,
  delay?: number,
  ...args: Array<any>
): () => void {
  const timer = setTimeout(callback, delay, ...args);

  return () => {
    clearTimeout(timer)
  }
}