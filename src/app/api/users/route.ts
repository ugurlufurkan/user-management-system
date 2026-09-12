import { NextResponse } from "next/server";
import { userService } from "@/services/user.service";
import { errorResponse, successResponse } from "@/lib/api-response";

function isValidUuid(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const accountId =
      typeof body.accountId === "string" ? body.accountId.trim() : "";

    const firstName =
      typeof body.firstName === "string" ? body.firstName.trim() : "";

    const lastName =
      typeof body.lastName === "string" ? body.lastName.trim() : "";

    if (!accountId || !firstName || !lastName) {
      return errorResponse(
        "accountId, firstName and lastName are required",
        400
      );
    }

    if (!isValidUuid(accountId)) {
      return errorResponse(
        "accountId must be a valid UUID",
        400
      );
    }

    if (firstName.length < 2 || lastName.length < 2) {
      return errorResponse(
        "firstName and lastName must be at least 2 characters",
        400
      );
    }

    const newUser = await userService.create({
      accountId,
      firstName,
      lastName,
    });

    return successResponse(newUser, 201);
  } catch (error) {
    console.error("User creation failed:", error);

    return errorResponse(
      "Failed to create user",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function GET() {
  try {
    const users = await userService.findAll();

    return successResponse(users);
  } catch (error) {
    console.error("User listing failed:", error);

    return errorResponse(
      "Failed to fetch users",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}