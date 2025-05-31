import { useState, useEffect } from 'react';
import axios, { type AxiosRequestConfig, type Method } from 'axios';

interface FetchOptions {
  method?: Method;
  body?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useFetch = <T = any>(
  url: string,
  options: FetchOptions = {},
): UseFetchResult<T> => {
  const { method = 'GET', body, params, headers = {} } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const config: AxiosRequestConfig = {
        url,
        method,
        headers,
        params,
        data: body,
        signal: controller.signal,
      };

      try {
        const response = await axios<T>(config);
        setData(response.data);
      } catch (err: any) {
        if (!axios.isCancel(err)) {
          setError(
            err.response?.data?.message ||
              err.message ||
              'Something went wrong',
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [
    url,
    method,
    JSON.stringify(body),
    JSON.stringify(params),
    JSON.stringify(headers),
  ]);

  return { data, loading, error };
};

export default useFetch;
