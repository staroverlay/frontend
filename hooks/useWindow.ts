"use client";

const ThisWindow = typeof window === "undefined" ? null : window;

interface UseWindowHook {
  openAndWaitMessage: (listenerChannel: string) => Promise<any>;
}

export default function useWindow(url: string): UseWindowHook {
  const openAndWaitMessage = (listenerChannel: string): Promise<any> => {
    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=400,height=600`;
    const newWindow = ThisWindow?.open(url, "", params);

    return new Promise((resolve) => {
      ThisWindow?.addEventListener("message", (ev) => {
        const { channel, data } = ev.data;
        if (channel === listenerChannel) {
          newWindow?.close();
          resolve(data);
        }
      });
    });
  };

  return { openAndWaitMessage };
}
