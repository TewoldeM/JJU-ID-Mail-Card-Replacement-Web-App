import * as React from "react";

interface EmailTemplateProps {
  FirstName: string;
  verificationLink?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  FirstName,
  verificationLink,
}) => (
  <div>
    <h1>Hello, {FirstName}!</h1>
    <p>
      You have submitted a replacement application for your ID/Mail card, and we
      need to verify your identity.
    </p>
    {verificationLink && (
      <p>
        Please click the link below to verify your application (expires in 10
        minutes):
        <br />
        <a href={verificationLink}>{verificationLink}</a>
      </p>
    )}
    <p>If you did not request this, please ignore this email.</p>
  </div>
);
