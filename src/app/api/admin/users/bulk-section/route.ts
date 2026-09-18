import { NextResponse } from "next/server";
import { db } from "@/db";
import { user, section } from "@/db/schema";
import { inArray, eq } from "drizzle-orm";
import { getAdminAuth } from "@/lib/auth";
import { activityService } from "@/services/activity.service";

export async function PATCH(request: Request) {
  try {
    const admin = await getAdminAuth();
    if (!admin) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });

    const body = await request.json();
    const { ids, sectionId } = body;

    if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ error: "Kullanıcı seçilmedi" }, { status: 400 });
    if (!sectionId) return NextResponse.json({ error: "Departman seçilmedi" }, { status: 400 });

    // Hedef departmanın adını bul (Log için)
    const [targetSection] = await db.select().from(section).where(eq(section.id, sectionId));
    const sectionName = targetSection ? targetSection.name : "Bilinmeyen Departman";

    // Toplu departman güncelleme
    await db.update(user).set({ sectionId }).where(inArray(user.accountId, ids));

    // Sisteme log atıyoruz (logAction olarak düzeltildi)
    await activityService.logAction(
      admin.accountId,
      "Toplu Departman Taşıma",
      `${ids.length} adet kullanıcı "${sectionName}" departmanına taşındı.`
    );

    return NextResponse.json({ success: true, count: ids.length });
  } catch (error) {
    console.error("Toplu taşıma hatası:", error);
    return NextResponse.json({ error: "Kullanıcılar taşınırken hata oluştu" }, { status: 500 });
  }
}