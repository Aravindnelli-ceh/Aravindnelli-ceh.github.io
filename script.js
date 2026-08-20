/* =========================================================
   GLOBALSSC
   MATRIX RAIN + PARTICLES + UI
   ========================================================= */


/* =========================================================
   MATRIX DIGITAL RAIN
   ========================================================= */

const matrixCanvas =
  document.getElementById("matrixCanvas");

const matrixCtx =
  matrixCanvas.getContext("2d");

let matrixWidth;
let matrixHeight;

let matrixFontSize = 14;
let matrixColumns;
let matrixDrops;


/* Matrix characters */

const matrixCharacters =
  "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}[]$#@%&*";


function resizeMatrix() {

  const dpr =
    Math.min(window.devicePixelRatio || 1, 2);

  matrixWidth =
    window.innerWidth;

  matrixHeight =
    window.innerHeight;

  matrixCanvas.width =
    matrixWidth * dpr;

  matrixCanvas.height =
    matrixHeight * dpr;

  matrixCanvas.style.width =
    matrixWidth + "px";

  matrixCanvas.style.height =
    matrixHeight + "px";

  matrixCtx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

  matrixFontSize =
    window.innerWidth < 600
      ? 12
      : 14;

  matrixColumns =
    Math.ceil(
      matrixWidth /
      matrixFontSize
    );

  matrixDrops =
    Array.from(
      { length: matrixColumns },
      () =>
        Math.random() *
        matrixHeight /
        matrixFontSize
    );
}


function drawMatrix() {

  /*
    Transparent black is essential.

    If we use normal black here,
    the Matrix will cover the website.
  */

  matrixCtx.fillStyle =
    "rgba(0, 0, 0, 0.055)";

  matrixCtx.fillRect(
    0,
    0,
    matrixWidth,
    matrixHeight
  );


  matrixCtx.font =
    `${matrixFontSize}px monospace`;

  matrixCtx.textAlign =
    "center";


  for (
    let i = 0;
    i < matrixDrops.length;
    i++
  ) {

    const character =
      matrixCharacters[
        Math.floor(
          Math.random() *
          matrixCharacters.length
        )
      ];

    const x =
      i * matrixFontSize;

    const y =
      matrixDrops[i] *
      matrixFontSize;


    /*
      Mostly green Matrix characters.
      Some brighter characters create
      the cinematic digital-rain effect.
    */

    const brightness =
      Math.random();


    if (brightness > .94) {

      matrixCtx.fillStyle =
        "#d9ffe9";

    } else if (brightness > .75) {

      matrixCtx.fillStyle =
        "#00ff88";

    } else {

      matrixCtx.fillStyle =
        "#008f55";
    }


    matrixCtx.shadowBlur =
      brightness > .75 ? 8 : 2;

    matrixCtx.shadowColor =
      "#00ff88";


    matrixCtx.fillText(
      character,
      x,
      y
    );


    /*
      Reset a column after it reaches
      the bottom.
    */

    if (
      y >
        matrixHeight &&
      Math.random() >
        .975
    ) {

      matrixDrops[i] =
        Math.random() *
        -20;
    }


    matrixDrops[i] +=
      0.45 +
      Math.random() * 0.65;
  }


  matrixCtx.shadowBlur = 0;

  requestAnimationFrame(
    drawMatrix
  );
}


window.addEventListener(
  "resize",
  resizeMatrix
);

resizeMatrix();

drawMatrix();


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuButton =
  document.getElementById("menuButton");

const mobileMenu =
  document.getElementById("mobileMenu");


if (menuButton) {

  menuButton.addEventListener(
    "click",
    () => {

      mobileMenu.classList.toggle(
        "active"
      );

      menuButton.textContent =
        mobileMenu.classList.contains("active")
          ? "×"
          : "☰";
    }
  );
}


document
  .querySelectorAll(".mobile-menu a")
  .forEach(link => {

    link.addEventListener(
      "click",
      () => {

        mobileMenu.classList.remove(
          "active"
        );

        menuButton.textContent = "☰";
      }
    );

  });


/* =========================================================
   MOUSE PARALLAX
   ========================================================= */

const coreWrapper =
  document.querySelector(
    ".core-wrapper"
  );


let mouseX = 0;
let mouseY = 0;

let currentX = 0;
let currentY = 0;


window.addEventListener(
  "mousemove",
  event => {

    mouseX =
      (event.clientX /
        window.innerWidth -
        .5) *
      2;

    mouseY =
      (event.clientY /
        window.innerHeight -
        .5) *
      2;

  }
);


function animateCore() {

  currentX +=
    (mouseX - currentX) *
    .035;

  currentY +=
    (mouseY - currentY) *
    .035;


  if (coreWrapper) {

    const isMobile =
      window.innerWidth <= 700;

    const base =
      isMobile
        ? "translate(-50%, -50%) scale(.7)"
        : "translateY(-50%)";


    coreWrapper.style.transform =
      `${base} rotateX(${currentY * -4}deg) rotateY(${currentX * 6}deg)`;
  }


  requestAnimationFrame(
    animateCore
  );
}


