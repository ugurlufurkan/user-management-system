import { cookies } from "next/headers";
import { sessionService } from "@/services/session.service";

/**
 * Sunucu tarafında (Server Components) Admin kontrolü yapar.
 * Mevcut servisi kullanarak mimari bütünlüğü korur.
 */
export async function getAdminAuth() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;

  try {
    const authUser = await sessionService.getAuthUserByToken(sessionToken);

    if (!authUser) return null;
    if (authUser.role !== "ADMIN") return null;

    return authUser;
  } catch (error) {
    console.error("Yönetici yetki kontrolü başarısız:", error);
    return null;
  }
}