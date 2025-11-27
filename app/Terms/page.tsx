import { Layout } from "@/components/layout/Layout";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
        <div className="container-custom section-padding">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8" />
              <span className="text-sm font-medium bg-primary-foreground/10 px-3 py-1 rounded-full">
                Legal
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Terms & Conditions
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
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing and using the Jigjiga University ID & Meal Card
                  Replacement System, you accept and agree to be bound by these
                  Terms and Conditions. If you do not agree to these terms,
                  please do not use this system.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  2. Eligibility
                </h2>
                <p>
                  This system is exclusively for registered students of Jigjiga
                  University. You must have a valid student ID number and be
                  currently enrolled to use this service.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  3. User Responsibilities
                </h2>
                <p className="mb-4">As a user of this system, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Provide accurate and truthful information in all
                    applications
                  </li>
                  <li>Keep your login credentials confidential</li>
                  <li>
                    Report any unauthorized access to your account immediately
                  </li>
                  <li>Use the system only for its intended purpose</li>
                  <li>Comply with all university policies and regulations</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  4. Application Process
                </h2>
                <p className="mb-4">
                  By submitting a card replacement application, you acknowledge
                  that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All information provided is accurate and complete</li>
                  <li>False information may result in application rejection</li>
                  <li>
                    Processing times may vary based on verification requirements
                  </li>
                  <li>
                    The university reserves the right to request additional
                    documentation
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  5. Fees and Payments
                </h2>
                <p>
                  Card replacement may be subject to administrative fees as
                  determined by the university. All applicable fees will be
                  clearly displayed before you submit your application. Fees are
                  non-refundable once the application is processed.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  6. Card Collection
                </h2>
                <p className="mb-4">Upon application approval:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You will receive an approval code via email/SMS</li>
                  <li>
                    Present this code at the Student Dean's Office to collect
                    your card
                  </li>
                  <li>Cards must be collected within 30 days of approval</li>
                  <li>Valid identification is required for collection</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  7. Prohibited Activities
                </h2>
                <p className="mb-4">Users are prohibited from:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Submitting fraudulent applications</li>
                  <li>Attempting to access other users' accounts</li>
                  <li>Interfering with system operations</li>
                  <li>Using the system for any unlawful purpose</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  8. Limitation of Liability
                </h2>
                <p>
                  Jigjiga University shall not be liable for any indirect,
                  incidental, special, or consequential damages arising from the
                  use of this system. The university makes no warranties
                  regarding system availability or uninterrupted service.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  9. Modifications
                </h2>
                <p>
                  The university reserves the right to modify these Terms and
                  Conditions at any time. Continued use of the system after
                  changes constitutes acceptance of the modified terms.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  10. Contact Information
                </h2>
                <p>For questions regarding these Terms and Conditions:</p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-foreground font-medium">
                    Student Dean's Office
                  </p>
                  <p>Jigjiga University</p>
                  <p>Email: support@jju.edu.et</p>
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

export default Terms;
