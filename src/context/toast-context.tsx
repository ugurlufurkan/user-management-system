"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Bildirim tiplerimiz (Başarılı veya Hata)
type ToastType = "success" | "error";

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Bu fonksiyonu projenin herhangi bir yerinden çağırıp mesaj fırlatabileceğiz
  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    
    // Mesajın 3 saniye (3000ms) sonra otomatik kaybolmasını sağlıyoruz
    setTimeout(() => {
      setToast(null);
    }, 3000); 
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Eğer fırlatılmış bir mesaj varsa, ekranın sağ altında göster! */}
      {toast && (
        <div 
          className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-2xl text-white font-medium z-50 animate-bounce transition-all ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? "✅ " : "⚠️ "}
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

// Kolayca kullanabilmek için kendi özel kancamızı (hook) yapıyoruz
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast sadece ToastProvider içinde kullanılabilir!");
  }
  return context;
};