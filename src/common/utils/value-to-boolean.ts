export const valueToBoolean = (value: unknown) => {
  if (value === null || value === undefined) {
    return;
  }
  if (typeof value !== 'string') {
    return Boolean(value);
  }
  if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
    return true;
  }
  if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
    return false;
  }
  return;
};
