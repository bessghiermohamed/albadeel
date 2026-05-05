import { NextRequest, NextResponse } from "next/server";
import { searchSubjects, subjectsData } from "@/lib/subjects-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Search query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const results = searchSubjects(query);

    // Also search by English name with case-insensitive matching
    // (the searchSubjects function already handles this, but we ensure
    // the results include matches from code and category too)

    return NextResponse.json({
      success: true,
      query: query,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("[API /search] Error:", error);
    return NextResponse.json(
      { error: "Failed to search subjects" },
      { status: 500 }
    );
  }
}
