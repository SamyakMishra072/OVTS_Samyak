"use client";

import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Car, MapPin, Calendar } from "lucide-react";

interface Vehicle {
  id: string;
  registrationNo: string;
  vehicleType: string;
  currentLocation: string;
  status: string;
  lastUpdated: string;
}

export default function Dashboard() {
  const { user } = useUser();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles");
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className=" min-h-screen py-8 px-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.firstName}!</h1>
        <div className=" flex items-center gap-4 ">
          <Link href="/vehicles/add">
            <Button className=" hover:scale-105 transition-all ">
              <Car className="mr-2 h-4 w-4" />
              Add New Vehicle
            </Button>
          </Link>
          <UserButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{vehicle.registrationNo}</span>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      vehicle.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Car className="mr-2 h-4 w-4" />
                    {vehicle.vehicleType}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    {vehicle.currentLocation || "Location not set"}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Last updated:{" "}
                    {new Date(vehicle.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No vehicles found</h3>
          <p className="mt-2 text-muted-foreground">
            Get started by adding your first vehicle.
          </p>
          <Link href="/vehicles/add">
            <Button className="mt-4">Add Vehicle</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
