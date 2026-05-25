<script setup lang="ts">
import { reactive, ref, onMounted, watch, computed } from 'vue'

// ── Config (todos los parámetros del hero, ahora editables) ──
const cfg = reactive({
  // Grid
  cols:         30,
  rows:         40,
  colSep:       1.38,
  // Dots
  minR:         1.5,
  maxR:         11.0,
  // Wave
  waveAmp:      0.13,
  waveColFact:  0.26,   // fase por columna
  waveRowFact:  3.20,   // contribución de profundidad a la fase
  wavePhase:    0,      // t congelado (0 = frame inicial del hero)
  // Perspectiva: vanishing point arriba-derecha
  nearCX:       0.60,   // centro X fila cercana (td=1)  → izquierda
  farCX:        0.98,   // centro X fila lejana  (td=0)  → derecha
  nearRY:       1.12,   // Y fila cercana (puede sobresalir abajo)
  farRY:        0.08,   // Y fila lejana
  sprdFar:      0.16,   // spread columnas lejos
  sprdNear:     1.00,   // spread columnas cerca
  // Fade
  xFadeStart:   0.28,   // fade izquierda empieza en este X normalizado
  xFadeWidth:   0.38,   // anchura del fade
  yFadeHeight:  0.22,   // fade superior cubre este % del alto
  // Opacidad
  alphaBase:    0.62,
  alphaRange:   0.23,
  // Transformación
  offsetX:         0,     // desplazamiento horizontal  -1…1 (relativo al ancho)
  offsetY:         0,     // desplazamiento vertical    -1…1 (relativo al alto)
  rotation:        0,     // grados -180…180
  // Color
  dotColor:        '#0092FF',
  bgColor:         '#000F41',
  showOverlay:     true,
  transparentBg:   false,
})

