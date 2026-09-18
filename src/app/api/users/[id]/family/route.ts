import { NextResponse } from "next/server";
import { userFamilyService } from "@/services/user-family.service";
import { errorResponse, successResponse } from "@/lib/api-response";
import { userService } from "@/services/user.service";

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    if (!isValidUuid(userId)) {
      return errorResponse("Invalid user id", 400);
    }

    const familyInfo = await userFamilyService.findByUserId(userId);

    if (!familyInfo) {
      return errorResponse("Family info not found", 404);
    }

    return successResponse(familyInfo);
  } catch (error) {
    console.error("Family info lookup failed:", error);
    return errorResponse("Failed to fetch family info", 500, error instanceof Error ? error.message : "Unknown error");
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    if (!isValidUuid(userId)) {
      return errorResponse("Invalid user id", 400);
    }

    const user = await userService.findById(userId);
    if (!user) {
      return errorResponse("User not found", 404);
    }

    const existingFamilyInfo = await userFamilyService.findByUserId(userId);
    if (existingFamilyInfo) {
      return errorResponse("Family info already exists for this user", 400);
    }

    const body = await request.json();

    if (!body.fatherName || typeof body.fatherName !== "string" || body.fatherName.trim().length < 2) {
      return errorResponse("Baba adı en az 2 karakter olmalıdır!", 400);
    }
    
    if (!body.motherName || typeof body.motherName !== "string" || body.motherName.trim().length < 2) {
      return errorResponse("Anne adı en az 2 karakter olmalıdır!", 400);
    }

    const newFamilyInfo = await userFamilyService.create({
      userId,
      fatherName: body.fatherName.trim(),
      motherName: body.motherName.trim(),
      siblingCount: body.siblingCount,
    });

    return successResponse(newFamilyInfo, 201);
  } catch (error) {
    console.error("Family info creation failed:", error);
    return errorResponse("Kayıt işlemi başarısız", 500, error instanceof Error ? error.message : "Unknown error");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    if (!isValidUuid(userId)) {
      return errorResponse("Invalid user id", 400);
    }

    const existingFamilyInfo = await userFamilyService.findByUserId(userId);
    if (!existingFamilyInfo) {
      return errorResponse("Family info not found", 404);
    }

    const body = await request.json();
    const updateData: { fatherName?: string; motherName?: string; siblingCount?: number } = {};

    if (body.fatherName !== undefined) {
      if (typeof body.fatherName !== "string" || body.fatherName.trim().length < 2) {
        return errorResponse("Baba adı en az 2 karakter olmalıdır!", 400);
      }
      updateData.fatherName = body.fatherName.trim();
    }

    if (body.motherName !== undefined) {
      if (typeof body.motherName !== "string" || body.motherName.trim().length < 2) {
        return errorResponse("Anne adı en az 2 karakter olmalıdır!", 400);
      }
      updateData.motherName = body.motherName.trim();
    }

    if (body.siblingCount !== undefined) {
      updateData.siblingCount = body.siblingCount;
    }

    if (Object.keys(updateData).length === 0) {
      return errorResponse("At least one field is required", 400);
    }

    const updatedFamilyInfo = await userFamilyService.update(userId, updateData);

    if (!updatedFamilyInfo) {
      return errorResponse("Family info not found", 404);
    }

    return successResponse(updatedFamilyInfo);
  } catch (error) {
    console.error("Family info update failed:", error);
    return errorResponse("Failed to update family info", 500, error instanceof Error ? error.message : "Unknown error");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    if (!isValidUuid(userId)) {
      return errorResponse("Invalid user id", 400);
    }

    const deletedFamilyInfo = await userFamilyService.delete(userId);

    if (!deletedFamilyInfo) {
      return errorResponse("Family info not found", 404);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Family info deletion failed:", error);
    return errorResponse("Failed to delete family info", 500, error instanceof Error ? error.message : "Unknown error");
  }
}