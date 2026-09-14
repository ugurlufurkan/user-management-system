import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { accountService } from "@/services/account.service";
import { sessionService } from "@/services/session.service";
import { verifyPassword, generateSessionToken } from "@/lib/auth-utils";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Basit doğrulama
    if (!email || !password) {
      return errorResponse("E-posta ve şifre zorunludur", 400);
    }

    // 2. Hesabı veritabanında ara
    const account = await accountService.findByEmail(email);
    if (!account) {
      // Güvenlik için e-posta yoksa bile şifre yanlışmış gibi aynı mesajı dönüyoruz (User enumeration engelleme)
      return errorResponse("E-posta veya şifre hatalı", 401);
    }

    // 3. Şifreyi doğrula
    const isValid = verifyPassword(password, account.passwordHash);
    if (!isValid) {
      return errorResponse("E-posta veya şifre hatalı", 401);
    }

    // 4. Yeni oturum (Session) token'ı oluştur ve 30 günlük ömür biç
    const token = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); 

    // 5. İstek atan cihazın ve internetin bilgilerini al (Profilde "Açık Oturumlar" kısmında göstermek için)
    const userAgent = request.headers.get("user-agent") || "Bilinmeyen Cihaz";
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Bilinmeyen IP";

    // 6. Bu oturumu veritabanına kaydet
    await sessionService.create({
      accountId: account.id,
      token,
      userAgent,
      ipAddress,
      expiresAt,
    });

    // 7. Token'ı HTTP-Only çerez (cookie) olarak kullanıcının tarayıcısına mühürle
    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
      httpOnly: true, // Tarayıcıdaki JavaScript'ler bu cookie'yi okuyamaz (Güvenlik)
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return successResponse({
      message: "Giriş başarılı",
      accountId: account.id,
    });

  } catch (error) {
    console.error("Giriş işlemi başarısız:", error);
    return errorResponse("Giriş işlemi sırasında sunucu hatası oluştu", 500);
  }
}