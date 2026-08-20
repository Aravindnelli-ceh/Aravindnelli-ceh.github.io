/* =========================================================
   GLOBALSSC
   SOFTWARE • SITES • SECURITY
   MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   WAIT FOR DOM
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    initMatrix();
    initThreeJS();
    initMobileMenu();
    initChat();
    initContactForm();
    initSmoothScroll();

  }
);


/* =========================================================
   MATRIX DIGITAL RAIN
   ========================================================= */

function initMatrix() {

  const container =
    document.getElementById("matrix-rain");

  if (!container) return;


  const characters =
    "アァカサタナハマヤラワガザダバパ" +
    "イィキシチニヒミリヰギジヂビピ" +
    "ウゥクスツヌフムユルグズヅブプ" +
    "エェケセテネヘメレヱゲゼデベペ" +
    "オォコソトノホモヨロヲゴゾドボポ" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "0123456789";


  const settings = {

    desktopColumns: 70,

    mobileColumns: 32,

    minLength: 10,

    maxLength: 32,

    minSpeed: 7,

    maxSpeed: 17

  };


  function random(min, max) {

    return Math.random() *
      (max - min) +
      min;

  }


  function randomCharacter() {

    return characters[
      Math.floor(
        Math.random() *
        characters.length
      )
    ];

  }


  function createColumn(index, total) {

    const column =
      document.createElement("div");

    column.className =
      "matrix-column";


    column.style.left =
      (
        (index / total) * 100 +
        random(-1.5, 1.5)
      ) + "%";


    const length =
      Math.floor(
        random(
          settings.minLength,
          settings.maxLength
        )
      );


    for (
      let i = 0;
      i < length;
      i++
    ) {

      const character =
        document.createElement("span");

      character.className =
        "matrix-char";

      character.textContent =
        randomCharacter();


      if (i === 0) {

        character.classList.add(
          "head"
        );

      }


      column.appendChild(
        character
      );

    }


    const duration =
      random(
        settings.minSpeed,
        settings.maxSpeed
      );


    column.style.animationDuration =
      duration + "s";


    column.style.animationDelay =
      random(
        -duration,
        0
      ) + "s";


    column.style.fontSize =
      random(9, 14) + "px";


    container.appendChild(
      column
    );

  }


  function buildMatrix() {

    container.innerHTML =
      "";


    const isMobile =
      window.innerWidth <= 700;


    const total =
      isMobile
        ? settings.mobileColumns
        : settings.desktopColumns;


    for (
      let i = 0;
      i < total;
      i++
    ) {

      createColumn(
        i,
        total
      );

    }

  }


  function refreshCharacters() {

    const chars =
      container.querySelectorAll(
        ".matrix-char"
      );


    chars.forEach(
      function (char) {

        if (
          !char.classList.contains(
            "head"
          )
        ) {

          if (
            Math.random() < .18
          ) {

            char.textContent =
              randomCharacter();

          }

        }

      }
    );

  }


  buildMatrix();


  setInterval(
    refreshCharacters,
    180
  );


  let resizeTimer;


  window.addEventListener(
    "resize",
    function () {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          buildMatrix,
          300
        );

    }
  );

}


/* =========================================================
   THREE.JS 3D CORE
   ========================================================= */

