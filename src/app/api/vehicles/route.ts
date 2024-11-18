import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("[VEHICLES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const body = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        userId: user.id,
        ...body,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("[VEHICLES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
