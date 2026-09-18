import { NextResponse } from "next/server";
import { userGirlfriendService } from "@/services/user-girlfriend.service";
import { errorResponse, successResponse } from "@/lib/api-response";
import { userService } from "@/services/user.service";

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await params;
    if (!isValidUuid(userId)) return errorResponse("Geçersiz kullanıcı ID", 400);

    const girlfriendInfo = await userGirlfriendService.findByUserId(userId);
    if (!girlfriendInfo) return errorResponse("Kız arkadaş bilgisi bulunamadı", 404);

    return successResponse(girlfriendInfo);
  } catch (error) {
    return errorResponse("Bilgiler alınamadı", 500, error instanceof Error ? error.message : "Unknown error");
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await params;
    if (!isValidUuid(userId)) return errorResponse("Geçersiz kullanıcı ID", 400);

    const user = await userService.findById(userId);
    if (!user) return errorResponse("Kullanıcı bulunamadı", 404);

    const existingGirlfriendInfo = await userGirlfriendService.findByUserId(userId);
    if (existingGirlfriendInfo) return errorResponse("Kız arkadaş bilgisi zaten mevcut", 400);

    const body = await request.json();

    if (!body.firstName || typeof body.firstName !== "string" || body.firstName.trim().length < 2) {
       return errorResponse("İsim en az 2 karakter olmalıdır!", 400);
    }
    if (!body.lastName || typeof body.lastName !== "string" || body.lastName.trim().length < 2) {
       return errorResponse("Soyisim en az 2 karakter olmalıdır!", 400);
    }

    const newGirlfriendInfo = await userGirlfriendService.create({
      userId,
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      age: body.age,
      city: body.city,
    });

    return successResponse(newGirlfriendInfo, 201);
  } catch (error) {
    return errorResponse("Kayıt işlemi başarısız", 500, error instanceof Error ? error.message : "Unknown error");
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await params;
    if (!isValidUuid(userId)) return errorResponse("Geçersiz kullanıcı ID", 400);

    const existingGirlfriendInfo = await userGirlfriendService.findByUserId(userId);
    if (!existingGirlfriendInfo) return errorResponse("Kız arkadaş bilgisi bulunamadı", 404);

    const body = await request.json();

    if (body.firstName !== undefined && (typeof body.firstName !== "string" || body.firstName.trim().length < 2)) {
      return errorResponse("İsim en az 2 karakter olmalıdır!", 400);
    }
    if (body.lastName !== undefined && (typeof body.lastName !== "string" || body.lastName.trim().length < 2)) {
      return errorResponse("Soyisim en az 2 karakter olmalıdır!", 400);
    }

    const updatedGirlfriendInfo = await userGirlfriendService.update(userId, {
      firstName: body.firstName?.trim(),
      lastName: body.lastName?.trim(),
      age: body.age,
      city: body.city,
    });

    return successResponse(updatedGirlfriendInfo);
  } catch (error) {
    return errorResponse("Güncelleme başarısız", 500, error instanceof Error ? error.message : "Unknown error");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    if (!isValidUuid(userId)) return errorResponse("Geçersiz kullanıcı ID", 400);

    await userGirlfriendService.delete(userId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return errorResponse("Silme işlemi başarısız", 500, error instanceof Error ? error.message : "Unknown error");
  }
}