export const getInviteEmailHtml = ({
  senderName,
  senderImage,
  receiverName,
  receiverImage,
  roomLink,
}: {
  senderName: string;
  senderImage: string;
  receiverName: string;
  receiverImage: string;
  roomLink: string;
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>You've been invited to a RapidChat room!</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; color: #111827; margin: 0; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
    
    <!-- Header -->
    <div style="background-color: #111827; padding: 32px 24px; text-align: center;">
      <h1 style="color: #f9fafb; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">RapidChat</h1>
    </div>

    <!-- Body content -->
    <div style="padding: 40px 32px;">
      <h2 style="margin-top: 0; font-size: 24px; color: #111827; font-weight: 700;">You're invited!</h2>
      <p style="color: #4b5563; font-size: 16px; margin-bottom: 32px;">
        Hi <strong>${receiverName}</strong>,<br/><br/>
        <strong>${senderName}</strong> has invited you to join their chat room on RapidChat. Click the link below to hop in and start chatting!
      </p>

      <!-- Users section -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0; background-color: #f3f4f6; border-radius: 12px; padding: 24px 16px;">
        <tr>
          <!-- Sender -->
          <td align="center" width="40%" style="text-align: center;">
            <img src="${senderImage}" alt="${senderName}" width="72" height="72" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: block; margin: 0 auto; background-color: #e5e7eb;"/>
            <p style="margin: 12px 0 0; font-size: 15px; color: #111827; font-weight: 600;">${senderName}</p>
            <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280; font-weight: 500;">Sent invite</p>
          </td>
          
          <!-- Arrow connection -->
          <td align="center" width="20%" style="text-align: center;">
            <div style="color: #9ca3af; font-size: 28px; line-height: 1;">&rarr;</div>
          </td>
          
          <!-- Receiver -->
          <td align="center" width="40%" style="text-align: center;">
            <img src="${receiverImage}" alt="${receiverName}" width="72" height="72" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: block; margin: 0 auto; background-color: #e5e7eb;"/>
            <p style="margin: 12px 0 0; font-size: 15px; color: #111827; font-weight: 600;">${receiverName}</p>
            <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280; font-weight: 500;">You</p>
          </td>
        </tr>
      </table>

      <!-- Call to Action -->
      <div style="text-align: center; margin-top: 40px; margin-bottom: 24px;">
        <a href="${roomLink}" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; text-align: center; transition: background-color 0.2s;">
          Join Chat Room
        </a>
      </div>
      
      <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 32px;">
        If you did not expect this invitation or don't want to join, you can safely ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #6b7280; font-size: 13px;">
        &copy; ${new Date().getFullYear()} RapidChat. A minimalist realtime chat experience.
      </p>
    </div>

  </div>
</body>
</html>
`;
};
