/*
type Maybe<V> = V | Promise<V | undefined> | undefined;

type LoaderCallback<K, V> = (id: K) => Maybe<V>;

type CacheSettings = {
  expiresIn: number;
};

type CacheEntry<T> = {
  value: T,
  savedAt: number
};

const defaultCacheSettings: CacheSettings = {
  expiresIn: Infinity,
};

export default class Cache<K, V> {
  private items: Map<K, CacheEntry<V>>;
  private callback: LoaderCallback<K, V>;
  private settings: CacheSettings;

  constructor(callback: LoaderCallback<K, V>, settings = defaultCacheSettings) {
    this.items = new Map();
    this.callback = callback;
    this.settings = settings;
  }

  async resolve(id: K): Maybe<V> {
    return await Promise.resolve(this.callback(id));
  }

  async resolveEntry(id: K): Promise<CacheEntry<V>> {
    const value = await this.resolve(id);
    const savedAt = Date.now();
    return { value, savedAt }
  }

  async getEntry(id: K): Promise<CacheEntry<V> | undefined> {
    if (this.items.has(id)) {
      const entry = this.items.get(id);
      const savedAgo = Date.now() - entry?.savedAt;
      if (entry?.savedAt) {}
    }

      const entry = await this.resolveEntry(id);
      this.items.set(id, entry);
      return entry;
  }

  async get(id: K) {
    if (this.items.has(id)) {
      return this.items.get(id);
    } else {
      const item = await this.resolve(id);
      this.items.set(id.)
    }
  }
}
*/
