/* =========================================================
   GLOBALSSC
   Software • Sites • Solutions
   Main JavaScript
========================================================= */


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMenu() {

  const menu =
    document.getElementById("mobileMenu");

  if (!menu) return;

  menu.classList.toggle("active");

}


function closeMenu() {

  const menu =
    document.getElementById("mobileMenu");

  if (!menu) return;

  menu.classList.remove("active");

}


/* =========================================================
   CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
  "click",
  function (event) {

    const menu =
      document.getElementById("mobileMenu");

    const button =
      document.querySelector(".menu-button");

    if (!menu || !button) return;

    if (
      menu.classList.contains("active") &&
      !menu.contains(event.target) &&
      !button.contains(event.target)
    ) {

      menu.classList.remove("active");

    }

  }
);


/* =========================================================
   CLOSE MOBILE MENU AFTER NAVIGATION
========================================================= */

document.querySelectorAll(
  ".mobile-menu a"
).forEach(function (link) {

  link.addEventListener(
    "click",
    function () {

      closeMenu();

    }
  );

});


/* =========================================================
   CONTACT FORM
========================================================= */

function submitForm(event) {

  event.preventDefault();

  const form =
    event.target;

  const message =
    document.getElementById(
      "formMessage"
    );

  if (!message) return;

  message.textContent =
    "✓ Thank you. Your project enquiry has been received.";

  message.style.opacity = "1";

  form.reset();

  setTimeout(function () {

    message.style.opacity = "0";

  }, 6000);

}


/* =========================================================
   AI CHAT
========================================================= */

function toggleChat() {

  const chat =
    document.getElementById(
      "chatWindow"
    );

  if (!chat) return;

  chat.classList.toggle("active");

}


/* =========================================================
   AI RESPONSE ENGINE
========================================================= */

