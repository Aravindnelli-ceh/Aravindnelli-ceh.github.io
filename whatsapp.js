const axios = require("axios");

async function sendWhatsAppNotification(enquiry) {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER;

  if (!token || !phoneNumberId || !adminNumber) {
    console.warn("[whatsapp] Cloud API not configured — skipping automatic WhatsApp notification.");
    return { sent: false, reason: "not_configured" };
  }

  const text =
    `📩 *New Rakhi Offer Enquiry*\n\n` +
    `*Name:* ${enquiry.name}\n` +
    `*Phone:* ${enquiry.phone}\n` +
    `*Business Type:* ${enquiry.businessType}\n` +
    `*Requirements:* ${enquiry.requirements}\n` +
    `*Received:* ${enquiry.createdAt}`;

  try {
    await axios.post(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: adminNumber,
        type: "text",
        text: { body: text },
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { sent: true };
  } catch (err) {
    console.error("[whatsapp] Failed to send notification:", err.response?.data || err.message);
    return { sent: false, reason: "api_error", detail: err.response?.data || err.message };
  }
}

module.exports = { sendWhatsAppNotification };
