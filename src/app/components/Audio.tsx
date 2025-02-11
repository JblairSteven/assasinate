"use client";

import { useEffect, useRef, useState } from "react";

interface AudioProps {
  isLoad: boolean;
}

export default function Audio({ isLoad }: AudioProps) {
  const [currentInterval, setCurrentInterval] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && isLoad) {
      audioRef?.current?.play();

      const intervalId = setInterval(() => {
        setCurrentInterval((prevInterval) => {
          if (prevInterval === 4) {
            clearInterval(intervalId);
          }
          return prevInterval + 1;
        });
      }, 1000);
    }
  }, [isLoad]);

  useEffect(() => {
    if (currentInterval === 5) {
      audioRef2?.current?.play();
    }
  }, [currentInterval]);

  return (
    <>
      <audio ref={audioRef}>
        <source src="/audio/music-1.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <audio ref={audioRef2} loop>
        <source src="/audio/music-2.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </>
  );
}
