import { GraphQLClient, CacheLoader } from "astraql";

const cache = new CacheLoader({
  expiresIn: 60 * 10,
});

const client = new GraphQLClient({
  endpoint: process.env["NEXT_PUBLIC_BACKEND_SERVER"] as string,
  cache,
  headers: {
    "X-Client": "so_next/api",
  },
});

export function setBearerToken(token: string) {
  client.addHeader("Authorization", `Bearer ${token}`);
}

export function removeBearerToken() {
  // client.removeHeader("Authorization");
}

export default client;
