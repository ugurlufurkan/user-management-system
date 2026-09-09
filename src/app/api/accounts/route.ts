import { NextResponse } from "next/server";
import { accountService } from "@/services/account.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, passwordHash } = body;

    if (!email || !passwordHash) {
      return NextResponse.json(
        {
          error: "email and passwordHash are required",
        },
        { status: 400 }
      );
    }

    const account = await accountService.create({
      email,
      passwordHash,
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error("Account creation failed:", error);

    return NextResponse.json(
      {
        error: "Failed to create account",
      },
      { status: 500 }
    );
  }
}