<script setup lang="ts">
import { ref, watch, computed, defineAsyncComponent } from 'vue'
import DotGridLab from './DotGridLab.vue'

// ─── Components ───────────────────────────────────────────
const allModules = import.meta.glob('@ds/_variants/**/*.vue')

const componentMap: Record<string, Record<string, ReturnType<typeof defineAsyncComponent>>> = {}

for (const [modulePath, loader] of Object.entries(allModules)) {
  const parts   = modulePath.split('/')
  const name    = parts[parts.length - 3]
  const variant = parts[parts.length - 2]
  if (!componentMap[name]) componentMap[name] = {}
  componentMap[name][variant] = defineAsyncComponent(loader as () => Promise<any>)
}

const componentNames = Object.keys(componentMap).sort()
const selected       = ref(componentNames[0] ?? '')
const activeVariant  = ref('')

watch(selected, (name) => {
  activeVariant.value = Object.keys(componentMap[name] ?? {})[0] ?? ''
}, { immediate: true })

function variantsOf(name: string) {
  return Object.keys(componentMap[name] ?? {}).sort()
}

// ─── Component type detection ──────────────────────────────
// Algunos componentes usan position:sticky/fixed relativo al viewport
// y necesitan un preview especial (componente arriba, contenido debajo).
// Añadir aquí cualquier nombre de componente que use fixed/sticky global.
const PAGE_TOP_COMPONENTS = ['Navbar', 'Header', 'Nav', 'Menu', 'Topbar', 'Toolbar']
const isNavbarComponent = computed(() =>
  PAGE_TOP_COMPONENTS.some(n => selected.value?.toLowerCase().includes(n.toLowerCase()))
)

// ─── View switcher ─────────────────────────────────────────
type View = 'components' | 'typography' | 'dotgrid'
const currentView = ref<View>('components')

// ─── Typography specimens ──────────────────────────────────
const HERO_TEXT   = 'Mejora la experiencia de tus Clientes'
const BODY_TEXT   = 'Investiga, mide y optimiza para aportar valor en cada paso del camino. Implementamos un sistema de evaluación a tu medida, para escuchar su voz mediante encuestas.'
const ALPHA_TEXT  = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'

const fonts = [
  {
    name: 'Playfair Display',
    family: '"Playfair Display", serif',
    tag: 'serif · editorial',
    weights: [400, 700, 900],
    note: 'Elegante, clásica, ideal para hero.',
    google: 'https://fonts.google.com/specimen/Playfair+Display',
  },
  {
    name: 'Cormorant Garamond',
    family: '"Cormorant Garamond", serif',
    tag: 'serif · alto contraste',
    weights: [300, 400, 700],
    note: 'Ultra-elegante, alto contraste, tipografía de lujo.',
    google: 'https://fonts.google.com/specimen/Cormorant+Garamond',
  },
  {
    name: 'Fraunces',
    family: '"Fraunces", serif',
    tag: 'serif variable · óptico',
    weights: [300, 700, 900],
    note: 'Variable con eje óptico, muy editorial y distinta.',
    google: 'https://fonts.google.com/specimen/Fraunces',
  },
  {
    name: 'DM Serif Display',
    family: '"DM Serif Display", serif',
    tag: 'serif · moderna',
    weights: [400],
    note: 'Serif limpia y moderna, excelente en tamaños grandes.',
    google: 'https://fonts.google.com/specimen/DM+Serif+Display',
  },
  {
    name: 'Plus Jakarta Sans',
    family: '"Plus Jakarta Sans", sans-serif',
    tag: 'sans · geométrica',
    weights: [300, 600, 800],
    note: 'Sans moderna y elegante, buena para body o hero ligero.',
    google: 'https://fonts.google.com/specimen/Plus+Jakarta+Sans',
  },
  {
    name: 'Outfit',
    family: '"Outfit", sans-serif',
    tag: 'sans · display',
    weights: [300, 700, 800],
    note: 'Limpia, tech-friendly, con personalidad propia.',
    google: 'https://fonts.google.com/specimen/Outfit',
  },
]

const activeFont = ref(fonts[0].name)
function selectFont(name: string) { activeFont.value = name }
const activeFontObj = () => fonts.find(f => f.name === activeFont.value) ?? fonts[0]
</script>

