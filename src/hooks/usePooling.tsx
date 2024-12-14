import { useState, useEffect } from 'react';

type ReturnType = {
  data: unknown
  error: boolean
  loading: boolean
}

const usePooling = (
  apiCall: () => Promise<T>,
  interval: number = 120000,
): ReturnType => {
  const [data, setData] = useState<null>(null)
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let isMounted = true // Prevent state updates on unmounted components

    const fetchData = async (): Promise<void> => {
      setLoading(true)
      setError(false)

      try {
        const response = await apiCall()
        if (isMounted) {
          setData(response)
          setError(false)
        }
      } catch (err) {
        if (isMounted) setError(true)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData() // Make an initial call

    const intervalId = setInterval(fetchData, interval)

    return () => {
      isMounted = false
      clearInterval(intervalId) // Cleanup the interval on unmount
    }
  }, [apiCall, interval])

  return { data, error, loading }
}


export default usePooling;