function getAIResponse(message) {

  const text =
    message
      .toLowerCase()
      .trim();


  /* WEBSITE */

  if (
    text.includes("website") ||
    text.includes("web") ||
    text.includes("site")
  ) {

    return `
GLOBALSSC builds premium websites focused on design,
performance, mobile responsiveness, SEO and conversion.

Tell me what type of website you want to build.
`;

  }


  /* SOFTWARE */

  if (
    text.includes("software") ||
    text.includes("app") ||
    text.includes("application") ||
    text.includes("dashboard")
  ) {

    return `
GLOBALSSC builds modern software products including
web applications, dashboards, APIs and business platforms.

Tell me what you want your software to do.
`;

  }


  /* CYBERSECURITY */

  if (
    text.includes("security") ||
    text.includes("cyber") ||
    text.includes("pentest") ||
    text.includes("penetration") ||
    text.includes("vulnerability")
  ) {

    return `
GLOBALSSC provides security-focused services including
vulnerability assessment, web/API security and
security architecture.

Security testing should only be performed on systems
you own or are authorized to test.
`;

  }


  /* AI */

  if (
    text === "ai" ||
    text.includes("artificial intelligence") ||
    text.includes("automation") ||
    text.includes("ai assistant") ||
    text.includes("agent")
  ) {

    return `
GLOBALSSC can design AI assistants, intelligent workflows
and business automation.

Tell me which process you want to automate.
`;

  }


  /* CLOUD */

  if (
    text.includes("cloud") ||
    text.includes("server") ||
    text.includes("hosting") ||
    text.includes("deployment")
  ) {

    return `
GLOBALSSC can help with cloud infrastructure,
deployment systems, hosting architecture,
monitoring and technology modernization.
`;

  }


  /* CONSULTING */

  if (
    text.includes("consult") ||
    text.includes("strategy") ||
    text.includes("technology advice")
  ) {

    return `
GLOBALSSC provides technology consulting around
software architecture, digital products,
security and business automation.

Tell us about your business and the problem
you want to solve.
`;

  }


  /* PRICE */

  if (
    text.includes("price") ||
    text.includes("pricing") ||
    text.includes("cost") ||
    text.includes("how much") ||
    text.includes("budget")
  ) {

    return `
Project pricing depends on scope, features,
integrations and timeline.

Send your requirements through the Contact section
and GLOBALSSC can prepare a suitable quotation.
`;

  }


  /* HELLO */

  if (
    text === "hi" ||
    text === "hello" ||
    text === "hey" ||
    text.includes("good morning") ||
    text.includes("good evening") ||
    text.includes("good afternoon")
  ) {

    return `
Hello 👋

I'm the GLOBALSSC AI assistant.

I can help you explore:

• Websites
• Software
• AI & Automation
• Cybersecurity
• Cloud
• Consulting
• Pricing

What would you like to build?
`;

  }


  /* THANK YOU */

  if (
    text.includes("thank") ||
    text.includes("thanks")
  ) {

    return `
You're welcome.

GLOBALSSC is ready when you are.
Let's build something exceptional. ✦
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
• Consulting
• Pricing

What would you like to build?
`;

}


/* =========================================================
   SEND CHAT MESSAGE
========================================================= */

function sendMessage() {

  const input =
    document.getElementById(
      "chatInput"
    );

  const messages =
    document.getElementById(
      "chatMessages"
    );

  if (!input || !messages) return;


  const text =
    input.value.trim();


  if (!text) {
    return;
  }


  /* USER MESSAGE */

  const userMessage =
    document.createElement(
      "div"
    );

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

  setTimeout(
    function () {

      const aiMessage =
        document.createElement(
          "div"
        );

      aiMessage.className =
        "ai-message";

      aiMessage.textContent =
        getAIResponse(text);

      messages.appendChild(
        aiMessage
      );

      messages.scrollTop =
        messages.scrollHeight;

    },
    500
  );

}


/* =========================================================
   ENTER KEY
========================================================= */

function chatKey(event) {

  if (
    event.key === "Enter" &&
    !event.shiftKey
  ) {

    event.preventDefault();

    sendMessage();

  }

}


/* =========================================================
   QUICK CHAT BUTTONS
========================================================= */

function quickMessage(text) {

  const input =
    document.getElementById(
      "chatInput"
    );

  if (!input) return;

  input.value =
    text;

  sendMessage();

}


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

window.addEventListener(
  "scroll",
  function () {

    const navbar =
      document.querySelector(
        ".navbar"
      );

    if (!navbar) return;

    if (window.scrollY > 30) {

      navbar.style.background =
        "rgba(5,5,5,0.94)";

      navbar.style.boxShadow =
        "0 10px 40px rgba(0,0,0,0.25)";

    } else {

      navbar.style.background =
        "linear-gradient(180deg, rgba(5,5,5,0.94), rgba(5,5,5,0.72))";

      navbar.style.boxShadow =
        "none";

    }

  }
);


/* =========================================================
   SMOOTH CTA INTERACTION
========================================================= */

document.querySelectorAll(
  'a[href^="#"]'
).forEach(function (link) {

  link.addEventListener(
    "click",
    function (event) {

      const targetId =
        link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#"
      ) {
        return;
      }


      const target =
        document.querySelector(
          targetId
        );

      if (!target) return;

      event.preventDefault();


      const navbar =
        document.querySelector(
          ".navbar"
        );

      const offset =
        navbar
          ? navbar.offsetHeight
          : 0;


      const targetPosition =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        offset;


      window.scrollTo({

        top: targetPosition,

        behavior: "smooth"

      });

    }
  );

});


/* =========================================================
   3D HERO STATUS
========================================================= */

window.addEventListener(
  "load",
  function () {

    const canvas =
      document.getElementById(
        "globalCanvas"
      );

    if (!canvas) {
      return;
    }

    canvas.style.opacity = "1";

  }
);


/* =========================================================
   PREVENT CHAT FROM CLOSING WHEN CLICKED
========================================================= */

document.addEventListener(
  "click",
  function (event) {

    const chat =
      document.getElementById(
        "chatWindow"
      );

    const chatButton =
      document.getElementById(
        "chatButton"
      );

    if (!chat || !chatButton) {
      return;
    }

    if (
      chat.classList.contains("active") &&
      !chat.contains(event.target) &&
      !chatButton.contains(event.target)
    ) {

      chat.classList.remove(
        "active"
      );

    }

  }
);


/* =========================================================
   GLOBALSSC READY
========================================================= */

console.log(
  "GLOBALSSC — Software • Sites • Solutions"
);

console.log(
  "3D Experience initialized."
);
