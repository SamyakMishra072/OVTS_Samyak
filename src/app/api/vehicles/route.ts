import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// GET /api/vehicles  -> current user's vehicles
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const vehicles = await prisma.vehicle.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(vehicles);
  } catch (error: any) {
    console.error("[VEHICLES_GET]", error?.message || error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// POST /api/vehicles  -> create vehicle for current user
export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const body = await request.json();
    const {
      registrationNo,
      vehicleType,
      model,
      manufacturer,
      yearOfMake,
      currentLocation,
      startLocation,
      endLocation,
      startDate,
      endDate,
      status, // optional
    } = body;

    // minimal validation
    if (!registrationNo || !vehicleType || !model || !manufacturer || !yearOfMake) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const created = await prisma.vehicle.create({
      data: {
        userId: user.id,
        registrationNo,
        vehicleType,
        model,
        manufacturer,
        yearOfMake: Number(yearOfMake),
        currentLocation: currentLocation ?? null,
        startLocation: startLocation ?? null,
        endLocation: endLocation ?? null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status ?? "active",
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("[VEHICLES_POST]", error?.message || error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
