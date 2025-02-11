import classNames from "classnames";
import BaseSkeleton from "../constants/skeletons/base";
import Image from "next/image";

interface SkeletonAppearance {
  back: number;
  bottom: number;
  face: number;
  hand: number;
  head: number;
  top_over: number;
  top_under: number;
}

interface SkeletonLandingItemProps {
  size: number;
  appearance: SkeletonAppearance;
  className: string;
}

export default function SkeletonLandingItem({
  appearance,
  size,
  className,
}: SkeletonLandingItemProps) {
  return (
    <div className={className}>
      <div className={classNames("transition duration-200 ease-out scale-125")}>
        {renderAppearance("back", appearance.back, size)}
        <svg
          width={size}
          height={size}
          viewBox="0 0 108 108"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`relative`}
          style={{
            filter: "none",
          }}
        >
          <BaseSkeleton />
        </svg>

        {renderAppearance("face", appearance.face, size)}
        {renderAppearance("head", appearance.head, size)}
        {renderAppearance("bottom", appearance.bottom, size)}
        {renderAppearance("hand", appearance.hand, size)}
        {renderAppearance("top_under", appearance.top_under, size)}
        {renderAppearance("top_over", appearance.top_over, size)}
      </div>
    </div>
  );
}

function renderAppearance(type: string, value: number, size: number) {
  return (
    <div className="absolute inset-0">
      <Image
        src={`/images/${type}/${value}.png`}
        alt={`${type} image`}
        width={size}
        height={size}
      />
    </div>
  );
}
