import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/auth";
import { accountService } from "@/services/account.service";
import { activityService } from "@/services/activity.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminAuth();
    if (!admin) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();
    
    // Güvenlik: Admin kendi kendini yetkisiz yapamasın
    if (id === admin.accountId) {
      return NextResponse.json({ error: "Kendi yetkinizi değiştiremezsiniz!" }, { status: 400 });
    }

    // Yetkiyi güncelle (USER -> ADMIN veya ADMIN -> USER)
    const updated = await accountService.update(id, { role: body.role });
    
    // Sisteme Log (Timeline) Olarak Kaydet! (Patron bunu görünce çıldıracak)
    await activityService.logAction(
      admin.accountId, 
      "Yetki Değişimi", 
      `Bir kullanıcının sistem yetkisi '${body.role}' olarak güncellendi.`
    );

    return NextResponse.json({ success: true, role: updated?.role });
  } catch (error) {
    console.error("Yetki değiştirme hatası:", error);
    return NextResponse.json({ error: "Yetki güncellenemedi" }, { status: 500 });
  }
}