export function checkIsNumber (value: number | undefined): asserts value is number {
  if (typeof value !== 'number') {
    throw new Error('Value is not a number');
  }
}
