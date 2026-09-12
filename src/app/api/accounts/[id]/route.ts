import { NextResponse } from "next/server";
import { accountService } from "@/services/account.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const account = await accountService.findById(id);

    if (!account) {
      return NextResponse.json(
        {
          error: "Account not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(account, { status: 200 });
  } catch (error) {
    console.error("Account lookup failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch account",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}