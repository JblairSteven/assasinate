"use client";

import { useStore } from "@nanostores/react";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import { $isLoading } from "../stores/skeleton";

interface LoadingScreenProps {
  isLoad: boolean;
  setIsLoad: (isLoad: boolean) => void;
}

export default function LoadingScreen({
  isLoad,
  setIsLoad,
}: LoadingScreenProps) {
  const isLoading = useStore($isLoading);
  const [counter, setCounter] = useState(0);
  const [showText, setShowText] = useState(false); // State to control the text visibility

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev >= 100 ? 0 : prev + 50));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
      setShowText(true); 
    setTimeout(() => {
      setIsLoad(true);
    }, 1500);
  }

  if (!isLoading && !isLoad) {
    return (
      <div
        className={classNames(
          "fixed bg-[url('/bg.png')] bg-cover bg-bottom bg-no-repeat bg-dust z-30 border-frame flex flex-col items-center justify-center h-screen w-screen transition duration-300",
          {
            "opacity-100": !isLoad,
            "opacity-0": isLoad,
            "pointer-events-none": isLoad,
          }
        )}
      >
        <div className="flex flex-col gap-[20px] items-center justify-center">
          <Image
            src="/loading.gif"
            alt="Assasinate"
            width={480}
            height={480}
            className="w-[10rem]"
          />

          <button
            className="transition-all duration-200 hover:brightness-125"
            onClick={handleClick}
          >
            <Image
              src="/opentheworld.svg"
              className="w-[20rem]"
              alt=""
              height={200}
              width={200}
            />
          </button>


          {showText && (
            <div className="text-red-500 text-center transition-all duration-300 absolute left-1/2 -translate-x-1/2 bottom-[20%]">
              <div>Token configuring with assassins</div>
              <div>Standby</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "fixed bg-[url('/bg.png')] bg-cover bg-bottom bg-no-repeat bg-dust z-30 border-frame flex flex-col items-center justify-center h-screen w-screen transition duration-300",
        {
          "opacity-100": isLoading,
          "opacity-0": !isLoading,
          "pointer-events-none": !isLoading,
        }
      )}
    >
      <Image
        src="/loading.gif"
        alt="Assasinate"
        width={480}
        height={480}
        className="w-[10rem]"
      />
      <div className="flex flex-col items-center justify-center text-white text-[1.5vw]">
        <div className="cut-corners outer mt-[26px] p-1 w-[50rem] h-[30px] !bg-[#454253] overflow-hidden">
          <div
            className="cut-corners inner h-full !bg-white transition-all duration-100"
            style={{ width: `${counter}%` }}
          ></div>
        </div>
        Preparing...
      </div>
    </div>
  );
}
