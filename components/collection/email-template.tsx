export function generateEmailTemplate({
  FirstName,
  verificationLink,
}: {
  FirstName: string;
  verificationLink?: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Verify Your Application</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a73e8;">ID/Mail Card Replacement Application</h2>
          <p>Dear ${FirstName},</p>
          <p>Thank you for submitting your application for an ID or Mail Card replacement.</p>
          ${
            verificationLink
              ? `
                <p>Please verify your application by clicking the link below:</p>
                <a
                  href="${verificationLink}"
                  style="display: inline-block; padding: 10px 20px; background-color: #1a73e8; color: #fff; text-decoration: none; border-radius: 4px;"
                >
                  Verify Application
                </a>
                <p style="margin-top: 10px;">This link will expire in 10 minutes.</p>
              `
              : ""
          }
          <p>If you did not submit this application, please ignore this email or contact support.</p>
          <p>Best regards,<br>The JJU Support Team</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #777;">
            Jimma University, Jimma, Ethiopia<br>
            Email: support@jju.edu.et
          </p>
        </div>
      </body>
    </html>
  `;
}
