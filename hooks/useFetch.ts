import { useState } from "react";
import { ResponseError } from "../lib/interfaces/response";

type JSON = { [key: string]: any };
type NullableJSON = JSON | null | undefined;

function queryToString(query?: JSON | null) {
  if (!query) {
    return "";
  }

  const results = [];
  for (const key in query) {
    results.push(`${key}=${query[key]}`);
  }
  return `?${results.join("&")}`;
}

const useFetch = (method: "get" | "post", url: string) => {
  const [fetched, setFetched] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<ResponseError | null>(null);
  const [data, setData] = useState<any>(null);

  const send = (query?: NullableJSON, post?: NullableJSON) => {
    setFetching(true);

    return new Promise(async (resolve, reject) => {
      const response = await fetch(`${url}${queryToString(query)}`, {
        method,
        body: post ? JSON.stringify(post) : undefined,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      setFetched(true);
      setFetching(false);

      if (response.ok) {
        setData(json);
        setError(null);
      } else {
        setError(json.error || json);
      }
    });
  };

  const sendOnce = (query?: NullableJSON, post?: NullableJSON) => {
    if (fetching || fetched || data || error) {
      return;
    } else {
      return send(query, post);
    }
  };

  return { send, sendOnce, fetched, fetching, data, error };
};

export default useFetch;
