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