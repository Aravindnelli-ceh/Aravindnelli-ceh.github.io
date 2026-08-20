/* =========================================================
   GLOBALSSC
   MATRIX + PARTICLES + THREE.JS 3D CORE
   ========================================================= */


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

if (menuButton && mobileMenu) {

  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");

    menuButton.textContent =
      mobileMenu.classList.contains("active")
        ? "×"
        : "☰";
  });

  document.querySelectorAll(".mobile-menu a").forEach(link => {

    link.addEventListener("click", () => {

      mobileMenu.classList.remove("active");

      menuButton.textContent = "☰";

    });

  });
}


/* =========================================================
   MATRIX DIGITAL RAIN
   ========================================================= */

const matrixCanvas =
  document.getElementById("matrixCanvas");

const matrixCtx =
  matrixCanvas.getContext("2d");

let matrixWidth;
let matrixHeight;
let matrixFontSize;
let matrixColumns;
let matrixDrops = [];

const matrixCharacters =
  "01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]<>/\\#$%&@";

function resizeMatrix() {

  const dpr =
    Math.min(window.devicePixelRatio || 1, 2);

  matrixWidth = window.innerWidth;
  matrixHeight = window.innerHeight;

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
    window.innerWidth < 700
      ? 13
      : 16;

  matrixColumns =
    Math.floor(
      matrixWidth / matrixFontSize
    );

  matrixDrops =
    Array(matrixColumns)
      .fill(0)
      .map(() =>
        Math.random() *
        -matrixHeight /
        matrixFontSize
      );
}

function drawMatrix() {

  matrixCtx.fillStyle =
    "rgba(0, 0, 0, 0.075)";

  matrixCtx.fillRect(
    0,
    0,
    matrixWidth,
    matrixHeight
  );

  matrixCtx.font =
    `${matrixFontSize}px monospace`;

  for (
    let i = 0;
    i < matrixDrops.length;
    i++
  ) {

    const char =
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

    const bright =
      Math.random() > .88;

    matrixCtx.fillStyle =
      bright
        ? "rgba(180,255,220,.95)"
        : "rgba(0,255,110,.42)";

    matrixCtx.fillText(
      char,
      x,
      y
    );

    if (
      y > matrixHeight &&
      Math.random() > .975
    ) {

      matrixDrops[i] =
        Math.random() *
        -20;

    } else {

      matrixDrops[i] +=
        Math.random() > .94
          ? 1.8
          : 1;

    }
  }

  requestAnimationFrame(drawMatrix);
}

resizeMatrix();
drawMatrix();

window.addEventListener(
  "resize",
  resizeMatrix
);


/* =========================================================
   FLOATING PARTICLES
   ========================================================= */

const particleCanvas =
  document.getElementById("particleCanvas");

const particleCtx =
  particleCanvas.getContext("2d");

let particles = [];

function resizeParticles() {

  const dpr =
    Math.min(window.devicePixelRatio || 1, 2);

  particleCanvas.width =
    window.innerWidth * dpr;

  particleCanvas.height =
    window.innerHeight * dpr;

  particleCanvas.style.width =
    window.innerWidth + "px";

  particleCanvas.style.height =
    window.innerHeight + "px";

  particleCtx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

  const count =
    window.innerWidth < 700
      ? 55
      : 110;

  particles =
    Array.from(
      { length: count },
      () => ({
        x:
          Math.random() *
          window.innerWidth,

        y:
          Math.random() *
          window.innerHeight,

        size:
          Math.random() * 1.8 + .4,

        speed:
          Math.random() * .35 + .05,

        drift:
          (Math.random() - .5) *
          .25,

        alpha:
          Math.random() * .7 + .1
      })
    );
}

function drawParticles() {

  particleCtx.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  particles.forEach(p => {

    p.y -= p.speed;
    p.x += p.drift;

    if (p.y < -10) {

      p.y =
        window.innerHeight + 10;

      p.x =
        Math.random() *
        window.innerWidth;
    }

    if (p.x < -10)
      p.x = window.innerWidth;

    if (p.x > window.innerWidth + 10)
      p.x = 0;

    particleCtx.beginPath();

    particleCtx.arc(
      p.x,
      p.y,
      p.size,
      0,
      Math.PI * 2
    );

    particleCtx.fillStyle =
      `rgba(0,255,136,${p.alpha})`;

    particleCtx.shadowBlur = 8;

    particleCtx.shadowColor =
      "rgba(0,255,136,.6)";

    particleCtx.fill();

  });

  requestAnimationFrame(drawParticles);
}

