/* =========================================================
   GLOBALSSC
   JavaScript
   ========================================================= */


/* =========================================================
   MOBILE MENU
   ========================================================= */

function toggleMenu() {

  const menu =
    document.getElementById("mobileMenu");

  menu.classList.toggle("active");

}


function closeMenu() {

  const menu =
    document.getElementById("mobileMenu");

  menu.classList.remove("active");

}


/* =========================================================
   CONTACT FORM
   ========================================================= */

function submitForm(event) {

  event.preventDefault();

  const message =
    document.getElementById("formMessage");

  message.innerHTML =
    "✓ Thank you. Your project enquiry has been received.";

  event.target.reset();

}


/* =========================================================
   AI CHAT
   ========================================================= */

function toggleChat() {

  const chat =
    document.getElementById("chatWindow");

  chat.classList.toggle("active");

}


/* =========================================================
   CHAT RESPONSE ENGINE
   ========================================================= */

function getAIResponse(message) {

  const text =
    message.toLowerCase().trim();


  /* WEBSITE */

  if (
    text.includes("website") ||
    text.includes("web") ||
    text.includes("site")
  ) {

    return `
      GLOBALSSC builds premium websites focused on
      design, performance, mobile responsiveness,
      SEO and conversion.

      Tell me what type of website you want to build.
    `;

  }


  /* SOFTWARE */

  if (
    text.includes("software") ||
    text.includes("app") ||
    text.includes("application")
  ) {

    return `
      We build modern software products including
      dashboards, business platforms, web applications
      and APIs.

      Tell me what you want your software to do.
    `;

  }


  /* CYBERSECURITY */

  if (
    text.includes("security") ||
    text.includes("cyber") ||
    text.includes("pentest") ||
    text.includes("vulnerability")
  ) {

    return `
      GLOBALSSC provides security-focused technology
      services including vulnerability assessment,
      web/API security and security architecture.

      Security testing should only be performed on
      systems you own or are authorized to test.
    `;

  }


  /* AI */

  if (
    text.includes("ai") ||
    text.includes("artificial intelligence") ||
    text.includes("automation") ||
    text.includes("agent")
  ) {

    return `
      We can design AI assistants, intelligent
      workflows and business automation.

      Tell me which process you want to automate.
    `;

  }


  /* CLOUD */

  if (
    text.includes("cloud") ||
    text.includes("server") ||
    text.includes("hosting")
  ) {

    return `
      GLOBALSSC can help with cloud infrastructure,
      deployment systems, hosting architecture and
      technology modernization.
    `;

  }


  /* PRICE */

  if (
    text.includes("price") ||
    text.includes("pricing") ||
    text.includes("cost") ||
    text.includes("how much")
  ) {

    return `
      Project pricing depends on scope, features,
      integrations and timeline.

      Send us your project requirements through
      the Contact section for a proper quotation.
    `;

  }


  /* HELLO */

  if (
    text === "hi" ||
    text === "hello" ||
    text === "hey" ||
    text.includes("good morning") ||
    text.includes("good evening")
  ) {

    return `
      Hello 👋

      I'm the GLOBALSSC AI assistant.

      I can help you explore:
      • Websites
      • Software
      • AI
      • Cybersecurity
      • Cloud

      What would you like to build?
    `;

  }


  /* DEFAULT */

  return `
    I can help you explore GLOBALSSC services.

    Try asking me about:
    • Website development
    • Software
    • AI & automation
    • Cybersecurity
    • Cloud
    • Pricing
  `;

}


/* =========================================================
   SEND MESSAGE
   ========================================================= */

function sendMessage() {

  const input =
    document.getElementById("chatInput");

  const messages =
    document.getElementById("chatMessages");


  const text =
    input.value.trim();


  if (!text) {
    return;
  }


  /* USER MESSAGE */

  const userMessage =
    document.createElement("div");

  userMessage.className =
    "user-message";

  userMessage.textContent =
    text;

  messages.appendChild(
    userMessage
  );


  /* CLEAR INPUT */

  input.value = "";


  /* SCROLL */

  messages.scrollTop =
    messages.scrollHeight;


  /* AI RESPONSE */

  setTimeout(() => {

    const aiMessage =
      document.createElement("div");

    aiMessage.className =
      "ai-message";

    aiMessage.textContent =
      getAIResponse(text);

    messages.appendChild(
      aiMessage
    );

    messages.scrollTop =
      messages.scrollHeight;

  }, 500);

}


/* =========================================================
   ENTER KEY
   ========================================================= */

function chatKey(event) {

  if (event.key === "Enter") {

    sendMessage();

  }

}


/* =========================================================
   QUICK CHAT BUTTONS
   ========================================================= */

function quickMessage(text) {

  const input =
    document.getElementById("chatInput");

  input.value =
    text;

  sendMessage();

}


/* =========================================================
   CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener(
  "click",
  function(event) {

    const menu =
      document.getElementById("mobileMenu");

    const button =
      document.querySelector(".menu-button");


    if (
      menu &&
      menu.classList.contains("active") &&
      !menu.contains(event.target) &&
      !button.contains(event.target)
    ) {

      menu.classList.remove("active");

    }

  }
);
