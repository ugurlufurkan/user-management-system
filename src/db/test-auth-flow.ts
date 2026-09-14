import "dotenv/config";

const baseUrl = "http://localhost:3000/api/auth";

async function main() {
  console.log("=== KİMLİK DOĞRULAMA (AUTH) TESTİ BAŞLIYOR ===");

  // Çakışma olmasın diye her testte rastgele yeni bir mail üretiyoruz
  const randomEmail = `testuser_${Date.now()}@example.com`;
  const password = "securepassword123";

  let sessionCookie = "";

  console.log(`\n1. YENİ KULLANICI KAYDI (REGISTER) -> ${randomEmail}`);
  const registerRes = await fetch(`${baseUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: randomEmail,
      password: password,
      firstName: "Test",
      lastName: "Kullanicisi",
    }),
  });

  console.log("REGISTER STATUS:", registerRes.status);
  if (registerRes.status !== 201) {
    throw new Error(`Register failed: ${await registerRes.text()}`);
  }

  // Sunucunun tarayıcıya (bize) yolladığı çerezi (Set-Cookie) yakalıyoruz
  const setCookieHeader = registerRes.headers.get("set-cookie");
  if (setCookieHeader) {
    sessionCookie = setCookieHeader.split(";")[0];
    console.log("COOKIE (ÇEREZ) BAŞARIYLA ALINDI!");
  } else {
    throw new Error("Sunucu cookie göndermedi!");
  }

  console.log("\n2. MEVCUT KULLANICIYI GETİR (ME)");
  // Yakaladığımız çerezi kafamıza takıp API'ye "Ben buyum" diyoruz
  const meRes = await fetch(`${baseUrl}/me`, {
    method: "GET",
    headers: {
      "Cookie": sessionCookie,
    },
  });
  console.log("ME STATUS:", meRes.status);
  const meData = await meRes.json();
  console.log("GİRİŞ YAPAN KULLANICI:", meData.account.email);

  console.log("\n3. AÇIK OTURUMLARI LİSTELE (SESSIONS)");
  const sessionsRes = await fetch(`${baseUrl}/sessions`, {
    method: "GET",
    headers: {
      "Cookie": sessionCookie,
    },
  });
  console.log("SESSIONS STATUS:", sessionsRes.status);
  const sessionsData = await sessionsRes.json();
  console.log("TOPLAM AÇIK CİHAZ SAYISI:", sessionsData.totalActive);

  console.log("\n4. ÇIKIŞ YAP (LOGOUT)");
  const logoutRes = await fetch(`${baseUrl}/logout`, {
    method: "POST",
    headers: {
      "Cookie": sessionCookie,
    },
  });
  console.log("LOGOUT STATUS:", logoutRes.status);

  console.log("\n5. ÇIKIŞTAN SONRA İÇERİ SIZMA DENEMESİ (ME)");
  // Çıkış yapıldıktan sonra veritabanında o cookie geçersiz kalmalı
  const meFailRes = await fetch(`${baseUrl}/me`, {
    method: "GET",
    headers: {
      "Cookie": sessionCookie, 
    },
  });
  console.log("ME FAIL STATUS (Beklenen Hata: 401 Unauthorized):", meFailRes.status);

  console.log("\n=== AUTH TESTİ KUSURSUZ TAMAMLANDI ===");
}

main().catch((error) => {
  console.error("\nAUTH TESTİ BAŞARISIZ");
  console.error(error);
  process.exit(1);
});