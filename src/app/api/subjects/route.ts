import { NextRequest, NextResponse } from "next/server";
import {
  subjectsData,
  getSubjectsBySemester,
  getSubjectsByCategory,
  getSharedSubjects,
} from "@/lib/subjects-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const semesterParam = searchParams.get("semester");
    const categoryParam = searchParams.get("category");
    const sharedParam = searchParams.get("shared");

    let results = [...subjectsData];

    // Filter by semester if provided
    if (semesterParam) {
      const semester = parseInt(semesterParam, 10);
      if (semester === 1 || semester === 2) {
        results = getSubjectsBySemester(semester as 1 | 2);
      } else {
        return NextResponse.json(
          { error: "Invalid semester value. Must be 1 or 2." },
          { status: 400 }
        );
      }
    }

    // Filter by category if provided
    if (categoryParam) {
      results = results.filter((s) => s.category === categoryParam);
    }

    // Filter by shared status if provided
    if (sharedParam === "true") {
      if (!semesterParam && !categoryParam) {
        results = getSharedSubjects();
      } else {
        results = results.filter((s) => s.isShared);
      }
    }

    // Sort by order
    results.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("[API /subjects] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
