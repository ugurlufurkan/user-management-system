import { NextResponse } from "next/server";
import { userGirlfriendFamilyService } from "@/services/user-girlfriend-family.service";
import { userGirlfriendService } from "@/services/user-girlfriend.service";
import { errorResponse, successResponse } from "@/lib/api-response";

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

    const girlfriendInfo = await userGirlfriendService.findByUserId(userId);
    if (!girlfriendInfo) {
      return errorResponse("Girlfriend info not found", 404);
    }

    const familyInfo = await userGirlfriendFamilyService.findByGirlfriendId(girlfriendInfo.id);
    if (!familyInfo) {
      return errorResponse("Girlfriend family info not found", 404);
    }

    return successResponse(familyInfo);
  } catch (error) {
    console.error("Girlfriend family lookup failed:", error);
    return errorResponse("Failed to fetch girlfriend family info", 500, error instanceof Error ? error.message : "Unknown error");
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

    const girlfriendInfo = await userGirlfriendService.findByUserId(userId);
    if (!girlfriendInfo) {
      return errorResponse("Girlfriend info not found. Create girlfriend info first.", 404);
    }

    const existingFamilyInfo = await userGirlfriendFamilyService.findByGirlfriendId(girlfriendInfo.id);
    if (existingFamilyInfo) {
      return errorResponse("Girlfriend family info already exists", 400);
    }

    const body = await request.json();

    if (!body.fatherName || typeof body.fatherName !== "string" || body.fatherName.trim().length < 2) {
       return errorResponse("fatherName must be at least 2 characters", 400);
    }
    
    if (!body.motherName || typeof body.motherName !== "string" || body.motherName.trim().length < 2) {
       return errorResponse("motherName must be at least 2 characters", 400);
    }

    const newFamilyInfo = await userGirlfriendFamilyService.create({
      girlfriendId: girlfriendInfo.id,
      fatherName: body.fatherName.trim(),
      motherName: body.motherName.trim(),
    });

    return successResponse(newFamilyInfo, 201);
  } catch (error) {
    console.error("Girlfriend family creation failed:", error);
    return errorResponse("Failed to create girlfriend family info", 500, error instanceof Error ? error.message : "Unknown error");
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

    const girlfriendInfo = await userGirlfriendService.findByUserId(userId);
    if (!girlfriendInfo) {
      return errorResponse("Girlfriend info not found", 404);
    }

    const body = await request.json();
    const updateData: { fatherName?: string; motherName?: string } = {};

    if (body.fatherName !== undefined) {
      if (typeof body.fatherName !== "string" || body.fatherName.trim().length < 2) {
        return errorResponse("fatherName must be at least 2 characters", 400);
      }
      updateData.fatherName = body.fatherName.trim();
    }

    if (body.motherName !== undefined) {
      if (typeof body.motherName !== "string" || body.motherName.trim().length < 2) {
        return errorResponse("motherName must be at least 2 characters", 400);
      }
      updateData.motherName = body.motherName.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return errorResponse("At least one field is required", 400);
    }

    const updatedFamilyInfo = await userGirlfriendFamilyService.update(girlfriendInfo.id, updateData);

    if (!updatedFamilyInfo) {
      return errorResponse("Girlfriend family info not found", 404);
    }

    return successResponse(updatedFamilyInfo);
  } catch (error) {
    console.error("Girlfriend family update failed:", error);
    return errorResponse("Failed to update girlfriend family info", 500, error instanceof Error ? error.message : "Unknown error");
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

    const girlfriendInfo = await userGirlfriendService.findByUserId(userId);
    if (!girlfriendInfo) {
      return errorResponse("Girlfriend info not found", 404);
    }

    const deletedFamilyInfo = await userGirlfriendFamilyService.delete(girlfriendInfo.id);

    if (!deletedFamilyInfo) {
      return errorResponse("Girlfriend family info not found", 404);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Girlfriend family deletion failed:", error);
    return errorResponse("Failed to delete girlfriend family info", 500, error instanceof Error ? error.message : "Unknown error");
  }
}