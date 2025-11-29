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

const Dashboard = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: profileRef, isVisible: profileVisible } = useScrollAnimation();
  const { ref: applicationRef, isVisible: applicationVisible } =
    useScrollAnimation();
  const { ref: historyRef, isVisible: historyVisible } = useScrollAnimation();
  const { ref: notificationRef, isVisible: notificationVisible } =
    useScrollAnimation();

  // Demo data
  const studentProfile = {
    firstName: "Andu",
    lastName: "Girma",
    studentId: "1012",
    email: "andu@gmail.com",
    phone: "0912131415",
    year: "3rd Year",
    college: "College of Engineering",
    department: "Computer Science",
  };

  const currentApplication = {
    id: "APP-2024-001",
    type: "ID Card",
    reason: "Lost",
    status: "pending",
    submittedDate: "2024-01-15",
    lastUpdated: "2024-01-16",
  };

  const applicationHistory = [
    {
      id: "APP-2023-045",
      type: "Meal Card",
      status: "approved",
      date: "2023-10-20",
    },
    {
      id: "APP-2023-032",
      type: "ID Card",
      status: "approved",
      date: "2023-08-15",
    },
    {
      id: "APP-2023-018",
      type: "Meal Card",
      status: "rejected",
      date: "2023-05-10",
    },
  ];

  const notifications = [
    {
      id: 1,
      message: "Your ID Card application is being reviewed",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      message: "Document verification completed",
      time: "1 day ago",
      read: false,
    },
    {
      id: 3,
      message: "Welcome to the ID & Meal Card System!",
      time: "3 days ago",
      read: true,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-warning/20 text-warning border-warning/30">
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-primary/20 text-primary border-primary/30">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-primary" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        <div className="section-padding container-custom">
          {/* Header */}
          <div
            ref={headerRef}
            className={`mb-8 transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
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

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Applications",
                value: "4",
                icon: FileText,
                color: "text-primary",
              },
              {
                label: "Pending",
                value: "1",
                icon: Clock,
                color: "text-warning",
              },
              {
                label: "Approved",
                value: "2",
                icon: CheckCircle,
                color: "text-primary",
              },
              {
                label: "Notifications",
                value: "2",
                icon: Bell,
                color: "text-info",
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

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div
              ref={profileRef}
              className={`lg:col-span-1 transition-all duration-700 delay-100 ${profileVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
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
                  {/* Avatar */}
                  <div className="flex items-center gap-4 pb-4 border-b border-border/50">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-2xl font-bold">
                      {studentProfile.firstName[0]}
                      {studentProfile.lastName[0]}
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

                  {/* Details */}
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
                    <div className="flex items-center gap-3 text-sm">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">
                        {studentProfile.year}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Building className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">
                        {studentProfile.college}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">
                        {studentProfile.department}
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4 group">
                    Edit Profile
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Current Application */}
            <div
              ref={applicationRef}
              className={`lg:col-span-2 transition-all duration-700 delay-200 ${applicationVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
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
                    {getStatusBadge(currentApplication.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                              Card Type
                            </p>
                            <p className="font-medium text-foreground">
                              {currentApplication.type}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Reason
                            </p>
                            <p className="font-medium text-foreground">
                              {currentApplication.reason}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Submitted
                            </p>
                            <p className="font-medium text-foreground">
                              {currentApplication.submittedDate}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Last Updated
                            </p>
                            <p className="font-medium text-foreground">
                              {currentApplication.lastUpdated}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
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
                            <div key={step} className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${index === 0 ? "bg-primary" : index === 1 ? "bg-warning animate-pulse" : "bg-border"}`}
                              />
                              <span
                                className={`text-xs ${index <= 1 ? "text-foreground" : "text-muted-foreground"}`}
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
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            {/* Application History */}
            <div
              ref={historyRef}
              className={`transition-all duration-700 delay-300 ${historyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
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
                    {applicationHistory.map((app, index) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border border-border/50 hover:bg-accent/50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          {getStatusIcon(app.status)}
                          <div>
                            <p className="font-medium text-foreground">
                              {app.type} Replacement
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {app.date}
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

            {/* Notifications */}
            <div
              ref={notificationRef}
              className={`transition-all duration-700 delay-400 ${notificationVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
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
                            className={`w-2 h-2 rounded-full mt-2 ${notification.read ? "bg-muted-foreground" : "bg-primary"}`}
                          />
                          <div className="flex-1">
                            <p
                              className={`text-sm ${notification.read ? "text-muted-foreground" : "text-foreground"}`}
                            >
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.time}
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

          {/* Quick Actions */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/30 to-primary/10 border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Need a new card?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Submit a new application for ID or Meal Card replacement
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="group">
                  ID Card
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button className="group">
                  Meal Card
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
