const nodemailer = require("nodemailer");

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendNewEnquiryEmail(enquiry) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[email] SMTP not configured — skipping email notification.");
    return { sent: false, reason: "not_configured" };
  }
  if (!process.env.NOTIFY_EMAIL_TO) {
    console.warn("[email] NOTIFY_EMAIL_TO not set — skipping email notification.");
    return { sent: false, reason: "no_recipient" };
  }

  const html = `
    <h2>New Rakhi Offer Enquiry — GLOBALSSC</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;">
      <tr><td><strong>Name</strong></td><td>${enquiry.name}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${enquiry.phone}</td></tr>
      <tr><td><strong>Business Type</strong></td><td>${enquiry.businessType}</td></tr>
      <tr><td><strong>Requirements</strong></td><td>${enquiry.requirements}</td></tr>
      <tr><td><strong>Received</strong></td><td>${enquiry.createdAt}</td></tr>
    </table>
  `;

  await transporter.sendMail({
    from: process.env.NOTIFY_EMAIL_FROM || process.env.SMTP_USER,
    to: process.env.NOTIFY_EMAIL_TO,
    subject: `New Rakhi ₹3,999 Enquiry — ${enquiry.name}`,
    html,
  });

  return { sent: true };
}

module.exports = { sendNewEnquiryEmail };