// ── Utilidades ────────────────────────────────────────────
function hexToRgba(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a.toFixed(3)})`
}

// ── Core: loop idéntico al hero ───────────────────────────
function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const {
    cols, rows, colSep, minR, maxR,
    waveAmp, waveColFact, waveRowFact, wavePhase,
    nearCX, farCX, nearRY, farRY, sprdFar, sprdNear,
    xFadeStart, xFadeWidth, yFadeHeight,
    alphaBase, alphaRange, dotColor, bgColor,
    offsetX, offsetY, rotation,
  } = cfg

  if (!cfg.transparentBg) {
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, W, H)
  }

  // Transformación: rotar y desplazar alrededor del centro
  ctx.save()
  ctx.translate(W / 2 + offsetX * W, H / 2 + offsetY * H)
  ctx.rotate(rotation * Math.PI / 180)
  ctx.translate(-W / 2, -H / 2)

  const colSpacing = (W / cols) * colSep

  for (let row = 0; row < rows; row++) {
    const td = row / (rows - 1)

    const centerX   = W  * (nearCX + (farCX  - nearCX)  * (1 - td))
    const rowY      = H  * (nearRY - (nearRY - farRY)    * (1 - td))
    const sprd      = sprdFar + (sprdNear - sprdFar) * td
    const dotRBase  = minR + (maxR - minR) * Math.pow(td, 1.1)
    const baseAlpha = alphaBase + alphaRange * td

    for (let col = 0; col < cols; col++) {
      const cx = centerX + (col - (cols - 1) / 2) * colSpacing * sprd

      if (cx < -dotRBase * 2 || cx > W + dotRBase * 2) continue

      const xFade = Math.max(0, Math.min(1, (cx / W - xFadeStart) / xFadeWidth))
      if (xFade < 0.02) continue

      const xSizeFactor = Math.max(0, Math.min(1, cx / W))
      const dotR = dotRBase * (0.8 + 0.55 * xSizeFactor)

      const p     = col * waveColFact + (1 - td) * Math.PI * waveRowFact + wavePhase
      const waveY = Math.sin(p)               * H * waveAmp * sprd
                  + Math.sin(p * 0.6 + 1.0)   * H * waveAmp * 0.30 * sprd

      const y = rowY - waveY
      if (y < -dotR * 2 || y > H + dotR * 2) continue

      const yFade      = Math.max(0, Math.min(1, y / (H * yFadeHeight)))
      const finalAlpha = baseAlpha * xFade * yFade
      if (finalAlpha < 0.01) continue

      ctx.beginPath()
      ctx.arc(cx, y, dotR, 0, Math.PI * 2)
      ctx.fillStyle = hexToRgba(dotColor, finalAlpha)
      ctx.fill()
    }
  }

  ctx.restore()
}

function applyOverlay(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const { bgColor } = cfg

  const g = ctx.createLinearGradient(0, 0, W, 0)
  g.addColorStop(0,    bgColor)
  g.addColorStop(0.25, bgColor)
  g.addColorStop(0.44, hexToRgba(bgColor, 0.80))
  g.addColorStop(0.65, hexToRgba(bgColor, 0.25))
  g.addColorStop(1,    hexToRgba(bgColor, 0.05))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  const spot = ctx.createRadialGradient(W * 0.62, H * 0.40, 0, W * 0.62, H * 0.40, W * 0.40)
  spot.addColorStop(0, 'rgba(0,55,160,0.28)')
  spot.addColorStop(1, 'rgba(0,55,160,0)')
  ctx.fillStyle = spot
  ctx.fillRect(0, 0, W, H)

  ;[{ cx: 0, cy: 0 }, { cx: W, cy: H }, { cx: W, cy: 0 }, { cx: 0, cy: H }]
    .forEach(({ cx, cy }, i) => {
      const v = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.70)
      v.addColorStop(0, `rgba(0,2,12,${i < 2 ? 0.52 : 0.35})`)
      v.addColorStop(1, 'rgba(0,2,12,0)')
      ctx.fillStyle = v
      ctx.fillRect(0, 0, W, H)
    })
}

// ── Canvas ────────────────────────────────────────────────
const canvasRef = ref<HTMLCanvasElement | null>(null)

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawGrid(ctx, canvas.width, canvas.height)
  if (cfg.showOverlay && !cfg.transparentBg) applyOverlay(ctx, canvas.width, canvas.height)
}

onMounted(() => {
  const canvas = canvasRef.value!
  const obs = new ResizeObserver(() => {
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    draw()
  })
  obs.observe(canvas)
})

watch(cfg, draw, { deep: true })

// ── Presets ───────────────────────────────────────────────
type CfgPatch = Partial<typeof cfg>

const PRESETS: { label: string; p: CfgPatch }[] = [
  {
    label: 'Hero',
    p: { cols:30, rows:40, colSep:1.38, minR:1.5, maxR:11, waveAmp:0.13, waveColFact:0.26, waveRowFact:3.2, wavePhase:0, nearCX:0.60, farCX:0.98, nearRY:1.12, farRY:0.08, sprdFar:0.16, sprdNear:1.0, xFadeStart:0.28, xFadeWidth:0.38, yFadeHeight:0.22, alphaBase:0.62, alphaRange:0.23, dotColor:'#0092FF', bgColor:'#000F41', showOverlay:true },
  },
  {
    label: 'Denso',
    p: { cols:45, rows:55, colSep:1.1, minR:0.8, maxR:6, waveAmp:0.08, waveColFact:0.4, waveRowFact:3.2, nearCX:0.60, farCX:0.98, nearRY:1.12, farRY:0.08, sprdFar:0.16, sprdNear:1.0, xFadeStart:0.20, xFadeWidth:0.35, yFadeHeight:0.18, alphaBase:0.55, alphaRange:0.3, dotColor:'#0092FF', bgColor:'#000F41', showOverlay:true },
  },
  {
    label: 'Espaciado',
    p: { cols:18, rows:28, colSep:1.6, minR:2, maxR:16, waveAmp:0.18, waveColFact:0.2, waveRowFact:3.2, nearCX:0.60, farCX:0.98, nearRY:1.12, farRY:0.08, sprdFar:0.16, sprdNear:1.0, xFadeStart:0.28, xFadeWidth:0.38, yFadeHeight:0.22, alphaBase:0.62, alphaRange:0.23, dotColor:'#0092FF', bgColor:'#000F41', showOverlay:true },
  },
  {
    label: 'Plano',
    p: { cols:30, rows:40, colSep:1.38, minR:1.5, maxR:11, waveAmp:0, waveColFact:0.26, waveRowFact:3.2, nearCX:0.60, farCX:0.98, nearRY:1.12, farRY:0.08, sprdFar:0.16, sprdNear:1.0, xFadeStart:0.28, xFadeWidth:0.38, yFadeHeight:0.22, alphaBase:0.62, alphaRange:0.23, dotColor:'#0092FF', bgColor:'#000F41', showOverlay:true },
  },
  {
    label: 'Tormenta',
    p: { cols:30, rows:40, colSep:1.38, minR:1.5, maxR:11, waveAmp:0.32, waveColFact:0.5, waveRowFact:5, nearCX:0.60, farCX:0.98, nearRY:1.12, farRY:0.08, sprdFar:0.16, sprdNear:1.0, xFadeStart:0.28, xFadeWidth:0.38, yFadeHeight:0.22, alphaBase:0.62, alphaRange:0.23, dotColor:'#0092FF', bgColor:'#000F41', showOverlay:true },
  },
  {
    label: 'Centrado',
    p: { cols:30, rows:40, colSep:1.38, minR:1.5, maxR:11, waveAmp:0.13, waveColFact:0.26, waveRowFact:3.2, nearCX:0.50, farCX:0.50, nearRY:1.12, farRY:0.08, sprdFar:0.05, sprdNear:1.0, xFadeStart:0.05, xFadeWidth:0.20, yFadeHeight:0.22, alphaBase:0.62, alphaRange:0.23, dotColor:'#0092FF', bgColor:'#000F41', showOverlay:false },
  },
  {
    label: 'Cyan',
    p: { cols:30, rows:40, colSep:1.38, minR:1.5, maxR:11, waveAmp:0.13, waveColFact:0.26, waveRowFact:3.2, nearCX:0.60, farCX:0.98, nearRY:1.12, farRY:0.08, sprdFar:0.16, sprdNear:1.0, xFadeStart:0.28, xFadeWidth:0.38, yFadeHeight:0.22, alphaBase:0.62, alphaRange:0.23, dotColor:'#3AABFF', bgColor:'#000F41', showOverlay:true },
  },
  {
    label: 'Light',
    p: { cols:30, rows:40, colSep:1.2, minR:1, maxR:7, waveAmp:0.1, waveColFact:0.26, waveRowFact:3.2, nearCX:0.60, farCX:0.98, nearRY:1.12, farRY:0.08, sprdFar:0.16, sprdNear:1.0, xFadeStart:0.28, xFadeWidth:0.38, yFadeHeight:0.22, alphaBase:0.12, alphaRange:0.10, dotColor:'#0092FF', bgColor:'#ffffff', showOverlay:false },
  },
]

function applyPreset(pr: (typeof PRESETS)[0]) {
  Object.assign(cfg, pr.p)
}

// ── Randomize ─────────────────────────────────────────────
function rnd(min: number, max: number, step: number = 0.01): number {
  const n = Math.round((max - min) / step)
  return +(min + Math.round(Math.random() * n) * step).toFixed(4)
}

function randomize() {
  Object.assign(cfg, {
    cols:         rnd(15, 45, 1),
    rows:         rnd(25, 55, 1),
    colSep:       rnd(0.8, 2.2, 0.05),
    minR:         rnd(0.5, 4, 0.5),
    maxR:         rnd(6, 18, 0.5),
    waveAmp:      rnd(0, 0.35, 0.01),
    waveColFact:  rnd(0.1, 0.8, 0.05),
    waveRowFact:  rnd(1, 6, 0.2),
    wavePhase:    rnd(0, 6.28, 0.1),
    nearCX:       rnd(0.40, 0.75, 0.05),
    farCX:        rnd(0.75, 1.10, 0.05),
    nearRY:       rnd(0.90, 1.30, 0.05),
    farRY:        rnd(-0.05, 0.20, 0.05),
    sprdFar:      rnd(0.05, 0.35, 0.05),
    sprdNear:     rnd(0.70, 1.30, 0.05),
    xFadeStart:   rnd(0.05, 0.45, 0.05),
    xFadeWidth:   rnd(0.15, 0.60, 0.05),
    yFadeHeight:  rnd(0.10, 0.45, 0.05),
    alphaBase:    rnd(0.30, 0.85, 0.05),
    alphaRange:   rnd(0.0,  0.40, 0.05),
    dotColor:     ['#0092FF','#3AABFF','#00C2FF','#5BC4FF','#A8D9FF'][Math.floor(Math.random() * 5)],
    bgColor:      Math.random() > 0.2 ? '#000F41' : ['#0a0a1a','#010820','#ffffff'][Math.floor(Math.random() * 3)],
    showOverlay:  Math.random() > 0.3,
  })
}

// ── Export PNG ────────────────────────────────────────────
const RESOLUTIONS = [
  { label: '1440 × 720',  w: 1440, h: 720  },
  { label: '1920 × 960',  w: 1920, h: 960  },
  { label: '2560 × 1280', w: 2560, h: 1280 },
] as const

const selectedRes = ref(0)
const downloading = ref(false)

function downloadPng() {
  downloading.value = true
  const { w, h } = RESOLUTIONS[selectedRes.value]

  const off = document.createElement('canvas')
  off.width  = w
  off.height = h
  const ctx = off.getContext('2d')!
  drawGrid(ctx, w, h)
  if (cfg.showOverlay && !cfg.transparentBg) applyOverlay(ctx, w, h)

  const dataUrl = off.toDataURL('image/png')
  const a = document.createElement('a')
  a.href     = dataUrl
  a.download = `hero-grid-${w}x${h}.png`
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  downloading.value = false
}

// CSS snippet de uso
const copied = ref(false)
const cssSnippet = computed(() =>
  `.hero-section {\n  background-color: ${cfg.bgColor};\n  background-image: url('/hero-grid.png');\n  background-size: cover;\n  background-position: center right;\n}`
)
async function copySnippet() {
  await navigator.clipboard.writeText(cssSnippet.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

// ── Helpers para el slider label ─────────────────────────
const fmt = (n: number, dec = 2) => n.toFixed(dec)
</script>

<template>
  <div class="dotlab">

    <!-- Canvas ───────────────────────────────────────────── -->
    <div class="dotlab-preview" :class="{ 'is-transparent': cfg.transparentBg }">
      <canvas ref="canvasRef" class="dotlab-canvas" />
    </div>

    <!-- Panel ───────────────────────────────────────────── -->
    <div class="dotlab-panel">

      <!-- Acciones rápidas -->
      <div class="panel-topbar">
        <button class="btn-random" @click="randomize">✦ Aleatorio</button>
        <div class="presets-scroll">
          <button
            v-for="pr in PRESETS" :key="pr.label"
            class="pill" @click="applyPreset(pr)"
          >{{ pr.label }}</button>
        </div>
        <label class="toggle">
          <input type="checkbox" v-model="cfg.showOverlay" :disabled="cfg.transparentBg"/>
          <span :style="cfg.transparentBg ? 'opacity:0.35' : ''">Overlay</span>
        </label>
        <label class="toggle">
          <input type="checkbox" v-model="cfg.transparentBg"/>
          <span>Transparente</span>
        </label>
      </div>

      <!-- Grupos de controles -->
      <div class="controls-scroll">

        <!-- GRID -->
        <div class="ctrl-group">
          <p class="ctrl-heading">Grid</p>
          <label class="sl"><span>Cols <em>{{ cfg.cols }}</em></span>
            <input type="range" min="8" max="60" step="1" v-model.number="cfg.cols"/></label>
          <label class="sl"><span>Rows <em>{{ cfg.rows }}</em></span>
            <input type="range" min="10" max="70" step="1" v-model.number="cfg.rows"/></label>
          <label class="sl"><span>Col sep <em>{{ fmt(cfg.colSep) }}</em></span>
            <input type="range" min="0.5" max="2.5" step="0.05" v-model.number="cfg.colSep"/></label>
        </div>

        <!-- DOTS -->
        <div class="ctrl-group">
          <p class="ctrl-heading">Puntos</p>
          <label class="sl"><span>Mín R <em>{{ fmt(cfg.minR) }}px</em></span>
            <input type="range" min="0.5" max="6" step="0.5" v-model.number="cfg.minR"/></label>
          <label class="sl"><span>Máx R <em>{{ fmt(cfg.maxR) }}px</em></span>
            <input type="range" min="3" max="24" step="0.5" v-model.number="cfg.maxR"/></label>
        </div>

        <!-- WAVE -->
        <div class="ctrl-group">
          <p class="ctrl-heading">Ola</p>
          <label class="sl"><span>Amplitud <em>{{ fmt(cfg.waveAmp) }}</em></span>
            <input type="range" min="0" max="0.5" step="0.01" v-model.number="cfg.waveAmp"/></label>
          <label class="sl"><span>Frec columna <em>{{ fmt(cfg.waveColFact) }}</em></span>
            <input type="range" min="0.05" max="1" step="0.01" v-model.number="cfg.waveColFact"/></label>
          <label class="sl"><span>Frec fila <em>{{ fmt(cfg.waveRowFact) }}</em></span>
            <input type="range" min="0.5" max="8" step="0.1" v-model.number="cfg.waveRowFact"/></label>
          <label class="sl"><span>Fase <em>{{ fmt(cfg.wavePhase) }}</em></span>
            <input type="range" min="0" max="6.28" step="0.05" v-model.number="cfg.wavePhase"/></label>
        </div>

        <!-- PERSPECTIVA -->
        <div class="ctrl-group">
          <p class="ctrl-heading">Perspectiva</p>
          <label class="sl"><span>Near X <em>{{ fmt(cfg.nearCX) }}</em></span>
            <input type="range" min="0.2" max="0.9" step="0.01" v-model.number="cfg.nearCX"/></label>
          <label class="sl"><span>Far X <em>{{ fmt(cfg.farCX) }}</em></span>
            <input type="range" min="0.5" max="1.3" step="0.01" v-model.number="cfg.farCX"/></label>
          <label class="sl"><span>Near Y <em>{{ fmt(cfg.nearRY) }}</em></span>
            <input type="range" min="0.7" max="1.4" step="0.01" v-model.number="cfg.nearRY"/></label>
          <label class="sl"><span>Far Y <em>{{ fmt(cfg.farRY) }}</em></span>
            <input type="range" min="-0.1" max="0.4" step="0.01" v-model.number="cfg.farRY"/></label>
          <label class="sl"><span>Spread lejos <em>{{ fmt(cfg.sprdFar) }}</em></span>
            <input type="range" min="0.02" max="0.5" step="0.01" v-model.number="cfg.sprdFar"/></label>
          <label class="sl"><span>Spread cerca <em>{{ fmt(cfg.sprdNear) }}</em></span>
            <input type="range" min="0.5" max="1.5" step="0.05" v-model.number="cfg.sprdNear"/></label>
        </div>

        <!-- FADE -->
        <div class="ctrl-group">
          <p class="ctrl-heading">Fade</p>
          <label class="sl"><span>Izq inicio <em>{{ fmt(cfg.xFadeStart) }}</em></span>
            <input type="range" min="0" max="0.7" step="0.01" v-model.number="cfg.xFadeStart"/></label>
          <label class="sl"><span>Izq ancho <em>{{ fmt(cfg.xFadeWidth) }}</em></span>
            <input type="range" min="0.05" max="0.8" step="0.01" v-model.number="cfg.xFadeWidth"/></label>
          <label class="sl"><span>Top altura <em>{{ fmt(cfg.yFadeHeight) }}</em></span>
            <input type="range" min="0.02" max="0.6" step="0.01" v-model.number="cfg.yFadeHeight"/></label>
        </div>

        <!-- OPACIDAD -->
        <div class="ctrl-group">
          <p class="ctrl-heading">Opacidad</p>
          <label class="sl"><span>Base <em>{{ fmt(cfg.alphaBase) }}</em></span>
            <input type="range" min="0.1" max="1" step="0.01" v-model.number="cfg.alphaBase"/></label>
          <label class="sl"><span>Rango <em>{{ fmt(cfg.alphaRange) }}</em></span>
            <input type="range" min="0" max="0.5" step="0.01" v-model.number="cfg.alphaRange"/></label>
        </div>

        <!-- TRANSFORMACIÓN -->
        <div class="ctrl-group">
          <p class="ctrl-heading">Posición</p>
          <label class="sl"><span>Offset X <em>{{ fmt(cfg.offsetX) }}</em></span>
            <input type="range" min="-0.5" max="0.5" step="0.01" v-model.number="cfg.offsetX"/></label>
          <label class="sl"><span>Offset Y <em>{{ fmt(cfg.offsetY) }}</em></span>
            <input type="range" min="-0.5" max="0.5" step="0.01" v-model.number="cfg.offsetY"/></label>
          <label class="sl"><span>Rotación <em>{{ fmt(cfg.rotation, 1) }}°</em></span>
            <input type="range" min="-180" max="180" step="1" v-model.number="cfg.rotation"/></label>
        </div>

        <!-- COLOR -->
        <div class="ctrl-group">
          <p class="ctrl-heading">Color</p>
          <label class="color-field">
            <input type="color" v-model="cfg.dotColor" />
            <span>Punto <code>{{ cfg.dotColor }}</code></span>
          </label>
          <label class="color-field" style="margin-top:0.35rem">
            <input type="color" v-model="cfg.bgColor" />
            <span>Fondo <code>{{ cfg.bgColor }}</code></span>
          </label>
          <div class="swatches">
            <button class="swatch" title="Navy + Blue"
              style="background:linear-gradient(135deg,#000F41 50%,#0092FF 50%)"
              @click="cfg.bgColor='#000F41';cfg.dotColor='#0092FF'"/>
            <button class="swatch" title="Navy + Cyan"
              style="background:linear-gradient(135deg,#000F41 50%,#3AABFF 50%)"
              @click="cfg.bgColor='#000F41';cfg.dotColor='#3AABFF'"/>
            <button class="swatch" title="Dark + Blue"
              style="background:linear-gradient(135deg,#010820 50%,#0092FF 50%)"
              @click="cfg.bgColor='#010820';cfg.dotColor='#0092FF'"/>
            <button class="swatch" title="White + Navy"
              style="background:linear-gradient(135deg,#ffffff 50%,#000F41 50%)"
              @click="cfg.bgColor='#ffffff';cfg.dotColor='#000F41'"/>
            <button class="swatch" title="White + Blue"
              style="background:linear-gradient(135deg,#f0f5ff 50%,#0092FF 50%)"
              @click="cfg.bgColor='#f0f5ff';cfg.dotColor='#0092FF'"/>
          </div>
        </div>

      </div>
    </div>

    <!-- Export ───────────────────────────────────────────── -->
    <div class="dotlab-export">
      <div class="export-row">

        <!-- Descarga PNG -->
        <div class="export-block">
          <span class="export-label">Exportar PNG</span>
          <div class="res-pills">
            <button
              v-for="(r, i) in RESOLUTIONS" :key="r.label"
              class="res-pill" :class="{ active: selectedRes === i }"
              @click="selectedRes = i"
            >{{ r.label }}</button>
          </div>
          <button class="btn-download" :class="{ loading: downloading }" @click="downloadPng">
            {{ downloading ? '…' : '⬇ Descargar PNG' }}
          </button>
        </div>

        <!-- CSS snippet -->
        <div class="export-block export-block--code">
          <span class="export-label">CSS</span>
          <pre class="export-pre"><code>{{ cssSnippet }}</code></pre>
          <button class="copy-btn" :class="{ success: copied }" @click="copySnippet">
            {{ copied ? '✓' : 'Copiar' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.dotlab {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

/* Preview wrapper */
.dotlab-preview {
  flex: 1;
  min-height: 0;
  position: relative;
}
/* Cuadros de transparencia */
.dotlab-preview.is-transparent {
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
}
.dotlab-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

/* Panel */
.dotlab-panel {
  flex-shrink: 0;
  background: #fff;
  border-top: 1px solid #e5e7eb;
}

.panel-topbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.45rem 1rem;
  border-bottom: 1px solid #f0f1f5;
}

.btn-random {
  flex-shrink: 0;
  padding: 0.28rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
  border: 1.5px solid #0092FF;
  background: rgba(0,146,255,0.06);
  color: #0092FF;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.12s;
}
.btn-random:hover { background: #0092FF; color: #fff; }

.presets-scroll {
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  flex: 1;
  scrollbar-width: none;
}
.presets-scroll::-webkit-scrollbar { display: none; }

.pill {
  padding: 0.16rem 0.55rem;
  border-radius: 9999px;
  font-size: 0.65rem;
  font-weight: 500;
  border: 1px solid #e5e7eb;
  background: #f0f5ff;
  color: #000F41;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.1s;
  flex-shrink: 0;
}
.pill:hover { background: #0092FF; border-color: #0092FF; color: #fff; }

.toggle {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.65rem;
  color: #6b7280;
  cursor: pointer;
  white-space: nowrap;
}
.toggle input { accent-color: #0092FF; cursor: pointer; }

/* Controls scroll */
.controls-scroll {
  display: flex;
  gap: 0;
  overflow-x: auto;
  padding: 0.65rem 1rem;
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}
.controls-scroll::-webkit-scrollbar { height: 4px; }
.controls-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }

.ctrl-group {
  flex-shrink: 0;
  min-width: 160px;
  max-width: 200px;
  padding-right: 1.25rem;
  margin-right: 1.25rem;
  border-right: 1px solid #f0f1f5;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.ctrl-group:last-child { border-right: none; padding-right: 0; margin-right: 0; }

.ctrl-heading {
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #9ca3af;
  margin-bottom: 0.15rem;
}

/* Sliders */
.sl {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.sl span {
  display: flex;
  justify-content: space-between;
  font-size: 0.58rem;
  color: #9ca3af;
}
.sl em {
  font-style: normal;
  font-weight: 600;
  color: #374151;
  min-width: 2.5rem;
  text-align: right;
}
.sl input[type=range] {
  width: 100%;
  accent-color: #0092FF;
  height: 3px;
  cursor: pointer;
}

/* Color */
.color-field {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
}
.color-field input[type=color] {
  width: 22px; height: 22px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  padding: 2px;
  cursor: pointer;
  flex-shrink: 0;
}
.color-field span {
  font-size: 0.58rem;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.color-field code {
  font-size: 0.56rem;
  color: #374151;
}

.swatches {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.35rem;
  flex-wrap: wrap;
}
.swatch {
  width: 20px; height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}
.swatch:hover { transform: scale(1.2); box-shadow: 0 2px 6px rgba(0,0,0,0.15); }

/* Export */
.dotlab-export {
  flex-shrink: 0;
  background: #0f1117;
  border-top: 1px solid #1e2028;
}

.export-row {
  display: flex;
  align-items: stretch;
  gap: 0;
  padding: 0.6rem 1rem;
  gap: 1.5rem;
}

.export-block {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
}

.export-block--code {
  flex: 1;
  min-width: 0;
  border-left: 1px solid #1e2028;
  padding-left: 1.5rem;
}

.export-label {
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #3d3f45;
  white-space: nowrap;
}

.res-pills {
  display: flex;
  gap: 0.2rem;
}
.res-pill {
  padding: 0.14rem 0.45rem;
  border-radius: 4px;
  font-size: 0.58rem;
  font-weight: 500;
  border: 1px solid #2a2d35;
  background: transparent;
  color: #4a4d55;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.1s;
}
.res-pill:hover { border-color: #0092FF; color: #0092FF; }
.res-pill.active { background: rgba(0,146,255,0.12); border-color: rgba(0,146,255,0.3); color: #0092FF; }

.btn-download {
  padding: 0.3rem 0.9rem;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  border: none;
  background: #0092FF;
  color: #fff;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.12s, opacity 0.12s;
}
.btn-download:hover { background: #007ACC; }
.btn-download.loading { opacity: 0.6; cursor: default; }

.export-pre {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-family: 'Consolas','Monaco',monospace;
  font-size: 0.58rem;
  line-height: 1.5;
  color: #7dd3fc;
  background: transparent;
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
}
.export-pre code { color: inherit; font-family: inherit; }

.copy-btn {
  flex-shrink: 0;
  padding: 0.18rem 0.6rem;
  border-radius: 4px;
  font-size: 0.58rem;
  font-weight: 600;
  border: 1px solid #2a2d35;
  background: #1a1d25;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}
.copy-btn:hover { border-color: #0092FF; color: #0092FF; }
.copy-btn.success { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.25); color: #10b981; }
</style>
