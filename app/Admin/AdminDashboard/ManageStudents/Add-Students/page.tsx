"use client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import AddStudentForm from "@/components/collection/Admin-staff/StudentsList/add-studentst-System";
export default function AddStudent() {
  return (
    <div className="max-w-4xl mx-auto p-6 dark:bg-black bg-white rounded-2xl shadow-md mt-10">
      <h1 className="text-3xl font-semibold mb-2">Add New Student</h1>
      <Separator className="mb-6 bg-green-600 h-[2px]" />
      <AddStudentForm />
    </div>
  );
}
