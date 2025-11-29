"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  FileText,
  Clock,
  Bell,
  Plus,
  ChevronRight,
  Mail,
  Phone,
  GraduationCap,
  Building,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Layout } from "@/components/collection/layouts/layout";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/use-Scroll-Animation";

// ----------------- TYPES ----------------- //
interface StudentDashboardProps {
  user: {
    Id: string;
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNumber: string;
    StudentId: string;
    Applications: Array<{
      id: string;
      applicationType: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    }>;
    Roles: Array<{ Id: string; Name: string }>;
    Notifications: Array<{
      id: string;
      message: string;
      read: boolean;
      createdAt: string;
    }>;
  };
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: profileRef, isVisible: profileVisible } = useScrollAnimation();
  const { ref: applicationRef, isVisible: applicationVisible } =
    useScrollAnimation();
  const { ref: historyRef, isVisible: historyVisible } = useScrollAnimation();
  const { ref: notificationRef, isVisible: notificationVisible } =
    useScrollAnimation();

  // ----------------- REAL DATA ----------------- //
  const studentProfile = {
    firstName: user.FirstName,
    lastName: user.LastName,
    studentId: user.StudentId,
    email: user.Email,
    phone: user.PhoneNumber,
    year: user.Roles[0]?.Name ?? "",
    college: "Unknown", // You can update these based on your model
    department: "Unknown",
  };

  const currentApplication = user.Applications[0] || null;
  const applicationHistory = user.Applications.slice(1);
  const notifications = user.Notifications;

  // ----------------- BADGE LOGIC ----------------- //
  const getStatusBadge = (status: string) => {
    if (!status) return null;

    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // ----------------- UI BELOW ----------------- //
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        <div className="section-padding container-custom">
          {/* HEADER */}
          <div
            ref={headerRef}
            className={`mb-8 transition-all duration-700 ${
              headerVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Welcome back,{" "}
                  <span className="gradient-text">
                    {studentProfile.firstName}!
                  </span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage your ID and Meal Card applications from your dashboard
                </p>
              </div>
              <Link href="/apply">
                <Button className="group">
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  New Application
                </Button>
              </Link>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Applications",
                value: user.Applications.length.toString(),
                icon: FileText,
                color: "text-primary",
              },
              {
                label: "Pending",
                value: user.Applications.filter(
                  (a) => a.status === "pending"
                ).length.toString(),
                icon: Clock,
                color: "text-yellow-500",
              },
              {
                label: "Approved",
                value: user.Applications.filter(
                  (a) => a.status === "approved"
                ).length.toString(),
                icon: CheckCircle,
                color: "text-green-500",
              },
              {
                label: "Notifications",
                value: user.Notifications.filter(
                  (n) => !n.read
                ).length.toString(),
                icon: Bell,
                color: "text-blue-500",
              },
            ].map((stat, index) => (
              <Card
                key={stat.label}
                className="card-hover border-border/50 bg-card/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-accent/50 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* PROFILE + CURRENT APPLICATION */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* PROFILE CARD */}
            <div
              ref={profileRef}
              className={`transition-all duration-700 delay-100 ${
                profileVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    Your Profile
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-border/50">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-2xl font-bold">
                      {studentProfile.firstName?.[0]}
                      {studentProfile.lastName?.[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {studentProfile.firstName} {studentProfile.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {studentProfile.studentId}
                      </p>
                    </div>
                  </div>

                  {/* INFO FIELDS */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">
                        {studentProfile.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">
                        {studentProfile.phone}
                      </span>
                    </div>
                  </div>
                  <Link href={"/UserProfile"}>
                    <Button variant="outline" className="w-full mt-4 group">
                      Edit Profile
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* CURRENT APPLICATION */}
            <div
              ref={applicationRef}
              className={`lg:col-span-2 transition-all duration-700 delay-200 ${
                applicationVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-foreground">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      Current Application
                    </span>
                    {currentApplication
                      ? getStatusBadge(currentApplication.status)
                      : null}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  {currentApplication ? (
                    <div className="bg-accent/30 rounded-xl p-6 border border-border/50">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Application ID:
                            </span>
                            <span className="font-mono font-semibold text-foreground">
                              {currentApplication.id}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Type
                              </p>
                              <p className="font-medium text-foreground">
                                {currentApplication.applicationType}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Submitted
                              </p>
                              <p className="font-medium text-foreground">
                                {currentApplication.createdAt.slice(0, 10)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Last Updated
                              </p>
                              <p className="font-medium text-foreground">
                                {currentApplication.updatedAt.slice(0, 10)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="md:w-48">
                          <p className="text-xs text-muted-foreground mb-3">
                            Progress
                          </p>
                          <div className="space-y-2">
                            {[
                              "Submitted",
                              "Under Review",
                              "Processing",
                              "Ready",
                            ].map((step, index) => (
                              <div
                                key={step}
                                className="flex items-center gap-2"
                              >
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    index === 0
                                      ? "bg-primary"
                                      : index === 1
                                        ? "bg-yellow-500 animate-pulse"
                                        : "bg-border"
                                  }`}
                                />
                                <span
                                  className={`text-xs ${
                                    index <= 1
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {step}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6 pt-4 border-t border-border/50">
                        <Link
                          href={`/application/${currentApplication.id}`}
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full group">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                        <Link href="/status">
                          <Button className="group">
                            Track Status
                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      You have no active application.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* HISTORY + NOTIFICATIONS */}
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            {/* HISTORY */}
            <div
              ref={historyRef}
              className={`transition-all duration-700 delay-300 ${
                historyVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-foreground">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      Application History
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/80"
                    >
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {applicationHistory.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border border-border/50 hover:bg-accent/50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          {getStatusIcon(app.status)}
                          <div>
                            <p className="font-medium text-foreground">
                              {app.applicationType}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {app.createdAt.slice(0, 10)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(app.status)}
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* NOTIFICATIONS */}
            <div
              ref={notificationRef}
              className={`transition-all duration-700 delay-400 ${
                notificationVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-foreground">
                      <div className="p-2 rounded-lg bg-primary/10 relative">
                        <Bell className="w-5 h-5 text-primary" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
                      </div>
                      Notifications
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/80"
                    >
                      Mark all read
                    </Button>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-xl border transition-colors cursor-pointer group ${
                          notification.read
                            ? "bg-accent/20 border-border/30"
                            : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              notification.read
                                ? "bg-muted-foreground"
                                : "bg-primary"
                            }`}
                          />
                          <div className="flex-1">
                            <p
                              className={`text-sm ${
                                notification.read
                                  ? "text-muted-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.createdAt.slice(0, 10)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
