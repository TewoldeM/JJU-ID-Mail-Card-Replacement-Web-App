"use client";
import ContactMessagesTable from "@/components/collection/Admin-staff/ContactMessagesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactMessages() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Contact Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactMessagesTable />
        </CardContent>
      </Card>
    </div>
  );
}
