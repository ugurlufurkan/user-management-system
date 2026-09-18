import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/auth";
import { accountService } from "@/services/account.service";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Güvenlik: İstek atan kişi gerçekten ADMIN mi?
    const admin = await getAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { id: accountId } = await params;
    
    // Güvenlik: Adminin kendini silmesini engelle
    if (accountId === admin.accountId) {
      return NextResponse.json({ error: "Kendi yönetici hesabınızı silemezsiniz!" }, { status: 400 });
    }

    // Hesabı sil (Veritabanındaki Cascade yapısı sayesinde User, Session ve tüm profiller otomatik silinir)
    await accountService.delete(accountId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kullanıcı silinemedi:", error);
    return NextResponse.json({ error: "Silme işlemi sırasında hata oluştu" }, { status: 500 });
  }
}