import { cookies } from "next/headers";
import { sessionService } from "@/services/session.service";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      // Tarayıcıda zaten bir token yoksa, adam giriş yapmamış demektir.
      return errorResponse("Aktif bir oturum bulunamadı", 401);
    }

    // 1. Veritabanından bu token'a ait oturumu bul ve tamamen sil (Geçersiz kıl)
    await sessionService.revokeByToken(sessionToken);

    // 2. Tarayıcıdaki çerezi (cookie) silerek kullanıcının cihazından izleri temizle
    cookieStore.delete("session_token");

    return successResponse({
      message: "Başarıyla çıkış yapıldı",
    });

  } catch (error) {
    console.error("Çıkış işlemi başarısız:", error);
    return errorResponse("Çıkış işlemi sırasında sunucu hatası oluştu", 500);
  }
}