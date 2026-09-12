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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { email, passwordHash } = body;

    if (!email && !passwordHash) {
      return NextResponse.json(
        {
          error: "At least one field is required",
        },
        { status: 400 }
      );
    }

    const updatedAccount = await accountService.update(id, {
      ...(email !== undefined && { email }),
      ...(passwordHash !== undefined && { passwordHash }),
    });

    if (!updatedAccount) {
      return NextResponse.json(
        {
          error: "Account not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAccount, { status: 200 });
  } catch (error) {
    console.error("Account update failed:", error);

    return NextResponse.json(
      {
        error: "Failed to update account",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedAccount = await accountService.delete(id);

    if (!deletedAccount) {
      return NextResponse.json(
        {
          error: "Account not found",
        },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Account deletion failed:", error);

    return NextResponse.json(
      {
        error: "Failed to delete account",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}