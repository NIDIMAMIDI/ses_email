// Load environment variables from .env file
import "dotenv/config";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
// import { fromIni } from "@aws-sdk/credential-providers"; // optional, if using credentials from the config file

// Initialize AWS SES Client with credentials from environment variables
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  },
});

// Function to send an email using SES
const sendEmail = async (to, subject, message, from) => {
  const params = {
    Destination: {
      ToAddresses: [to], // List of recipients
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: message,
        },
        // Uncomment the below section for plain text emails
        // Text: {
        //   Charset: "UTF-8",
        //   Data: message,
        // },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: from || process.env.AWS_SENDER_EMAIL, // Sender email address
    ReturnPath: from || process.env.AWS_SENDER_EMAIL, // ReturnPath for errors
  };

  try {
    const command = new SendEmailCommand(params);
    const data = await sesClient.send(command);
    console.log("Email sent successfully:", data);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

// Send a test email
sendEmail(
  "sharuks909@gmail.com", // Recipient email address
  "Hey! Welcome", // Email subject
  "This is the body of the email", // Email body (HTML),
  process.env.AWS_SENDER_EMAIL // Sender email (must be verified in SES)
);
