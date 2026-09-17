import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={32} strokeWidth={2} className="text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-zinc-500 tracking-wide uppercase">
          Veriler Yükleniyor...
        </p>
      </div>
    </div>
  );
}