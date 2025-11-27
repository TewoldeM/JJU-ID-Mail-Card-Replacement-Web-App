"use client";

import { useState } from "react";
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Eye,
  Key,
  Copy,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-Scroll-Animation";
import { Layout } from "@/components/collection/layouts/layout";

type StatusType = "pending" | "approved" | "rejected" | null;

interface TimelineItem {
  step: string;
  date: string;
  completed: boolean;
  current?: boolean;
  rejected?: boolean;
}

interface StatusDataItem {
  reference: string;
  name: string;
  cardType: string;
  submittedDate: string;
  status: string;
  currentStep: number;
  timeline: TimelineItem[];
  approvalCode?: string;
  rejectionReason?: string;
}

const statusData: Record<"pending" | "approved" | "rejected", StatusDataItem> =
  {
    pending: {
      reference: "JJU-2024-001234",
      name: "Ahmed Mohamed Ali",
      cardType: "ID Card",
      submittedDate: "January 15, 2024",
      status: "pending",
      currentStep: 3,
      timeline: [
        {
          step: "Application Submitted",
          date: "Jan 15, 2024 - 10:30 AM",
          completed: true,
        },
        {
          step: "Documents Verified",
          date: "Jan 15, 2024 - 2:45 PM",
          completed: true,
        },
        {
          step: "Under Review",
          date: "Jan 16, 2024 - 9:00 AM",
          completed: true,
          current: true,
        },
        { step: "Approval Decision", date: "Pending", completed: false },
        {
          step: "Card Ready for Collection",
          date: "Pending",
          completed: false,
        },
      ],
    },
    approved: {
      reference: "JJU-2024-001235",
      name: "Fatima Hassan Ibrahim",
      cardType: "Meal Card",
      submittedDate: "January 10, 2024",
      status: "approved",
      approvalCode: "APPR-2024-XYZ789",
      currentStep: 5,
      timeline: [
        {
          step: "Application Submitted",
          date: "Jan 10, 2024 - 11:00 AM",
          completed: true,
        },
        {
          step: "Documents Verified",
          date: "Jan 10, 2024 - 3:30 PM",
          completed: true,
        },
        {
          step: "Under Review",
          date: "Jan 11, 2024 - 10:00 AM",
          completed: true,
        },
        { step: "Approved", date: "Jan 12, 2024 - 2:00 PM", completed: true },
        {
          step: "Card Ready for Collection",
          date: "Jan 12, 2024 - 4:30 PM",
          completed: true,
          current: true,
        },
      ],
    },
    rejected: {
      reference: "JJU-2024-001236",
      name: "Abdi Omar Hassan",
      cardType: "ID Card",
      submittedDate: "January 8, 2024",
      status: "rejected",
      rejectionReason:
        "The uploaded photo does not meet the required specifications. Please submit a new application with a clear, recent passport-size photo.",
      currentStep: 4,
      timeline: [
        {
          step: "Application Submitted",
          date: "Jan 8, 2024 - 9:00 AM",
          completed: true,
        },
        {
          step: "Documents Verified",
          date: "Jan 8, 2024 - 1:00 PM",
          completed: true,
        },
        {
          step: "Under Review",
          date: "Jan 9, 2024 - 10:00 AM",
          completed: true,
        },
        {
          step: "Rejected",
          date: "Jan 10, 2024 - 11:30 AM",
          completed: true,
          current: true,
          rejected: true,
        },
      ],
    },
  };

