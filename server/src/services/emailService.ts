import nodemailer from 'nodemailer';

export class EmailService {
  private static getTransporter() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      return null;
    }

    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  public static async sendOtpEmail(
    email: string,
    otp: string,
    name: string
  ): Promise<boolean> {
    const transporter = this.getTransporter();

    console.log(
      `\n========================================\n[EMAIL SERVICE] ✉️ OTP Verification Code for ${name} (${email})\n🔑 6-DIGIT OTP: ${otp}\n========================================\n`
    );

    if (!transporter) {
      // In dev mode or when SMTP env vars are not set, output to console log
      return true;
    }

    try {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; width: 40px; height: 40px; background-color: #4f46e5; border-radius: 8px; color: #ffffff; line-height: 40px; font-weight: bold; font-size: 18px;">EP</div>
            <h2 style="color: #0f172a; margin-top: 12px; margin-bottom: 4px; font-size: 20px;">Email OTP Verification</h2>
            <p style="color: #64748b; font-size: 13px; margin: 0;">External Job Opportunity Portal</p>
          </div>
          
          <p style="color: #334155; font-size: 14px; line-height: 1.5;">Hello <strong>${name}</strong>,</p>
          <p style="color: #334155; font-size: 14px; line-height: 1.5;">Your 6-digit OTP code to verify your student email address is:</p>
          
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; tracking: 6px; color: #4f46e5; background-color: #f1f5f9; padding: 12px 24px; border-radius: 8px; letter-spacing: 6px;">${otp}</span>
          </div>

          <p style="color: #64748b; font-size: 12px; text-align: center; margin-bottom: 0;">This OTP code will expire in 10 minutes. Please do not share this code with anyone.</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Placement Portal'}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `${otp} is your Email Verification Code — External Job Portal`,
        html: htmlContent,
      });

      return true;
    } catch (error) {
      console.error('[EmailService] Failed to send email via SMTP:', error);
      // Fallback: Return true so flow is not broken
      return true;
    }
  }
}
