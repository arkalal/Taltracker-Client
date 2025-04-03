import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import Competency from "../../../../../models/Competency";
import { auth } from "../../../../../auth";

// GET a specific competency
export async function GET(request, { params }) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    // Find the competency that either:
    // 1. Has the current user's ID, or
    // 2. Has no userId (may be a shared competency)
    const competency = await Competency.findOne({
      _id: id,
      $or: [{ userId: session.user.id }, { userId: { $exists: false } }],
    });

    if (!competency) {
      return NextResponse.json(
        { error: "Competency not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ competency }, { status: 200 });
  } catch (error) {
    console.error("Error fetching competency:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT - Update a competency
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();

    // Ensure the user can only update their own competencies or shared competencies
    const competency = await Competency.findOne({
      _id: id,
      $or: [{ userId: session.user.id }, { userId: { $exists: false } }],
    });

    if (!competency) {
      return NextResponse.json(
        { error: "Competency not found" },
        { status: 404 }
      );
    }

    // Update the competency
    const updatedCompetency = await Competency.findByIdAndUpdate(
      id,
      {
        ...data,
        userId: session.user.id, // Set userId to current user when updating
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { competency: updatedCompetency },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating competency:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a competency
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Ensure the user can only delete their own competencies or shared competencies
    const competency = await Competency.findOne({
      _id: id,
      $or: [{ userId: session.user.id }, { userId: { $exists: false } }],
    });

    if (!competency) {
      return NextResponse.json(
        { error: "Competency not found" },
        { status: 404 }
      );
    }

    // Delete the competency
    await Competency.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Competency deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting competency:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
