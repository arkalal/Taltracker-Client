import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/mongodb";
import Competency from "../../../../../../models/Competency";
import { auth } from "../../../../../../auth";

// GET competencies for a specific role and type
export async function GET(request, context) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await the params object before accessing its properties
    const params = await context.params;
    const id = params.id;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { error: "Type parameter is required" },
        { status: 400 }
      );
    }

    // Find competency for this role ID and type that either:
    // 1. Belongs to the current user
    // 2. Has no user ID (legacy data)
    const competency = await Competency.findOne({
      roleId: id,
      type,
      $or: [{ userId: session.user.id }, { userId: { $exists: false } }],
    });

    return NextResponse.json({ competency }, { status: 200 });
  } catch (error) {
    console.error("Error fetching competencies for role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
