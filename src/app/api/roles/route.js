import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Role from "../../../../models/Role";
import { auth } from "../../../../auth";

// GET all roles
export async function GET() {
  try {
    await connectDB();
    const roles = await Role.find({}).sort({ createdAt: -1 });

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
      // Add organization to each role
      const rolesWithOrg = data.map((role) => ({
        ...role,
        organization: session.user.companyName || "Default Organization",
      }));

      const roles = await Role.create(rolesWithOrg);
      return NextResponse.json({ roles }, { status: 201 });
    }
    // Handle single role
    else {
      const role = await Role.create({
        ...data,
        organization: session.user.companyName || "Default Organization",
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
