<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  projects: { type: Array, required: true },
})

const emit = defineEmits(['select', 'active-change'])

const container = ref(null)

// ── Pacôme spiral params ──────────────────────────────────────
const VERTICAL_GAP = 0.5
const ANGLE_GAP = 0.85
const BASE_RADIUS = 2
const BASE_SCALE_X = 1.7
const BASE_SCALE_Y = 1
const PLANE_W = 1.7
const PLANE_H = 1

const VERTEX_SHADER = /* glsl */`
  varying vec2 vUv;
  #define PI 3.14159265359
  uniform float uScrollSpeed;

  void main() {
    vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vec3 pos = position;
    pos.z = sin(uv.x * PI) * 0.2;

    vec4 modelPos = modelMatrix * vec4(pos, 1.0);
    vec4 viewPos = viewMatrix * modelPos;
    viewPos.x += pow(worldPosition.y, 2.0) * 0.1;
    viewPos.x += sin(uv.y * PI) * uScrollSpeed * 2.0;
    gl_Position = projectionMatrix * viewPos;
    vUv = uv;
  }
`

const FRAGMENT_SHADER = /* glsl */`
  uniform sampler2D uTexture;
  uniform float uColorStrength;
  uniform float uZoom;
  uniform float uAlpha;
  uniform vec2 uPlaneSizes;
  uniform vec2 uImageSizes;
  varying vec2 vUv;

  float roundedRectSDF(vec2 uv, vec2 size, float radius) {
    vec2 d = abs(uv - 0.5) - size * 0.5 + radius;
    return length(max(d, 0.0)) - radius;
  }

  void main() {
    vec2 ratio = vec2(
      min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
      min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
    );
    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
    vec2 zoomedUv = (uv - 0.5) / uZoom + 0.5;

    vec4 color = texture2D(uTexture, zoomedUv);
    color = mix(color, vec4(0.0), uColorStrength);

    float sdf = roundedRectSDF(vUv, vec2(1.0), 0.06);
    float alpha = smoothstep(0.005, 0.0, sdf) * uAlpha;

    gl_FragColor = vec4(color.rgb, alpha);
  }
`

let renderer, scene, camera, planes = [], raycaster, mouse, animId
let hoveredPlane = null
let lastActive = -1
const textureCache = new Map()
let sharedLoader = null

function loadTexture(url, onLoad) {
  if (textureCache.has(url)) {
    const cached = textureCache.get(url)
    if (cached.image?.complete) onLoad?.(cached)
    return cached
  }
  const tex = sharedLoader.load(url, (t) => {
    t.colorSpace = THREE.SRGBColorSpace
    onLoad?.(t)
  })
  textureCache.set(url, tex)
  return tex
}

// Scroll physics (from Pacôme Controls)
let scrollOffset = 0
let wheelDeltaY = 0
let targetWheelDeltaY = 0
let wheelDirection = 1
const EASING = 0.1
const MIN_WHEEL_SPEED = 0.002

// Touch
let touchStartX = 0
let isDragging = false
let touchVelocityX = 0
let lastTouchX = 0

// Mouse parallax
let mouseNorm = { x: 0, y: 0 }
let cameraTarget = { x: 0, y: 0 }

function lerp(a, b, t) {
  return a + (b - a) * t
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

function mod(n, m) {
  return ((n % m) + m) % m
}

function getCenterIndex(count) {
  return Math.floor(count / 2)
}

function createPlane(project, index, geometry) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: null },
      uColorStrength: { value: 0.45 },
      uZoom: { value: 1 },
      uAlpha: { value: 1 },
      uPlaneSizes: { value: new THREE.Vector2(PLANE_W, PLANE_H) },
      uImageSizes: { value: new THREE.Vector2(16, 9) },
      uScrollSpeed: { value: 0 },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: true,
  })

  const mesh = new THREE.Mesh(geometry, mat)
  mesh.scale.set(BASE_SCALE_X, BASE_SCALE_Y, 1)
  mesh.userData = {
    index,
    project,
    hoverProgress: 0,
    hoverTarget: 0,
    B: 0,
    imageUrl: project.image,
    textureReady: false,
  }
  scene.add(mesh)
  planes.push(mesh)
}

