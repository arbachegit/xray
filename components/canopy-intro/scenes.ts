import type { CanopyScene } from './CanopyIntro'

export const PRODUCT_NAME = 'Icons.ai · Xray'
export const PRODUCT_TAGLINE = 'IA descritiva sobre dados públicos brasileiros.'
export const PRODUCT_ACCENT = '#22d3ee'
export const CONTINUE_HREF = 'https://icon.iconsai.ai/icon'

const HOLD = 14000

export const SCENES: CanopyScene[] = [
  {
    bg: '#bcd0c0',
    hero: 'Pergunte sobre o Brasil real',
    mockup: 'prompt',
    promptText: 'Qual o faturamento médio das ME do CNAE 47.11?',
    hold: HOLD,
  },
  {
    bg: '#f3ecdc',
    hero: 'Receba a resposta auditável',
    mockup: 'prompt',
    promptText: 'Compare arrecadação ISS de 2024 com 2023',
    hold: HOLD,
  },
  {
    bg: '#0f1116',
    caption: 'TABELAS · IBGE · RFB · ANEEL · CNJ',
    mockup: 'dialog',
    browserUrl: 'xray.iconsai.ai/q/cnae-47.11',
    promptText: 'Mostre o histórico de 5 anos em SP',
    hold: HOLD,
  },
  {
    bg: '#cdd9d4',
    mockup: 'gallery',
    browserUrl: 'xray.iconsai.ai/dossie/fortaleza',
    hold: HOLD,
  },
  {
    bg: '#d8d7e8',
    mockup: 'deck-export',
    browserUrl: 'xray.iconsai.ai/dossie/export',
    hold: HOLD,
  },
]
