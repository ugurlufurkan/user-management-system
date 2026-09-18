import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/auth";
import { sectionService } from "@/services/section.service";

export async function POST(request: Request) {
  try {
    const admin = await getAdminAuth();
    if (!admin) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });

    const body = await request.json();
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json({ error: "Geçerli bir departman adı girin" }, { status: 400 });
    }

    const newSection = await sectionService.create({ name: body.name.trim() });
    return NextResponse.json({ success: true, section: newSection });
  } catch (error: any) {
    if (error.code === '23505') { // PostgreSQL Unique Constraint hatası
      return NextResponse.json({ error: "Bu departman zaten sistemde mevcut" }, { status: 400 });
    }
    return NextResponse.json({ error: "Departman oluşturulamadı" }, { status: 500 });
  }
}