<template>
  <div class="layout">

    <!-- Sidebar -->
    <aside class="sidebar">
      <header class="sidebar-header">
        <span class="sidebar-logo">DS</span>
        <div>
          <p class="sidebar-title">Design Playground</p>
          <p class="sidebar-subtitle">Component preview</p>
        </div>
      </header>

      <!-- Sección Componentes -->
      <nav class="nav">
        <p class="nav-label">Components</p>
        <button
          v-for="name in componentNames"
          :key="name"
          class="nav-btn"
          :class="{ active: currentView === 'components' && selected === name }"
          @click="currentView = 'components'; selected = name"
        >
          {{ name }}
          <span class="nav-badge">{{ variantsOf(name).length }}</span>
        </button>
        <div v-if="!componentNames.length" class="empty-sidebar">
          <p>No variants yet.</p>
          <code>/generar-componente</code>
        </div>
      </nav>

      <!-- Sección Typography -->
      <nav class="nav" style="border-top: 1px solid rgba(255,255,255,0.07); padding-top: 0.75rem;">
        <p class="nav-label">Typography</p>
        <button
          class="nav-btn"
          :class="{ active: currentView === 'typography' }"
          @click="currentView = 'typography'"
        >
          Fonts
          <span class="nav-badge">{{ fonts.length }}</span>
        </button>
      </nav>

      <!-- Sección Labs -->
      <nav class="nav" style="border-top: 1px solid rgba(255,255,255,0.07); padding-top: 0.75rem;">
        <p class="nav-label">Labs</p>
        <button
          class="nav-btn"
          :class="{ active: currentView === 'dotgrid' }"
          @click="currentView = 'dotgrid'"
        >
          Dot Grid
          <span class="nav-badge">lab</span>
        </button>
      </nav>

      <footer class="sidebar-footer">
        <span>Hot-reload active</span>
        <span class="dot" />
      </footer>
    </aside>

    <!-- Main -->
    <main class="main">

      <!-- ── Vista Componentes ── -->
      <div v-if="currentView === 'components'">
        <div v-if="selected" class="component-view">
          <div class="view-header">
            <h1 class="view-title">{{ selected }}</h1>
            <div class="tabs" role="tablist">
              <button
                v-for="variant in variantsOf(selected)"
                :key="variant"
                class="tab"
                :class="{ active: activeVariant === variant }"
                role="tab"
                :aria-selected="activeVariant === variant"
                @click="activeVariant = variant"
              >
                {{ variant }}
              </button>
            </div>
          </div>

          <!-- ── Navbar preview: componente arriba, página simulada debajo ── -->
          <div v-if="isNavbarComponent" class="preview-shell preview-shell--page">
            <Suspense v-if="activeVariant && componentMap[selected]?.[activeVariant]">
              <component :is="componentMap[selected][activeVariant]" />
              <template #fallback>
                <div class="loading">Loading…</div>
              </template>
            </Suspense>

            <!-- Página simulada debajo del nav para dar contexto de scroll -->
            <div class="page-mock page-mock--navbar-hero" aria-hidden="true">
              <div class="mock-hero">
                <p class="mock-eyebrow">Encuestas · Experiencia · CX</p>
                <h2 class="mock-h1">Mejora la experiencia<br>de tus Clientes</h2>
                <p class="mock-lead">Investiga, mide y optimiza para aportar valor en cada paso del camino. Implementamos un sistema de evaluación a tu medida.</p>
                <div class="mock-btns">
                  <span class="mock-btn-primary">Solicitar demo</span>
                  <span class="mock-btn-secondary">Saber más →</span>
                </div>
              </div>
            </div>
            <div class="page-mock page-mock--below" aria-hidden="true">
              <div class="mock-cards-row">
                <div class="mock-card" v-for="i in 3" :key="i">
                  <div class="mock-card-icon">{{ ['◆', '▲', '●'][i-1] }}</div>
                  <div class="mock-card-name">{{ ['Feedback Multicanal', 'Aprendizaje Automático', 'Del Dato a la Acción'][i-1] }}</div>
                  <div class="mock-card-desc">Te ayudamos a recopilar información de calidad e integrarla con los sistemas de tu empresa.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Preview normal: secciones (Footer, Hero, CTABanner…) ── -->
          <div v-else class="preview-shell">
            <div class="page-mock page-mock--above" aria-hidden="true">
              <div class="mock-hero">
                <p class="mock-eyebrow">Encuestas · Experiencia · CX</p>
                <h2 class="mock-h1">Mejora la experiencia<br>de tus Clientes</h2>
                <p class="mock-lead">Investiga, mide y optimiza para aportar valor en cada paso del camino. Implementamos un sistema de evaluación a tu medida.</p>
                <div class="mock-btns">
                  <span class="mock-btn-primary">Solicitar demo</span>
                  <span class="mock-btn-secondary">Saber más →</span>
                </div>
              </div>
            </div>

            <Suspense v-if="activeVariant && componentMap[selected]?.[activeVariant]">
              <component :is="componentMap[selected][activeVariant]" />
              <template #fallback>
                <div class="loading">Loading…</div>
              </template>
            </Suspense>

            <div class="page-mock page-mock--below" aria-hidden="true">
              <div class="mock-cards-row">
                <div class="mock-card" v-for="i in 3" :key="i">
                  <div class="mock-card-icon">{{ ['◆', '▲', '●'][i-1] }}</div>
                  <div class="mock-card-name">{{ ['Feedback Multicanal', 'Aprendizaje Automático', 'Del Dato a la Acción'][i-1] }}</div>
                  <div class="mock-card-desc">Te ayudamos a recopilar información de calidad e integrarla con los sistemas de tu empresa.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-main"><p>Select a component</p></div>
      </div>

      <!-- ── Vista Dot Grid ── -->
      <div v-if="currentView === 'dotgrid'" class="dotgrid-view">
        <DotGridLab />
      </div>

      <!-- ── Vista Typography ── -->
      <div v-if="currentView === 'typography'" class="typo-view">

        <div class="view-header">
          <h1 class="view-title">Typography</h1>
          <div class="tabs" role="tablist">
            <button
              v-for="f in fonts"
              :key="f.name"
              class="tab"
              :class="{ active: activeFont === f.name }"
              @click="selectFont(f.name)"
            >
              {{ f.name }}
            </button>
          </div>
        </div>

        <div class="typo-content" :style="{ '--preview-font': activeFontObj().family }">

          <!-- Hero specimen — simula el hero real -->
          <section class="typo-hero-specimen">
            <div class="typo-hero-inner">
              <p class="typo-eyebrow">Encuestas · Experiencia · CX</p>
              <h1 class="typo-hero-h1">{{ HERO_TEXT }}</h1>
              <p class="typo-hero-lead">{{ BODY_TEXT }}</p>
              <div class="typo-hero-btns">
                <span class="typo-btn-primary">Solicitar demo</span>
                <span class="typo-btn-secondary">Ver plataforma →</span>
              </div>
            </div>
          </section>

          <!-- Ficha de la fuente -->
          <div class="typo-meta-row">
            <div class="typo-meta-card">
              <div class="typo-meta-name">{{ activeFontObj().name }}</div>
              <div class="typo-meta-tag">{{ activeFontObj().tag }}</div>
              <div class="typo-meta-note">{{ activeFontObj().note }}</div>
              <a :href="activeFontObj().google" target="_blank" rel="noopener" class="typo-meta-link">
                Ver en Google Fonts ↗
              </a>
            </div>

            <!-- Scale -->
            <div class="typo-scale-card">
              <p class="typo-scale-label">Escala tipográfica</p>
              <div class="typo-scale-row" v-for="[size, px] in [['7xl','4.5rem'],['5xl','3rem'],['4xl','2.25rem'],['3xl','1.875rem'],['2xl','1.5rem'],['xl','1.25rem'],['base','1rem']]" :key="size">
                <span class="typo-scale-size">{{ size }}</span>
                <span class="typo-scale-px">{{ px }}</span>
                <span class="typo-scale-sample" :style="{ fontSize: px }">Mejora</span>
              </div>
            </div>
          </div>

          <!-- Pesos disponibles -->
          <div class="typo-weights-section">
            <p class="typo-section-label">Weights</p>
            <div class="typo-weights-grid">
              <div v-for="w in activeFontObj().weights" :key="w" class="typo-weight-card">
                <span class="typo-weight-num">{{ w }}</span>
                <span class="typo-weight-sample" :style="{ fontWeight: w }">Mejora la experiencia</span>
              </div>
            </div>
          </div>

          <!-- Alfabeto -->
          <div class="typo-alpha-section">
            <p class="typo-section-label">Glyphs</p>
            <p class="typo-alpha">{{ ALPHA_TEXT }}</p>
            <p class="typo-alpha typo-alpha-italic">{{ ALPHA_TEXT }}</p>
          </div>

          <!-- Párrafo largo -->
          <div class="typo-prose-section">
            <p class="typo-section-label">Párrafo corrido</p>
            <p class="typo-prose">
              En Webtools diseñamos e implementamos sistemas de evaluación a medida para que puedas escuchar
              la voz de tus clientes, empleados y mercados. Combinamos tecnología, metodología y experiencia
              para transformar los datos en decisiones. Cada encuesta, cada métrica, cada insight: una
              oportunidad de mejorar lo que más importa.
            </p>
          </div>

        </div>
      </div>

    </main>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-body, system-ui, sans-serif);
  background: #eef0f3;
  color: var(--color-text, #0a0a0a);
  -webkit-font-smoothing: antialiased;
}

