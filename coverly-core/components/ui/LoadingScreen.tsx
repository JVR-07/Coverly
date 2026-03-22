interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({
  message = "Cargando...",
}: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-soft-light border-t-trust-blue animate-coverly-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-insight-teal animate-coverly-pulse" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-trust-blue animate-coverly-pulse tracking-wide">
          Coverly<span className="text-insight-teal">.</span>
        </h3>
        <p className="text-sm text-slate mt-1">{message}</p>
      </div>
    </div>
  );
}
