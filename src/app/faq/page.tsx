import Link from "next/link";
import { HelpCircle, ChevronRight, ArrowRight } from "lucide-react";

export const metadata = {
  title: 'Sıkça Sorulan Sorular | System Enterprise',
};

export default function FAQPage() {
  const faqs = [
    {
      q: "Şifremi nasıl değiştirebilirim?",
      a: "Ayarlar sayfasına giderek 'Güvenlik ve Şifre' bölümünden mevcut şifrenizi ve yeni şifrenizi girerek anında değişiklik yapabilirsiniz."
    },
    {
      q: "Bağlı olduğum departmanı değiştirebilir miyim?",
      a: "Evet, Ayarlar menüsündeki 'Kişisel Bilgiler' kartı üzerinden farklı bir departman seçip kaydedebilirsiniz."
    },
    {
      q: "Hesabımı silersem verilerime ne olur?",
      a: "Hesabınızı sildiğinizde (Ayarlar sayfasındaki Tehlikeli Bölge), size ait tüm kayıtlar veritabanımızdan kalıcı ve geri döndürülemez şekilde tamamen silinir."
    },
    {
      q: "Diğer kullanıcıların profillerini düzenleyebilir miyim?",
      a: "Hayır. Sistemimiz sıkı bir yetkilendirme altyapısına sahiptir. Üye rehberinden başkasının profiline girdiğinizde sadece okuma modunda görüntüleyebilirsiniz."
    },
    {
      q: "Kayıt sırasında tüm alanları doldurmak zorunlu mu?",
      a: "Kız arkadaş veya aile bilgisi gibi modüller tamamen opsiyoneldir. Sadece temel kimlik bilgileriniz zorunludur."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto mt-4 mb-16">
      
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-indigo-100/50 dark:border-indigo-800/50 transition-colors">
          <HelpCircle size={24} strokeWidth={1.8} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight transition-colors">Sıkça Sorulan Sorular</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-[15px] max-w-lg mx-auto transition-colors">
          Sistem kullanımı ve güvenlik politikalarımız hakkında merak ettiğiniz tüm teknik detaylar.
        </p>
      </div>

      {/* Accordion List (Visual) */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200/80 dark:border-zinc-800 overflow-hidden mb-10 transition-colors">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6 sm:p-8 group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
              <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-white mb-3 flex items-start gap-3 transition-colors">
                <span className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5 transition-colors"><ChevronRight size={16} strokeWidth={2.5} /></span> 
                {faq.q}
              </h3>
              <p className="text-[14px] text-zinc-500 dark:text-zinc-400 leading-relaxed pl-7 transition-colors">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Card */}
      <div className="bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
        <h3 className="text-lg font-bold text-white mb-2 relative z-10">Başka bir sorunuz mu var?</h3>
        <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto relative z-10">
          İşleyişi daha iyi kavramak için hemen ayarlar sayfanıza giderek sistemi test edebilirsiniz.
        </p>
        <Link 
          href="/settings"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm relative z-10"
        >
          Ayarlara Git <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>

    </div>
  );
}