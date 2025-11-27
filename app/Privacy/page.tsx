"use client";

import { Layout } from "@/components/collection/layouts/layout";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
        <div className="container-custom section-padding">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8" />
              <span className="text-sm font-medium bg-primary-foreground/10 px-3 py-1 rounded-full">
                Legal
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-primary-foreground/90">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <div className="space-y-8 text-muted-foreground">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  1. Introduction
                </h2>
                <p>
                  Jigjiga University ("we," "our," or "us") is committed to
                  protecting your privacy. This Privacy Policy explains how we
                  collect, use, disclose, and safeguard your information when
                  you use the ID & Meal Card Replacement System.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  2. Information We Collect
                </h2>
                <p className="mb-4">
                  We collect information that you provide directly to us,
                  including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Student identification number</li>
                  <li>Full name and contact information</li>
                  <li>Photograph for card issuance</li>
                  <li>Application details and history</li>
                  <li>Communication records with our support team</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Process your card replacement applications</li>
                  <li>Verify your identity and student status</li>
                  <li>Send notifications about your application status</li>
                  <li>Improve our services and user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  4. Information Security
                </h2>
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction. This includes
                  encryption, secure servers, and access controls.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  5. Data Retention
                </h2>
                <p>
                  We retain your personal information for as long as necessary
                  to fulfill the purposes for which it was collected, including
                  to satisfy legal, accounting, or reporting requirements.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  6. Your Rights
                </h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Receive a copy of your data</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  7. Third-Party Sharing
                </h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal
                  information to outside parties except as required for the
                  operation of our services or as required by law.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  8. Changes to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last updated" date.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  9. Contact Us
                </h2>
                <p>
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-foreground font-medium">
                    Student Dean's Office
                  </p>
                  <p>Jigjiga University</p>
                  <p>Email: privacy@jju.edu.et</p>
                  <p>Phone: +251 25 775 2020</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
