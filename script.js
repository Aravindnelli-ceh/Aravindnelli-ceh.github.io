/* =========================================================
   GLOBALSSC — MAIN JAVASCRIPT
   Software • Sites • Solutions
   ========================================================= */

const BACKEND_URL = "https://globalssc-backend.onrender.com";


/* =========================================================
   MOBILE MENU
   ========================================================= */

function toggleMenu() {
  const menu = document.getElementById("mobileMenu");

  if (menu) {
    menu.classList.toggle("active");
  }
}

function closeMenu() {
  const menu = document.getElementById("mobileMenu");

  if (menu) {
    menu.classList.remove("active");
  }
}


/* =========================================================
   CONTACT FORM
   GLOBALSSC → RENDER BACKEND
   ========================================================= */

async function submitForm(event) {

  event.preventDefault();

  const form = event.target;
  const messageBox = document.getElementById("formMessage");
  const submitButton = form.querySelector(".submit-button");

  if (!messageBox || !submitButton) {
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


  /* -----------------------------------------
     EMAIL VALIDATION
  ----------------------------------------- */

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {

    messageBox.textContent =
      "Please enter a valid email address.";

    return;
  }


  /* -----------------------------------------
     LOADING STATE
  ----------------------------------------- */

  submitButton.disabled = true;

  submitButton.textContent =
    "Sending enquiry...";

  messageBox.textContent = "";


  /* -----------------------------------------
     REQUEST BODY
  ----------------------------------------- */

  const data = {

    name: name,

    email: email,

    company: company,

    service: service,

    message: projectMessage

  };


  try {

    /* -----------------------------------------
       SEND TO RENDER BACKEND
    ----------------------------------------- */

    const response = await fetch(
      `${BACKEND_URL}/api/contact`,
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body:
          JSON.stringify(data)

      }
    );


    const result =
      await response.json();


    /* -----------------------------------------
       SUCCESS
    ----------------------------------------- */

    if (response.ok && result.success) {

      messageBox.textContent =
        "✓ Thank you. Your project enquiry has been received.";

      form.reset();

    }


    /* -----------------------------------------
       SERVER ERROR
    ----------------------------------------- */

    else {

      messageBox.textContent =
        result.message ||
        "Unable to send your enquiry. Please try again.";

    }

  }


  /* -----------------------------------------
     NETWORK ERROR
  ----------------------------------------- */

  catch (error) {

    console.error(
      "GLOBALSSC contact form error:",
      error
    );

    messageBox.textContent =
      "Unable to connect to GLOBALSSC. Please try again.";

  }


  /* -----------------------------------------
     RESTORE BUTTON
  ----------------------------------------- */

  finally {

    submitButton.disabled = false;

    submitButton.textContent =
      "Send Project Enquiry →";

  }

}


/* =========================================================
   AI CHAT
   ========================================================= */

function toggleChat() {

  const chat =
    document.getElementById("chatWindow");

  if (
