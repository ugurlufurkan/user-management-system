import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/auth";
import { sectionService } from "@/services/section.service";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminAuth();
    if (!admin) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });

    const { id } = await params;
    
    // Veritabanı şemasında "onDelete: set null" kurduğumuz için, 
    // departman silinse bile içindeki adamlar silinmez, sadece departmansız kalırlar.
    await sectionService.delete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Silme işlemi başarısız" }, { status: 500 });
  }
}