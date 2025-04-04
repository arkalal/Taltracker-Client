import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import Competency from "../../../../../models/Competency";
import { auth } from "../../../../../auth";

// Get existing competency levels
export async function GET(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const competencies = await Competency.find({
      levels: { $exists: true, $not: { $size: 0 } },
    });

    return NextResponse.json({ competencies }, { status: 200 });
  } catch (error) {
    console.error("Error fetching competency levels:", error);
    return NextResponse.json(
      { error: "Failed to fetch competency levels" },
      { status: 500 }
    );
  }
}

// Add or update competency levels
export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestData = await request.json();
    const { competencyId, levels } = requestData;

    console.log("Request data:", JSON.stringify(requestData, null, 2));
    console.log("CompetencyId:", competencyId);
    console.log("Levels structure:", Array.isArray(levels), levels?.length);

    // Validate competencyId
    if (!competencyId) {
      return NextResponse.json(
        { error: "Missing competencyId" },
        { status: 400 }
      );
    }

    // Validate levels data
    if (!levels || !Array.isArray(levels)) {
      return NextResponse.json(
        { error: "Levels must be an array" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the competency first to validate it exists
    const competency = await Competency.findById(competencyId);

    if (!competency) {
      return NextResponse.json(
        { error: "Competency not found with ID: " + competencyId },
        { status: 404 }
      );
    }

    console.log(
      "Found competency:",
      competency.type,
      competency.competencies.length
    );

    // Update the competency
    const updatedCompetency = await Competency.findByIdAndUpdate(
      competencyId,
      {
        $set: {
          levels,
          hasLevels: true,
        },
      },
      { new: true }
    );

    if (!updatedCompetency) {
      return NextResponse.json(
        { error: "Failed to update competency after finding it" },
        { status: 500 }
      );
    }

    console.log("Successfully updated competency with levels");

    return NextResponse.json(
      { competency: updatedCompetency },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating competency levels:", error);
    return NextResponse.json(
      {
        error: "Failed to update competency levels",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
