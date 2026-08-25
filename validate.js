const ALLOWED_BUSINESS_TYPES = [
  "Retail / Shop",
  "Restaurant / Food & D2C",
  "Corporate / Startup",
  "Institute / Coaching",
  "Portfolio / Freelancer",
  "Healthcare / Clinic",
  "Real Estate",
  "Other",
];

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function stripControlChars(str) {
  return String(str).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
}

function validateEnquiry(body) {
  const errors = {};
  const clean = {};

  const name = stripControlChars(String(body.name || "").trim());
  if (name.length < 2 || name.length > 80) {
    errors.name = "Name must be between 2 and 80 characters.";
  }
  clean.name = escapeHtml(name);

  const phone = String(body.phone || "").replace(/\D/g, "");
  if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }
  clean.phone = phone;

  const businessType = stripControlChars(String(body.businessType || "").trim());
  if (!ALLOWED_BUSINESS_TYPES.includes(businessType)) {
    errors.businessType = "Select a valid business type.";
  }
  clean.businessType = escapeHtml(businessType);

  const requirements = stripControlChars(String(body.requirements || "").trim());
  if (requirements.length < 10 || requirements.length > 1000) {
    errors.requirements = "Requirements must be between 10 and 1000 characters.";
  }
  clean.requirements = escapeHtml(requirements);

  clean.source = escapeHtml(String(body.source || "Rakhi Special 2040 Landing Page").slice(0, 120));

  return { valid: Object.keys(errors).length === 0, errors, clean };
}

module.exports = { validateEnquiry, ALLOWED_BUSINESS_TYPES, escapeHtml };
