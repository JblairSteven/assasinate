// src/components/Leaderboards.tsx
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import { $holdersData, $supply } from "../stores/holders";
import { HolderData } from "@/types";

interface Holder {
  rank: number;
  wallet: string;
  balance: number;
  percentage: string;
}

interface LeaderboardData {
  totalSupply: number;
  top7Holders: Holder[];
}

interface LeaderboardProps {
  onSearch: (address: string) => void;
}

export default function Leaderboards({ onSearch }: LeaderboardProps) {
  const [isActive, setActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const holders = useStore($holdersData);
  const supply = useStore($supply);
  const [top7Holders, setTop7Holders] = useState<Holder[]>([]);

  useEffect(() => {
    setIsLoading(true);

    // Proses data dalam useEffect untuk menghindari blocking
    const processedHolders = holders
      .sort((a, b) => b.position.balance - a.position.balance)
      .slice(0, 7)
      .map((holder, index) => ({
        ...holder,
        rank: index + 1,
        percentage: ((holder.position.balance / supply) * 100).toFixed(2) + "%",
        balance: holder.position.balance,
      }));

    setTop7Holders(processedHolders);
    setIsLoading(false);
  }, [holders, supply]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="cut-corners outer">
      <div className="flex flex-col cut-corners inner">
        <div className="bg-white">
          <button
            onClick={() => setActive(!isActive)}
            className="gap-3 button-nav-board !pr-[5rem] !bg-[#6F71C3] text-black focus-within:border-none"
          >
            <span
              className={`
              transition-transform duration-300 text-xs
              ${isActive ? "" : "rotate-180"}
            `}
            >
              {`>>>`}
            </span>
            <p className="font-bold text-[10px] sm:text-xs md:text-sm lg:text-base">
              Leaderboards
            </p>
          </button>
          <div className="px-1.5 md:px-2">
            
          </div>
        </div>

        <div
          className={`
            bg-white shadow-lg
            transform transition-all duration-300 ease-in-out
            ${
              isActive
                ? "translate-x-0 opacity-100 h-auto"
                : "translate-x-full opacity-0 h-0"
            }
            overflow-hidden
          `}
        >
          <div className="w-full px-1 sm:px-1.5 md:px-2 pb-2 text-black">
            <div className="flex justify-between  font-bold text-[8px] mt-[20px] sm:text-[10px] md:text-xs lg:text-sm">
              <p className="w-1/6 text-center">Rank</p>
              <p className="w-3/6 text-center">Wallet</p>
              <p className="w-2/6 text-center">%</p>
            </div>
            {top7Holders.map((holder) => (
              <div
                key={holder.wallet}
                className="cursor-pointer hover:bg-gray-100 flex justify-between font-normal my-1 text-[8px] sm:text-[10px] md:text-xs lg:text-sm"
                onClick={() => onSearch(holder.wallet)} // tambahkan onClick handler
              >
                <p className="w-1/6 text-center">{holder.rank}</p>
                <p className="w-3/6 text-center">
                  {holder.wallet.slice(0, 5) + "..."}
                </p>
                <p className="w-2/6 text-center">{holder.percentage}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
