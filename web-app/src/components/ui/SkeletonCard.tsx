import { twMerge } from "tailwind-merge";

export default function SkeletonCard({ ...props }) {
  return (
    <div
      className={twMerge(`relative w-full h-80 bg-gray-200 overflow-hidden rounded-lg animate-pulse`, props.className)}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer`}
      />
    </div>
  );
}
