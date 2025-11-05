"use client";

import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { Car, MapPin, Calendar, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium text-gray-600">
        Loading your vehicles...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200 px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center mb-10"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Welcome, {user?.firstName || "User"} 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and track your vehicles in real time.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Link href="/vehicles/add">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-transform hover:scale-105 shadow-md">
              <PlusCircle size={18} /> Add Vehicle
            </Button>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </motion.div>

      {/* Vehicle Cards */}
      {vehicles.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <Link href={`/vehicles/${vehicle.id}`}>
                <Card className="hover:shadow-xl hover:-translate-y-1 transition-all bg-white/90 backdrop-blur rounded-2xl cursor-pointer border border-blue-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-800">
                      <span>{vehicle.registrationNo}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          vehicle.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {vehicle.status.toUpperCase()}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-600 text-sm space-y-2">
                    <div className="flex items-center">
                      <Car className="mr-2 h-4 w-4 text-blue-500" />
                      {vehicle.vehicleType}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-sky-500" />
                      {vehicle.currentLocation || "Location not set"}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      Last updated:{" "}
                      <span className="ml-1 font-medium">
                        {new Date(vehicle.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <Car className="mx-auto h-16 w-16 text-blue-400" />
          <h3 className="mt-4 text-2xl font-semibold text-gray-700">
            No Vehicles Found
          </h3>
          <p className="mt-2 text-gray-500">
            Start tracking by adding your first vehicle below.
          </p>
          <Link href="/vehicles/add">
            <Button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              <PlusCircle size={18} className="mr-2" /> Add Vehicle
            </Button>
          </Link>
        </motion.div>
      )}
    </main>
  );
}
