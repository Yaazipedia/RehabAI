export default function LoadingState({ message = "Analyzing...", lines = 4 }) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--clr-primary)", borderTopColor: "transparent" }} />
        <p className="text-sm font-medium" style={{ color: "var(--clr-primary)" }}>{message}</p>
      </div>
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="shimmer" style={{
            height: i === 0 ? "20px" : "14px",
            width: `${85 - i * 12}%`,
          }} />
        ))}
      </div>
    </div>
  );
}
