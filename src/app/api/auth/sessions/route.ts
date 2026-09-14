import { cookies } from "next/headers";
import { sessionService } from "@/services/session.service";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return errorResponse("Oturum açılmamış", 401);
    }

    // 1. Önce isteği yapan kullanıcının kendi oturumunu doğrula
    const currentSession = await sessionService.findByToken(sessionToken);
    if (!currentSession) {
      return errorResponse("Geçersiz oturum", 401);
    }

    // 2. Bu hesaba (accountId) ait tüm aktif oturumları (cihazları) veritabanından çek
    const allSessions = await sessionService.findActiveByAccountId(currentSession.accountId);

    // 3. Arayüzde "Bu Cihaz" yazabilmek için ufak bir düzenleme (mapping) yapıyoruz.
    // Güvenlik gereği "token" bilgisini asla dışarı göndermiyoruz!
    const formattedSessions = allSessions.map((session) => ({
      id: session.id,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      isCurrentDevice: session.id === currentSession.id, // Adamın şu an elinde tuttuğu cihaz mı?
    }));

    return successResponse({
      sessions: formattedSessions,
      totalActive: formattedSessions.length,
    });

  } catch (error) {
    console.error("Aktif oturumları getirme hatası:", error);
    return errorResponse("Oturumlar getirilirken sunucu hatası oluştu", 500);
  }
}