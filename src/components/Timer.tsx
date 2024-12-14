import React, { useState, useEffect } from 'react';

function Timer({ finishTime, description }: { finishTime: Date, description: string }) {
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

    // TODO: UNCOMMENT LATER TO UPDATE EVERY MINUTE NOT EVERY SECOND
    const interval = setInterval(updateCountdown, 60000);

    // Initial call to set the time difference
    updateCountdown();

    return () => clearInterval(interval);
  }, [finishTime]);

  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);

  return (
    isVisible && <div>
      <span>
        {description}

        { (minutes > 0) 
          ? minutes +  ' minute' + ((minutes > 1) ? 's' : '') 
          : 'less than a minute left'
        }
      </span>
    </div>
  );
}

export default Timer;
