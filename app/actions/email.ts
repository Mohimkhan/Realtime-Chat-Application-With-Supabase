"use server";

import { sendEmail } from "@/lib/utils/email";

export const sendInviteEmail = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) => {
  await sendEmail({
    to,
    subject,
    text,
    html,
  });
};
