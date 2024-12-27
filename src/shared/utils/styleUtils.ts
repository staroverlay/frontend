export function cn(
  ...inputs: (
    | string
    | undefined
    | null
    | { [key: string]: string }
    | string[]
  )[]
) {
  return inputs
    .filter(Boolean)
    .filter((className, i, arr) => {
      const lastIndex = arr.lastIndexOf(className);
      return i === lastIndex;
    })
    .map((className) =>
      typeof className === 'string'
        ? className
        : Object.values(className || {}).join(' '),
    )
    .join(' ');
}
