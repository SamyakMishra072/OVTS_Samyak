import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// guards fetching a vehicle that belongs to the user
async function getOwnedVehicle(id: string, userId: string) {
  const v = await prisma.vehicle.findUnique({ where: { id } });
  if (!v) return { error: new NextResponse("Vehicle not found", { status: 404 }) };
  if (v.userId !== userId) return { error: new NextResponse("Unauthorized", { status: 401 }) };
  return { vehicle: v };
}

// GET /api/vehicles/:id
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { vehicle, error } = await getOwnedVehicle(params.id, user.id);
    if (error) return error;

    return NextResponse.json(vehicle);
  } catch (error: any) {
    console.error("[VEHICLE_GET]", error?.message || error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PATCH /api/vehicles/:id
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { vehicle, error } = await getOwnedVehicle(params.id, user.id);
    if (error) return error;

    const body = await req.json();
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
      status,
    } = body;

    const updated = await prisma.vehicle.update({
      where: { id: vehicle!.id },
      data: {
        ...(registrationNo !== undefined && { registrationNo }),
        ...(vehicleType !== undefined && { vehicleType }),
        ...(model !== undefined && { model }),
        ...(manufacturer !== undefined && { manufacturer }),
        ...(yearOfMake !== undefined && { yearOfMake: Number(yearOfMake) }),
        ...(currentLocation !== undefined && { currentLocation }),
        ...(startLocation !== undefined && { startLocation }),
        ...(endLocation !== undefined && { endLocation }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[VEHICLE_PATCH]", error?.message || error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/vehicles/:id
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { vehicle, error } = await getOwnedVehicle(params.id, user.id);
    if (error) return error;

    await prisma.vehicle.delete({ where: { id: vehicle!.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[VEHICLE_DELETE]", error?.message || error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
