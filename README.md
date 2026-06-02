# xray

Página showcase do **Icons.ai · Xray** — animação canônica (estilo Canopy intro) com 5 cenas que apresentam a IA descritiva sobre dados públicos brasileiros.

## Visão geral

- **Stack:** Next.js 15 (App Router) + React 19 + TypeScript strict
- **Runtime:** `output: 'standalone'`
- **basePath:** `/xray` — final em `icon.iconsai.ai/xray`
- **Sem backend:** animação 100% CSS + JS de transição de cena
- **Sem dependências externas:** fontes via Google Fonts CDN

## Estrutura

```
xray/
├── app/
│   ├── layout.tsx        # Root layout com fontes Fraunces/Jakarta/JetBrains Mono
│   ├── page.tsx          # Renderiza CanopyIntro com SCENES do produto
│   └── globals.css       # Reset + body bg
├── components/canopy-intro/
│   ├── CanopyIntro.tsx   # Componente reutilizável (5 cenas em sequência)
│   ├── canopy-intro.css  # Animações CSS (keyframes)
│   └── scenes.ts         # Cenas específicas do Xray
├── next.config.js        # basePath /xray + standalone
├── tsconfig.json
└── package.json
```

## Desenvolvimento

```bash
npm install
npm run dev
# Abrir http://localhost:3101/xray
```

## Deploy

Mesmo pipeline dos outros apps IconsAI:

1. `npm run build` (gera `.next/standalone`)
2. `rsync` para `/opt/xray/app/` no DigitalOcean
3. systemd unit `xray.service` apontando para `node server.js -p 3101`
4. Caddy entrega `icon.iconsai.ai/xray/*` → `127.0.0.1:3101/xray/*`

## Cenas (5 totais)

1. **Hero + prompt typing** — "Pergunte sobre o Brasil real"
2. **Prompt completo + hover Send** — "Receba a resposta auditável"
3. **Dialog overlay + browser** — "TABELAS · IBGE · RFB · ANEEL · CNJ"
4. **Wireframe gallery + sticky notes** — dossiê visual
5. **Deck slide + Share & Export** — exportação para apresentação

Editar `components/canopy-intro/scenes.ts` para mudar o roteiro.

## Origem

Componente `CanopyIntro` é compartilhado com:
- discovery
- discoveryhealth
- tutor
- nanduti
- fiscal

Manter sincronizado quando editar.
