import { NextResponse } from "next/server";
import { sectionService } from "@/services/section.service";

export async function POST(request: Request) {
  try {
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

    const newSection = await sectionService.create({
      name: name.trim(),
    });

    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error("Section creation failed:", error);

    return NextResponse.json(
      {
        error: "Failed to create section",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sections = await sectionService.findAll();

    return NextResponse.json(sections, { status: 200 });
  } catch (error) {
    console.error("Section listing failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch sections",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}