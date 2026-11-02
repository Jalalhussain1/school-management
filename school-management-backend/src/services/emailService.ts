import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'jh1388965@gmail.com',
    pass: process.env.SMTP_PASS || '',
  },
});

export const sendInvitationEmail = async (params: {
  to: string;
  name: string;
  role: string;
  inviteLink: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const { to, name, role, inviteLink } = params;

  // Check if SMTP password is set
  if (!process.env.SMTP_PASS) {
    console.warn(
      `[EmailService] SMTP_PASS not set in .env. Email to ${to} was prepared with link: ${inviteLink}`
    );
    return {
      success: false,
      error: 'SMTP_PASS is not configured in backend .env',
    };
  }

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
      .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
      .header { background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
      .header h1 { margin: 0 0 6px 0; font-size: 24px; font-weight: 800; }
      .header p { margin: 0; opacity: 0.9; font-size: 14px; }
      .content { padding: 32px 24px; }
      .badge { display: inline-block; padding: 4px 12px; font-size: 12px; font-weight: 700; color: #1e40af; background: #dbeafe; border-radius: 20px; margin-bottom: 16px; }
      .button-wrapper { text-align: center; margin: 32px 0; }
      .button { display: inline-block; background-color: #2563eb; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
      .link-box { background: #f1f5f9; padding: 12px 16px; border-radius: 6px; word-break: break-all; font-family: monospace; font-size: 12px; color: #475569; }
      .footer { background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>EduManage Portal</h1>
        <p>School Management System Invitation</p>
      </div>
      <div class="content">
        <div class="badge">${role} Access</div>
        <h2 style="margin-top: 0; font-size: 20px;">Welcome, ${name}!</h2>
        <p style="line-height: 1.6; color: #475569;">
          You have been registered for an official account on the <strong>EduManage School Management System</strong>.
        </p>
        <p style="line-height: 1.6; color: #475569;">
          Please click the button below to verify your email, choose your password, and activate your personal portal access.
        </p>
        
        <div class="button-wrapper">
          <a href="${inviteLink}" class="button" target="_blank">Activate Your Account & Set Password</a>
        </div>

        <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
          If the button above does not work, copy and paste this link into your browser:
        </p>
        <div class="link-box">
          ${inviteLink}
        </div>
      </div>
      <div class="footer">
        <p style="margin: 0;">This invitation is valid for 7 days. If you did not expect this invitation, please ignore this email.</p>
        <p style="margin: 6px 0 0 0;">&copy; EduManage International Academy</p>
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"EduManage Academy" <${process.env.SMTP_USER || 'jh1388965@gmail.com'}>`,
      to,
      subject: `Official Invitation: Set up your EduManage Account (${role})`,
      html: htmlContent,
    });

    console.log(`[EmailService] Invitation email successfully sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[EmailService] Failed to send email to ${to}:`, error);
    return { success: false, error: error.message };
  }
};