function ensureTexture(mesh) {
  const ud = mesh.userData
  if (ud.textureReady || Math.abs(ud.B) > 6) return
  ud.textureReady = true
  loadTexture(ud.imageUrl, (tex) => {
    mesh.material.uniforms.uTexture.value = tex
    if (tex.image?.width) {
      mesh.material.uniforms.uImageSizes.value.set(tex.image.width, tex.image.height)
    }
  })
}

function updatePlane(mesh, count, centerIndex) {
  const ud = mesh.userData
  let N = mod(ud.index - scrollOffset, count)
  const B = N - centerIndex
  ud.B = B

  const Y = B * VERTICAL_GAP - 0.8
  const G = BASE_RADIUS
  const V = B * ANGLE_GAP
  const cosV = Math.cos(V)
  const sinV = Math.sin(V)

  mesh.position.set(cosV * G, Y, sinV * G)
  mesh.rotation.y = -V + Math.PI / 2

  // Only show cards near the focal point (like Pacôme's ~9 visible projects)
  const absB = Math.abs(B)
  const distFade = clamp(1 - (absB - 0.5) / 3.5, 0, 1)
  const distFadeSmooth = distFade * distFade * (3 - 2 * distFade)

  // Hover lerp
  const dt = 0.016
  const hoverSpeed = ud.hoverTarget > ud.hoverProgress ? 0.09 : 0.07
  const hoverT = 1 - Math.pow(1 - hoverSpeed, dt * 60)
  ud.hoverProgress = lerp(ud.hoverProgress, ud.hoverTarget, hoverT)

  const u = mesh.material.uniforms
  const baseStrength = clamp(absB * 0.18, 0, 0.6)
  u.uColorStrength.value = baseStrength * (1 - ud.hoverProgress * 0.85)
  u.uZoom.value = 1 + 0.06 * ud.hoverProgress
  u.uAlpha.value = distFadeSmooth
  u.uScrollSpeed.value = wheelDeltaY

  mesh.visible = absB < 5.5
  ensureTexture(mesh)
}

function init() {
  const el = container.value
  if (!el) return

  const w = el.clientWidth
  const h = el.clientHeight
  const isMobile = w < 900

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0a0a0a, 0.055)

  camera = new THREE.PerspectiveCamera(isMobile ? 45 : 35, w / h, 0.1, 100)
  camera.position.set(0, 0, 8)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x0a0a0a, 0)
  el.appendChild(renderer.domElement)

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  const geometry = new THREE.PlaneGeometry(1, 1, 12, 8)
  sharedLoader = new THREE.TextureLoader()

  props.projects.forEach((project, i) => {
    createPlane(project, i, geometry)
  })

  animate()
}

function checkHover() {
  if (!raycaster || isDragging) return

  raycaster.setFromCamera(mouse, camera)
  const hits = raycaster.intersectObjects(planes.filter((p) => p.visible))

  let next = null
  if (hits.length > 0) {
    const hit = hits[0]
    const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld)
    if (normal.dot(raycaster.ray.direction) < 0) {
      next = hit.object
    }
  }

  if (hoveredPlane !== next) {
    hoveredPlane?.userData && (hoveredPlane.userData.hoverTarget = 0)
    hoveredPlane = next
    if (hoveredPlane) hoveredPlane.userData.hoverTarget = 1
    container.value.style.cursor = hoveredPlane ? 'pointer' : 'grab'
  }
}

