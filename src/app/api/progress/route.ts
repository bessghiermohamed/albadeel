import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/progress?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const subjectId = searchParams.get("subjectId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }

    // If subjectId is provided, return progress for that specific subject
    if (subjectId) {
      const progress = await db.progress.findUnique({
        where: {
          userId_subjectId: { userId, subjectId },
        },
        include: {
          subject: true,
        },
      });

      if (!progress) {
        return NextResponse.json(
          { error: "Progress entry not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: progress,
      });
    }

    // Otherwise, return all progress entries for the user
    const progressList = await db.progress.findMany({
      where: { userId },
      include: {
        subject: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: progressList.length,
      data: progressList,
    });
  } catch (error) {
    console.error("[API /progress GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

// POST /api/progress — Create a new progress entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subjectId, status, progress, notes } = body;

    if (!userId || !subjectId) {
      return NextResponse.json(
        { error: "userId and subjectId are required" },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ["not_started", "in_progress", "completed"];
    const progressStatus = status || "not_started";
    if (!validStatuses.includes(progressStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate progress value if provided
    const progressValue = progress ?? 0;
    if (typeof progressValue !== "number" || progressValue < 0 || progressValue > 100) {
      return NextResponse.json(
        { error: "Progress must be a number between 0 and 100" },
        { status: 400 }
      );
    }

    // Check if progress entry already exists for this user+subject
    const existing = await db.progress.findUnique({
      where: {
        userId_subjectId: { userId, subjectId },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Progress entry already exists for this user and subject. Use PUT to update." },
        { status: 409 }
      );
    }

    const newProgress = await db.progress.create({
      data: {
        userId,
        subjectId,
        status: progressStatus,
        progress: progressValue,
        notes: notes ?? null,
      },
      include: {
        subject: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newProgress,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API /progress POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to create progress entry" },
      { status: 500 }
    );
  }
}

// PUT /api/progress — Update an existing progress entry
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subjectId, status, progress, notes } = body;

    if (!userId || !subjectId) {
      return NextResponse.json(
        { error: "userId and subjectId are required" },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status !== undefined) {
      const validStatuses = ["not_started", "in_progress", "completed"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }
    }

    // Validate progress value if provided
    if (progress !== undefined) {
      if (typeof progress !== "number" || progress < 0 || progress > 100) {
        return NextResponse.json(
          { error: "Progress must be a number between 0 and 100" },
          { status: 400 }
        );
      }
    }

    // Check if the progress entry exists
    const existing = await db.progress.findUnique({
      where: {
        userId_subjectId: { userId, subjectId },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Progress entry not found. Use POST to create a new entry." },
        { status: 404 }
      );
    }

    // Build update data object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (notes !== undefined) updateData.notes = notes;

    const updatedProgress = await db.progress.update({
      where: {
        userId_subjectId: { userId, subjectId },
      },
      data: updateData,
      include: {
        subject: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedProgress,
    });
  } catch (error) {
    console.error("[API /progress PUT] Error:", error);
    return NextResponse.json(
      { error: "Failed to update progress entry" },
      { status: 500 }
    );
  }
}
