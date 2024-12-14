import React, { useState, useEffect } from 'react';

function Timer({ finishTime, description, updateInterval }: { finishTime: Date, description: string, updateInterval: number }) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  
  useEffect(() => {
    const updateCountdown = () => {
      const futureTime = new Date(finishTime).getTime();
      const difference = futureTime - new Date().getTime();
      setTimeLeft(difference);

      // Timer expired
      if (difference <= 0) {
        // hide timer
        setIsVisible(false);
      }
    };

    const interval = setInterval(updateCountdown, updateInterval);

    // Initial call to set the time difference
    updateCountdown();

    return () => clearInterval(interval);
  }, [finishTime]);

  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);

  return (
    isVisible && <div>
      {description}

      { (minutes > 0) 
        ? minutes +  ' minute' + ((minutes > 1) ? 's' : '') 
        : 'less than a minute left'
      }
    </div>
  );
}

export default Timer;
