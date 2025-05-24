"use client";
import AddStudentForm from "@/components/collection/Admin-staff/SampleDB/add-student";
import React from "react";

export default function AddStudent() {
  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-col gap-4 mt-12 px-5 md:px-20">
        <h1 className="text-3xl md:text-6xl font-semibold">Add Student</h1>
        <h3 className="text-xl md:text-3xl">
          Please fill the form to add a new student to JJU DB.
        </h3>
      </div>
      <div>
        <AddStudentForm />
      </div>
    </div>
  );
}
