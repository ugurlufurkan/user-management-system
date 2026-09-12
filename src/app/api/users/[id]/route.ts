import { NextResponse } from "next/server";
import { userService } from "@/services/user.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await userService.findById(id);

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("User lookup failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch user",
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

    const hasFirstName = Object.prototype.hasOwnProperty.call(
      body,
      "firstName"
    );

    const hasLastName = Object.prototype.hasOwnProperty.call(
      body,
      "lastName"
    );

    if (!hasFirstName && !hasLastName) {
      return NextResponse.json(
        {
          error: "At least one field is required",
        },
        { status: 400 }
      );
    }

    if (
      hasFirstName &&
      (typeof body.firstName !== "string" ||
        body.firstName.trim().length < 2)
    ) {
      return NextResponse.json(
        {
          error: "firstName must be at least 2 characters",
        },
        { status: 400 }
      );
    }

    if (
      hasLastName &&
      (typeof body.lastName !== "string" ||
        body.lastName.trim().length < 2)
    ) {
      return NextResponse.json(
        {
          error: "lastName must be at least 2 characters",
        },
        { status: 400 }
      );
    }

    const firstName = hasFirstName ? body.firstName.trim() : undefined;
    const lastName = hasLastName ? body.lastName.trim() : undefined;

    const user = await userService.update(id, {
      firstName,
      lastName,
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("User update failed:", error);

    return NextResponse.json(
      {
        error: "Failed to update user",
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

    const deletedUser = await userService.delete(id);

    if (!deletedUser) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("User deletion failed:", error);

    return NextResponse.json(
      {
        error: "Failed to delete user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}