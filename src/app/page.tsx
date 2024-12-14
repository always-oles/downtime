"use client";
import { useState, useEffect } from 'react';
import usePooling from "@/hooks/usePooling";
import { redirect } from '@/common';
import Timer from "@/components/Timer";

const poolingFunction = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/status');
    if (response.status === 200) {
      // REDIRECT
      redirect();
    }
    return response;
  } catch (err) {
    console.error(err);
  }
}

export default function Home() {
  const [downtimeExpiresAt, setDowntimeExpiresAt] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTimerVisible, setIsTimerVisible] = useState<boolean>(true);
  usePooling(poolingFunction, 60000);
  
  useEffect(() => {
    // Fetch downtime expiration date from server
    const fetchTimeFromServer = async () => {
      const response = await fetch('http://localhost:3000/api/timer');
      let { downtimeExpiration } = await response.json();

      downtimeExpiration = new Date(downtimeExpiration);
      const timeDifference = downtimeExpiration - new Date().getTime();
      const hours = Math.floor(timeDifference / 1000 / 60 / 60);

      // 1 hour or more left - hide timer
      if (hours >= 1) {
        setIsTimerVisible(false);
      }

      setDowntimeExpiresAt(downtimeExpiration);
      setIsLoading(false);
    };

    fetchTimeFromServer();
  }, []);

  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {isLoading 
          ? <p>Loading...</p> 
          : isTimerVisible && <Timer description="Server is down, estimated wait time is " finishTime={downtimeExpiresAt} /> 
        }
      </main>
    </div>
  );
}
