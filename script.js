/* =========================================================
   CONTACT FORM
   GLOBALSSC → WHATSAPP
   ========================================================= */

function submitForm(event) {

  event.preventDefault();

  const form = event.target;
  const messageBox = document.getElementById("formMessage");

  if (!messageBox) {
    return;
  }

  /* -----------------------------------------
     GET FORM VALUES
  ----------------------------------------- */

  const inputs = form.querySelectorAll("input");
  const select = form.querySelector("select");
  const textarea = form.querySelector("textarea");

  const name = inputs[0]?.value.trim() || "";
  const email = inputs[1]?.value.trim() || "";
  const company = inputs[2]?.value.trim() || "";

  const service = select?.value.trim() || "";
  const projectMessage = textarea?.value.trim() || "";

  /* -----------------------------------------
     BASIC VALIDATION
  ----------------------------------------- */

  if (!name || !email || !service || !projectMessage) {
    messageBox.textContent =
      "Please complete all required fields.";
    return;
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    messageBox.textContent =
      "Please enter a valid email address.";
    return;
  }

  /* -----------------------------------------
     BUILD WHATSAPP MESSAGE
  ----------------------------------------- */

  const WHATSAPP_NUMBER = "916309579202";

  const lines = [
    "New Project Enquiry — GLOBALSSC",
    `Name: ${name}`,
    `Email: ${email}`
  ];

  if (company) {
    lines.push(`Company: ${company}`);
  }

  lines.push(`Service: ${service}`);
  lines.push(`Message: ${projectMessage}`);

  const text = encodeURIComponent(lines.join("\n"));

  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

  /* -----------------------------------------
     OPEN WHATSAPP
  ----------------------------------------- */

  messageBox.textContent =
    "Opening WhatsApp…";

  window.open(whatsappURL, "_blank");

  form.reset();

}
