require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { insertEnquiry, getAllEnquiries, getStats } = require("./db");
const { validateEnquiry } = require("./validate");
const { sendNewEnquiryEmail } = require("./email");
const { sendWhatsAppNotification } = require("./whatsapp");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: "20kb" }));

app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please try again later." },
  })
);

const enquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many enquiries submitted. Please try again in a few minutes." },
});

function requireAdmin(req, res, next) {
  const key = req.header("x-admin-key");
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.post("/api/enquiry", enquiryLimiter, async (req, res) => {
  const { valid, errors, clean } = validateEnquiry(req.body || {});
  if (!valid) {
    return res.status(400).json({ error: "Validation failed", fields: errors });
  }

  let saved;
  try {
    saved = insertEnquiry(clean);
  } catch (err) {
    console.error("[db] insert failed:", err);
    return res.status(500).json({ error: "Could not save enquiry. Please try again." });
  }

  const enquiry = { ...clean, id: saved.id, createdAt: saved.createdAt };

  Promise.allSettled([sendNewEnquiryEmail(enquiry), sendWhatsAppNotification(enquiry)]).then(
    ([emailResult, waResult]) => {
      if (emailResult.status === "rejected") console.error("[email] error:", emailResult.reason);
      if (waResult.status === "rejected") console.error("[whatsapp] error:", waResult.reason);
    }
  );

  return res.status(201).json({
    success: true,
    id: saved.id,
    message: "Enquiry received. GLOBALSSC will contact you shortly.",
  });
});

app.get("/api/enquiries", requireAdmin, (req, res) => {
  try {
    const rows = getAllEnquiries();
    const stats = getStats();
    res.json({ enquiries: rows, stats });
  } catch (err) {
    console.error("[db] read failed:", err);
    res.status(500).json({ error: "Could not load enquiries." });
  }
});

app.use(express.static(path.join(__dirname, "..", "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`GLOBALSSC Rakhi server running on http://localhost:${PORT}`);
});
