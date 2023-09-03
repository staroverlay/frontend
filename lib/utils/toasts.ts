import { toast, ToastOptions, ToastPromiseParams } from 'react-toastify';

const DEFAULT: ToastOptions = {
  position: 'bottom-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  theme: 'dark',
};

export function toastPending<T>(
  promise: Promise<T> | (() => Promise<T>),
  messages: ToastPromiseParams<T, string, unknown>,
): Promise<T | null> {
  if (!messages.error) {
    messages.error = {
      render: ({ data }: any) => {
        return data?.message || 'Unknown error';
      },
    };
  }

  return toast
    .promise(promise, messages, {
      ...DEFAULT,
    })
    .catch(() => null);
}

export function toastError(message: string) {
  return toast.error(message, {
    ...DEFAULT,
  });
}

export function toastSuccess(message: string) {
  return toast.success(message, {
    ...DEFAULT,
  });
}
