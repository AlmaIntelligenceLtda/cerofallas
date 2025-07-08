// fetch.ts
import { useState, useEffect, useCallback } from "react";

//para incertar

export const fetchAPI = async (url: string, options?: RequestInit) => {
  try {
    console.log("[fetchAPI] Fetching URL:", url, "Options:", options);
    const response = await fetch(url, options);
    console.log("[fetchAPI] Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    console.log("[fetchAPI] Response JSON:", json);
    return json;
  } catch (error) {
    console.error("[fetchAPI] Fetch error:", error);
    throw error;
  }
};

//para traer 

export const useFetch = <T>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("[useFetch] Starting fetch for:", url);

    try {
      const result = await fetchAPI(url, options);
      console.log("[useFetch] Result received:", result);
      setData(result.data);
    } catch (err) {
      console.error("[useFetch] Error caught:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
      console.log("[useFetch] Fetch finished");
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
