import { useState, useCallback } from 'react'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { baseUrl } from '@/utils/Endpoints'

axios.defaults.baseURL = baseUrl

interface UseAxiosReturn<T> {
  response: AxiosResponse<T> | undefined
  error: string
  loading: boolean
  refetch: (params?: AxiosRequestConfig) => Promise<void>
}

export const useAxios = <T = unknown>(
  initialParams: AxiosRequestConfig,
): UseAxiosReturn<T> => {
  const [response, setResponse] = useState<AxiosResponse<T> | undefined>(
    undefined,
  )
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const fetchData = useCallback(
    async (params?: AxiosRequestConfig) => {
      setLoading(true)
      try {
        const res = await axios.request<T>(params || initialParams)
        setResponse(res)
        setError('')
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    },
    [initialParams],
  )

  return { response, error, loading, refetch: fetchData }
}
