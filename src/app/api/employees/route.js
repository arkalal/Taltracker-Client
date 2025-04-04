import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Employee from "../../../../models/Employee";
import { auth } from "../../../../auth";

// GET all employees
export async function GET() {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all employees for the current user
    const employees = await Employee.find({
      userId: session.user.id,
    })
      .populate("roleId", "jobRole")
      .sort({ createdAt: 1 });

    return NextResponse.json({ employees }, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Create new employees
export async function POST(request) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Ensure we have an array of employees
    const employeesData = Array.isArray(data) ? data : [data];

    // Validate each employee
    for (const employee of employeesData) {
      if (!employee.name || !employee.profileDescription || !employee.roleId) {
        return NextResponse.json(
          {
            error:
              "Missing required fields: name, profileDescription, or roleId",
          },
          { status: 400 }
        );
      }
    }

    // Add userId to each employee
    const enrichedEmployeesData = employeesData.map((employee) => ({
      ...employee,
      userId: session.user.id,
    }));

    // Create all employees
    const employees = await Employee.create(enrichedEmployeesData);

    return NextResponse.json({ employees }, { status: 201 });
  } catch (error) {
    console.error("Error creating employees:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
