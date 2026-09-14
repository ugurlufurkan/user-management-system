import { cookies } from "next/headers";
import { sessionService } from "@/services/session.service";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionIdToDelete } = await params;
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return errorResponse("Oturum açılmamış", 401);
    }

    // 1. İsteği yapan kişinin mevcut oturumunu doğrula
    const currentSession = await sessionService.findByToken(sessionToken);
    if (!currentSession) {
      return errorResponse("Geçersiz oturum", 401);
    }
    
    // Kullanıcının tüm açık cihazlarını çekip, silmek istediği ID bu listede var mı bakıyoruz.
    const allSessions = await sessionService.findActiveByAccountId(currentSession.accountId);
    const isOwner = allSessions.some(session => session.id === sessionIdToDelete);

    if (!isOwner) {
      return errorResponse("Bu oturum size ait değil veya zaten kapatılmış", 403); // Hack koruması
    }

    // 3. Eğer adamın kapattığı oturum, "şu an elinde tuttuğu cihazın" oturumuysa, çerezi de temizliyoruz
    if (currentSession.id === sessionIdToDelete) {
      cookieStore.delete("session_token");
    }

    // 4. Veritabanından oturumu sil
    await sessionService.delete(sessionIdToDelete);

    return successResponse({
      message: "Seçili oturum başarıyla kapatıldı",
    });

  } catch (error) {
    console.error("Oturum kapatma hatası:", error);
    return errorResponse("Oturum kapatılırken sunucu hatası oluştu", 500);
  }
}