const Status = () => {
  const [selectedStatus, setSelectedStatus] = useState<StatusType>(null);
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();

  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case "pending":
        return <Clock className="w-6 h-6 text-warning" />;
      case "approved":
        return <CheckCircle className="w-6 h-6 text-success" />;
      case "rejected":
        return <XCircle className="w-6 h-6 text-destructive" />;
      default:
        return <AlertCircle className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "approved":
        return "bg-success/10 text-success border-success/20";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const currentData = selectedStatus ? statusData[selectedStatus] : null;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
        </div>
        <div
          ref={heroRef}
          className="container-custom section-padding relative"
        >
          <div className="max-w-3xl">
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-medium mb-4 opacity-0",
                heroVisible && "animate-fade-in-up"
              )}
            >
              Track Application
            </span>
            <h1
              className={cn(
                "font-heading text-4xl md:text-5xl font-bold mb-6 opacity-0",
                heroVisible && "animate-fade-in-up animation-delay-100"
              )}
            >
              Application Status Tracking
            </h1>
            <p
              className={cn(
                "text-xl text-primary-foreground/90 opacity-0",
                heroVisible && "animate-fade-in-up animation-delay-200"
              )}
            >
              Enter your application reference number to check the current
              status of your card replacement request.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="p-8 rounded-2xl bg-card border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Search className="w-6 h-6 text-primary" />
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  Check Your Status
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., JJU-2024-001234"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Demo: Click a button below to see different status examples
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant={
                      selectedStatus === "pending" ? "default" : "outline"
                    }
                    onClick={() => setSelectedStatus("pending")}
                  >
                    <Clock className="w-4 h-4" />
                    View Pending
                  </Button>
                  <Button
                    variant={
                      selectedStatus === "approved" ? "default" : "outline"
                    }
                    onClick={() => setSelectedStatus("approved")}
                  >
                    <CheckCircle className="w-4 h-4" />
                    View Approved
                  </Button>
                  <Button
                    variant={
                      selectedStatus === "rejected" ? "default" : "outline"
                    }
                    onClick={() => setSelectedStatus("rejected")}
                  >
                    <XCircle className="w-4 h-4" />
                    View Rejected
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Result */}
      {currentData && (
        <section className="pb-16 md:pb-24 px-4 md:px-6 lg:px-8 bg-background">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              {/* Status Card */}
              <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm mb-8 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(selectedStatus)}
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-foreground">
                        Application Status
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Reference: {currentData.reference}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium border capitalize",
                      getStatusColor(selectedStatus)
                    )}
                  >
                    {selectedStatus}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Applicant Name
                    </p>
                    <p className="font-medium text-foreground">
                      {currentData.name}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Card Type
                    </p>
                    <p className="font-medium text-foreground">
                      {currentData.cardType}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Submitted Date
                    </p>
                    <p className="font-medium text-foreground">
                      {currentData.submittedDate}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Current Step
                    </p>
                    <p className="font-medium text-foreground">
                      {currentData.currentStep} of 5
                    </p>
                  </div>
                </div>

                {/* Approval Code */}
                {selectedStatus === "approved" && (
                  <div className="p-6 rounded-xl bg-success/10 border border-success/20 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Key className="w-6 h-6 text-success" />
                      <h4 className="font-semibold text-foreground">
                        Your Approval Code
                      </h4>
                    </div>
                    <div className="flex items-center gap-4">
                      <code className="text-2xl font-mono font-bold text-success">
                        {statusData.approved.approvalCode}
                      </code>
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      Present this code at the Student Dean's Office to collect
                      your card.
                    </p>
                  </div>
                )}

                {/* Rejection Reason */}
                {selectedStatus === "rejected" && (
                  <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/20 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertCircle className="w-6 h-6 text-destructive" />
                      <h4 className="font-semibold text-foreground">
                        Rejection Reason
                      </h4>
                    </div>
                    <p className="text-muted-foreground">
                      {statusData.rejected.rejectionReason}
                    </p>
                    <Button variant="outline" className="mt-4">
                      Submit New Application
                    </Button>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm animate-fade-in-up animation-delay-200">
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="w-6 h-6 text-primary" />
                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    Application Timeline
                  </h3>
                </div>

                <div className="space-y-0">
                  {currentData.timeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            item.completed
                              ? item.rejected
                                ? "bg-destructive text-destructive-foreground"
                                : "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {item.completed ? (
                            item.rejected ? (
                              <XCircle className="w-5 h-5" />
                            ) : (
                              <CheckCircle className="w-5 h-5" />
                            )
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-current" />
                          )}
                        </div>
                        {index < currentData.timeline.length - 1 && (
                          <div
                            className={cn(
                              "w-0.5 h-16",
                              item.completed ? "bg-primary" : "bg-border"
                            )}
                          />
                        )}
                      </div>
                      <div className="pb-8">
                        <h4
                          className={cn(
                            "font-medium",
                            item.current ? "text-primary" : "text-foreground"
                          )}
                        >
                          {item.step}
                          {item.current && (
                            <span className="ml-2 px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
                              Current
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!currentData && (
        <section className="pb-16 md:pb-24 bg-background">
          <div className="container-custom">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                No Application Selected
              </h3>
              <p className="text-muted-foreground">
                Enter your reference number or click one of the demo buttons
                above to see sample application statuses.
              </p>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Status;
