import { cookies } from "next/headers";
import { sessionService } from "@/services/session.service";
import { accountService } from "@/services/account.service";
import { errorResponse, successResponse } from "@/lib/api-response";

// Veri SİLME işlemleri için DELETE metodu kullanılır
export async function DELETE(request: Request) {
  try {
    // 1. Kullanıcının oturumunu kontrol et
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return errorResponse("Bu işlem için oturum açmanız gerekmektedir.", 401);
    }

    const activeSession = await sessionService.findByToken(sessionToken);
    
    if (!activeSession) {
      return errorResponse("Geçersiz veya süresi dolmuş oturum. Lütfen tekrar giriş yapın.", 401);
    }

    // 2. Çok Kritik İşlem: Hesap silme talebini veritabanına ilet!
    // CASCADE (Zincirleme silme) özelliği sayesinde;
    // Hesap silinince -> Profil Silinir -> Aile Bilgileri Silinir -> Kız Arkadaş Silinir -> Tüm cihaz oturumları kapatılır!
    const deletedAccount = await accountService.delete(activeSession.accountId);

    if (!deletedAccount) {
      return errorResponse("Hesap bulunamadı veya daha önceden silinmiş.", 404);
    }

    // 3. Hesap artık yok, adamın tarayıcısında kalan giriş biletini (cookie) de yok edelim
    cookieStore.delete("session_token");

    // İşlem başarılı!
    return successResponse({ message: "Hesabınız ve tüm verileriniz sistemden kalıcı olarak silindi." }, 200);

  } catch (error) {
    console.error("Hesap silme hatası:", error);
    return errorResponse("Hesap silinirken sunucu hatası oluştu.", 500);
  }
}