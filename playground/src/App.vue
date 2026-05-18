<script setup lang="ts">
import { ref, watch, defineAsyncComponent } from 'vue'

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

      <nav class="nav">
        <p class="nav-label">Components</p>
        <button
          v-for="name in componentNames"
          :key="name"
          class="nav-btn"
          :class="{ active: selected === name }"
          @click="selected = name"
        >
          {{ name }}
          <span class="nav-badge">{{ variantsOf(name).length }}</span>
        </button>
      </nav>

      <div v-if="!componentNames.length" class="empty-sidebar">
        <p>No variants yet.</p>
        <code>/generar-componente</code>
      </div>

      <footer class="sidebar-footer">
        <span>Hot-reload active</span>
        <span class="dot" />
      </footer>
    </aside>

    <!-- Main -->
    <main class="main">
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

        <div class="preview-shell">
          <Suspense v-if="activeVariant && componentMap[selected]?.[activeVariant]">
            <component :is="componentMap[selected][activeVariant]" />
            <template #fallback>
              <div class="loading">Loading…</div>
            </template>
          </Suspense>

          <!-- Generic page mock to show component in context -->
          <div class="page-mock" aria-hidden="true">
            <div class="mock-hero">
              <p class="mock-eyebrow">Tagline · Value proposition</p>
              <h2 class="mock-h1">Main headline that explains<br>what the product does</h2>
              <p class="mock-lead">Supporting copy that gives more detail about the offering and the target audience. Two lines max.</p>
              <div class="mock-btns">
                <span class="mock-btn-primary">Primary CTA</span>
                <span class="mock-btn-secondary">Secondary CTA →</span>
              </div>
            </div>
            <div class="mock-cards-row">
              <div class="mock-card" v-for="i in 3" :key="i">
                <div class="mock-card-icon">{{ ['◆', '▲', '●'][i-1] }}</div>
                <div class="mock-card-name">Product {{ ['A', 'B', 'C'][i-1] }}</div>
                <div class="mock-card-desc">Short description of what this product or feature does for the user.</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div v-else class="empty-main">
        <p>Select a component</p>
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

/* Sidebar */
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

/* Main */
.main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.component-view { flex: 1; display: flex; flex-direction: column; }
.view-header {
  position: sticky; top: 0; z-index: 10;
  background: #eef0f3;
  display: flex; align-items: center; gap: 1.5rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
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

/* Generic page mock */
.page-mock {
  background: var(--color-surface, #f7f9fc);
  padding: 3rem 2.5rem;
  display: flex; flex-direction: column; gap: 2.5rem;
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
</style>
