"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface userprops {
  Id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  StudentId: string;
  Applications: {
    id: string;
    applicationType: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  Roles: {
    Id: string;
    Name: string;
  }[];
  Notifications: {
    id: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }[];
}

const StudentDashboard = ({ user }: { user: userprops }) => {
  const currentApplication = user.Applications[0];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-500";
      case "ACCEPTED":
      case "ACTIVE":
        return "text-green-500";
      case "REJECTED":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-12 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome, {user.FirstName}!
      </h1>

      {/* Top Two Panels: Profile + Current App */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Profile */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
          <p>
            <span className="font-medium">Name:</span> {user.FirstName}{" "}
            {user.LastName}
          </p>
          <p>
            <span className="font-medium">Student ID:</span> {user.StudentId}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.Email}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {user.PhoneNumber}
          </p>

          <div className="mt-4">
            <Link href={`/UserProfile`}>
              <Button className="px-5 py-2 bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                View Details
              </Button>
            </Link>
          </div>
        </div>

        {/* Current Application */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Current Application</h2>
          {currentApplication ? (
            <>
              <p>
                Type:{" "}
                <span className="font-medium">
                  {currentApplication.applicationType.replace("_", " ")}
                </span>
              </p>
              <p>
                Status:{" "}
                <span
                  className={`font-medium ${getStatusColor(
                    currentApplication.status
                  )}`}
                >
                  {currentApplication.status}
                </span>
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Submitted on: {formatDate(currentApplication.createdAt)}
              </p>
              <div className="mt-4">
                <Link
                  href={`/applicationsDetail/${currentApplication.id}/Detail`}
                >
                  <Button className="px-5 py-2 bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                    View Details
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No current application.</p>
          )}
        </div>
      </div>

      {/* Bottom Two Panels: History + Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Application History */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Application History</h2>
          {user.Applications.length > 0 ? (
            <ul className="space-y-2">
              {user.Applications.map((app) => (
                <li
                  key={app.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span>
                    {app.applicationType.replace("_", " ")} -{" "}
                    {formatDate(app.createdAt)}
                  </span>
                  <span className={`font-medium ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No application history.</p>
          )}
          {user.Applications.length > 1 ? (
            <Link href="/applicationsDetail/applicationHistory">
              <Button className="px-5 py-2 bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                View Details
              </Button>
            </Link>
          ) : (
            ""
          )}
          {/* <div className="mt-4">
     
          </div> */}
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          {user.Notifications.length > 0 ? (
            <ul className="list-disc pl-5 text-sm space-y-2">
              {user.Notifications.slice(0, 3).map((notif) => (
                <li
                  key={notif.id}
                  className={notif.read ? "text-gray-500" : "font-medium"}
                >
                  {notif.message} ({formatDate(notif.createdAt)})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No notifications.</p>
          )}

          <div className="mt-4">
            {user.Notifications.length > 2 ? (
              <Link href={`/StudentDashboard/Notfications`}>
                <Button className="px-5 py-2 bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                  {user.Notifications.length > 3 ? "See More" : "View Details"}
                </Button>
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {/* New Application Button */}
      <div className="text-left">
        <Link href="/application/new">
          <Button className="px-8 py-6 text-base rounded-lg bg-green-700 text-white font-semibold hover:bg-green-700 transition dark:bg-green-700 dark:hover:bg-green-600">
            Submit New Application
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
