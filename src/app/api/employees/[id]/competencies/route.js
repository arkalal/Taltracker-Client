import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/mongodb";
import Employee from "../../../../../../models/Employee";
import { auth } from "../../../../../../auth";

// GET employee competencies
export async function GET(request, { params }) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Find employee with specified ID that belongs to current user
    const employee = await Employee.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { competencies: employee.competencies },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching employee competencies:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH - Update employee competencies
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();

    if (!data.competencies) {
      return NextResponse.json(
        { error: "Missing competencies data" },
        { status: 400 }
      );
    }

    // Find employee with specified ID that belongs to current user
    const employee = await Employee.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Update employee competencies
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        $set: { competencies: data.competencies },
      },
      { new: true }
    );

    return NextResponse.json(
      {
        employee: updatedEmployee,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating employee competencies:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
