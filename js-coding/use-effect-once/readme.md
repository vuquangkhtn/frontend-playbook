# Use Effect Once

Implement a useEffectOnce hook that runs an effect only once.

```js
export default function Component() {
  useEffectOnce(() => {
    console.log('Running effect once on mount');

    return () => {
      console.log('Running clean-up of effect on unmount');
    };
  });

  return null;
}
```

## Arguments
`effect`: The function that will be executed once. This function has the same parameters and behavior as the first argument of useEffect
## Returns
Nothing, just like useEffect.