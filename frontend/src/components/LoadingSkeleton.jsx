export default function LoadingSkeleton({ lines = 5 }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-[rgba(255,255,255,0.08)] rounded w-full" />
      ))}
    </div>
  );
}
