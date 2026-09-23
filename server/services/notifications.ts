import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Email Transporter (Requires App Password for Gmail)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const ADMIN_NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'vidhyatutorials22@gmail.com';
const ADMIN_WHATSAPP_TO = process.env.ADMIN_WHATSAPP_TO || '+918898117343'; // Vidhya Tutorials official line

/**
 * Send Email notification for Appointment, Free Demo, Counseling & Quick Inquiry
 */
export const sendAppointmentEmail = async (appointmentDetails: any) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Email Service] EMAIL_USER or EMAIL_PASS not configured in .env. Skipping email notification.');
    return;
  }

  const transporter = createTransporter();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); color: #ffffff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">VIDHYA TUTORIALS</h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">New Lead / Form Submission Received</p>
      </div>
      <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
        <h3 style="margin-top: 0; color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Lead Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 140px; font-weight: 600;">Full Name:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${appointmentDetails.name || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Phone Number:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #2563eb;"><a href="tel:${appointmentDetails.phone}" style="color: #2563eb; text-decoration: none;">${appointmentDetails.phone || 'N/A'}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${appointmentDetails.email}" style="color: #2563eb;">${appointmentDetails.email || 'N/A'}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Standard / Wing:</td>
            <td style="padding: 8px 0; font-weight: 600;">${appointmentDetails.standard || 'Not Specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600; vertical-align: top;">Submission Note:</td>
            <td style="padding: 8px 0; background: #f8fafc; padding: 10px; border-radius: 6px; white-space: pre-wrap;">${appointmentDetails.message || 'Standard Inquiry'}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding: 14px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px; font-size: 13px; color: #1e40af;">
          <strong>Action Recommended:</strong> Call this candidate within 1-2 hours to discuss syllabus roadmap, demo class, or batch schedule.
        </div>
      </div>
      <div style="background: #f1f5f9; padding: 14px; text-align: center; font-size: 11px; color: #64748b;">
        Vidhya Tutorials • Official Academic Desk Alert System • Mumbai - 400017
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Vidhya Tutorials Portal" <${process.env.EMAIL_USER}>`,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `🔔 New Inquiry: ${appointmentDetails.name} (${appointmentDetails.standard || 'General'})`,
      html: htmlContent
    });
    console.log('[Email Service] Appointment notification email sent successfully to:', ADMIN_NOTIFICATION_EMAIL);
  } catch (error) {
    console.error('[Email Service] Failed to send appointment email:', error);
  }
};

/**
 * Send WhatsApp notification for Appointment, Free Demo, Counseling & Quick Inquiry
 */
export const sendAppointmentWhatsApp = async (appointmentDetails: any) => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP_NUMBER) {
    console.warn('[WhatsApp Service] Twilio credentials not configured in .env. Skipping automated WhatsApp notification.');
    return;
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  const messageText = `🔔 *NEW VIDHYA TUTORIALS LEAD!*\n\n👤 *Name:* ${appointmentDetails.name}\n📞 *Phone:* ${appointmentDetails.phone}\n✉️ *Email:* ${appointmentDetails.email || 'N/A'}\n📚 *Class:* ${appointmentDetails.standard || 'N/A'}\n\n📝 *Details:*\n${appointmentDetails.message || 'Standard website form enquiry'}\n\n_Vidhya Tutorials Automated Alert System_`;

  try {
    const formattedTo = ADMIN_WHATSAPP_TO.startsWith('whatsapp:')
      ? ADMIN_WHATSAPP_TO
      : `whatsapp:${ADMIN_WHATSAPP_TO.startsWith('+') ? ADMIN_WHATSAPP_TO : '+91' + ADMIN_WHATSAPP_TO}`;

    await client.messages.create({
      body: messageText,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: formattedTo
    });
    console.log('[WhatsApp Service] Notification sent successfully to:', formattedTo);
  } catch (error) {
    console.error('[WhatsApp Service] Failed to send WhatsApp notification:', error);
  }
};

/**
 * Send Email notification for Full Admission Application Form Submission
 */