function initThreeJS() {

  const container =
    document.getElementById(
      "three-container"
    );


  if (!container) return;


  if (
    typeof THREE ===
    "undefined"
  ) {

    console.warn(
      "Three.js was not loaded."
    );

    return;

  }


  /* =======================================================
     SCENE
     ======================================================= */

  const scene =
    new THREE.Scene();


  scene.fog =
    new THREE.FogExp2(
      0x050505,
      .055
    );


  /* =======================================================
     CAMERA
     ======================================================= */

  const camera =
    new THREE.PerspectiveCamera(
      45,
      container.clientWidth /
      container.clientHeight,
      .1,
      100
    );


  camera.position.z =
    7;


  /* =======================================================
     RENDERER
     ======================================================= */

  const renderer =
    new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });


  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  );


  renderer.setSize(
    container.clientWidth,
    container.clientHeight
  );


  renderer.outputEncoding =
    THREE.sRGBEncoding;


  container.appendChild(
    renderer.domElement
  );


  /* =======================================================
     CORE GROUP
     ======================================================= */

  const core =
    new THREE.Group();


  scene.add(core);


  /* =======================================================
     MAIN ICOSPHERE
     ======================================================= */

  const geometry =
    new THREE.IcosahedronGeometry(
      1.35,
      3
    );


  const material =
    new THREE.MeshBasicMaterial({
      color: 0xe8bd58,
      wireframe: true,
      transparent: true,
      opacity: .65
    });


  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );


  core.add(mesh);


  /* =======================================================
     INNER CORE
     ======================================================= */

  const innerGeometry =
    new THREE.IcosahedronGeometry(
      .85,
      2
    );


  const innerMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xffdf8a,
      wireframe: true,
      transparent: true,
      opacity: .32
    });


  const inner =
    new THREE.Mesh(
      innerGeometry,
      innerMaterial
    );


  core.add(inner);


  /* =======================================================
     OUTER RINGS
     ======================================================= */

  const ringMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xe8bd58,
      transparent: true,
      opacity: .35,
      side: THREE.DoubleSide
    });


  const ring1 =
    new THREE.Mesh(
      new THREE.TorusGeometry(
        1.9,
        .015,
        16,
        100
      ),
      ringMaterial
    );


  const ring2 =
    new THREE.Mesh(
      new THREE.TorusGeometry(
        2.2,
        .01,
        16,
        100
      ),
      ringMaterial
    );


  ring1.rotation.x =
    Math.PI / 2.5;


  ring2.rotation.y =
    Math.PI / 2.8;


  core.add(ring1);
  core.add(ring2);


  /* =======================================================
     PARTICLES
     ======================================================= */

  const particleCount =
    window.innerWidth <= 700
      ? 700
      : 1400;


  const particleGeometry =
    new THREE.BufferGeometry();


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
      3.5 +
      Math.random() * 4;


    const theta =
      Math.random() *
      Math.PI *
      2;


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
      Math.sin(phi) *
      Math.sin(theta);


    positions[i * 3 + 2] =
      radius *
      Math.cos(phi);

  }


  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );


  const particleMaterial =
    new THREE.PointsMaterial({

      color: 0xe8bd58,

      size:
        window.innerWidth <= 700
          ? .025
          : .035,

      transparent: true,

      opacity: .65,

      blending:
        THREE.AdditiveBlending

    });


  const particles =
    new THREE.Points(
      particleGeometry,
      particleMaterial
    );


  scene.add(
    particles
  );


  /* =======================================================
     LIGHTS
     ======================================================= */

  const ambient =
    new THREE.AmbientLight(
      0xffffff,
      .5
    );


  scene.add(
    ambient
  );


  const goldLight =
    new THREE.PointLight(
      0xe8bd58,
      4,
      20
    );


  goldLight.position.set(
    3,
    2,
    5
  );


  scene.add(
    goldLight
  );


  /* =======================================================
     MOUSE
     ======================================================= */

  let mouseX = 0;
  let mouseY = 0;


  window.addEventListener(
    "mousemove",
    function (event) {

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


  /* =======================================================
     ANIMATION
     ======================================================= */

  const clock =
    new THREE.Clock();


  function animate() {

    requestAnimationFrame(
      animate
    );


    const elapsed =
      clock.getElapsedTime();


    core.rotation.y =
      elapsed * .18;


    core.rotation.x =
      Math.sin(
        elapsed * .25
      ) * .08;


    mesh.rotation.z =
      elapsed * .08;


    inner.rotation.y =
      -elapsed * .25;


    ring1.rotation.z =
      elapsed * .18;


    ring2.rotation.x =
      elapsed * .12;


    particles.rotation.y =
      elapsed * .015;


    particles.rotation.x =
      Math.sin(
        elapsed * .1
      ) * .04;


    core.position.x +=
      (
        mouseX * .12 -
        core.position.x
      ) * .025;


    core.position.y +=
      (
        -mouseY * .12 -
        core.position.y
      ) * .025;


    renderer.render(
      scene,
      camera
    );

  }


  animate();


  /* =======================================================
     RESIZE
     ======================================================= */

  window.addEventListener(
    "resize",
    function () {

      const width =
        container.clientWidth;

      const height =
        container.clientHeight;


      camera.aspect =
        width / height;


      camera.updateProjectionMatrix();


      renderer.setSize(
        width,
        height
      );

    }
  );

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function initMobileMenu() {

  const button =
    document.getElementById(
      "menuButton"
    );

  const menu =
    document.getElementById(
      "mobileMenu"
    );


  if (!button || !menu)
    return;


  button.addEventListener(
    "click",
    function () {

      menu.classList.toggle(
        "active"
      );

      button.textContent =
        menu.classList.contains(
          "active"
        )
          ? "×"
          : "☰";

    }
  );


  menu.querySelectorAll(
    "a"
  ).forEach(
    function (link) {

      link.addEventListener(
        "click",
        function () {

          menu.classList.remove(
            "active"
          );

          button.textContent =
            "☰";

        }
      );

    }
  );

}


/* =========================================================
   AI CHAT
   ========================================================= */

function initChat() {

  const button =
    document.getElementById(
      "chatButton"
    );

  const windowElement =
    document.getElementById(
      "chatWindow"
    );

  const close =
    document.getElementById(
      "closeChat"
    );

  const input =
    document.getElementById(
      "chatInput"
    );

  const send =
    document.getElementById(
      "sendChat"
    );

  const messages =
    document.getElementById(
      "chatMessages"
    );


  if (
    !button ||
    !windowElement ||
    !close ||
    !input ||
    !send ||
    !messages
  ) return;


  button.addEventListener(
    "click",
    function () {

      windowElement.classList.toggle(
        "active"
      );

      if (
        windowElement.classList.contains(
          "active"
        )
      ) {

        input.focus();

      }

    }
  );


  close.addEventListener(
    "click",
    function () {

      windowElement.classList.remove(
        "active"
      );

    }
  );


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


    messages.appendChild(
      message
    );


    messages.scrollTop =
      messages.scrollHeight;

  }


  function getAIResponse(
    text
  ) {

    const lower =
      text.toLowerCase();


    if (
      lower.includes(
        "service"
      )
    ) {

      return (
        "GLOBALSSC provides software development, " +
        "website development, AI automation, " +
        "cybersecurity, cloud infrastructure and " +
        "digital solutions."
      );

    }


    if (
      lower.includes(
        "website"
      )
    ) {

      return (
        "We can build a premium responsive website " +
        "with modern UI, animations, 3D elements, " +
        "security-focused architecture and " +
        "mobile support."
      );

    }


    if (
      lower.includes(
        "security"
      ) ||
      lower.includes(
        "cyber"
      )
    ) {

      return (
        "GLOBALSSC focuses on security-aware digital " +
        "systems, monitoring, secure architecture " +
        "and cybersecurity solutions."
      );

    }


    if (
      lower.includes(
        "ai"
      ) ||
      lower.includes(
        "automation"
      )
    ) {

      return (
        "We can design AI assistants, automated " +
        "workflows and intelligent business tools."
      );

    }


    if (
      lower.includes(
        "price"
      ) ||
      lower.includes(
        "cost"
      )
    ) {

      return (
        "Project pricing depends on the required " +
        "features, design, integrations and " +
        "technical complexity. Send your project " +
        "details through the contact form."
      );

    }


    return (
      "Thanks for contacting GLOBALSSC. " +
      "Tell me whether you need software, a website, " +
      "AI automation, cybersecurity or another " +
      "digital solution."
    );

  }


  function sendMessage() {

    const text =
      input.value.trim();


    if (!text)
      return;


    addMessage(
      text,
      "user"
    );


    input.value =
      "";


    setTimeout(
      function () {

        addMessage(
          getAIResponse(text),
          "ai"
        );

      },
      500
    );

  }


  send.addEventListener(
    "click",
    sendMessage
  );


  input.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();

        sendMessage();

      }

    }
  );


  document
    .querySelectorAll(
      ".chat-suggestions button"
    )
    .forEach(
      function (suggestion) {

        suggestion.addEventListener(
          "click",
          function () {

            input.value =
              suggestion.dataset.question;

            sendMessage();

          }
        );

      }
    );

}


/* =========================================================
   CONTACT FORM
   ========================================================= */

function initContactForm() {

  const form =
    document.getElementById(
      "contactForm"
    );

  const message =
    document.getElementById(
      "formMessage"
    );


  if (!form || !message)
    return;


  form.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      message.textContent =
        "✓ PROJECT REQUEST READY — CONNECT BACKEND TO RECEIVE SUBMISSIONS.";


      form.reset();


      setTimeout(
        function () {

          message.textContent =
            "";

        },
        6000
      );

    }
  );

}


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

function initSmoothScroll() {

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(
      function (link) {

        link.addEventListener(
          "click",
          function (event) {

            const targetId =
              this.getAttribute(
                "href"
              );


            if (
              targetId === "#"
            )
              return;


            const target =
              document.querySelector(
                targetId
              );


            if (!target)
              return;


            event.preventDefault();


            target.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }
        );

      }
    );

}
