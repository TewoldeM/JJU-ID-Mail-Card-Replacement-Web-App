"use client";
import React from "react";
import { Spotlight } from "@/components/ui/Spotlight";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SpotlightPreview() {
  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-white dark:bg-black/[0.96] antialiased dark:bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-black to-neutral-600 dark:from-neutral-50 dark:to-neutral-400">
          JJU ID AND MEAL CARD
          <br /> Replacement Service.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-700 dark:text-neutral-300 max-w-lg text-center mx-auto">
          Apply for ID card and Meal card replacement online from anywhere. Pay
          online and collect your card at your convenience. Save time by signing
          in, submitting your application, and tracking your approval status
          with real-time notifications.
        </p>

        <div className="mt-6 flex justify-center">
          <Link href="applications/IdandMailCardReplacement">
            <Button className="px-8 py-6 text-lg rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition dark:bg-green-500 dark:hover:bg-green-600">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
