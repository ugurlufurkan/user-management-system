import { cookies } from "next/headers";
import { sessionService } from "@/services/session.service";
import { accountService } from "@/services/account.service";
import {userService} from "@/services/user.service";
import {errorResponse, successResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;
    if (!sessionToken) {
        return errorResponse("Oturum açılmamış (Token yok)", 401);
    }
    // 1. Token geçerli mi ve süresi dolmamış mı kontrol et
    const activeSession = await sessionService.findByToken(sessionToken);
    if (!activeSession) {
      // Token tarayıcıda kalmış ama veritabanında silinmiş (Örn: Başka cihazdan çıkış yapılmış)
      cookieStore.delete("session_token");
      return errorResponse("Oturum süresi dolmuş veya geçersiz", 401);
    }
    // 2. İlgili hesabı bul
    const account = await accountService.findById(activeSession.accountId);
    if (!account) {
      return errorResponse("Hesap bulunamadı", 404);
    }
    // 3. Hesaba bağlı asıl Profil (User) verilerini getir
    const userProfile = await userService.findByAccountId(account.id);
    // Başarılı! (Şifreyi [passwordHash] bilerek dışarı göndermiyoruz, güvenlik şart!)
    return successResponse({
      account: {
        id: account.id,
        email: account.email,
        createdAt: account.createdAt,
      },
      profile: userProfile || null,
      session: {
        id: activeSession.id,
        userAgent: activeSession.userAgent,
        ipAddress: activeSession.ipAddress,
        expiresAt: activeSession.expiresAt,
      }
    });
  } catch (error) {
    console.error("Mevcut kullanıcı (me) kontrol hatası:", error);
    return errorResponse("Kimlik bilgileri doğrulanırken sunucu hatası oluştu", 500);
  }
}