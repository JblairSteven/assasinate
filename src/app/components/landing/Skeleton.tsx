import { Holder, HolderData } from "@/types";
import { useStore } from "@nanostores/react";
import { throttle } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getDynamicAppearance } from "../../helpers";
import {
  $containerWidth,
  $scrollTop,
  $selectedHolder,
  $worker,
} from "../../stores/holders";
import SkeletonItem from "../SkeletonItem";
import SkeletonLandingItem from "../SkeletonLandingItem";
import Leaderboards from "./Leaderboard";
import Recent from "./Recent";

const Skeleton: React.FC<{
  holders: Array<HolderData>;
  searchedAddress: string | null;
  supply: number | null;
  height: number;
  onSearch: (address: string) => void;
  dummyHolders: Array<HolderData> | null;
}> = ({ holders, searchedAddress, supply, height, onSearch, dummyHolders }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [topHolders, setTopHolders] = useState<string[]>([]);

  const selectedHolder = useStore($selectedHolder);

  // create web worker and store
  useEffect(() => {
    const worker = new Worker(
      new URL("../../workers/worker.ts", import.meta.url)
    );
    $worker.set(worker);

    // Clean up the worker when the component unmounts
    return () => {
      worker.terminate();
      $worker.set(null);
    };
  }, []);

  // useEffect(() => {
  //   console.log("supply:", supply);
  // }, [supply]);

  // update width of the viewport
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        $containerWidth.set(containerRef.current.offsetWidth);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // useEffect(() => {
  //   const updateDimensions = () => {
  //     if (containerRef.current) {
  //       setDimensions({
  //         width: containerRef.current.offsetWidth,
  //         height: containerRef.current.offsetHeight,
  //       });
  //     }
  //   };
  //
  //   updateDimensions();
  //   window.addEventListener("resize", updateDimensions);
  //   return () => window.removeEventListener("resize", updateDimensions);
  // }, []);

  useEffect(() => {
    if (selectedHolder) {
      // console.log("skeleton searchedAddress:", selectedHolder.wallet);

      containerRef.current?.scrollTo({
        top: selectedHolder.position.y,
        behavior: "smooth",
      });

      const skeletonElement = document.querySelector(
        `[data-address="${selectedHolder.wallet}"]`
      );

      if (skeletonElement) {
        // skeletonElement.scrollIntoView({ behavior: "smooth", block: "center" });

        skeletonElement.classList.add("highlight-skeleton");

        setTimeout(() => {
          skeletonElement.classList.remove("highlight-skeleton");
        }, 2000);
      }

      $selectedHolder.set(null);
    }
  }, [selectedHolder]);

  // const itemsRef = useRef<Array<HTMLDivElement>>([]);

  const [viewportTop, setViewportTop] = useState(0);

  const viewportBottom = useMemo(() => {
    return viewportTop + (containerRef.current?.offsetHeight || 800);
  }, [viewportTop, containerRef]);

  // scroll handle
  const onScroll = useMemo(
    () =>
      throttle(
        () => {
          const viewportTop = containerRef.current?.scrollTop || 0;
          setViewportTop(viewportTop);
          $scrollTop.set(viewportTop); // also save to store
        },
        100,
        { leading: false }
      ),
    []
  );

  // filter holders data which are visible in viewport
  const visibleItems = useMemo(() => {
    return holders.filter((item) => {
      const itemTop = item.position.y;
      const itemBottom = item.position.y + item.position.size;

      const safeArea = 0; // we can also add some safe area to avoid clipping
      const top = viewportTop - safeArea;
      const bottom = viewportBottom + safeArea;

      if (itemBottom >= top && itemTop <= bottom) {
        return true;
      } else {
        return false;
      }
    });
  }, [holders, viewportTop, viewportBottom]);

  // render item based on visibleItems
  const renderItems = useMemo(() => {
    return visibleItems.map((item) => {
      const { wallet, position } = item;
      const rank =
        (dummyHolders?.findIndex((holder) => holder.wallet === wallet) ?? -1) +
        1;

      return (
        <SkeletonItem
          key={wallet}
          rank={rank}
          address={wallet}
          balance={position.balance}
          size={position.size}
          x={position.x}
          y={position.y}
          appearance={{
            back: getDynamicAppearance(wallet, 0, 12),
            bottom: getDynamicAppearance(wallet, 0, 12),
            face: getDynamicAppearance(wallet, 0, 20),
            hand: getDynamicAppearance(wallet, 0, 9),
            head: getDynamicAppearance(wallet, 0, 22),
            top_over: getDynamicAppearance(wallet, 0, 22),
            top_under: getDynamicAppearance(wallet, 0, 7),
          }}
          style={{
            position: "absolute",
            transform: `rotate(${position.rotation}deg)`,
          }}
          isHighlighted={searchedAddress === wallet}
          percentage={supply ? (position.balance / supply) * 100 : 0}
        />
      );
    });
  }, [visibleItems, searchedAddress, supply, dummyHolders]);

  return (
    <div className="">
      <div className="fixed z-10 -left-3 top-[50%] md:top-[23%] h-fit w-1/2 lg:w-[25%] ">
        <Leaderboards
          onSearch={onSearch}
          setTopHolders={(items) => {
            const _items = items?.map((item) => item?.wallet);

            setTopHolders(_items);
          }}
        />
      </div>
      <div className="fixed z-10 -right-3 top-[50%] md:top-[23%] h-fit w-1/2 lg:w-[25%] ">
        <Recent />
      </div>
      <div className="fixed bottom-[-15%] md:bottom-0  scale-50 md:scale-100 left-1/2 -translate-x-1/2">
        <div className="flex items-end gap-4">
          {topHolders?.[5] && (
            <SkeletonLandingItem
              size={180}
              className="-mx-16 z-20"
              appearance={{
                back: getDynamicAppearance(topHolders?.[5], 0, 12),
                bottom: getDynamicAppearance(topHolders?.[5], 0, 12),
                face: getDynamicAppearance(topHolders?.[5], 0, 20),
                hand: getDynamicAppearance(topHolders?.[5], 0, 9),
                head: getDynamicAppearance(topHolders?.[5], 0, 22),
                top_over: getDynamicAppearance(topHolders?.[5], 0, 22),
                top_under: getDynamicAppearance(topHolders?.[5], 0, 7),
              }}
            />
          )}
          {topHolders?.[3] && (
            <SkeletonLandingItem
              size={240}
              className="-mx-20 z-30"
              appearance={{
                back: getDynamicAppearance(topHolders?.[3], 0, 12),
                bottom: getDynamicAppearance(topHolders?.[3], 0, 12),
                face: getDynamicAppearance(topHolders?.[3], 0, 20),
                hand: getDynamicAppearance(topHolders?.[3], 0, 9),
                head: getDynamicAppearance(topHolders?.[3], 0, 22),
                top_over: getDynamicAppearance(topHolders?.[3], 0, 22),
                top_under: getDynamicAppearance(topHolders?.[3], 0, 7),
              }}
            />
          )}

          {topHolders?.[1] && (
            <SkeletonLandingItem
              size={360}
              className="-mx-24 z-40"
              appearance={{
                back: getDynamicAppearance(topHolders?.[1], 0, 12),
                bottom: getDynamicAppearance(topHolders?.[1], 0, 12),
                face: getDynamicAppearance(topHolders?.[1], 0, 20),
                hand: getDynamicAppearance(topHolders?.[1], 0, 9),
                head: getDynamicAppearance(topHolders?.[1], 0, 22),
                top_over: getDynamicAppearance(topHolders?.[1], 0, 22),
                top_under: getDynamicAppearance(topHolders?.[1], 0, 7),
              }}
            />
          )}

          {topHolders?.[0] && (
            <SkeletonLandingItem
              size={480}
              className="-mx-32 z-50"
              appearance={{
                back: getDynamicAppearance(topHolders?.[0], 0, 12),
                bottom: getDynamicAppearance(topHolders?.[0], 0, 12),
                face: getDynamicAppearance(topHolders?.[0], 0, 20),
                hand: getDynamicAppearance(topHolders?.[0], 0, 9),
                head: getDynamicAppearance(topHolders?.[0], 0, 22),
                top_over: getDynamicAppearance(topHolders?.[0], 0, 22),
                top_under: getDynamicAppearance(topHolders?.[0], 0, 7),
              }}
            />
          )}
          {topHolders?.[2] && (
            <SkeletonLandingItem
              size={360}
              className="-mx-24 z-40"
              appearance={{
                back: getDynamicAppearance(topHolders?.[2], 0, 12),
                bottom: getDynamicAppearance(topHolders?.[2], 0, 12),
                face: getDynamicAppearance(topHolders?.[2], 0, 20),
                hand: getDynamicAppearance(topHolders?.[2], 0, 9),
                head: getDynamicAppearance(topHolders?.[2], 0, 22),
                top_over: getDynamicAppearance(topHolders?.[2], 0, 22),
                top_under: getDynamicAppearance(topHolders?.[2], 0, 7),
              }}
            />
          )}
          {topHolders?.[4] && (
            <SkeletonLandingItem
              size={240}
              className="-mx-20 z-30"
              appearance={{
                back: getDynamicAppearance(topHolders?.[4], 0, 12),
                bottom: getDynamicAppearance(topHolders?.[4], 0, 12),
                face: getDynamicAppearance(topHolders?.[4], 0, 20),
                hand: getDynamicAppearance(topHolders?.[4], 0, 9),
                head: getDynamicAppearance(topHolders?.[4], 0, 22),
                top_over: getDynamicAppearance(topHolders?.[4], 0, 22),
                top_under: getDynamicAppearance(topHolders?.[4], 0, 7),
              }}
            />
          )}
          {topHolders?.[6] && (
            <SkeletonLandingItem
              size={180}
              className="-mx-16 z-20"
              appearance={{
                back: getDynamicAppearance(topHolders?.[6], 0, 12),
                bottom: getDynamicAppearance(topHolders?.[6], 0, 12),
                face: getDynamicAppearance(topHolders?.[6], 0, 20),
                hand: getDynamicAppearance(topHolders?.[6], 0, 9),
                head: getDynamicAppearance(topHolders?.[6], 0, 22),
                top_over: getDynamicAppearance(topHolders?.[6], 0, 22),
                top_under: getDynamicAppearance(topHolders?.[6], 0, 7),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
