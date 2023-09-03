import { toastError } from './toasts';

export async function handlePromise<T>(promise: Promise<T>, defaultValue?: T) {
  return await Promise.resolve<T>(promise).catch((err) => {
    toastError(err.message);
    return defaultValue;
  });
}