resizeParticles();
drawParticles();

window.addEventListener(
  "resize",
  resizeParticles
);


/* =========================================================
   THREE.JS 3D SYSTEM
   ========================================================= */

const threeContainer =
  document.getElementById(
    "threeContainer"
  );

if (
  threeContainer &&
  typeof THREE !== "undefined"
) {

  let scene;
  let camera;
  let renderer;

  let coreGroup;
  let outerRing;
  let innerRing;

  let animationTime = 0;


  /* =====================================================
     SCENE
     ===================================================== */

  scene =
    new THREE.Scene();


  /* =====================================================
     CAMERA
     ===================================================== */

  camera =
    new THREE.PerspectiveCamera(
      45,
      threeContainer.clientWidth /
      threeContainer.clientHeight,
      .1,
      100
    );

  camera.position.set(
    0,
    0,
    8
  );


  /* =====================================================
     RENDERER
     ===================================================== */

  renderer =
    new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });

  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio || 1,
      2
    )
  );

  renderer.setSize(
    threeContainer.clientWidth,
    threeContainer.clientHeight
  );

  renderer.setClearColor(
    0x000000,
    0
  );

  threeContainer.appendChild(
    renderer.domElement
  );


  /* =====================================================
     LIGHTS
     ===================================================== */

  const ambientLight =
    new THREE.AmbientLight(
      0x88ffbb,
      .5
    );

  scene.add(
    ambientLight
  );

  const pointLight =
    new THREE.PointLight(
      0x00ff88,
      6,
      20
    );

  pointLight.position.set(
    0,
    0,
    2
  );

  scene.add(
    pointLight
  );

  const goldLight =
    new THREE.PointLight(
      0xffcc55,
      3,
      15
    );

  goldLight.position.set(
    3,
    2,
    3
  );

  scene.add(
    goldLight
  );


  /* =====================================================
     CORE GROUP
     ===================================================== */

  coreGroup =
    new THREE.Group();

  coreGroup.position.set(
    2.0,
    0,
    0
  );

  scene.add(
    coreGroup
  );


  /* =====================================================
     MAIN CORE SPHERE
     ===================================================== */

  const coreGeometry =
    new THREE.IcosahedronGeometry(
      1.45,
      5
    );

  const coreMaterial =
    new THREE.MeshStandardMaterial({

      color: 0x06140e,

      emissive: 0x00ff88,

      emissiveIntensity: .55,

      metalness: .8,

      roughness: .25,

      wireframe: false

    });

  const core =
    new THREE.Mesh(
      coreGeometry,
      coreMaterial
    );

  coreGroup.add(
    core
  );


  /* =====================================================
     CORE WIRE FRAME
     ===================================================== */

  const wireGeometry =
    new THREE.IcosahedronGeometry(
      1.53,
      3
    );

  const wireMaterial =
    new THREE.MeshBasicMaterial({

      color: 0x00ff88,

      wireframe: true,

      transparent: true,

      opacity: .55

    });

  const wire =
    new THREE.Mesh(
      wireGeometry,
      wireMaterial
    );

  coreGroup.add(
    wire
  );


  /* =====================================================
     GOLD INNER CORE
     ===================================================== */

  const innerGeometry =
    new THREE.SphereGeometry(
      .55,
      32,
      32
    );

  const innerMaterial =
    new THREE.MeshBasicMaterial({

      color: 0xffd65c,

      transparent: true,

      opacity: .85

    });

  const inner =
    new THREE.Mesh(
      innerGeometry,
      innerMaterial
    );

  coreGroup.add(
    inner
  );


  /* =====================================================
     ORBIT RINGS
     ===================================================== */

  const ringMaterial =
    new THREE.MeshBasicMaterial({

      color: 0x00ff88,

      transparent: true,

      opacity: .6

    });


  const ringGeometry =
    new THREE.TorusGeometry(
      2.0,
      .018,
      8,
      160
    );

  outerRing =
    new THREE.Mesh(
      ringGeometry,
      ringMaterial
    );

  outerRing.rotation.x =
    Math.PI / 2.5;

  coreGroup.add(
    outerRing
  );


  const ring2Geometry =
    new THREE.TorusGeometry(
      1.75,
      .012,
      8,
      160
    );

  innerRing =
    new THREE.Mesh(
      ring2Geometry,
      new THREE.MeshBasicMaterial({

        color: 0xffcc55,

        transparent: true,

        opacity: .45

      })
    );

  innerRing.rotation.y =
    Math.PI / 3;

  coreGroup.add(
    innerRing
  );


  /* =====================================================
     DIGITAL SATELLITES
     ===================================================== */

  const satelliteGroup =
    new THREE.Group();

  coreGroup.add(
    satelliteGroup
  );

  const satelliteGeometry =
    new THREE.BoxGeometry(
      .08,
      .08,
      .08
    );

  const satelliteMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x00ff88
    });

  for (
    let i = 0;
    i < 18;
    i++
  ) {

    const satellite =
      new THREE.Mesh(
        satelliteGeometry,
        satelliteMaterial
      );

    const angle =
      (i / 18) *
      Math.PI * 2;

    const radius =
      1.8 +
      Math.random() * .8;

    satellite.position.set(
      Math.cos(angle) * radius,
      (Math.random() - .5) * 1.8,
      Math.sin(angle) * radius
    );

    satelliteGroup.add(
      satellite
    );
  }


  /* =====================================================
     PARTICLE FIELD AROUND CORE
     ===================================================== */

  const particleCount = 900;

  const positions =
    new Float32Array(
      particleCount * 3
    );

  for (
    let i = 0;
    i < particleCount;
    i++
  ) {

    const radius =
      2.2 +
      Math.random() * 2.8;

    const theta =
      Math.random() *
      Math.PI * 2;

    const phi =
      Math.acos(
        2 * Math.random() - 1
      );

    positions[i * 3] =
      radius *
      Math.sin(phi) *
      Math.cos(theta);

    positions[i * 3 + 1] =
      radius *
      Math.cos(phi);

    positions[i * 3 + 2] =
      radius *
      Math.sin(phi) *
      Math.sin(theta);
  }

  const particleGeometry =
    new THREE.BufferGeometry();

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );

  const particleMaterial =
    new THREE.PointsMaterial({

      color: 0x00ff88,

      size: .025,

      transparent: true,

      opacity: .7,

      blending:
        THREE.AdditiveBlending

    });

  const threeParticles =
    new THREE.Points(
      particleGeometry,
      particleMaterial
    );

  coreGroup.add(
    threeParticles
  );


  /* =====================================================
     MOUSE INTERACTION
     ===================================================== */

  let targetRotationX = 0;
  let targetRotationY = 0;

  window.addEventListener(
    "pointermove",
    event => {

      const x =
        event.clientX /
        window.innerWidth;

      const y =
        event.clientY /
        window.innerHeight;

      targetRotationY =
        (x - .5) * .7;

      targetRotationX =
        (y - .5) * .4;

    }
  );


  /* =====================================================
     RESIZE
     ===================================================== */

  function resizeThree() {

    const width =
      threeContainer.clientWidth;

    const height =
      threeContainer.clientHeight;

    if (
      width === 0 ||
      height === 0
    ) return;

    camera.aspect =
      width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
      width,
      height
    );

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        2
      )
    );
  }

  window.addEventListener(
    "resize",
    resizeThree
  );

  resizeThree();


  /* =====================================================
     ANIMATION
     ===================================================== */

  function animate() {

    requestAnimationFrame(
      animate
    );

    animationTime += .01;


    /* Core rotation */

    core.rotation.x += .002;
    core.rotation.y += .004;

    wire.rotation.x -= .0015;
    wire.rotation.y -= .003;


    /* Rings */

    outerRing.rotation.z += .008;
    innerRing.rotation.x += .006;
    innerRing.rotation.z -= .004;


    /* Satellites */

    satelliteGroup.rotation.y += .004;

    satelliteGroup.rotation.x =
      Math.sin(animationTime * .4) *
      .2;


    /* Particle orbit */

    threeParticles.rotation.y += .0015;

    threeParticles.rotation.x =
      Math.sin(animationTime * .3) *
      .08;


    /* Smooth mouse movement */

    coreGroup.rotation.y +=
      (
        targetRotationY -
        coreGroup.rotation.y
      ) * .025;

    coreGroup.rotation.x +=
      (
        targetRotationX -
        coreGroup.rotation.x
      ) * .025;


    /* Floating */

    coreGroup.position.y =
      Math.sin(
        animationTime
      ) * .08;


    /* Camera */

    camera.lookAt(
      coreGroup.position
    );


    renderer.render(
      scene,
      camera
    );
  }

  animate();

}