function animate() {
  animId = requestAnimationFrame(animate)

  // Scroll physics
  wheelDeltaY = lerp(wheelDeltaY, targetWheelDeltaY, EASING)
  scrollOffset += wheelDeltaY

  if (Math.abs(targetWheelDeltaY) < MIN_WHEEL_SPEED) {
    targetWheelDeltaY = wheelDirection * MIN_WHEEL_SPEED
  }
  targetWheelDeltaY *= 0.92

  // Camera parallax
  cameraTarget.x = lerp(cameraTarget.x, mouseNorm.x * 0.35, 0.06)
  cameraTarget.y = lerp(cameraTarget.y, mouseNorm.y * 0.2, 0.06)
  camera.position.x = cameraTarget.x
  camera.position.y = cameraTarget.y
  camera.lookAt(cameraTarget.x * 0.5, cameraTarget.y * 0.5, 0)

  const count = planes.length
  const centerIndex = getCenterIndex(count)

  planes.forEach((mesh) => updatePlane(mesh, count, centerIndex))

  // Sort for correct depth
  planes.sort((a, b) => b.position.z - a.position.z)

  checkHover()

  const activeIdx = mod(Math.round(scrollOffset), count)
  if (activeIdx !== lastActive) {
    lastActive = activeIdx
    emit('active-change', activeIdx)
  }

  renderer?.render(scene, camera)
}

function onResize() {
  const el = container.value
  if (!el || !renderer) return
  const w = el.clientWidth
  const h = el.clientHeight
  camera.fov = w < 900 ? 45 : 35
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}

function onWheel(e) {
  e.preventDefault()
  targetWheelDeltaY += e.deltaY * 0.00015
  targetWheelDeltaY = clamp(targetWheelDeltaY, -2, 2)
  wheelDirection = e.deltaY > 0 ? 1 : -1
}

function onPointerMove(e) {
  const el = container.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  mouseNorm.x = mouse.x
  mouseNorm.y = mouse.y
}

function onClick() {
  if (isDragging) return
  if (hoveredPlane) {
    emit('select', hoveredPlane.userData.project)
  }
}

function onTouchStart(e) {
  const t = e.touches[0]
  if (!t) return
  touchStartX = t.clientX
  lastTouchX = t.clientX
  touchVelocityX = 0
  isDragging = false
}

function onTouchMove(e) {
  const t = e.touches[0]
  if (!t) return
  const dx = t.clientX - touchStartX
  if (!isDragging && Math.abs(dx) > 8) isDragging = true
  if (isDragging) {
    e.preventDefault()
    const delta = -(t.clientX - lastTouchX) * 0.5
    targetWheelDeltaY -= delta * 0.003
    targetWheelDeltaY = clamp(targetWheelDeltaY, -2, 2)
    wheelDirection = delta < 0 ? 1 : -1
    touchVelocityX = delta
  }
  lastTouchX = t.clientX
}

function onTouchEnd() {
  if (isDragging) {
    targetWheelDeltaY -= touchVelocityX * 0.002
    targetWheelDeltaY = clamp(targetWheelDeltaY, -2, 2)
  }
  setTimeout(() => { isDragging = false }, 50)
  touchVelocityX = 0
}

onMounted(() => {
  init()
  window.addEventListener('resize', onResize)
  const el = container.value
  el?.addEventListener('wheel', onWheel, { passive: false })
  el?.addEventListener('pointermove', onPointerMove)
  el?.addEventListener('click', onClick)
  el?.addEventListener('touchstart', onTouchStart, { passive: true })
  el?.addEventListener('touchmove', onTouchMove, { passive: false })
  el?.addEventListener('touchend', onTouchEnd)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('resize', onResize)
  const el = container.value
  el?.removeEventListener('wheel', onWheel)
  el?.removeEventListener('pointermove', onPointerMove)
  el?.removeEventListener('click', onClick)
  el?.removeEventListener('touchstart', onTouchStart)
  el?.removeEventListener('touchmove', onTouchMove)
  el?.removeEventListener('touchend', onTouchEnd)
  renderer?.dispose()
  planes.forEach((p) => {
    p.geometry.dispose()
    p.material.dispose()
    p.material.uniforms.uTexture.value?.dispose()
  })
})
</script>

<template>
  <div ref="container" class="webgl" />
</template>

<style scoped>
.webgl {
  position: fixed;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  cursor: grab;
  touch-action: none;
}

.webgl:active {
  cursor: grabbing;
}

.webgl :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
