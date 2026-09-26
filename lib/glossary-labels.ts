// Kept separate from ./glossary, which reads files with fs, so client
// components like the /contribute form can import these labels.

/**
 * All language-specific labels live here.
 * Adding a new language should only require updating this object.
 */
const MARKDOWN_LABELS = {
  category: {
    en: 'Category',
    sw: 'Kategoria',
    yo: 'Ẹ̀ka',
    lwg: 'Olukongo',
    pcm: 'Kain',
  },

  contextMeaning: {
    en: 'What this means',
    sw: 'Maana yake',
    yo: 'Ìtumọ̀ èyí',
    lwg: 'Amakulu kwakwo',
    pcm: 'Wetin dis mean',
  },

  sections: {
    plainEnglish: {
      en: 'Plain English',
      sw: 'Maelezo Rahisi',
      yo: 'Ìtumọ̀ Rọrùn',
      // 'Na njira huthu' is Kikuyu, not Wanga — it was mistakenly duplicated
      // into this slot. Wanga still needs a real translation here; falls
      // back to English until one is confirmed.
      lwg: 'Plain English',
      pcm: 'Simple Tori',
      ki: 'Na njira huthu',
    },

    analogy: {
      en: 'Analogy',
      sw: 'Mfano wa Kila Siku',
      yo: 'Àkàwé',
      lwg: 'Olulinganisho',
      pcm: 'E Be Like',
    },

    inContext: {
      en: 'In Context',
      sw: 'Jinsi Inavyotumiwa',
      yo: 'Ní Àpẹẹrẹ',
      lwg: 'Mu Mbeele',
      pcm: 'How E Dey Used',
    },

    whyItMatters: {
      en: 'Why It Matters',
      sw: 'Kwa Nini Ni Muhimu',
      yo: 'Ìdí Tí Ó Fi Ṣe Pàtàkì',
      lwg: 'Habwaki ni yákamaro',
      pcm: 'Why E Matter',
    },

    relatedTerms: {
      en: 'Related Terms',
      sw: 'Maneno Yanayohusiana',
      yo: 'Àwọn Ọ̀rọ̀ Tí Ó Jọra',
      lwg: 'Amakhuwa akalondana',
      pcm: 'Wordings Wey Relate',
    },
  },
} as const;

export type SectionKey = keyof typeof MARKDOWN_LABELS.sections;

/**
 * Same lookup, without the "## " prefix — for callers building their own
 * markdown (e.g. the /contribute form) rather than parsing existing files.
 */
export function getSectionLabel(section: SectionKey, language: string): string {
  const labels = MARKDOWN_LABELS.sections[section] as Record<string, string>;
  return labels[language] ?? labels.en;
}

export function getCategoryLabel(language: string): string {
  const labels = MARKDOWN_LABELS.category as Record<string, string>;
  return labels[language] ?? labels.en;
}

export function getContextMeaningLabel(language: string): string {
  const labels = MARKDOWN_LABELS.contextMeaning as Record<string, string>;
  return labels[language] ?? labels.en;
}
