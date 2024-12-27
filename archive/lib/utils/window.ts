export class PopupWindow {
  private readonly url: string;
  private window: Window | null;

  constructor(url: string) {
    this.url = url;
    this.window = null;
  }

  close() {
    if (this.window) {
      this.window.close();
      this.window = null;
    }
  }

  open() {
    this.window = window.open(this.url, '_blank', 'width=480,height=766');
  }

  waitMessage<T>(channel: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      let resolved = false;

      if (!this.window) {
        resolved = true;
        reject('not_opened');
        return;
      }

      setInterval(() => {
        if (resolved) return;

        if (this.window?.closed) {
          this.window = null;
          resolved = true;
          resolve(null);
          return;
        }
      }, 1000);

      const listener = (event: MessageEvent) => {
        if (resolved) return;

        if (event.data.channel === channel) {
          this.window?.removeEventListener('message', listener);
          resolved = true;
          resolve(event.data.data as T);
        }
      };

      window.addEventListener('message', listener);
    });
  }

  async waitMessageAndClose<T>(channel: string): Promise<T | null> {
    const data = await this.waitMessage<T>(channel);
    if (this.window) this.close();
    return data;
  }
}

export function openWindow(url: string) {
  const wn = new PopupWindow(url);
  wn.open();
  return wn;
}
