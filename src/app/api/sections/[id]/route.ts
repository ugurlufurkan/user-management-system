import { cookies } from "next/headers";
import { sectionService } from "@/services/section.service";
import { errorResponse, successResponse } from "@/lib/api-response";

// Gelen ID'nin geçerli bir veritabanı ID'si (UUID) olup olmadığını kontrol eden fonksiyon
function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

// BÖLÜM (DEPARTMAN) SİLME İŞLEMİ
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("session_token")) {
      return errorResponse("Bu işlemi yapmak için giriş yapmalısınız.", 401);
    }

    const { id } = await params; // Hangi bölüm silinecek?
    
    if (!isValidUuid(id)) {
      return errorResponse("Geçersiz bölüm ID'si.", 400);
    }

    const deletedSection = await sectionService.delete(id);
    
    if (!deletedSection) {
      return errorResponse("Silinmek istenen bölüm bulunamadı.", 404);
    }

    return successResponse({ message: "Bölüm başarıyla silindi." }, 200);
  } catch (error) {
    console.error("Bölüm silme hatası:", error);
    return errorResponse("Bölüm silinirken sunucu hatası oluştu.", 500);
  }
}

// BÖLÜM İSMİNİ GÜNCELLEME İŞLEMİ
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("session_token")) {
      return errorResponse("Bu işlemi yapmak için giriş yapmalısınız.", 401);
    }

    const { id } = await params;
    
    if (!isValidUuid(id)) {
      return errorResponse("Geçersiz bölüm ID'si.", 400);
    }

    const body = await request.json();
    
    if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
      return errorResponse("Geçerli bir bölüm adı giriniz (En az 2 karakter olmalıdır).", 400);
    }

    const updatedSection = await sectionService.update(id, { name: body.name.trim() });
    
    if (!updatedSection) {
      return errorResponse("Güncellenmek istenen bölüm bulunamadı.", 404);
    }

    return successResponse(updatedSection, 200);
  } catch (error) {
    console.error("Bölüm güncelleme hatası:", error);
    return errorResponse("Bölüm güncellenirken sunucu hatası oluştu.", 500);
  }
}