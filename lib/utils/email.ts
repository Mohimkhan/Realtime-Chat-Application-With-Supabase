import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Or use 'host' and 'port'
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your App Password
  },
});

export async function sendEmail({
  from = process.env.EMAIL_USER!,
  to,
  subject = "nodemailer setup success",
  text = "This is email text",
  html = "<b>This is the email body</b>",
}: {
  from?: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
  };

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials not found");
    }

    if (!from && !to) {
      throw new Error("Email credentials not found");
    }

    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
