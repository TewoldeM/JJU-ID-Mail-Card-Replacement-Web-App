"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const AboutUS = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-4xl w-full space-y-8 transform transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="relative">
          <Image
            src="/photo_2023-02-08_11-25-40.jpg"
            alt="Jigjiga University"
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            ID & Mail Card Replacement System
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            This web application is designed for students of Jigjiga University
            who have lost or have expired ID or mail cards. Through this
            platform, students can easily apply for replacement cards online
            without visiting the administration in person.
        
            Once an application is submitted, students receive real-time updates
            on the status of their request. Applications are reviewed by the
            Student Deans office, which may approve or reject the request based
            on the provided details.
    
         
            If approved, students will receive a secure approval code via
            notification, which they must present at the Deans Office to
            collect their new ID or mail card. In case of rejection, a reason
            will be provided for transparency and guidance.
          </p>
          <Link href="applications/IdandMailCardReplacement">
          <Button className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition dark:bg-green-500 dark:hover:bg-green-600">
            Apply for Replacement
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUS;
