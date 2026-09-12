import { NextResponse } from "next/server";
import { userService } from "@/services/user.service";
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
    const { id } = await params;

    if (!isValidUuid(id)) {
      return errorResponse("Invalid user id", 400);
    }

    const user = await userService.findById(id);

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user);
  } catch (error) {
    console.error("User lookup failed:", error);

    return errorResponse(
      "Failed to fetch user",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isValidUuid(id)) {
      return errorResponse("Invalid user id", 400);
    }

    const body = await request.json();

    const hasFirstName = Object.prototype.hasOwnProperty.call(
      body,
      "firstName"
    );

    const hasLastName = Object.prototype.hasOwnProperty.call(
      body,
      "lastName"
    );

    if (!hasFirstName && !hasLastName) {
      return errorResponse(
        "At least one field is required",
        400
      );
    }

    if (
      hasFirstName &&
      (typeof body.firstName !== "string" ||
        body.firstName.trim().length < 2)
    ) {
      return errorResponse(
        "firstName must be at least 2 characters",
        400
      );
    }

    if (
      hasLastName &&
      (typeof body.lastName !== "string" ||
        body.lastName.trim().length < 2)
    ) {
      return errorResponse(
        "lastName must be at least 2 characters",
        400
      );
    }

    const firstName = hasFirstName
      ? body.firstName.trim()
      : undefined;

    const lastName = hasLastName
      ? body.lastName.trim()
      : undefined;

    const user = await userService.update(id, {
      firstName,
      lastName,
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user);
  } catch (error) {
    console.error("User update failed:", error);

    return errorResponse(
      "Failed to update user",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isValidUuid(id)) {
      return errorResponse("Invalid user id", 400);
    }

    const deletedUser = await userService.delete(id);

    if (!deletedUser) {
      return errorResponse("User not found", 404);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("User deletion failed:", error);

    return errorResponse(
      "Failed to delete user",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}