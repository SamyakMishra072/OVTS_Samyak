"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LatLngExpression } from "leaflet";
import { motion } from "framer-motion";
import { PlusCircle, LocateFixed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const VehicleMap = dynamic(() => import("@/components/VehicleMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[500px] text-gray-500">
      Loading map...
    </div>
  ),
});

const vehicleSchema = z.object({
  registrationNo: z.string().min(1, "Registration number is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  model: z.string().min(1, "Model is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  yearOfMake: z.string().transform((val) => parseInt(val, 10)),
  currentLocation: z.string().optional(),
});

export default function AddVehicle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<LatLngExpression>([20.5937, 78.9629]); // default India center

  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registrationNo: "",
      vehicleType: "",
      model: "",
      manufacturer: "",
      yearOfMake: 0,
      currentLocation: "",
    },
  });

  const handleUseMyLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: LatLngExpression = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(coords);
        form.setValue(
          "currentLocation",
          `Lat: ${coords[0].toFixed(4)}, Lng: ${coords[1].toFixed(4)}`
        );
        toast({
          title: "Location Set",
          description: "Your current location was added successfully.",
        });
      },
      () => {
        toast({
          title: "Location Error",
          description: "Unable to fetch your current location.",
          variant: "destructive",
        });
      }
    );
  };

  const onSubmit = async (values: z.infer<typeof vehicleSchema>) => {
    try {
      setLoading(true);
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          currentLocation:
            values.currentLocation ||
            `Lat: ${(position as any)[0].toFixed(4)}, Lng: ${(position as any)[1].toFixed(4)}`,
        }),
      });

      if (!response.ok) throw new Error("Failed to add vehicle");

      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to add vehicle",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200 flex items-center justify-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-white/90 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="grid md:grid-cols-2">
          {/* --- Form Section --- */}
          <div className="p-8">
            <Card className="shadow-none border-none">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                  <PlusCircle className="text-blue-600" /> Add New Vehicle
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <FormField
                      control={form.control}
                      name="registrationNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter registration number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehicleType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="car">Car</SelectItem>
                              <SelectItem value="truck">Truck</SelectItem>
                              <SelectItem value="van">Van</SelectItem>
                              <SelectItem value="bus">Bus</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="manufacturer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Manufacturer</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter manufacturer" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter model" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="yearOfMake"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year of Make</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Enter year" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currentLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Location</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Click map or use my location" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleUseMyLocation}
                        className="flex items-center gap-2"
                      >
                        <LocateFixed size={16} /> Use My Location
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? "Adding..." : "Add Vehicle"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* --- Map Section --- */}
          <VehicleMap position={position} setPosition={setPosition} />
        </div>
      </motion.div>
    </main>
  );
}
