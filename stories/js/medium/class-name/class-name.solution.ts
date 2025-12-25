export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = Array<ClassValue>;

function classNamesUtl(arg: ClassValue): string {
  if (!arg) {
    return '';
  }

  if (typeof arg === 'boolean') {
    return '';
  }

  if (Array.isArray(arg)) {
    let result = '';
    for (let i=0; i<arg.length; i++) {
      const val = classNamesUtl(arg[i]);
      result += val;

      if (val && i !== arg.length-1) {
        result += ' ';
      }
    }

    return result.trim();
  }

  if (typeof arg === 'object') {
    const entries = Object.entries(arg);
    const result = entries.reduce((acc, val) => {
      const [key, value] = val;
      if (value) {
        const strKey = classNamesUtl(key);
        acc += strKey + ' ';
      }

      if (typeof value === 'string') {
        const strVal = classNamesUtl(value);
        acc += strVal + ' ';
      }

      return acc;
    }, '');
    return result.trim();

  }

  return String(arg);
}

export default function classNames(...args: Array<ClassValue>): string {
  return classNamesUtl(args);
}