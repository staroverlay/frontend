import { toast, ToastOptions, ToastPromiseParams } from "react-toastify";

const DEFAULT: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  theme: "dark",
};

export function toastPending(
  promise: Promise<unknown> | (() => Promise<unknown>),
  messages: ToastPromiseParams<unknown, string, unknown>
) {
  if (!messages.error) {
    messages.error = {
      render: ({ data }: any) => {
        return data?.message || "Unknown error";
      },
    };
  }

  return toast.promise(promise, messages, {
    ...DEFAULT,
  });
}

export function toastError(message: string) {
  return toast.error(message, {
    ...DEFAULT,
  });
}
