import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!vehicle) {
      return new NextResponse("Vehicle not found", { status: 404 });
    }

    if (vehicle.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("[VEHICLE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    const body = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!vehicle) {
      return new NextResponse("Vehicle not found", { status: 404 });
    }

    if (vehicle.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: {
        id: params.id,
      },
      data: body,
    });

    return NextResponse.json(updatedVehicle);
  } catch (error) {
    console.error("[VEHICLE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!vehicle) {
      return new NextResponse("Vehicle not found", { status: 404 });
    }

    if (vehicle.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.vehicle.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[VEHICLE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
