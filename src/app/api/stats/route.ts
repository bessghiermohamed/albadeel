import { NextResponse } from "next/server";
import { subjectsData, categories } from "@/lib/subjects-data";

export async function GET() {
  try {
    const totalSubjects = subjectsData.length;

    // Count by semester
    const semester1Count = subjectsData.filter((s) => s.semester === 1).length;
    const semester2Count = subjectsData.filter((s) => s.semester === 2).length;

    // Count by category
    const categoryCounts: Record<string, number> = {};
    for (const subject of subjectsData) {
      categoryCounts[subject.category] = (categoryCounts[subject.category] || 0) + 1;
    }

    // Count shared subjects
    const sharedCount = subjectsData.filter((s) => s.isShared).length;

    // Build category breakdown with labels
    const categoryBreakdown = categories.map((cat) => ({
      id: cat.id,
      label: cat.label,
      color: cat.color,
      icon: cat.icon,
      count: categoryCounts[cat.id] || 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalSubjects,
        bySemester: {
          1: semester1Count,
          2: semester2Count,
        },
        byCategory: categoryBreakdown,
        sharedCount,
      },
    });
  } catch (error) {
    console.error("[API /stats] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
