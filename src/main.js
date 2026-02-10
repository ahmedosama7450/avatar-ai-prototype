import * as THREE from "three";
import { EventBus } from "./utils/EventBus.js";
import { AvatarRenderer } from "./avatar/AvatarRenderer.js";
import { AnimationEngine } from "./avatar/AnimationEngine.js";
import { InteractionController } from "./interaction/InteractionController.js";
import "./style.css";

// --- Setup ---
const eventBus = new EventBus();
const avatarRenderer = new AvatarRenderer(512, 640);
const animationEngine = new AnimationEngine(eventBus);

// --- Three.js Scene ---
const threeCanvas = document.getElementById("three-canvas");
const container = document.getElementById("avatar-container");

const renderer = new THREE.WebGLRenderer({
  canvas: threeCanvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xfdf6ee, 1);

const scene = new THREE.Scene();

// Orthographic camera for 2D display
const aspect = 512 / 640;
const frustumSize = 2;
const camera = new THREE.OrthographicCamera(
  (-frustumSize * aspect) / 2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  -frustumSize / 2,
  0.1,
  10,
);
camera.position.z = 1;

// Create texture from avatar canvas
const avatarTexture = new THREE.CanvasTexture(avatarRenderer.getCanvas());
avatarTexture.minFilter = THREE.LinearFilter;
avatarTexture.magFilter = THREE.LinearFilter;

// Plane to display the avatar
const geometry = new THREE.PlaneGeometry(frustumSize * aspect, frustumSize);
const material = new THREE.MeshBasicMaterial({
  map: avatarTexture,
  transparent: true,
});
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// --- Resize Handler ---
function resize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  renderer.setSize(w, h);
}
resize();
window.addEventListener("resize", resize);

// --- Animation Loop ---
let lastTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);

  const dt = Math.min(now - lastTime, 100); // cap delta to avoid jumps
  lastTime = now;

  // Update animation engine
  const params = animationEngine.update(dt);

  // Render avatar to offscreen canvas
  avatarRenderer.render(params);

  // Update Three.js texture
  avatarTexture.needsUpdate = true;

  // Render Three.js scene
  renderer.render(scene, camera);
}

requestAnimationFrame(animate);

// --- Debug: keyboard shortcuts for testing animations ---
document.addEventListener("keydown", (e) => {
  const stateMap = {
    1: "idle",
    2: "wave",
    3: "nod",
    4: "talking",
    5: "happy",
    6: "thinking",
    7: "encouraging",
  };
  if (stateMap[e.key]) {
    animationEngine.transitionTo(stateMap[e.key]);
  }
});

// --- Start Interaction ---
const controller = new InteractionController(eventBus, animationEngine);
controller.start();
