import Link from "next/link";

export const metadata = {
  title: 'Sıkça Sorulan Sorular | Sistem',
  description: 'Kullanıcı yönetim sistemi hakkında sıkça sorulan sorular ve cevapları.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: "Şifremi nasıl değiştirebilirim?",
      a: "Ayarlar sayfasına giderek 'Güvenlik' sekmesi altından mevcut şifrenizi ve yeni şifrenizi girerek anında değişiklik yapabilirsiniz."
    },
    {
      q: "Bağlı olduğum departmanı (Section) değiştirebilir miyim?",
      a: "Evet, Ayarlar menüsünde yer alan 'Kişisel Bilgiler' kısmından açılır menüyü (dropdown) kullanarak farklı bir departman seçip kaydet butonuna basmanız yeterlidir."
    },
    {
      q: "Hesabımı silersem verilerime ne olur?",
      a: "Hesabınızı sildiğinizde (Ayarlar sayfasının en altındaki 'Tehlikeli Bölge'), size ve ailenize ait tüm veriler veritabanından kalıcı olarak ve geri döndürülemez şekilde tamamen silinir."
    },
    {
      q: "Diğer kullanıcıların bilgilerini düzenleyebilir miyim?",
      a: "Hayır. Sistemimiz sıkı bir güvenlik yapısına sahiptir. Üye rehberinden başkasının profiline girdiğinizde sistem sadece okuma (isReadOnly) modunda açılır ve düzenleme butonları gizlenir."
    },
    {
      q: "Kız arkadaş veya aile bilgisi girmek zorunlu mu?",
      a: "Hayır, bu alanlar tamamen opsiyoneldir. Profilinizi detaylandırmak isterseniz sonradan ekleyebilirsiniz."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-20 px-4">
      
      {/* Sayfa Başlığı */}
      <div className="text-center mb-12">
        <span className="text-6xl mb-4 block drop-shadow-sm">💡</span>
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">Sıkça Sorulan Sorular</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Sistem kullanımı hakkında merak ettiğiniz tüm detayları aşağıda bulabilirsiniz.
        </p>
      </div>

      {/* Soru & Cevap Listesi */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-12">
        <div className="divide-y divide-slate-100">
          {faqs.map((faq, index) => (
            <div key={index} className="p-8 hover:bg-slate-50 transition-colors group">
              <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-start gap-4">
                <span className="text-blue-500 font-black text-2xl group-hover:scale-110 transition-transform">S.</span> 
                {faq.q}
              </h3>
              <p className="text-slate-600 leading-relaxed flex items-start gap-4">
                <span className="text-emerald-500 font-black text-2xl group-hover:scale-110 transition-transform">C.</span> 
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ekstra Yönlendirme Kartı */}
      <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 p-10 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        
        <h3 className="text-2xl font-bold text-blue-900 mb-3 relative z-10">Başka bir sorunuz mu var?</h3>
        <p className="text-blue-700/80 mb-8 max-w-md mx-auto relative z-10">
          Aradığınız cevabı bulamadıysanız hemen ayarlar sayfanıza giderek sistemi bizzat test edebilirsiniz.
        </p>
        <Link 
          href="/settings"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-10 rounded-xl transition-all shadow-md inline-block relative z-10"
        >
          Ayarlara Git &rarr;
        </Link>
      </div>

    </div>
  );
}