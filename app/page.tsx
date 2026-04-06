"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("[AUTH CHECK]", err);
        // Redirect to login on error (database might not be initialized)
        setTimeout(() => router.push("/login"), 500);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-card to-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary">
            <span className="text-4xl font-bold text-primary-foreground">
              T
            </span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Trade Area Analysis
        </h1>
        <p className="text-muted-foreground mb-8">
          {error ? "Redirecting..." : "Loading..."}
        </p>
      </motion.div>
    </div>
  );
}
