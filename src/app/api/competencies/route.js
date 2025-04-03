import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Competency from "../../../../models/Competency";
import { auth } from "../../../../auth";

// GET all competencies
export async function GET() {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all competencies for the current user
    const competencies = await Competency.find({
      $or: [{ userId: session.user.id }, { userId: { $exists: false } }],
    })
      .populate("roleId", "jobRole")
      .sort({ createdAt: 1 });

    return NextResponse.json({ competencies }, { status: 200 });
  } catch (error) {
    console.error("Error fetching competencies:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Create or update a competency for a role
export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    if (
      !data.roleId ||
      !data.type ||
      !data.competencies ||
      !data.competencies.length
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if competency already exists for this role and type
    const existingCompetency = await Competency.findOne({
      roleId: data.roleId,
      type: data.type,
      $or: [{ userId: session.user.id }, { userId: { $exists: false } }],
    });

    let competency;

    if (existingCompetency) {
      // Update existing competency
      competency = await Competency.findByIdAndUpdate(
        existingCompetency._id,
        {
          competencies: data.competencies,
          userId: session.user.id,
        },
        { new: true }
      );
    } else {
      // Create new competency
      competency = await Competency.create({
        ...data,
        userId: session.user.id,
      });
    }

    return NextResponse.json({ competency }, { status: 201 });
  } catch (error) {
    console.error("Error creating/updating competency:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
