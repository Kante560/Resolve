---
trigger: model_decision
description: when given task concerns UI/UX
---

# UI_UX_DESIGN_SKILL.md
# Agent UI/UX Design Guide — Anti Gravity IDE

> Read this file before writing any component, page, or visual element.
> Resolve design decisions by referencing the sources listed here first.

---

## 1. Design Philosophy

Every screen must feel **intentional, premium, and Web3-native**. Target aesthetic: dark, spatial, high-contrast, deliberate motion. Think Linear meets a DeFi protocol — structured and trustworthy but alive.

- One signature element per page. Everything else is quiet.
- Motion serves meaning. Never animate for decoration.
- Dark mode is default. Light mode is opt-in.
- Mobile-first. Every layout starts at 375px.
- 8px base grid. All spacing is a multiple of 8.
- No hardcoded hex in components. CSS variables only.

---

## 2. Reference Sources — Check Before Building Anything

### 2.1 Component Libraries

| Source | URL | Best For |
|--------|-----|----------|
| **21st.dev** | https://21st.dev/community/components | Heroes, backgrounds, shaders, text animations, cards |
| **React Bits** | https://reactbits.dev | Animated interactive React components |
| **Aceternity UI** | https://ui.aceternity.com | 3D cards, spotlights, glowing beams, particle backgrounds |
| **Magic UI** | https://magicui.design | Micro-interactions, animated beams, neon gradients |
| **Cult UI** | https://www.cult-ui.com | AI patterns, futuristic inputs |
| **shadcn/ui** | https://ui.shadcn.com | Base primitives: dialogs, tables, forms, toasts |
| **Origin UI** | https://originui.com | Advanced inputs, complex form patterns |

**Rule:** Hero/background/animation → check 21st.dev + Aceternity first. App UI (tables, forms, modals) → check shadcn/ui + Origin UI first. Never build from scratch what already exists here.

### 2.2 Three.js / R3F References

| Source | URL | Best For |
|--------|-----|----------|
| **R3F Docs** | https://r3f.docs.pmnd.rs | Canvas setup, hooks, core API |
| **Drei** | https://github.com/pmndrs/drei | Environment, OrbitControls, Float, MeshReflectorMaterial |
| **Three.js Journey** | https://threejs-journey.com | Shaders, lighting, post-processing |
| **Three.js Resources** | https://threejsresources.com | Particles, fluid sim, distortion effects |
| **pmndrs/postprocessing** | https://github.com/pmndrs/postprocessing | Bloom, SSAO, chromatic aberration |

**Rule:** Never use raw imperative Three.js inside React. Always use `@react-three/fiber` Canvas + `@react-three/drei` helpers. If a Drei component exists for it — use it.

### 2.3 Visual Inspiration

| Site | Why |
|------|-----|
| Linear.app | Dark SaaS benchmark — spacing, type, micro-motion |
| Vercel.com | Clean dark landing with tasteful animation |
| Luma AI | WebGL background + clean UI overlay layering |
| Rainbow.me | Web3 UI done tastefully — wallet UX patterns |
| Uniswap.org | DeFi interface — token selection, transaction flows |

---

## 3. Token System

### 3.1 Color Palette (globals.css)

```css
:root {
  --bg-base:        #0A0A0F;
  --bg-surface:     #111118;
  --bg-elevated:    #1A1A24;
  --bg-glass:       rgba(255,255,255,0.04);
  --brand-primary:  #6366F1;
  --brand-accent:   #8B5CF6;
  --brand-glow:     rgba(99,102,241,0.3);
  --success:        #10B981;
  --warning:        #F59E0B;
  --error:          #EF4444;
  --text-primary:   #F4F4F5;
  --text-secondary: #A1A1AA;
  --text-muted:     #52525B;
  --border-default: rgba(255,255,255,0.08);
  --border-strong:  rgba(255,255,255,0.16);
  --border-brand:   rgba(99,102,241,0.5);
  --gradient-brand: linear-gradient(135deg,#6366F1 0%,#8B5CF6 100%);
  --gradient-glow:  radial-gradient(ellipse at 50% 0%,rgba(99,102,241,0.15),transparent 70%);
  --font-sans:      'Inter', -apple-system, sans-serif;
  --font-mono:      'JetBrains Mono', monospace;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --radius-xl: 16px; --radius-2xl: 24px; --radius-full: 9999px;
}
```

### 3.2 Type Scale

```
--text-xs: 0.75rem   labels, badges
--text-sm: 0.875rem  body small
--text-base: 1rem    body default
--text-xl: 1.25rem   section headings
--text-3xl: 1.875rem subheadings
--text-5xl: 3rem     hero headings
--text-6xl: 3.75rem  display
```

