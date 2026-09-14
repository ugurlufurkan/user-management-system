import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { accountService } from "@/services/account.service";
import { userService } from "@/services/user.service";
import { sessionService } from "@/services/session.service";
import { hashPassword, generateSessionToken } from "@/lib/auth-utils";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    // 1. Girdileri doğrula
    if (!email || !email.includes("@")) {
      return errorResponse("Geçerli bir e-posta adresi giriniz", 400);
    }
    if (!password || password.length < 6) {
      return errorResponse("Şifre en az 6 karakter olmalıdır", 400);
    }
    if (!firstName || !lastName) {
      return errorResponse("Ad ve soyad zorunludur", 400);
    }

    // 2. E-posta zaten kayıtlı mı kontrol et
    const existingAccount = await accountService.findByEmail(email);
    if (existingAccount) {
      return errorResponse("Bu e-posta adresi ile zaten bir hesap var", 400);
    }

    // 3. Şifreyi güvenli bir şekilde hashle
    const passwordHash = hashPassword(password);

    // 4. Veritabanında Hesap (Account) oluştur
    const newAccount = await accountService.create({
      email,
      passwordHash,
    });

    // 5. Hesaba bağlı Kullanıcı Profilini (User) oluştur
    await userService.create({
      accountId: newAccount.id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });

    // 6. Kayıt başarılı olunca adama eziyet çektirmeden otomatik Oturum (Login) aç
    const token = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 günlük oturum

    const userAgent = request.headers.get("user-agent") || "Bilinmeyen Cihaz";
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Bilinmeyen IP";

    await sessionService.create({
      accountId: newAccount.id,
      token,
      userAgent,
      ipAddress,
      expiresAt,
    });

    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    // Başarıyla oluşturulduğunu dönüyoruz
    return successResponse({
      message: "Kayıt işlemi başarılı ve oturum açıldı",
      accountId: newAccount.id,
    }, 201);

  } catch (error) {
    console.error("Kayıt olma hatası:", error);
    return errorResponse("Kayıt işlemi sırasında sunucu hatası oluştu", 500);
  }
}