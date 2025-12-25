function camelize(str) {
  return str.toLowerCase()
    .replace(/([-_][a-z0-9])/g, (group) =>
    {
      return group
        .toUpperCase()
        .replace(/[-_]/g, '')
    }
    );
}

export default function camelCaseKeys(object: object): object {
  if (Array.isArray(object)) {
    return object.map((item) => camelCaseKeys(item));
  }

  if (typeof object !== 'object' || object === null) {
    return object;
  }

  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      camelize(key),
      camelCaseKeys(value),
    ]),
  );
}