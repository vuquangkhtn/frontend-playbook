import { useState, useEffect } from 'react';

export default function useMediaQuery(query: string): boolean {
  const mediaQueryList = window.matchMedia(query);
  const [matched, setMatch] = useState(!!mediaQueryList.matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const changeHandler = (e: MediaQueryListEvent) => {
      setMatch(mediaQueryList.matches);
    }
    mediaQueryList.addEventListener('change', changeHandler);

    return () => {
      mediaQueryList.removeEventListener('change', changeHandler);
    }
  }, [query]);

  return matched;
}