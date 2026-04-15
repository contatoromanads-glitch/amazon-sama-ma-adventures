

# Plano de Otimização Máxima para Mobile

## Diagnóstico Atual

| Asset | Tamanho |
|-------|---------|
| Vídeo hero (hero-drone.mp4) | **14 MB** — maior gargalo |
| Imagens full-size | 11 MB (70 arquivos WebP) |
| Thumbnails | 1.9 MB |
| Dependências JS não utilizadas | ~20 pacotes Radix/UI nunca importados nas páginas |
| App.css (Vite template) | Arquivo morto, não usado |
| Google Fonts | Carregamento bloqueante via @import no CSS |

## Ações (ordenadas por impacto)

### 1. Comprimir o vídeo hero (~14 MB → ~2 MB)
- Recodificar com ffmpeg: 720p, CRF 28, faststart, sem áudio
- Gerar poster frame estático (primeiro frame como WebP) para exibição instantânea
- Adicionar `poster` e `preload="none"` na tag `<video>` para que mobile não baixe o vídeo até necessário

### 2. Eliminar font @import bloqueante
- Mover o carregamento de Google Fonts do `@import` no CSS para `<link>` com `display=swap` no `index.html`
- Isso desbloqueia a primeira pintura (FCP) em ~300-500ms

### 3. Lazy-load framer-motion no Index
- O `Index.tsx` importa framer-motion sincronamente (é a landing page, não lazy-loaded)
- Substituir `SectionFadeIn` por CSS `@keyframes` + `IntersectionObserver` nativo — elimina framer-motion do bundle inicial
- Alternativa mais simples: manter framer-motion mas garantir que animações usem `will-change` e `transform` apenas

### 4. Remover dependências não utilizadas do bundle
- ~20 pacotes Radix UI instalados mas nunca usados nas páginas reais (menubar, hover-card, radio-group, slider, etc.)
- Remover do `package.json` para reduzir install e evitar tree-shaking falho
- Remover `App.css` (template Vite não utilizado)
- Remover `recharts`, `react-day-picker`, `date-fns`, `next-themes`, `react-resizable-panels`, `cmdk`, `input-otp`, `react-hook-form`, `@hookform/resolvers`, `zod` se não estiverem em uso

### 5. Imagens: `sizes` e `decoding="async"`
- Adicionar `sizes="(max-width: 768px) 100vw, 50vw"` nas imagens de card
- Adicionar `decoding="async"` em todas as imagens não-hero
- Usar thumbnails nos cards do Index.tsx (experiences section) — atualmente carregam full-size

### 6. Preload crítico no index.html
- Adicionar `<link rel="preload">` para a fonte heading (Cormorant Garamond woff2)
- Adicionar `<meta http-equiv="x-dns-prefetch-control" content="on">` 

### 7. CSS: contain e content-visibility
- Adicionar `content-visibility: auto` nas sections abaixo do fold para que o browser pule rendering até scroll
- Adicionar `contain: layout style paint` nos cards

## Resultado Esperado
- **Vídeo:** 14 MB → ~2 MB (85% menor)
- **Bundle JS inicial:** Eliminação de ~15-20 dependências mortas
- **FCP mobile:** -500ms (font desbloqueada + poster no vídeo)
- **Total page weight inicial:** ~29 MB → ~5-6 MB

## Detalhes Técnicos
- Todas as mudanças são não-destrutivas (sem reescrita de componentes)
- O vídeo será recodificado via ffmpeg no sandbox
- Dependências removidas são verificadas com grep antes da remoção

