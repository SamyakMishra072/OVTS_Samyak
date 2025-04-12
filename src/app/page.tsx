"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, Car, MapPin } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted to-slate-200 p-6">
      <nav className="flex justify-end items-center">
        <UserButton afterSignOutUrl="/" />
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-8 max-w-4xl w-full"
        >
          <Car className="h-24 w-24 mx-auto text-primary animate-bounce" />
          <h1 className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-indigo-600 text-transparent bg-clip-text">
            Vehicle Tracking System
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            Manage and track your fleet with real-time updates, intelligent reporting,
            and deep analytics — all in one place.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
            <FeatureCard
              icon={<Car className="h-10 w-10 text-primary" />}
              title="Fleet Management"
              description="Track and manage your entire fleet from a unified dashboard."
            />
            <FeatureCard
              icon={<MapPin className="h-10 w-10 text-primary" />}
              title="Location Tracking"
              description="Monitor vehicle locations and review travel history in real-time."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Analytics & Reports"
              description="Generate smart reports and analyze fleet performance effortlessly."
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            {!user ? (
              <>
                <Link href="/signin">
                  <Button size="lg" className="px-10 py-6 text-base font-semibold shadow-lg hover:scale-105 transition">
                    Get Started
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-10 py-6 text-base font-semibold border-muted-foreground hover:border-primary hover:scale-105 transition"
                  >
                    Create Account
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button size="lg" className="px-10 py-6 text-base font-semibold shadow-lg hover:scale-105 transition">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/vehicles/add">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-10 py-6 text-base font-semibold border-muted-foreground hover:border-primary hover:scale-105 transition"
                  >
                    Add Vehicle
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="p-6 bg-white dark:bg-card rounded-2xl shadow-xl transition-all duration-200 hover:shadow-2xl"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
}