.layout { display: flex; min-height: 100vh; }

/* ── Sidebar ── */
.sidebar {
  width: 220px; flex-shrink: 0;
  background: #0f1117; color: #c9cdd4;
  display: flex; flex-direction: column;
  position: sticky; top: 0; height: 100vh; overflow-y: auto;
}
.sidebar-header {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.sidebar-logo {
  width: 30px; height: 30px;
  background: var(--color-primary, #0080ff);
  border-radius: 7px; display: flex; align-items: center;
  justify-content: center; font-weight: 700; font-size: 0.7rem;
  color: #fff; flex-shrink: 0;
}
.sidebar-title  { font-size: 0.78rem; font-weight: 600; color: #fff; line-height: 1.2; }
.sidebar-subtitle { font-size: 0.68rem; color: #555; line-height: 1.2; }
.nav { padding: 0.75rem 0; flex: 1; }
.nav-label {
  font-size: 0.62rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.08em; color: #3d3f45; padding: 0 1rem 0.4rem;
}
.nav-btn {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: 0.48rem 1rem;
  background: none; border: none; color: #8a8f98;
  text-align: left; font-size: 0.8rem; cursor: pointer;
  transition: background 0.1s, color 0.1s;
}
.nav-btn:hover { background: rgba(255,255,255,0.04); color: #ccc; }
.nav-btn.active {
  background: rgba(0,128,255,0.13); color: var(--color-primary, #0080ff);
  font-weight: 600; border-right: 2px solid var(--color-primary, #0080ff);
}
.nav-badge {
  font-size: 0.6rem; background: rgba(255,255,255,0.07); color: #555;
  padding: 0.1rem 0.35rem; border-radius: 99px;
}
.nav-btn.active .nav-badge { background: rgba(0,128,255,0.18); color: var(--color-primary, #0080ff); }
.empty-sidebar { padding: 1.5rem 1rem; font-size: 0.78rem; color: #444; line-height: 1.8; }
.empty-sidebar code {
  display: block; background: rgba(255,255,255,0.05);
  padding: 0.3rem 0.5rem; border-radius: 4px;
  font-size: 0.72rem; color: #aaa; margin-top: 0.5rem;
}
.sidebar-footer {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.85rem 1rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  font-size: 0.65rem; color: #3d3f45;
}
.dot {
  width: 6px; height: 6px;
  background: var(--color-success, #10b981);
  border-radius: 50%; animation: pulse 2s infinite; margin-left: auto;
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }

/* ── Main shared ── */
.main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.component-view { flex: 1; display: flex; flex-direction: column; }
.view-header {
  position: sticky; top: 0; z-index: 10;
  background: #eef0f3;
  display: flex; align-items: center; gap: 1.5rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
  flex-wrap: wrap;
}
.view-title { font-size: 1rem; font-weight: 700; white-space: nowrap; }
.tabs { display: flex; gap: 0.25rem; flex-wrap: wrap; }
.tab {
  padding: 0.3rem 0.85rem;
  background: #fff; border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 9999px; font-size: 0.75rem; font-weight: 500;
  color: var(--color-text-muted, #6b7280); cursor: pointer; transition: all 0.12s;
}
.tab:hover { border-color: var(--color-primary, #0080ff); color: var(--color-primary, #0080ff); }
.tab.active {
  background: var(--color-primary, #0080ff);
  border-color: var(--color-primary, #0080ff);
  color: #fff; font-weight: 600;
}
.preview-shell { flex: 1; background: var(--color-background, #fff); }

/* Modo navbar: el componente va arriba del todo, sin mock hero encima */
.preview-shell--page {
  flex: 1;
  background: var(--color-background, #fff);
  /* Sin overflow aquí — dejamos que el documento scrollee normalmente
     para que position:sticky del navbar funcione respecto al viewport */
}

.page-mock--navbar-hero {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  min-height: 500px;
  display: flex;
  align-items: center;
  padding: 4rem 2.5rem;
}

/* ── Components page mock ── */
.page-mock {
  padding: 3rem 2.5rem;
  display: flex; flex-direction: column; gap: 2.5rem;
}
.page-mock--above {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}
.page-mock--below {
  background: var(--color-surface, #f7f9fc);
  border-top: 1px solid #e5e7eb;
}
.mock-hero { display: flex; flex-direction: column; gap: 0.75rem; max-width: 520px; }
.mock-eyebrow { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-primary, #0080ff); }
.mock-h1 { font-size: 2rem; font-weight: 700; line-height: 1.2; color: var(--color-text, #0a0a0a); }
.mock-lead { font-size: 1rem; color: var(--color-text-muted, #6b7280); line-height: 1.6; }
.mock-btns { display: flex; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap; }
.mock-btn-primary {
  display: inline-flex; padding: 0.6rem 1.25rem;
  background: var(--color-primary, #0080ff); color: #fff;
  border-radius: 9999px; font-size: 0.875rem; font-weight: 600;
}
.mock-btn-secondary {
  display: inline-flex; padding: 0.6rem 1.25rem;
  color: var(--color-primary, #0080ff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 9999px; font-size: 0.875rem; font-weight: 500;
}
.mock-cards-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.mock-card {
  background: #fff; border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 0.75rem; padding: 1.25rem;
  display: flex; flex-direction: column; gap: 0.5rem;
}
.mock-card-icon { font-size: 1.25rem; color: var(--color-primary, #0080ff); }
.mock-card-name { font-size: 0.875rem; font-weight: 600; color: var(--color-text, #0a0a0a); }
.mock-card-desc { font-size: 0.8rem; color: var(--color-text-muted, #6b7280); line-height: 1.5; }
.loading { color: var(--color-text-muted, #6b7280); font-size: 0.85rem; padding: 3rem; text-align: center; }
.empty-main {
  display: flex; align-items: center; justify-content: center;
  height: 60vh; color: var(--color-text-muted, #6b7280); font-size: 0.9rem;
}

/* ── Dot Grid view ── */
.dotgrid-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
.dotgrid-view > * {
  flex: 1;
  min-height: 0;
}

/* ── Typography view ── */
.typo-view { flex: 1; display: flex; flex-direction: column; }
.typo-content {
  flex: 1; overflow-y: auto;
  display: flex; flex-direction: column; gap: 0;
  font-family: var(--preview-font, serif);
}

/* Hero specimen */
.typo-hero-specimen {
  background: var(--color-brand-dark, #000F41);
  padding: 5rem 3rem;
}
.typo-hero-inner { max-width: 780px; display: flex; flex-direction: column; gap: 1.25rem; }
.typo-eyebrow {
  font-family: system-ui, sans-serif;
  font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--color-accent, #3AABFF);
}
.typo-hero-h1 {
  font-family: var(--preview-font, serif);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 700; line-height: 1.05;
  color: #fff; letter-spacing: -0.02em;
}
.typo-hero-lead {
  font-family: system-ui, sans-serif;
  font-size: 1.125rem; color: rgba(255,255,255,0.7); line-height: 1.6; max-width: 560px;
}
.typo-hero-btns { display: flex; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap; }
.typo-btn-primary {
  font-family: system-ui, sans-serif;
  display: inline-flex; padding: 0.75rem 1.75rem;
  background: var(--color-primary, #0092FF); color: #fff;
  border-radius: 9999px; font-size: 0.9rem; font-weight: 600;
}
.typo-btn-secondary {
  font-family: system-ui, sans-serif;
  display: inline-flex; padding: 0.75rem 1.75rem;
  color: #fff; border: 1px solid rgba(255,255,255,0.3);
  border-radius: 9999px; font-size: 0.9rem; font-weight: 500;
}

/* Meta row */
.typo-meta-row {
  display: grid; grid-template-columns: 280px 1fr; gap: 0;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}
.typo-meta-card {
  padding: 2rem 2.5rem;
  background: #fff;
  border-right: 1px solid var(--color-border, #e5e7eb);
  display: flex; flex-direction: column; gap: 0.5rem;
}
.typo-meta-name { font-family: var(--preview-font, serif); font-size: 1.5rem; font-weight: 700; color: var(--color-text, #0a0a0a); }
.typo-meta-tag {
  font-family: system-ui, sans-serif;
  font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--color-primary, #0092FF);
}
.typo-meta-note {
  font-family: system-ui, sans-serif;
  font-size: 0.8rem; color: var(--color-text-muted, #6b7280); line-height: 1.5; margin-top: 0.25rem;
}
.typo-meta-link {
  font-family: system-ui, sans-serif;
  font-size: 0.75rem; color: var(--color-primary, #0092FF);
  text-decoration: none; margin-top: auto; padding-top: 0.5rem;
}
.typo-meta-link:hover { text-decoration: underline; }

.typo-scale-card { padding: 2rem 2.5rem; background: #fff; display: flex; flex-direction: column; gap: 0.1rem; }
.typo-scale-label {
  font-family: system-ui, sans-serif;
  font-size: 0.62rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.08em; color: #3d3f45; margin-bottom: 0.75rem;
}
.typo-scale-row { display: flex; align-items: baseline; gap: 1rem; padding: 0.3rem 0; border-bottom: 1px solid #f3f4f6; }
.typo-scale-size {
  font-family: system-ui, monospace; font-size: 0.65rem; color: #9ca3af; width: 2.5rem; flex-shrink: 0;
}
.typo-scale-px {
  font-family: system-ui, monospace; font-size: 0.65rem; color: #c4c9d4; width: 3.5rem; flex-shrink: 0;
}
.typo-scale-sample { font-family: var(--preview-font, serif); color: var(--color-text, #0a0a0a); line-height: 1; }

/* Weights */
.typo-weights-section { padding: 2rem 2.5rem; background: #fafafa; border-bottom: 1px solid var(--color-border, #e5e7eb); }
.typo-section-label {
  font-family: system-ui, sans-serif;
  font-size: 0.62rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.08em; color: #3d3f45; margin-bottom: 1rem;
}
.typo-weights-grid { display: flex; flex-direction: column; gap: 0.75rem; }
.typo-weight-card { display: flex; align-items: baseline; gap: 1.25rem; }
.typo-weight-num {
  font-family: system-ui, monospace; font-size: 0.7rem; color: #9ca3af; width: 2.5rem; flex-shrink: 0;
}
.typo-weight-sample { font-family: var(--preview-font, serif); font-size: 1.75rem; color: var(--color-text, #0a0a0a); line-height: 1; }

/* Alpha */
.typo-alpha-section { padding: 2rem 2.5rem; background: #fff; border-bottom: 1px solid var(--color-border, #e5e7eb); }
.typo-alpha { font-family: var(--preview-font, serif); font-size: 1.1rem; line-height: 2; color: var(--color-text, #0a0a0a); word-break: break-all; }
.typo-alpha-italic { font-style: italic; color: var(--color-text-muted, #6b7280); margin-top: 0.25rem; }

/* Prose */
.typo-prose-section { padding: 2rem 2.5rem; background: #fafafa; }
.typo-prose { font-family: var(--preview-font, serif); font-size: 1.05rem; line-height: 1.8; color: var(--color-text, #0a0a0a); max-width: 680px; }
</style>
