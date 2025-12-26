export type ClassValue =
  | ClassArray
  | ClassDictionary
  | Function
  | string
  | number
  | null
  | boolean
  | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = Array<ClassValue>;

function classNamesUtl(set: Set<ClassValue>, arg: ClassValue, forceDelete = false): Set<ClassValue> {
  if (!arg) {
    return set;
  }

  if (typeof arg === 'boolean') {
    return set;
  }

  if (forceDelete) {
    set.delete(arg);
    return set;
  }

  if (typeof arg === 'function') {
    const result = arg();
    return classNamesUtl(set, result);
  }

  if (Array.isArray(arg)) {
    for (let i=0; i<arg.length; i++) {
      set = classNamesUtl(set, arg[i]);
    }

    return set;
  }

  if (typeof arg === 'object') {
    const entries = Object.entries(arg);
    const result = entries.reduce((acc, val) => {
      const [key, value] = val;

      if (typeof value  === 'string') {
        let cur = classNamesUtl(acc, key);
        cur = classNamesUtl(acc, value);
        return cur;
      } else {
        if (value) {
          return classNamesUtl(acc, key);
        } else {
          return classNamesUtl(acc, key, true);
        }
      }
    }, set);
    return result;

  }

  set.add(String(arg));
  return set;
}

export default function classNames(...args: Array<ClassValue>): string {
  return [...(classNamesUtl(new Set(), args).values())].join(' ');
}