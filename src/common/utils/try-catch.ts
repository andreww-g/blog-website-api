export const tryCatch = async <T, E = Error>(
  target: Promise<T> | (() => Promise<T>) | (() => T),
): Promise<{ data: T | undefined, error: E | undefined }> => {
  let data, error;

  try {
    data = await (target instanceof Promise ? target : target());
  } catch (_error) {
    error = _error;
  }

  return { data, error };
};
