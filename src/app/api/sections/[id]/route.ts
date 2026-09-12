import { NextResponse } from "next/server";
import { sectionService } from "@/services/section.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const section = await sectionService.findById(id);

    if (!section) {
      return NextResponse.json(
        {
          error: "Section not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(section, { status: 200 });
  } catch (error) {
    console.error("Section lookup failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch section",
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

    const { name } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        {
          error: "name is required",
        },
        { status: 400 }
      );
    }

    const updatedSection = await sectionService.update(id, {
      name: name.trim(),
    });

    if (!updatedSection) {
      return NextResponse.json(
        {
          error: "Section not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSection, { status: 200 });
  } catch (error) {
    console.error("Section update failed:", error);

    return NextResponse.json(
      {
        error: "Failed to update section",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}