import { useState, useEffect } from 'react';
import { redirect } from '@/common';

function usePooling() {
  const [downtimeExpiresAt, setDowntimeExpiresAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch downtime expiration date from server
    const fetchTimeFromServer = async () => {
      const response = await fetch('http://localhost:3000/api/timer');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { downtimeExpiration } = await response.json();
      setDowntimeExpiresAt(new Date(downtimeExpiration));
      setIsLoading(false);
    };

    fetchTimeFromServer();

    // Fetch status (502 or 200 from another endpoint)
    const fetchStatusFromServer = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/status');
        if (response.status === 502) {
          // server is down
        } else if (response.status === 200) {
          // REDIRECT
          redirect();
        }
      } catch (err) {
        console.error(err);
      }
    };
      
    fetchStatusFromServer();

    // Set interval to fetch server time every minute
    // TODO: UNCOMMENT LATER
    // const interval = setInterval(fetchStatusFromServer, 60 * 1000);
    const interval = setInterval(fetchStatusFromServer, 5 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return { downtimeExpiresAt, isLoading };
}

export default usePooling;
