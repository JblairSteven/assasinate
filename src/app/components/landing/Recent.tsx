// components/Skeleton.tsx
import React, { useEffect, useState } from "react";
import { solanaRpcUrl, tokenMintAddress } from "@/app/constants/config";

interface Transaction {
  signature: string;
  timestamp: string | null;
  from: string;
  amount: string;
}

interface SkeletonProps {
  style?: React.CSSProperties;
}

const Recent: React.FC<SkeletonProps> = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/recent-transactions");
        const data = await response.json();

        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.error("Invalid data format:", data);
          setTransactions([]);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setTransactions([]);
      }
    };

    // fetch when .env populated
    if (tokenMintAddress && solanaRpcUrl) {
      fetchTransactions();

      const interval = setInterval(fetchTransactions, 60000);

      return () => clearInterval(interval);
    }
  }, []);

  const getTimeAgo = (timestamp: string | null) => {
    if (!timestamp) return "Unknown";
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1m ago";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "1h ago";
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "1d ago";
    return `${days}d ago`;
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="cut-corners-right outer">
      <div className="flex flex-col cut-corners-right inner">
        <div className="bg-white">
          <button
            onClick={() => setActive(!isActive)}
            className="gap-3 !pl-[4rem] button-nav-board w-full !bg-[#6F71C3] text-white focus-within:border-none transition-all duration-200  hover:brightness-125"
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
              Recent Input
            </p>
          </button>
          <div className="px-1.5 md:px-2"></div>
        </div>

        <div
          className={`
            bg-[#161727]
            transform transition-all duration-300 ease-in-out
            ${
              isActive
                ? "translate-x-0 opacity-100 h-auto"
                : "translate-x-full opacity-0 h-0"
            }
            overflow-hidden
          `}
        >
          <div className="w-full px-1 sm:px-1.5 md:px-2 pt-4 pb-2">
            <div className="flex justify-between font-bold text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-white ">
              <p className="w-1/4 text-center">Time</p>
              <p className="w-2/4 text-center">From</p>
              <p className="w-1/4 text-center">Amount</p>
            </div>
            {Array.isArray(transactions) && transactions.length > 0 ? (
              transactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex justify-between my-1 text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-white font-normal transition-all duration-100  hover:bg-white/10"
                >
                  <p className="w-1/4 text-center">
                    {getTimeAgo(tx.timestamp)}
                  </p>
                  <p className="w-2/4 text-center">
                    {tx.from.slice(0, 5) + "..."}
                  </p>
                  <p className="w-1/4 text-center">
                    {Number(tx.amount).toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center my-4 text-[8px] sm:text-[10px] md:text-xs lg:text-sm">
                No recent transactions
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recent;
