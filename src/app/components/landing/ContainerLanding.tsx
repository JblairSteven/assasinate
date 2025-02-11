"use client";
import { useEffect, useState } from "react";
import NavbarLanding from "./NavbarLanding";
import Skeleton from "./Skeleton";
// import { FpsView } from "react-fps";
import { solanaRpcUrl, tokenMintAddress } from "@/app/constants/config";
import { Holder, HolderData } from "@/types";
import { useStore } from "@nanostores/react";
import {
  $holders,
  $holdersDataChunk,
  $maxY,
  $supply,
} from "../../stores/holders";
import { $isLoading } from "../../stores/skeleton";
import { useRouter } from "next/navigation";
import LoadingScreen from "../LoadingScreen";

export default function ContainerLanding() {
  const router = useRouter();
  // const [holders, setHolders] = useState<Array<Holder>>([]);
  // const holders = useStore($holders);
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);
  const [supply, setSupply] = useState<number | null>(null);
  const [dummyHolders, setDummyHolders] = useState<Array<HolderData>>([]);
  const [isLoad, setIsLoad] = useState<boolean>(false);

  // current chunk of holders data
  const data = useStore($holdersDataChunk);
  const maxY = useStore($maxY);

  const handleSearch = (address: string) => {
    // const holder = $holdersData
    //   .get()
    //   .find((holder) => holder.wallet === address);

    // if (holder) {
    //   setSearchedAddress(address);
    //   $selectedHolder.set(holder);
    // }

    window.location.href = `/assasinate?address=${address}`;
  };

  useEffect(() => {
    async function fetchHolders() {
      try {
        const response = await fetch("/api/holders");
        const data = await response.json();
        const convertedData = data.map(
          (holder: { wallet: string; balance: bigint }) => ({
            wallet: holder.wallet,
            balance: Number(holder.balance),
          })
        );
        // setHolders(convertedData);
        $holders.set(convertedData);
        setDummyHolders(convertedData);
      } catch (error) {
        console.error("Failed to fetch holders:", error);
      }
    }
    const fetchSupply = async () => {
      try {
        const supply = await fetch("/api/token");
        const data = await supply.json();
        setSupply(data);
        $supply.set(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    async function loadAll() {
      $isLoading.set(true);
      // wait all promises to resolve
      await Promise.all([fetchHolders(), fetchSupply()]);
      // at least wait 1s
      setTimeout(() => {
        $isLoading.set(false);
      }, 1000);
    }

    // fetch all when .env populated
    if (tokenMintAddress && solanaRpcUrl) {
      loadAll();
    } else {
      setTimeout(() => {
        $isLoading.set(false);
      }, 2000);
    }

    async function fetchDummyHolders() {
      try {
        $isLoading.set(true);
        const response = await fetch("/holders10k.json");
        const data: { address: string; balance: number }[] =
          await response.json();
        const convertedData: Holder[] = data.map((holder) => ({
          wallet: holder.address,
          balance: holder.balance,
        }));

        const totalBalance = data.reduce(
          (total, holder) => total + holder.balance,
          0
        );
        // console.log("totalBalance:", totalBalance);

        setSupply(totalBalance);
        $supply.set(totalBalance);

        // console.log(convertedData);
        $holders.set(convertedData);

        // dummy loading
        setTimeout(() => {
          $isLoading.set(false);
        }, 2000);
      } catch (error) {
        console.error("Failed to fetch holders:", error);
        $isLoading.set(false);
      }
    }

    // fetchDummyHolders();
    //
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[url('/bg.png')] bg-cover bg-bottom bg-no-repeat">
      <NavbarLanding onSearch={handleSearch} />
      <Skeleton
        holders={data}
        searchedAddress={searchedAddress}
        supply={supply}
        height={maxY}
        onSearch={handleSearch}
        dummyHolders={dummyHolders}
      />
      {/* <FpsView /> */}
      <LoadingScreen isLoad={isLoad} setIsLoad={setIsLoad} />
    </div>
  );
}
