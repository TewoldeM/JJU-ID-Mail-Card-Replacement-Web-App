"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Share2,
  FileText,
} from "lucide-react";
import { Layout } from "@/components/collection/layouts/layout";
import { useScrollAnimation } from "@/hooks/use-Scroll-Animation";
import Link from "next/link";

// Demo data - in real app this would come from API/database
const applicationData = {
  id: "APP-2025-001234",
  type: "ID_CARD_REPLACEMENT",
  typeLabel: "ID Card Replacement",
  reason: "Expired",
  createdAt: "2025-05-24",
  status: "accepted",
  approvalCode: "JJU-2025-ABC123",
  submittedPhoto: "/placeholder.svg",
  user: {
    firstName: "Tewolde",
    lastName: "Marie",
    email: "tewoldemarie6@gmail.com",
    phone: "0925233133",
    studentId: "3569",
    year: "3rd Year",
    college: "College of Engineering and Technology",
    department: "Software Engineering",
  },
  timeline: [
    {
      status: "submitted",
      date: "2025-05-24",
      time: "10:30 AM",
      completed: true,
    },
    {
      status: "under_review",
      date: "2025-05-25",
      time: "09:00 AM",
      completed: true,
    },
    {
      status: "approved",
      date: "2025-05-26",
      time: "02:15 PM",
      completed: true,
    },
    {
      status: "ready_for_collection",
      date: "2025-05-27",
      time: "11:00 AM",
      completed: false,
    },
  ],
};

const statusConfig = {
  pending: {
    color: "bg-warning/20 text-warning border-warning/30",
    icon: Clock,
    label: "Pending Review",
  },
  under_review: {
    color: "bg-info/20 text-info border-info/30",
    icon: AlertCircle,
    label: "Under Review",
  },
  accepted: {
    color: "bg-primary/20 text-primary border-primary/30",
    icon: CheckCircle2,
    label: "Accepted",
  },
  rejected: {
    color: "bg-destructive/20 text-destructive border-destructive/30",
    icon: XCircle,
    label: "Rejected",
  },
};

export default function ApplicationDetails() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: detailsRef, isVisible: detailsVisible } = useScrollAnimation();
  const { ref: userRef, isVisible: userVisible } = useScrollAnimation();
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollAnimation();

  const status =
    statusConfig[applicationData.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-accent/30 to-background">
        <div className="section-padding">
          <div className="container-custom">
            {/* Back Navigation */}
            <div
              ref={headerRef}
              className={`mb-8 opacity-0 ${headerVisible ? "animate-fade-in-down" : ""}`}
            >
              <Link href="/status">
                <Button variant="ghost" className="gap-2 hover:bg-primary/10">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Applications
                </Button>
              </Link>
            </div>

            {/* Header Section */}
            <div
              className={`mb-8 opacity-0 ${headerVisible ? "animate-fade-in-up" : ""}`}
              style={{ animationDelay: "100ms" }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-muted-foreground font-mono">
                      {applicationData.id}
                    </span>
                    <Badge className={`${status.color} border`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    {applicationData.typeLabel}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Submitted on{" "}
                    {new Date(applicationData.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Application Details Card */}
                <div
                  ref={detailsRef}
                  className={`opacity-0 ${detailsVisible ? "animate-fade-in-up" : ""}`}
                >
                  <Card className="overflow-hidden border-border/50 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-accent border-b border-border/50">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="w-5 h-5 text-primary" />
                        Application Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Application Type
                              </p>
                              <p className="font-semibold text-foreground">
                                {applicationData.typeLabel}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <AlertCircle className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Reason for Replacement
                              </p>
                              <p className="font-semibold text-foreground">
                                {applicationData.reason}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Submission Date
                              </p>
                              <p className="font-semibold text-foreground">
                                {new Date(
                                  applicationData.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-xl border border-border/50">
                          <p className="text-sm text-muted-foreground mb-3">
                            Submitted Photo
                          </p>
                          <div className="w-32 h-40 rounded-lg overflow-hidden border-2 border-primary/30 shadow-md">
                            <img
                              src={applicationData.submittedPhoto}
                              alt="Student Photo"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Approval Code Section */}
                      {applicationData.status === "accepted" && (
                        <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Your Approval Code
                              </p>
                              <p className="text-2xl font-bold text-primary font-mono tracking-wider">
                                {applicationData.approvalCode}
                              </p>
                            </div>
                            <CheckCircle2 className="w-10 h-10 text-primary opacity-50" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Present this code at the Student Dean's Office to
                            collect your new card.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* User Information Card */}
                <div
                  ref={userRef}
                  className={`opacity-0 ${userVisible ? "animate-fade-in-up" : ""}`}
                  style={{ animationDelay: "200ms" }}
                >
                  <Card className="overflow-hidden border-border/50 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-accent border-b border-border/50">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="w-5 h-5 text-primary" />
                        Student Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            <User className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Full Name
                              </p>
                              <p className="font-medium text-foreground">
                                {applicationData.user.firstName}{" "}
                                {applicationData.user.lastName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            <Mail className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Email Address
                              </p>
                              <p className="font-medium text-foreground">
                                {applicationData.user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            <Phone className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Phone Number
                              </p>
                              <p className="font-medium text-foreground">
                                {applicationData.user.phone}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Student ID
                              </p>
                              <p className="font-medium text-foreground">
                                {applicationData.user.studentId}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Academic Year
                              </p>
                              <p className="font-medium text-foreground">
                                {applicationData.user.year}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            <Building className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                College
                              </p>
                              <p className="font-medium text-foreground text-sm">
                                {applicationData.user.college}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Department
                              </p>
                              <p className="font-medium text-foreground">
                                {applicationData.user.department}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Sidebar - Timeline */}
              <div className="lg:col-span-1">
                <div
                  ref={timelineRef}
                  className={`sticky top-24 opacity-0 ${timelineVisible ? "animate-slide-in-right" : ""}`}
                >
                  <Card className="overflow-hidden border-border/50 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-accent border-b border-border/50">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="w-5 h-5 text-primary" />
                        Application Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-0">
                        {applicationData.timeline.map((item, index) => (
                          <div key={index} className="relative">
                            {/* Connector Line */}
                            {index < applicationData.timeline.length - 1 && (
                              <div
                                className={`absolute left-4 top-8 w-0.5 h-full ${
                                  item.completed ? "bg-primary" : "bg-border"
                                }`}
                              />
                            )}
                            <div className="flex gap-4 pb-6">
                              <div
                                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                  item.completed
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground border-2 border-border"
                                }`}
                              >
                                {item.completed ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <Clock className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`font-medium capitalize ${
                                    item.completed
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {item.status.replace("_", " ")}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.date} • {item.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="mt-6 overflow-hidden border-border/50 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-accent border-b border-border/50 py-4">
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <Link href="/status" className="block">
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back to All Applications
                        </Button>
                      </Link>
                      <Link href="/contact" className="block">
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Contact Support
                        </Button>
                      </Link>
                      <Link href="/" className="block">
                        <Button className="w-full justify-start gap-2">
                          <CreditCard className="w-4 h-4" />
                          New Application
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
