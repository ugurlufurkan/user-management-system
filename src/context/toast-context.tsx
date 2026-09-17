"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error";

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000); // 4 saniye
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container - Sağ alt köşe */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto
              flex items-start gap-3 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border
              transform transition-all duration-300 ease-out animate-in slide-in-from-right-8 fade-in
              ${toast.type === "success" 
                ? "bg-white border-emerald-200/60" 
                : "bg-white border-red-200/60"
              }
            `}
          >
            <div className={`mt-0.5 shrink-0 ${toast.type === "success" ? "text-emerald-500" : "text-red-500"}`}>
              {toast.type === "success" 
                ? <CheckCircle2 size={18} strokeWidth={2} />
                : <AlertCircle size={18} strokeWidth={2} />
              }
            </div>
            
            <div className="flex-1 text-[13.5px] font-medium text-zinc-700 leading-snug">
              {toast.message}
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
              aria-label="Kapat"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}