export const sendAdmissionEmail = async (admissionDetails: any) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Email Service] EMAIL_USER or EMAIL_PASS not configured. Skipping admission email notification.');
    return;
  }

  const transporter = createTransporter();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0f172a, #1e3a8a); color: #ffffff; padding: 26px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 0.5px;">VIDHYA TUTORIALS</h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #93c5fd; font-weight: 600;">NEW OFFICIAL ADMISSION APPLICATION SUBMITTED</p>
      </div>
      <div style="padding: 26px; color: #0f172a; line-height: 1.6;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 13px; color: #64748b;">Application Reference ID:</p>
          <p style="margin: 2px 0 0 0; font-size: 18px; font-weight: bold; color: #2563eb; font-family: monospace;">${admissionDetails._id || 'VT-ADM-LIVE'}</p>
        </div>

        <h3 style="margin: 0 0 12px 0; color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Student & Academic Info</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 150px; font-weight: 600;">Student Name:</td>
            <td style="padding: 8px 0; font-weight: bold;">${admissionDetails.studentName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Contact Phone:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #2563eb;"><a href="tel:${admissionDetails.phone}" style="color: #2563eb; text-decoration: none;">${admissionDetails.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email Address:</td>
            <td style="padding: 8px 0;"><a href="mailto:${admissionDetails.email}" style="color: #2563eb;">${admissionDetails.email || 'N/A'}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Father / Mother:</td>
            <td style="padding: 8px 0;">${admissionDetails.fatherName || '-'} & ${admissionDetails.motherName || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Standard & Stream:</td>
            <td style="padding: 8px 0; font-weight: 600;">${admissionDetails.standard} ${admissionDetails.stream ? `(${admissionDetails.stream})` : ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Enrollment Type:</td>
            <td style="padding: 8px 0;">${admissionDetails.enrollmentType === 'ALL_SUBJECTS' ? 'All Subjects' : 'Particular Subjects'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Previous School:</td>
            <td style="padding: 8px 0;">${admissionDetails.previousSchool || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Address:</td>
            <td style="padding: 8px 0;">${admissionDetails.presentAddress || 'Dharavi / Matunga, Mumbai'}</td>
          </tr>
        </table>

        <div style="padding: 14px; background: #ecfdf5; border-left: 4px solid #10b981; border-radius: 6px; font-size: 13px; color: #065f46;">
          <strong>Admin Next Step:</strong> Review full form in the Admin Portal under <strong>"Admissions"</strong> to print the receipt or approve student enrollment.
        </div>
      </div>
      <div style="background: #f1f5f9; padding: 14px; text-align: center; font-size: 11px; color: #64748b;">
        Vidhya Tutorials • Admissions Bureau • Matunga Road Center, Mumbai - 400017
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Vidhya Tutorials Portal" <${process.env.EMAIL_USER}>`,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `🎓 NEW ADMISSION FORM: ${admissionDetails.studentName} (${admissionDetails.standard})`,
      html: htmlContent
    });
    console.log('[Email Service] Admission application email sent to:', ADMIN_NOTIFICATION_EMAIL);
  } catch (error) {
    console.error('[Email Service] Failed to send admission email:', error);
  }
};

/**
 * Send WhatsApp notification for Full Admission Application Form Submission
 */
export const sendAdmissionWhatsApp = async (admissionDetails: any) => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP_NUMBER) {
    console.warn('[WhatsApp Service] Twilio credentials not configured. Skipping WhatsApp notification.');
    return;
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  const messageText = `🎓 *NEW ADMISSION APPLICATION SUBMITTED!*\n\n👤 *Student:* ${admissionDetails.studentName}\n📚 *Class/Wing:* ${admissionDetails.standard} ${admissionDetails.stream ? `(${admissionDetails.stream})` : ''}\n📞 *Phone:* ${admissionDetails.phone}\n✉️ *Email:* ${admissionDetails.email || 'N/A'}\n👨‍👩‍👧 *Parents:* ${admissionDetails.fatherName || '-'} / ${admissionDetails.motherName || '-'}\n🏫 *School:* ${admissionDetails.previousSchool || 'N/A'}\n📍 *Address:* ${admissionDetails.presentAddress || 'N/A'}\n\n_Review and approve in Admin Portal > Admissions_`;

  try {
    const formattedTo = ADMIN_WHATSAPP_TO.startsWith('whatsapp:')
      ? ADMIN_WHATSAPP_TO
      : `whatsapp:${ADMIN_WHATSAPP_TO.startsWith('+') ? ADMIN_WHATSAPP_TO : '+91' + ADMIN_WHATSAPP_TO}`;

    await client.messages.create({
      body: messageText,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: formattedTo
    });
    console.log('[WhatsApp Service] Admission WhatsApp alert sent to:', formattedTo);
  } catch (error) {
    console.error('[WhatsApp Service] Failed to send admission WhatsApp:', error);
  }
};

/**
 * Send Password Reset Link Email
 */
export const sendPasswordResetEmail = async (toEmail: string, resetUrl: string, userName?: string): Promise<{ sent: boolean; link: string }> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Email Service] EMAIL_USER or EMAIL_PASS not configured in .env. Password reset link generated:');
    console.log(`\n=======================================================\n[PASSWORD RESET LINK FOR ${toEmail}]\n${resetUrl}\n=======================================================\n`);
    return { sent: false, link: resetUrl };
  }

  const transporter = createTransporter();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); color: #ffffff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">VIDHYA TUTORIALS</h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">Secure Admin Password Reset</p>
      </div>
      <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
        <h3 style="margin-top: 0; color: #1e3a8a;">Hello ${userName || 'Administrator'},</h3>
        <p>A request was received to reset the password for your Vidhya Tutorials administrative account.</p>
        <p>Click the button below to securely set your new password. This single-use link is valid for <strong>15 minutes</strong>:</p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${resetUrl}" style="background: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Reset My Password</a>
        </div>
        <p style="font-size: 13px; color: #64748b;">If the button does not work, copy and paste this link into your web browser:</p>
        <p style="font-size: 12px; word-break: break-all; color: #2563eb;"><a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a></p>
        <div style="margin-top: 24px; padding: 12px; background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px; font-size: 12px; color: #991b1b;">
          If you did not request this password reset, please ignore this email. Your current credentials will remain safe and unchanged.
        </div>
      </div>
      <div style="background: #f1f5f9; padding: 14px; text-align: center; font-size: 11px; color: #64748b;">
        Vidhya Tutorials • Official Academic Administration • Mumbai - 400017
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Vidhya Tutorials Security" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `🔐 Vidhya Tutorials - Password Reset Link`,
      html: htmlContent
    });
    console.log('[Email Service] Password reset email sent successfully to:', toEmail);
    return { sent: true, link: resetUrl };
  } catch (error) {
    console.error('[Email Service] Failed to send password reset email via SMTP:', error);
    console.log(`\n=======================================================\n[PASSWORD RESET FALLBACK LINK FOR ${toEmail}]\n${resetUrl}\n=======================================================\n`);
    return { sent: false, link: resetUrl };
  }
};


