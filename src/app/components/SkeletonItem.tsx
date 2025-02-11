// components/Skeleton.tsx
import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import BaseSkeleton from "../constants/skeletons/base";
import { $holdersData } from "../stores/holders";
import Image from "next/image";

interface SkeletonProps {
  address: string;
  style?: React.CSSProperties;
  size: number;
  balance: number;
  x: number;
  y: number;
  isHighlighted?: boolean;
  percentage: number;
  appearance: SkeletonAppearance;
  ref?: React.Ref<HTMLDivElement>;
  rank: number;
}

interface SkeletonAppearance {
  back: number;
  bottom: number;
  face: number;
  hand: number;
  head: number;
  top_over: number;
  top_under: number;
}

const SkeletonItem: React.FC<SkeletonProps> = ({
  address,
  style,
  size,
  balance,
  x,
  y,
  isHighlighted,
  percentage,
  appearance,
  ref,
}) => {
  console.log(balance);

  const rotation = style?.transform?.match(/-?\d+/)?.[0] || 0;
  const [showTooltip, setShowTooltip] = useState(false);
  // const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsShow(true);
    }, 50);
  }, []);

  const randomDelay = useMemo(() => Math.random() * 200, []);

  // useEffect(() => {
  //   const updateTooltipPosition = () => {
  //     if (elementRef.current) {
  //       const rect = elementRef.current.getBoundingClientRect();
  //       const scrollLeft =
  //         document.documentElement.scrollLeft || window.scrollX;
  //       const scrollTop = document.documentElement.scrollTop || window.scrollY;
  //
  //       setTooltipPosition({
  //         x: rect.left + rect.width / 2 + scrollLeft,
  //         y: rect.top + rect.height / 2 + scrollTop,
  //       });
  //     }
  //   };
  //
  //   window.addEventListener("scroll", updateTooltipPosition, true);
  //   window.addEventListener("resize", updateTooltipPosition, true);
  //   updateTooltipPosition();
  //
  //   return () => {
  //     window.removeEventListener("scroll", updateTooltipPosition, true);
  //     window.removeEventListener("resize", updateTooltipPosition, true);
  //   };
  // }, []);

  return (
    <div
      ref={ref}
      data-address={address}
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
      }}
      className="absolute group cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => {
        const idx = $holdersData
          .get()
          .findIndex((holder) => holder.wallet === address);
        console.log("skeleton index:", idx, address);
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <div
          className={classNames(
            "absolute inset-0 transition duration-200 ease-out",
            {
              "scale-0": !isShow,
              "scale-125": isShow,
            }
          )}
          style={{
            transitionDelay: `${randomDelay}ms`,
          }}
        >
          {renderAppearance("back", appearance.back.toString(), size)}
          <svg
            width={size}
            height={size}
            viewBox="0 0 108 108"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`absolute ${
              isHighlighted ? "highlight-skeleton" : ""
            } relative`}
            style={{
              filter: isHighlighted
                ? "drop-shadow(0 0 15px rgba(255, 255, 255, 0.7))"
                : "none",
              // transition: "all 0.3s ease",
            }}
          >
            <BaseSkeleton />
          </svg>

          {renderAppearance("face", appearance.face.toString(), size)}
          {renderAppearance("head", appearance.head.toString(), size)}
          {renderAppearance("bottom", appearance.bottom.toString(), size)}
          {renderAppearance("hand", appearance.hand.toString(), size)}
          {renderAppearance("top_under", appearance.top_under.toString(), size)}
          {renderAppearance("top_over", appearance.top_over.toString(), size)}
        </div>
      </div>

      {showTooltip && (
        <div
          className="transition-opacity bg-black bg-opacity-60 p-2 rounded-lg backdrop-blur-sm fixed text-center"
          style={{
            position: "absolute",
            width: "240px",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%)`,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <p className="text-white text-sm">
            {address.slice(0, 4)}...{address.slice(-4)}
          </p>
          <p className="text-white text-sm">{`${balance.toFixed(
            2
          )} $SQUIDSIM`}</p>
          <p className="text-white text-sm">{`${
            percentage < 0.01 ? "<0.01" : percentage.toFixed(2)
          }%`}</p>
        </div>
      )}
    </div>
  );
};

function renderAppearance(type: string, value: string, size: number) {
  return (
    <div className="absolute inset-0">
      <Image
        src={`/images/${type}/${value}.png`}
        alt={`${type} ${value}`}
        width={size}
        height={size}
      />
    </div>
  );
}

export default SkeletonItem;
