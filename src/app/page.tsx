"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, Car, MapPin } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col p-4 ">
      <nav className=" flex justify-end ">
        <UserButton />
      </nav>
      <div className=" flex-1 min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="text-center space-y-8 max-w-3xl mx-auto px-4">
          <Car className="h-24 w-24 mx-auto text-primary animate-pulse" />
          <h1 className="text-5xl font-bold tracking-tight">
            Vehicle Tracking System
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage and track your fleet with real-time updates, comprehensive
            reporting, and powerful analytics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-card rounded-lg shadow-lg">
              <Car className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Fleet Management</h3>
              <p className="text-muted-foreground">
                Track and manage your entire fleet from a single dashboard.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-lg">
              <MapPin className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Location Tracking</h3>
              <p className="text-muted-foreground">
                Monitor vehicle locations and track their movement history.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-lg">
              <BarChart3 className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">
                Analytics & Reports
              </h3>
              <p className="text-muted-foreground">
                Generate detailed reports and analyze fleet performance.
              </p>
            </div>
          </div>

          <div className="mt-12 space-x-4">
            {!user ? (
              <>
                <Link href="/sign-in">
                  <Button size="lg" className="px-8">
                    Get Started
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="outline" size="lg">
                    Create Account
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button size="lg" className="px-8">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/vehicles/add">
                  <Button variant="outline" size="lg">
                    Add Vehicle
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
