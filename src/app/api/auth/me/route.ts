import { cookies } from "next/headers";
import { sessionService } from "@/services/session.service";
import { accountService } from "@/services/account.service";
import { userService } from "@/services/user.service";
import { errorResponse, successResponse } from "@/lib/api-response";

// 1. Kullanıcının kendi bilgilerini ÇEKMESİ (GET)
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

// Profil (İsim/Soyisim) GÜNCELLEMESİ (PATCH)
export async function PATCH(request: Request) {
  try {
    // Önce adam giriş yapmış mı kontrol edelim
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;
    
    if (!sessionToken) {
      return errorResponse("Bu işlemi yapmak için giriş yapmalısınız.", 401);
    }
    
    const activeSession = await sessionService.findByToken(sessionToken);
    if (!activeSession) {
      return errorResponse("Oturum süresi dolmuş, lütfen tekrar giriş yapın.", 401);
    }
    
    // Ad ve soyad 'user' tablosunda tutuluyor. Önce o tabloyu bulalım.
    const userProfile = await userService.findByAccountId(activeSession.accountId);
    if (!userProfile) {
      return errorResponse("Kullanıcı profili bulunamadı.", 404);
    }
    
    // Frontend'den gönderilen yeni isimleri (JSON Parser ile) açıyoruz
    const body = await request.json();
    const { firstName, lastName } = body;
    
    if (!firstName || !lastName) {
      return errorResponse("Ad ve Soyad alanları boş bırakılamaz.", 400);
    }
    
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      return errorResponse("Ad ve Soyad en az 2 karakter olmalıdır.", 400);
    }
    
    // Veritabanında ismi güncelliyoruz
    const updatedProfile = await userService.update(userProfile.id, {
      firstName: firstName.trim(),
      lastName: lastName.trim()
    });
    
    // İşlem başarılı!
    return successResponse({ 
      message: "Profil bilgileriniz başarıyla güncellendi.",
      profile: updatedProfile 
    }, 200);
    
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    return errorResponse("Profil güncellenirken sunucu hatası oluştu.", 500);
  }
}