import { NextResponse } from "next/server";
import { userGirlfriendService } from "@/services/user-girlfriend.service";
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

    const girlfriendInfo = await userGirlfriendService.findByUserId(userId);

    if (!girlfriendInfo) {
      return errorResponse("Girlfriend info not found", 404);
    }

    return successResponse(girlfriendInfo);
  } catch (error) {
    console.error("Girlfriend info lookup failed:", error);
    return errorResponse("Failed to fetch girlfriend info", 500, error instanceof Error ? error.message : "Unknown error");
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

    const existingGirlfriendInfo = await userGirlfriendService.findByUserId(userId);
    if (existingGirlfriendInfo) {
      return errorResponse("Girlfriend info already exists for this user", 400);
    }

    const body = await request.json();

    if (!body.firstName || typeof body.firstName !== "string" || body.firstName.trim().length < 2) {
       return errorResponse("firstName must be at least 2 characters", 400);
    }
    
    if (!body.lastName || typeof body.lastName !== "string" || body.lastName.trim().length < 2) {
       return errorResponse("lastName must be at least 2 characters", 400);
    }

    const newGirlfriendInfo = await userGirlfriendService.create({
      userId,
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
    });

    return successResponse(newGirlfriendInfo, 201);
  } catch (error) {
    console.error("Girlfriend info creation failed:", error);
    return errorResponse("Failed to create girlfriend info", 500, error instanceof Error ? error.message : "Unknown error");
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

    const body = await request.json();
    const updateData: { firstName?: string; lastName?: string } = {};

    if (body.firstName !== undefined) {
      if (typeof body.firstName !== "string" || body.firstName.trim().length < 2) {
        return errorResponse("firstName must be at least 2 characters", 400);
      }
      updateData.firstName = body.firstName.trim();
    }

    if (body.lastName !== undefined) {
      if (typeof body.lastName !== "string" || body.lastName.trim().length < 2) {
        return errorResponse("lastName must be at least 2 characters", 400);
      }
      updateData.lastName = body.lastName.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return errorResponse("At least one field is required", 400);
    }

    const updatedGirlfriendInfo = await userGirlfriendService.update(userId, updateData);

    if (!updatedGirlfriendInfo) {
      return errorResponse("Girlfriend info not found", 404);
    }

    return successResponse(updatedGirlfriendInfo);
  } catch (error) {
    console.error("Girlfriend info update failed:", error);
    return errorResponse("Failed to update girlfriend info", 500, error instanceof Error ? error.message : "Unknown error");
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

    const deletedGirlfriendInfo = await userGirlfriendService.delete(userId);

    if (!deletedGirlfriendInfo) {
      return errorResponse("Girlfriend info not found", 404);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Girlfriend info deletion failed:", error);
    return errorResponse("Failed to delete girlfriend info", 500, error instanceof Error ? error.message : "Unknown error");
  }
}