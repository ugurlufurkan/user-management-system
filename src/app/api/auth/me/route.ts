import { cookies } from "next/headers";
import { sessionService } from "@/services/session.service";
import { accountService } from "@/services/account.service";
import { userService } from "@/services/user.service";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;
    
    if (!sessionToken) {
      return errorResponse("Oturum açılmamış (Token yok)", 401);
    }
    
    const activeSession = await sessionService.findByToken(sessionToken);
    
    if (!activeSession) {
      cookieStore.delete("session_token");
      return errorResponse("Oturum süresi dolmuş veya geçersiz", 401);
    }
    
    const account = await accountService.findById(activeSession.accountId);
    
    if (!account) {
      return errorResponse("Hesap bulunamadı", 404);
    }
    
    // GET işleminde kod değişmiyor, çünkü arka planda userService zaten JOIN yapıp departman adını da çekecek
    const userProfile = await userService.findByAccountId(account.id);
    
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

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;
    
    if (!sessionToken) {
      return errorResponse("Bu işlemi yapmak için giriş yapmalısınız.", 401);
    }
    
    const activeSession = await sessionService.findByToken(sessionToken);
    if (!activeSession) {
      return errorResponse("Oturum süresi dolmuş, lütfen tekrar giriş yapın.", 401);
    }
    
    const userProfile = await userService.findByAccountId(activeSession.accountId);
    if (!userProfile) {
      return errorResponse("Kullanıcı profili bulunamadı.", 404);
    }
    
    const body = await request.json();
    
    // JSON ayrıştırıcıdan (Parser) sectionId'yi de çıkartıyoruz!
    const { firstName, lastName, sectionId } = body; 
    
    if (!firstName || !lastName) {
      return errorResponse("Ad ve Soyad alanları boş bırakılamaz.", 400);
    }
    
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      return errorResponse("Ad ve Soyad en az 2 karakter olmalıdır.", 400);
    }
    
    // Profili güncelliyoruz ve sectionId'yi veritabanına kaydediyoruz
    const updatedProfile = await userService.update(userProfile.id, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      // Eğer kullanıcı departman seçmediyse (Boş ise) veritabanına null gönder.
      sectionId: sectionId === "" ? null : sectionId, 
    });
    
    return successResponse({ 
      message: "Profil bilgileriniz başarıyla güncellendi.",
      profile: updatedProfile 
    }, 200);
    
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    return errorResponse("Profil güncellenirken sunucu hatası oluştu.", 500);
  }
}