import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Role from "../../../../models/Role";
import { auth } from "../../../../auth";

// GET all roles for the current user
export async function GET() {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find roles that either:
    // 1. Have the current user's ID, or
    // 2. Have no userId but match the user's company name
    const roles = await Role.find({
      $or: [
        { userId: session.user.id },
        {
          userId: { $exists: false },
          organization: session.user.companyName,
        },
      ],
    }).sort({ createdAt: 1 });

    return NextResponse.json({ roles }, { status: 200 });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Create a new role or multiple roles
export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    // Handle multiple roles being sent
    if (Array.isArray(data)) {
      // Add organization and userId to each role
      const rolesWithUserData = data.map((role) => ({
        ...role,
        organization: session.user.companyName || "Default Organization",
        userId: session.user.id,
      }));

      const roles = await Role.create(rolesWithUserData);
      return NextResponse.json({ roles }, { status: 201 });
    }
    // Handle single role
    else {
      const role = await Role.create({
        ...data,
        organization: session.user.companyName || "Default Organization",
        userId: session.user.id,
      });
      return NextResponse.json({ role }, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