---

## 4. Component Patterns

### Glassmorphism Card
```tsx
<div className="rounded-xl border border-white/8 bg-white/4 backdrop-blur-md p-6 hover:border-white/16 transition-colors duration-200">
```

### Primary CTA Button
```tsx
<button className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-medium text-sm hover:from-indigo-400 hover:to-violet-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/25">
```

### Status Badge
```tsx
const statusColors = {
  Open:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Active:    'bg-blue-500/10    text-blue-400    border-blue-500/20',
  Disputed:  'bg-amber-500/10   text-amber-400   border-amber-500/20',
  Completed: 'bg-violet-500/10  text-violet-400  border-violet-500/20',
  Resolved:  'bg-zinc-500/10    text-zinc-400    border-zinc-500/20',
};
// <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status]}`}>
```

### Navbar Shell
```tsx
<nav className="sticky top-0 z-50 h-16 border-b border-white/8 bg-[#0A0A0F]/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 lg:px-8">
```

---

## 5. Motion Standards

Use **Framer Motion** exclusively. Always wrap app in `<LazyMotion features={domAnimation}>`.

### Shared Variants (lib/motion.ts — import, never redefine inline)
```ts
export const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25,0.46,0.45,0.94] } },
};
export const fadeIn    = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } };
export const scaleIn   = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } } };
export const stagger   = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
```

### Rules
- Page transitions: `fadeIn` 300ms
- Cards entering viewport: `fadeUp` + `stagger` on grid wrapper
- Modals: `scaleIn` on mount
- Hover: `whileHover={{ scale: 1.02 }}` on cards, `whileHover={{ y: -1 }}` on buttons
- Tap: `whileTap={{ scale: 0.97 }}` on all interactive elements
- Always check `useReducedMotion()` and skip animations if true

---

## 6. Three.js / R3F Rules

### Canvas Setup
```tsx
// Always isolate canvas behind page content
<div className="absolute inset-0 -z-10">
  <Canvas dpr={[1,1.5]} gl={{ antialias:true, alpha:true }} performance={{ min:0.5 }}>
    <Suspense fallback={null}><Environment preset="city" /><YourScene /><Preload all /></Suspense>
  </Canvas>
</div>
```

### Performance Rules
- `useMemo` for all geometries and materials — never create inside render loop
- Use `<Detailed>` from Drei for LOD on complex meshes
- Draco-compress all GLTF models over 500KB
- Dispose geometries + materials on unmount
- Use `frameloop="demand"` on static scenes
- Post-processing (Bloom, ChromaticAberration) only on hero/landing — never on dashboard pages
- Target 60fps desktop, 30fps mobile — test with `<Stats>` during dev

---

## 7. Web3 UI Patterns

### Wallet Button — always use RainbowKit `ConnectButton.Custom`, never build custom
### Address Display
```tsx
const truncate = (addr: string) => `${addr.slice(0,6)}...${addr.slice(-4)}`;
// Always link to https://basescan.org/address/{address}
```

### ETH Amount
```tsx
import { formatEther } from 'viem';
const formatETH = (wei: bigint) => `${parseFloat(formatEther(wei)).toFixed(4)} ETH`;
```

### Transaction State — all 4 states required on every on-chain action
```
IDLE    → default button
PENDING → spinner + "Confirm in wallet..."
MINING  → progress + "Transaction submitted..."
SUCCESS → green check + tx hash link to Basescan
ERROR   → red state + human-readable message (never raw revert string)
```

---

## 8. Accessibility Baseline (non-negotiable)

- Focus ring on all interactive elements: `focus-visible:ring-2 focus-visible:ring-indigo-500`
- Color contrast ≥ 4.5:1 for all text
- All images have `alt`. All icon buttons have `aria-label`.
- Inputs have associated `<label>` elements
- `prefers-reduced-motion` respected on all animations

---

## 9. Agent Checklist Before Marking Any UI Task Done

- [ ] Checked 21st.dev / Aceternity before building visual from scratch
- [ ] All colors use CSS variables — no hardcoded hex in JSX
- [ ] Mobile layout verified at 375px
- [ ] Framer Motion used with `LazyMotion` wrapper
- [ ] `useReducedMotion()` handled
- [ ] Three.js canvas isolated with `z-index: -1` (if present)
- [ ] R3F geometries/materials disposed on unmount (if present)
- [ ] All 4 transaction states implemented (if on-chain action)
- [ ] Addresses truncated and linked to Basescan
- [ ] Screenshot taken before marking done
- [ ] No `any` TypeScript types