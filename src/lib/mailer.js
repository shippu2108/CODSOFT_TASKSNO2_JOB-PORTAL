import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendApplicationStatusEmail({ to, candidateName, jobTitle, companyName, status }) {
  const statusConfig = {
    SHORTLISTED: {
      subject: `You've been shortlisted for ${jobTitle}`,
      heading: "You're on the shortlist!",
      body: `Good news — your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been shortlisted. The hiring team will be in touch soon with next steps.`,
      color: '#a97c1f',
    },
    REJECTED: {
      subject: `Update on your application for ${jobTitle}`,
      heading: 'Application update',
      body: `Thank you for applying for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>. After careful review, the team has decided to move forward with other candidates at this time. We encourage you to apply for future openings that match your profile.`,
      color: '#9f3a38',
    },
    HIRED: {
      subject: `🎉 Offer: ${jobTitle} at ${companyName}`,
      heading: "Congratulations — you're hired!",
      body: `We are delighted to inform you that you have been selected for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>. Please find your official offer letter below.`,
      color: '#1f4b43',
    },
  };

  const config = statusConfig[status];
  if (!config) return;

  const html = `
  <div style="font-family: -apple-system, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; color: #101828;">
    <h1 style="font-size: 20px; color: #101828; margin-bottom: 4px;">CareerHub</h1>
    <div style="height: 3px; width: 40px; background: ${config.color}; margin-bottom: 24px;"></div>

    <h2 style="font-size: 18px; color: ${config.color}; margin-bottom: 16px;">${config.heading}</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #344054;">Hi ${candidateName},</p>
    <p style="font-size: 15px; line-height: 1.6; color: #344054;">${config.body}</p>

    ${status === 'HIRED' ? `
      <div style="margin-top: 24px; padding: 20px; border: 1px solid #e5e1d8; border-radius: 12px; background: #faf9f6;">
        <h3 style="font-size: 15px; color: #101828; margin-bottom: 12px;">Offer Summary</h3>
        <table style="width: 100%; font-size: 14px; color: #344054;">
          <tr><td style="padding: 4px 0;">Position</td><td style="text-align: right; font-weight: 600;">${jobTitle}</td></tr>
          <tr><td style="padding: 4px 0;">Company</td><td style="text-align: right; font-weight: 600;">${companyName}</td></tr>
          <tr><td style="padding: 4px 0;">Status</td><td style="text-align: right; font-weight: 600; color: #1f4b43;">Offer Extended</td></tr>
        </table>
        <p style="font-size: 13px; color: #667085; margin-top: 16px;">
          A member of the ${companyName} team will reach out shortly with onboarding details,
          compensation specifics, and your start date. Please reply to this email to confirm
          your acceptance.
        </p>
      </div>
    ` : ''}

    <p style="font-size: 14px; color: #667085; margin-top: 28px;">
      — The CareerHub Team
    </p>
  </div>
  `;

  await transporter.sendMail({
    from: `"CareerHub" <${process.env.EMAIL_USER}>`,
    to,
    subject: config.subject,
    html,
  });
}