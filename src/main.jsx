import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { createRoot } from "react-dom/client";

import {
  Canvas,
  useFrame,
  useThree
} from "@react-three/fiber";

import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette
} from "@react-three/postprocessing";

import * as THREE from "three";

import "./styles.css";


/* =========================================================
   GLOBAL HELPERS
========================================================= */

const clamp = (n, a, b) =>
  Math.min(b, Math.max(a, n));


const isLowPowerDevice = () => {
  if (typeof navigator === "undefined") return false;

  return (
    navigator.hardwareConcurrency &&
    navigator.hardwareConcurrency <= 4
  );
};


/* =========================================================
   GLOBALSSC 3D CORE
========================================================= */

function GlobalCore({
  stage = 0,
  onPulse
}) {
  const group = useRef();
  const inner = useRef();
  const pulse = useRef(0);

  const particleCount = isLowPowerDevice()
    ? 1400
    : 4200;


  /*
    Generate particles once.
  */

  const particleData = useMemo(() => {
    const positions =
      new Float32Array(
        particleCount * 3
      );

    for (
      let i = 0;
      i < particleCount;
      i++
    ) {
      const theta =
        Math.random() *
        Math.PI *
        2;

      const u =
        Math.random() * 2 - 1;

      const radiusPlane =
        Math.sqrt(
          1 - u * u
        );

      const radius =
        1.75 +
        Math.pow(
          Math.random(),
          2
        ) *
        1.7;

      positions[i * 3] =
        radius *
        radiusPlane *
        Math.cos(theta);

      positions[i * 3 + 1] =
        radius * u;

      positions[i * 3 + 2] =
        radius *
        radiusPlane *
        Math.sin(theta);
    }

    return positions;
  }, [particleCount]);


  /*
    Core animation.
  */

  useFrame(
    (state, delta) => {
      const time =
        state.clock.elapsedTime;

      if (group.current) {
        group.current.rotation.y +=
          delta *
          (0.07 + stage * 0.015);

        group.current.rotation.x =
          Math.sin(time * 0.2) *
          0.08;

        group.current.scale.setScalar(
          1 +
            Math.sin(time * 1.3) *
              0.015
        );
      }

      if (inner.current) {
        inner.current.rotation.y -=
          delta * 0.12;

        inner.current.rotation.z +=
          delta * 0.04;
      }

      pulse.current =
        Math.max(
          0,
          pulse.current -
            delta * 1.8
        );

      if (
        pulse.current > 0 &&
        group.current
      ) {
        group.current.scale.setScalar(
          1 +
            pulse.current *
              0.14
        );
      }
    }
  );


  /*
    Click / energy pulse.
  */

  const triggerPulse = () => {
    pulse.current = 1;

    if (onPulse) {
      onPulse();
    }
  };


  return (
    <group
      ref={group}
      onPointerDown={triggerPulse}
    >

      {/* Main glass crystal */}

      <mesh ref={inner}>
        <icosahedronGeometry
          args={[1.9, 4]}
        />

        <meshPhysicalMaterial
          color="#cfeaff"
          metalness={0.8}
          roughness={0.08}
          transmission={0.55}
          thickness={1.2}
          transparent
          opacity={0.55}
          envMapIntensity={2.2}
        />
      </mesh>


      {/* Primary orbital ring */}

      <mesh
        rotation={[
          Math.PI / 2,
          0,
          0
        ]}
      >
        <torusGeometry
          args={[
            2.75,
            0.018,
            8,
            160
          ]}
        />

        <meshBasicMaterial
          color="#74d8ff"
          transparent
          opacity={0.55}
        />
      </mesh>


      {/* Secondary orbital ring */}

      <mesh
        rotation={[
          0.6,
          0,
          0.8
        ]}
      >
        <torusGeometry
          args={[
            3.15,
            0.012,
            8,
            160
          ]}
        />

        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.35}
        />
      </mesh>


      {/* Particle shell */}

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particleData}
            itemSize={3}
          />
        </bufferGeometry>

        <pointsMaterial
          size={0.018}
          color="#9ee9ff"
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </points>


      {/* Internal data rings */}

      {Array.from({
        length: 12
      }).map((_, index) => (
        <mesh
          key={index}
          rotation={[
            index * 0.37,
            index * 0.91,
            index * 0.53
          ]}
        >
          <torusGeometry
            args={[
              2.2 +
                index * 0.075,
              0.006,
              6,
              100
            ]}
          />

          <meshBasicMaterial
            color={
              index % 3 === 0
                ? "#ffffff"
                : "#48cfff"
            }
            transparent
            opacity={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}


/* =========================================================
   NEURAL NETWORK
========================================================= */

function NeuralNetwork({
  stage
}) {
  const group = useRef();

  const nodeCount =
    isLowPowerDevice()
      ? 90
      : 180;


  const nodes = useMemo(
    () =>
      Array.from(
        {
          length: nodeCount
        },
        () =>
          new THREE.Vector3(
            (Math.random() - 0.5) *
              8,

            (Math.random() - 0.5) *
              5,

            (Math.random() - 0.5) *
              5
          )
      ),
    [nodeCount]
  );


  /*
    Connect nearby nodes.
  */

  const connectionPositions =
    useMemo(() => {
      const array = [];

      for (
        let i = 0;
        i < nodeCount;
        i++
      ) {
        for (
          let j = i + 1;
          j < nodeCount;
          j++
        ) {
          if (
            nodes[i].distanceTo(
              nodes[j]
            ) < 1.35
          ) {
            array.push(
              nodes[i].x,
              nodes[i].y,
              nodes[i].z,

              nodes[j].x,
              nodes[j].y,
              nodes[j].z
            );
          }
        }
      }

      return new Float32Array(
        array
      );
    }, [nodes, nodeCount]);


  const nodePositions =
    useMemo(() => {
      const array =
        new Float32Array(
          nodeCount * 3
        );

      nodes.forEach(
        (node, index) => {
          array[index * 3] =
            node.x;

          array[index * 3 + 1] =
            node.y;

          array[index * 3 + 2] =
            node.z;
        }
      );

      return array;
    }, [nodes, nodeCount]);


  useFrame(
    (_, delta) => {
      if (group.current) {
        group.current.rotation.y +=
          delta * 0.025;
      }
    }
  );


  return (
    <group
      ref={group}
      visible={
        stage === 3 ||
        stage === 5
      }
    >

      {/* Network connections */}

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={
              connectionPositions.length /
              3
            }
            array={
              connectionPositions
            }
            itemSize={3}
          />
        </bufferGeometry>

        <lineBasicMaterial
          color="#4fd8ff"
          transparent
          opacity={0.22}
        />
      </lineSegments>


      {/* Nodes */}

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodeCount}
            array={nodePositions}
            itemSize={3}
          />
        </bufferGeometry>

        <pointsMaterial
          size={0.035}
          color="#dff8ff"
        />
      </points>

    </group>
  );
}


/* =========================================================
   THREE.JS WORLD
========================================================= */

function World({
  stage,
  mouse
}) {
  const { camera } =
    useThree();


  useFrame(
    (_, delta) => {

      const targetX =
        mouse.x * 0.65;

      const targetY =
        mouse.y * 0.35;


      camera.position.x =
        THREE.MathUtils.damp(
          camera.position.x,
          targetX,
          1.7,
          delta
        );


      camera.position.y =
        THREE.MathUtils.damp(
          camera.position.y,
          targetY,
          1.7,
          delta
        );


      const targetZ =
        7.6 -
        stage * 0.45;


      camera.position.z =
        THREE.MathUtils.damp(
          camera.position.z,
          targetZ,
          1.1,
          delta
        );


      camera.lookAt(
        0,
        0,
        0
      );
    }
  );


  return (
    <>
      {/* Space */}

      <color
        attach="background"
        args={[
          "#020306"
        ]}
      />

      <fog
        attach="fog"
        args={[
          "#020306",
          7,
          20
        ]}
      />


      {/* Lighting */}

      <ambientLight
        intensity={0.25}
      />

      <pointLight
        position={[
          4,
          4,
          6
        ]}
        intensity={35}
        distance={18}
        color="#9bdfff"
      />

      <pointLight
        position={[
          -5,
          -3,
          3
        ]}
        intensity={18}
        distance={15}
        color="#5a7cff"
      />


      {/* GLOBALSSC Core */}

      <GlobalCore
        stage={stage}
      />


      {/* Neural environment */}

      <NeuralNetwork
        stage={stage}
      />


      {/* Cinematic post processing */}

      <EffectComposer
        multisampling={0}
      >
        <Bloom
          intensity={1.15}
          luminanceThreshold={0.12}
          mipmapBlur
        />

        <DepthOfField
          focusDistance={0.01}
          focalLength={0.035}
          bokehScale={2}
        />

        <Vignette
          eskil={false}
          offset={0.16}
          darkness={0.8}
        />
      </EffectComposer>
    </>
  );
}


/* =========================================================
   CINEMATIC JOURNEY CONTENT
========================================================= */

const scenes = [
  [
    "01",
    "DIGITAL CORE",
    "IDEAS BECOME SYSTEMS.",
    "The GLOBALSSC core is where strategy, engineering and imagination converge."
  ],

  [
    "02",
    "SOFTWARE",
    "SOFTWARE WITHOUT LIMITS.",
    "APIs, platforms, cloud systems and automation engineered for scale."
  ],

  [
    "03",
    "WEB",
    "DIGITAL EXPERIENCES PEOPLE REMEMBER.",
    "Immersive websites and interfaces built like products, not templates."
  ],

  [
    "04",
    "AI",
    "INTELLIGENCE, ENGINEERED.",
    "AI agents, chatbots, automation and intelligent integrations that work."
  ],

  [
    "05",
    "SECURITY",
    "PROTECTION AT EVERY LAYER.",
    "Cybersecurity, monitoring, secure architecture and resilient networks."
  ],

  [
    "06",
    "GLOBALSSC",
    "ONE DIGITAL ENGINE.",
    "Software, web, cloud, security and AI converging into one system."
  ]
];


/* =========================================================
   SERVICES
========================================================= */

const services = [
  [
    "SOFTWARE",
    "CRYSTAL SYSTEM",
    "Engineering platforms, APIs and automation."
  ],

  [
    "WEBSITES",
    "GLASS INTERFACE",
    "Premium digital experiences that convert."
  ],

  [
    "AI",
    "NEURAL ENGINE",
    "Agents, copilots and intelligent workflows."
  ],

  [
    "SECURITY",
    "CYBER SHIELD",
    "Security architecture, monitoring and defense."
  ],

  [
    "CLOUD",
    "ORBITAL CLOUD",
    "Reliable, scalable infrastructure."
  ],

  [
    "AUTOMATION",
    "MACHINE NETWORK",
    "Processes that run smarter with less friction."
  ]
];


/* =========================================================
   MAIN APPLICATION
========================================================= */

function App() {

  const [stage, setStage] =
    useState(0);

  const [mouse, setMouse] =
    useState({
      x: 0,
      y: 0
    });


  /*
    Mouse movement
  */

  useEffect(() => {

    const handleMouseMove =
      (event) => {

        setMouse({
          x:
            (event.clientX /
              window.innerWidth -
              0.5) *
            2,

          y:
            (event.clientY /
              window.innerHeight -
              0.5) *
            -2
        });
      };


    /*
      Scroll-driven scenes
    */

    const handleScroll =
      () => {

        const currentStage =
          clamp(
            Math.round(
              window.scrollY /
                (window.innerHeight *
                  0.8)
            ),
            0,
            5
          );

        setStage(
          currentStage
        );
      };


    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true
      }
    );


    return () => {

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  }, []);


  return (
    <div className="site">

      {/* =================================================
          3D BACKGROUND
      ================================================= */}

      <div className="canvas">

        <Canvas
          dpr={[
            1,
            isLowPowerDevice()
              ? 1.2
              : 1.8
          ]}
          camera={{
            position: [
              0,
              0,
              7.6
            ],
            fov: 42
          }}
          gl={{
            antialias: false,
            powerPreference:
              "high-performance"
          }}
        >

          <World
            stage={stage}
            mouse={mouse}
          />

        </Canvas>

      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <header>

        <div className="brand">
          GLOBALSSC
          <span>®</span>
        </div>


        <nav>

          {[
            "Solutions",
            "Technology",
            "Work",
            "About",
            "Contact"
          ].map(
            (item) => (

              <a
                href={
                  "#" +
                  item.toLowerCase()
                }
                key={item}
              >
                {item}
              </a>

            )
          )}

        </nav>


        <a
          className="topCta"
          href="#contact"
        >
          LET'S TALK
          <b>→</b>
        </a>

      </header>


      <main>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero">

          <div className="heroCopy">

            <div className="eyebrow">
              GLOBALSSC / DIGITAL SYSTEMS
            </div>


            <h1>
              BUILD
              <br />
              <em>
                THE FUTURE.
              </em>
            </h1>


            <p>
              Software. Websites.
              Security. AI.
            </p>


            <small>
              We engineer intelligent
              digital experiences and
              secure technology systems
              for businesses ready for
              what's next.
            </small>


            <div className="actions">

              <a
                className="primary"
                href="#contact"
              >
                START A PROJECT
                <b>→</b>
              </a>


              <a
                className="secondary"
                href="#journey"
              >
                EXPLORE TECHNOLOGY ↓
              </a>

            </div>

          </div>


          <div className="scrollHint">
            SCROLL TO ENTER
            <span>↓</span>
          </div>

        </section>


        {/* =================================================
            3D JOURNEY
        ================================================= */}

        <section
          id="journey"
          className="journey"
        >

          {scenes.map(
            (scene, index) => (

              <article
                className={
                  "scene " +
                  (
                    stage === index
                      ? "active"
                      : ""
                  )
                }
                key={scene[0]}
              >

                <div className="sceneNo">
                  {scene[0]} / 06
                </div>


                <div>

                  <div className="eyebrow">
                    {scene[1]}
                  </div>


                  <h2>
                    {scene[2]}
                  </h2>


                  <p>
                    {scene[3]}
                  </p>

                </div>

              </article>

            )
          )}

        </section>


        {/* =================================================
            SERVICES
        ================================================= */}

        <section
          id="solutions"
          className="services"
        >

          <div className="sectionIntro">

            <div className="eyebrow">
              CAPABILITIES
            </div>


            <h2>
              Six systems.
              <br />
              <em>
                One advantage.
              </em>
            </h2>

          </div>


          <div className="serviceGrid">

            {services.map(
              (service, index) => (

                <div
                  className="service"
                  key={service[0]}
                >

                  <div className="orb">
                    {index + 1}
                  </div>


                  <div>

                    <h3>
                      {service[0]}
                    </h3>


                    <div className="serviceType">
                      {service[1]}
                    </div>


                    <p>
                      {service[2]}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </section>


        {/* =================================================
            PORTFOLIO
        ================================================= */}

        <section
          id="work"
          className="work"
        >

          <div className="eyebrow">
            SELECTED SYSTEMS
          </div>


          <h2>
            Built to feel
            <br />
            <em>
              inevitable.
            </em>
          </h2>


          <div className="projects">

            <div>

              <span>
                01
              </span>

              <h3>
                AI PLATFORM
              </h3>

              <p>
                Intelligent dashboard /
                agents / automation
              </p>

            </div>


            <div>

              <span>
                02
              </span>

              <h3>
                SECURITY SYSTEM
              </h3>

              <p>
                Protected server
                architecture /
                monitoring
              </p>

            </div>


            <div>

              <span>
                03
              </span>

              <h3>
                WEB EXPERIENCE
              </h3>

              <p>
                Premium interface /
                conversion engine
              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            CONTACT / LEAD GENERATION
        ================================================= */}

        <section
          id="contact"
          className="contact"
        >

          <div className="contactCopy">

            <div className="eyebrow">
              THE NEXT MOVE
            </div>


            <h2>
              WHAT WILL
              <br />
              <em>
                YOU BUILD?
              </em>
            </h2>


            <p>
              Tell us your idea.
              We'll turn it into a
              digital system designed
              to perform.
            </p>

          </div>


          <form
            onSubmit={(event) =>
              event.preventDefault()
            }
          >

            <input
              placeholder="Name"
            />

            <input
              placeholder="Company"
            />

            <input
              type="email"
              placeholder="Email"
            />

            <input
              placeholder="Phone"
            />


            <select defaultValue="">
              <option
                value=""
                disabled
              >
                Service
              </option>

              <option>
                Software
              </option>

              <option>
                Websites
              </option>

              <option>
                AI
              </option>

              <option>
                Security
              </option>

              <option>
                Cloud
              </option>
            </select>


            <select defaultValue="">
              <option
                value=""
                disabled
              >
                Budget
              </option>

              <option>
                ₹50K – ₹2L
              </option>

              <option>
                ₹2L – ₹5L
              </option>

              <option>
                ₹5L+
              </option>
            </select>


            <textarea
              placeholder="Project Description"
              rows="5"
            />


            <button>
              LET'S BUILD IT
              <b>→</b>
            </button>

          </form>

        </section>


        {/* =================================================
            FINAL SCENE
        ================================================= */}

        <section className="final">

          <div className="eyebrow">
            GLOBALSSC / DIGITAL SYSTEMS
          </div>


          <div className="finalLogo">
            GLOBALSSC
          </div>


          <p>
            SOFTWARE • SITES • SECURITY • AI
          </p>


          <h2>
            THE FUTURE IS BUILT.
          </h2>


          <a
            className="primary"
            href="#contact"
          >
            START YOUR PROJECT
            <b>→</b>
          </a>

        </section>

      </main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer>

        <span>
          © 2026 GLOBALSSC
        </span>

        <span>
          SOFTWARE • WEBSITES • SECURITY • AI
        </span>

      </footer>

    </div>
  );
}


/* =========================================================
   REACT ROOT
========================================================= */

createRoot(
  document.getElementById("root")
).render(
  <App />
);
