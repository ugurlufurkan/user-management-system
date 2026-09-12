import { NextResponse } from "next/server";
import { userService } from "@/services/user.service";

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
      return NextResponse.json(
        {
          error: "accountId, firstName and lastName are required",
        },
        { status: 400 }
      );
    }

    if (!isValidUuid(accountId)) {
      return NextResponse.json(
        {
          error: "accountId must be a valid UUID",
        },
        { status: 400 }
      );
    }

    if (firstName.length < 2 || lastName.length < 2) {
      return NextResponse.json(
        {
          error: "firstName and lastName must be at least 2 characters",
        },
        { status: 400 }
      );
    }

    const newUser = await userService.create({
      accountId,
      firstName,
      lastName,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("User creation failed:", error);

    return NextResponse.json(
      {
        error: "Failed to create user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await userService.findAll();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("User listing failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}