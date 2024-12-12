import React, { useState, useEffect } from 'react';
import usePooling from "@/hooks/usePooling";
import { redirect } from '@/common';

function Timer() {
  const { downtimeExpiresAt, isLoading } = usePooling();
  const [timeDifference, setTimeDifference] = useState<number | null>(null);
  const [isTimerVisible, setIsTimerVisible] = useState(true);

  useEffect(() => {
    if (!downtimeExpiresAt) return;

    const updateTimeDifference = () => {
      const now = new Date();
      const futureTime = new Date(downtimeExpiresAt).getTime();
      const diff = futureTime - now.getTime();
      setTimeDifference(diff);
      const hours = Math.floor(diff / 1000 / 60 / 60);

      // 1 hour or more
      if (hours >= 1) {
        // hide timer
        setIsTimerVisible(false);
      }

      // Timer expired
      if (diff <= 0) {
        // hide timer
        setIsTimerVisible(false);

        // REDIRECT
        redirect();
        
        clearInterval(interval);
      }
    };

    // TODO: UNCOMMENT LATER TO UPDATE EVERY MINUTE NOT EVERY SECOND
    // const interval = setInterval(updateTimeDifference, 60 * 1000);
    const interval = setInterval(updateTimeDifference, 1000);

    // Initial call to set the time difference
    updateTimeDifference();

    return () => clearInterval(interval);
  }, [downtimeExpiresAt]);

  if (isLoading) return <p>Loading...</p>;
  if (timeDifference === null) return <p>No server time received.</p>;

  // Convert milliseconds to hours, minutes, seconds
  const seconds = Math.floor((timeDifference / 1000) % 60);
  const minutes = Math.floor((timeDifference / 1000 / 60) % 60);

  return (
    !isLoading && isTimerVisible && <div>
      <span>
        Server is down, estimated wait time:{' '}

        { (minutes > 0) 
          ? minutes +  ' minute' + ((minutes > 1) ? 's' : '') 
          : 'less than a minute left'
        }<br/>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        <br/><h4 className='text-xs'>(Seconds are for testing purposes only)</h4>
      </span>
    </div>
  );
}

export default Timer;