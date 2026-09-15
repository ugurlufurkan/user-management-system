import { cookies } from "next/headers";
import { sessionService } from "@/services/session.service";
import { accountService } from "@/services/account.service";
import { errorResponse, successResponse } from "@/lib/api-response";
import { hashPassword, verifyPassword } from "@/lib/auth-utils";

// Veri GÜNCELLEME (Update) işlemleri için PUT veya PATCH kullanılır
export async function PUT(request: Request) {
  try {
    // 1. Önce güvenliği sağlıyoruz, adam kimliğini kanıtlamış mı?
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return errorResponse("Bu işlem için oturum açmanız gerekmektedir.", 401);
    }

    const activeSession = await sessionService.findByToken(sessionToken);
    
    if (!activeSession) {
      return errorResponse("Geçersiz veya süresi dolmuş oturum. Lütfen tekrar giriş yapın.", 401);
    }

    // 2. Gelen şifreleri al
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return errorResponse("Hem mevcut şifrenizi hem de yeni şifrenizi girmelisiniz.", 400);
    }

    if (newPassword.length < 6) {
      return errorResponse("Yeni şifreniz güvenlik sebebiyle en az 6 karakter olmalıdır.", 400);
    }

    // 3. Kullanıcının hesap bilgilerini veritabanından bul
    const account = await accountService.findById(activeSession.accountId);

    if (!account) {
      return errorResponse("Hesap bulunamadı.", 404);
    }

    // 4. Çok Kritik Kısım: Mevcut şifreyi (eski şifresini) doğru girmiş mi kontrol et!
    const isPasswordCorrect = verifyPassword(currentPassword, account.passwordHash);

    if (!isPasswordCorrect) {
      return errorResponse("Mevcut şifrenizi yanlış girdiniz. Lütfen tekrar deneyin.", 400);
    }

    // 5. Doğrulama başarılıysa, yeni şifreyi Kriptolayıp (Hashleyip) veritabanına kaydet
    const newPasswordHash = hashPassword(newPassword);

    await accountService.update(account.id, {
      passwordHash: newPasswordHash,
    });

    // Başarıyla tamamlandı
    return successResponse({ message: "Şifreniz başarıyla güncellendi." }, 200);

  } catch (error) {
    console.error("Şifre güncelleme hatası:", error);
    return errorResponse("Şifre güncellenirken sunucu hatası oluştu.", 500);
  }
}