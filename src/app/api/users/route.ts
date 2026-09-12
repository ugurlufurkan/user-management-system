import { NextResponse } from "next/server";
import { userService } from "@/services/user.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { accountId, firstName, lastName } = body;

    if (!accountId || !firstName || !lastName) {
      return NextResponse.json(
        {
          error: "accountId, firstName and lastName are required",
        },
        { status: 400 }
      );
    }

    const newUser = await userService.create({
      accountId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
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