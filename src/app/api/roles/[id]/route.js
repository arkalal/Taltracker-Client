import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import Role from "../../../../../models/Role";
import { auth } from "../../../../../auth";

// GET a specific role
export async function GET(request, { params }) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    // Find the role that either:
    // 1. Has the current user's ID, or
    // 2. Has no userId but matches the user's company name
    const role = await Role.findOne({
      _id: id,
      $or: [
        { userId: session.user.id },
        {
          userId: { $exists: false },
          organization: session.user.companyName,
        },
      ],
    });

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json({ role }, { status: 200 });
  } catch (error) {
    console.error("Error fetching role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT - Update a role
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();

    // Ensure the user can only update their own roles or shared roles
    const role = await Role.findOne({
      _id: id,
      $or: [
        { userId: session.user.id },
        {
          userId: { $exists: false },
          organization: session.user.companyName,
        },
      ],
    });

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Update the role
    const updatedRole = await Role.findByIdAndUpdate(
      id,
      {
        ...data,
        userId: session.user.id, // Set userId to current user when updating
        organization: session.user.companyName || role.organization,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ role: updatedRole }, { status: 200 });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a role
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Ensure the user can only delete their own roles or shared roles
    const role = await Role.findOne({
      _id: id,
      $or: [
        { userId: session.user.id },
        {
          userId: { $exists: false },
          organization: session.user.companyName,
        },
      ],
    });

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Delete the role
    await Role.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Role deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