/* =========================================================
   FALLBACK IF THREE.JS DOES NOT LOAD
   ========================================================= */

else {

  console.warn(
    "GLOBALSSC: Three.js failed to load."
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

const chatForm =
  document.getElementById(
    "chatForm"
  );

const chatInput =
  document.getElementById(
    "chatInput"
  );

const chatMessages =
  document.getElementById(
    "chatMessages"
  );


function addChatMessage(
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


function getAIResponse(question) {

  const q =
    question.toLowerCase();

  if (
    q.includes("service") ||
    q.includes("what do you")
  ) {

    return `
GLOBALSSC provides:

• Software Development
• Web Development
• AI Solutions
• Cyber Security
• Cloud & Infrastructure
• Digital Solutions

Tell me what you want to build.
    `.trim();

  }

  if (
    q.includes("website") ||
    q.includes("web")
  ) {

    return `
We can build a premium responsive website with modern UI,
animations, backend integration and AI capabilities.
    `.trim();

  }

  if (
    q.includes("ai") ||
    q.includes("chatbot")
  ) {

    return `
GLOBALSSC can integrate AI assistants, automation,
chatbots and intelligent business workflows.
    `.trim();

  }

  if (
    q.includes("security") ||
    q.includes("cyber")
  ) {

    return `
GLOBALSSC focuses on security-aware system design,
monitoring, infrastructure protection and cybersecurity solutions.
    `.trim();

  }

  if (
    q.includes("contact") ||
    q.includes("project")
  ) {

    return `
Use the contact form on this page and send your project
requirements. The GLOBALSSC team can review your request.
    `.trim();

  }

  return `
I understand your request.

Tell me more about the software, website, AI or
technology solution you want to build.
  `.trim();
}


if (chatButton) {

  chatButton.addEventListener(
    "click",
    () => {

      chatWindow.classList.toggle(
        "active"
      );

      if (
        chatWindow.classList.contains(
          "active"
        )
      ) {

        setTimeout(
          () => chatInput.focus(),
          100
        );

      }

    }
  );

}


if (chatClose) {

  chatClose.addEventListener(
    "click",
    () => {

      chatWindow.classList.remove(
        "active"
      );

    }
  );

}


if (chatForm) {

  chatForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const question =
        chatInput.value.trim();

      if (!question)
        return;

      addChatMessage(
        question,
        "user"
      );

      chatInput.value = "";

      setTimeout(
        () => {

          addChatMessage(
            getAIResponse(question),
            "ai"
          );

        },
        450
      );

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

        addChatMessage(
          question,
          "user"
        );

        setTimeout(
          () => {

            addChatMessage(
              getAIResponse(question),
              "ai"
            );

          },
          400
        );

      }
    );

  });


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
        "MESSAGE READY — CONNECT YOUR BACKEND/EMAIL API TO SEND.";

      contactForm.reset();

    }
  );

}


/* =========================================================
   SMOOTH NAVIGATION
   ========================================================= */

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach(link => {

    link.addEventListener(
      "click",
      event => {

        const target =
          document.querySelector(
            link.getAttribute("href")
          );

        if (!target)
          return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth"
        });

      }
    );

  });


console.log(
  "%c GLOBALSSC SYSTEM ONLINE ",
  "background:#00ff88;color:#000;font-weight:bold;padding:8px;"
);

console.log(
  "%c MATRIX RAIN: ACTIVE ",
  "color:#00ff88;font-weight:bold;"
);

console.log(
  "%c 3D CORE: ACTIVE ",
  "color:#e8bd58;font-weight:bold;"
);
