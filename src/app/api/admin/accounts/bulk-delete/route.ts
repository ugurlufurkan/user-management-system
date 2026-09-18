import { NextResponse } from "next/server";
import { db } from "@/db";
import { account } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { getAdminAuth } from "@/lib/auth";
import { activityService } from "@/services/activity.service";

export async function DELETE(request: Request) {
  try {
    const admin = await getAdminAuth();
    if (!admin) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });

    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Silinecek kullanıcı seçilmedi" }, { status: 400 });
    }

    // Toplu silme
    await db.delete(account).where(inArray(account.id, ids));

    // Sisteme log atıyoruz (logAction olarak düzeltildi)
    await activityService.logAction(
      admin.accountId,
      "Toplu Kullanıcı Silme",
      `${ids.length} adet kullanıcı sistemden kalıcı olarak silindi.`
    );

    return NextResponse.json({ success: true, count: ids.length });
  } catch (error) {
    console.error("Toplu silme hatası:", error);
    return NextResponse.json({ error: "Kullanıcılar silinirken bir hata oluştu" }, { status: 500 });
  }
}