animateCore();


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements =
  document.querySelectorAll(
    ".service-card, .about-panel, .security-box, .contact-form"
  );


const revealObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (
          entry.isIntersecting
        ) {

          entry.target.style.opacity =
            "1";

          entry.target.style.transform =
            "translateY(0)";

          revealObserver.unobserve(
            entry.target
          );

        }

      });

    },
    {
      threshold: .12
    }
  );


revealElements.forEach(
  element => {

    element.style.opacity =
      "0";

    element.style.transform =
      "translateY(30px)";

    element.style.transition =
      "opacity .7s ease, transform .7s ease";

    revealObserver.observe(
      element
    );

  }
);


/* =========================================================
   CONTACT FORM
   ========================================================= */

const contactForm =
  document.getElementById(
    "contactForm"
  );

const formMessage =
  document.getElementById(
    "formMessage"
  );


if (contactForm) {

  contactForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      formMessage.textContent =
        "✓ MESSAGE READY FOR TRANSMISSION";


      contactForm.reset();


      setTimeout(
        () => {

          formMessage.textContent =
            "";

        },
        5000
      );

    }
  );
}


/* =========================================================
   AI CHAT
   ========================================================= */

const chatButton =
  document.getElementById(
    "chatButton"
  );

const chatWindow =
  document.getElementById(
    "chatWindow"
  );

const chatClose =
  document.getElementById(
    "chatClose"
  );

const chatInput =
  document.getElementById(
    "chatInput"
  );

const chatSend =
  document.getElementById(
    "chatSend"
  );

const chatMessages =
  document.getElementById(
    "chatMessages"
  );


function openChat() {

  chatWindow.classList.add(
    "active"
  );

  chatInput.focus();
}


function closeChat() {

  chatWindow.classList.remove(
    "active"
  );
}


if (chatButton) {

  chatButton.addEventListener(
    "click",
    openChat
  );
}


if (chatClose) {

  chatClose.addEventListener(
    "click",
    closeChat
  );
}


/* =========================================================
   CHAT MESSAGE
   ========================================================= */

function addMessage(
  text,
  type
) {

  const message =
    document.createElement(
      "div"
    );

  message.className =
    type === "user"
      ? "user-message"
      : "ai-message";

  message.textContent =
    text;

  chatMessages.appendChild(
    message
  );

  chatMessages.scrollTop =
    chatMessages.scrollHeight;
}


/* =========================================================
   SIMPLE AI RESPONSE
   ========================================================= */

function generateResponse(
  question
) {

  const q =
    question.toLowerCase();


  if (
    q.includes("service") ||
    q.includes("services")
  ) {

    return (
      "GLOBALSSC provides Software Development, " +
      "Web Development, AI Solutions, Cyber Security, " +
      "Cloud Systems and Technical Support."
    );
  }


  if (
    q.includes("about") ||
    q.includes("globalssc")
  ) {

    return (
      "GLOBALSSC is a technology-focused platform " +
      "combining software, websites, AI and security " +
      "into modern digital solutions."
    );
  }


  if (
    q.includes("contact") ||
    q.includes("email")
  ) {

    return (
      "You can contact GLOBALSSC through " +
      "hello@globalssc.in or the contact form on this page."
    );
  }


  if (
    q.includes("ai")
  ) {

    return (
      "GLOBALSSC AI can be integrated with websites, " +
      "business workflows, customer support and automation."
    );
  }


  if (
    q.includes("security") ||
    q.includes("cyber")
  ) {

    return (
      "GLOBALSSC focuses on security-first digital " +
      "architecture, monitoring, testing and defensive systems."
    );
  }


  return (
    "I'm GLOBALSSC AI. Tell me about your project, " +
    "website, software, AI or security requirement."
  );
}


function sendChat() {

  const text =
    chatInput.value.trim();


  if (!text) {
    return;
  }


  addMessage(
    text,
    "user"
  );


  chatInput.value =
    "";


  setTimeout(
    () => {

      const response =
        generateResponse(
          text
        );

      addMessage(
        response,
        "ai"
      );

    },
    500
  );
}


if (chatSend) {

  chatSend.addEventListener(
    "click",
    sendChat
  );
}


if (chatInput) {

  chatInput.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter"
      ) {

        sendChat();

      }

    }
  );
}


/* =========================================================
   CHAT SUGGESTIONS
   ========================================================= */

document
  .querySelectorAll(
    ".chat-suggestions button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const question =
          button.dataset.question;

        chatInput.value =
          question;

        sendChat();

      }
    );

  });


/* =========================================================
   CONSOLE
   ========================================================= */

console.log(
  "%c GLOBALSSC ",
  "background:#00ff88;color:#000;font-size:20px;font-weight:bold;padding:8px;"
);

console.log(
  "%c SYSTEM ONLINE // MATRIX CORE ACTIVE ",
  "color:#00ff88;font-family:monospace;"
);
