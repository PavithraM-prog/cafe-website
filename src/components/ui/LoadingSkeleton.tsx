import React from "react";

/** Card skeleton that mimics the ProductCard layout */
export const CardSkeleton: React.FC = () => (
  <div className="flex flex-col rounded-2xl border border-borderColor bg-cardBg overflow-hidden shadow-sm animate-pulse">
    {/* Image placeholder */}
    <div className="aspect-video w-full bg-secondary" />
    {/* Content */}
    <div className="p-5 space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-5 w-32 bg-secondary rounded" />
        <div className="h-5 w-12 bg-secondary rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-secondary rounded" />
        <div className="h-3 w-3/4 bg-secondary rounded" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-borderColor/60">
        <div className="h-6 w-16 bg-secondary rounded" />
        <div className="h-10 w-10 bg-secondary rounded-full" />
      </div>
    </div>
  </div>
);

/** Full-width form skeleton */
export const FormSkeleton: React.FC = () => (
  <div className="border border-borderColor bg-cardBg p-6 sm:p-8 rounded-2xl shadow-sm space-y-6 animate-pulse">
    <div className="h-6 w-40 bg-secondary rounded" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-20 bg-secondary rounded" />
          <div className="h-10 w-full bg-secondary rounded-lg" />
        </div>
      ))}
    </div>
    <div className="space-y-2">
      <div className="h-3 w-28 bg-secondary rounded" />
      <div className="h-24 w-full bg-secondary rounded-lg" />
    </div>
    <div className="h-12 w-full bg-secondary rounded-full" />
  </div>
);

/** Grid of card skeletons */
export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

/** Booking card skeleton */
export const BookingCardSkeleton: React.FC = () => (
  <div className="border border-borderColor bg-cardBg p-5 rounded-2xl shadow-sm space-y-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-4 w-28 bg-secondary rounded" />
        <div className="h-3 w-40 bg-secondary rounded" />
      </div>
      <div className="h-6 w-20 bg-secondary rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-4 bg-secondary rounded" />
      ))}
    </div>
    <div className="flex gap-3 pt-2">
      <div className="h-9 w-28 bg-secondary rounded-full" />
      <div className="h-9 w-28 bg-secondary rounded-full" />
    </div>
  </div>
);
