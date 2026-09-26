import fs from 'fs';
import path from 'path';

const glossaryDirectory = path.join(process.cwd(), 'glossary');

export interface Term {
  slug: string;
  title: string;
  category: string;
  plainEnglish: string;
  analogy: string;
  inContext: string;
  contextMeaning: string;
  whyItMatters?: string;
  relatedTerms: string[];
  language: string;
  content: string;
}

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

function getSectionHeader(section: SectionKey, language: string): string {
  const labels = MARKDOWN_LABELS.sections[section] as Record<string, string>;
  return `## ${labels[language] ?? labels.en}`;
}

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

/**
 * Parses a markdown document into named sections.
 *
 * Example:
 *
 * ## Plain English
 * text...
 *
 * ## Analogy
 * more text...
 *
 * becomes:
 *
 * {
 *   "Plain English": "text...",
 *   "Analogy": "more text..."
 * }
 */
function parseSections(markdown: string): Record<string, string> {
  const sections: Record<string, string> = {};

  const lines = markdown.split('\n');

  let currentSection = '';
  let buffer: string[] = [];

  for (const line of lines) {
    if (line.trim().startsWith('## ')) {
      if (currentSection) {
        sections[currentSection] = buffer.join('\n').trim();
      }

      currentSection = line.trim();
      buffer = [];
      continue;
    }

    if (currentSection) {
      buffer.push(line);
    }
  }

  if (currentSection) {
    sections[currentSection] = buffer.join('\n').trim();
  }

  return sections;
}

/**
 * Returns the contents of a named section.
 */
function extractSection(
  sections: Record<string, string>,
  section: SectionKey,
  language: string
): string {
  const header = getSectionHeader(section, language);

  return sections[header]?.trim() ?? '';
}

/**
 * Extracts:
 *
 * **What this means:** ...
 *
 * from a block of markdown.
 */
function extractContextMeaning(
  inContext: string,
  language: string
): {
  quote: string;
  meaning: string;
} {
  if (!inContext) {
    return {
      quote: '',
      meaning: '',
    };
  }

  const label = `**${getContextMeaningLabel(language)}:**`;

  const lines = inContext.split('\n');

  const labelIndex = lines.findIndex(line =>
    line.trim().startsWith(label)
  );

  if (labelIndex === -1) {
    return {
      quote: inContext.trim(),
      meaning: '',
    };
  }

  const quote = lines
    .slice(0, labelIndex)
    .join('\n')
    .trim()
    .replace(/^["*]+|["*]+$/g, '')
    .trim();

  const meaning = lines
    .slice(labelIndex)
    .join('\n')
    .replace(label, '')
    .trim();

  return {
    quote,
    meaning,
  };
}

/**
 * Converts:
 *
 * - API
 * - HTTP
 * - REST
 *
 * into:
 *
 * ["API", "HTTP", "REST"]
 */
function extractList(section: string): string[] {
  if (!section) {
    return [];
  }

  return section
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- '))
    .map(line => line.replace(/^- /, '').trim());
}

/**
 * Reads the category from markdown.
 */
function extractCategory(
  markdown: string,
  language: string
): string {
  const prefix = `**${getCategoryLabel(language)}:**`;

  const line = markdown
    .split('\n')
    .find(line => line.trim().startsWith(prefix));

  if (!line) {
    return 'General';
  }

  return line.replace(prefix, '').trim();
}

/**
 * Reads the Title from markdown.
 */
function extractTitle(markdown: string): string {

    const firstLine =
        markdown
            .split('\n')
            .find(line => line.trim().length > 0);

    return firstLine
        ?.replace(/^#\s*/, '')
        .trim() ?? '';

}

export function getAllTerms(
  language: string = 'en'
): Term[] {

  const langPath = path.join(
    glossaryDirectory,
    language
  );

  if (!fs.existsSync(langPath)) {
    return [];
  }

  const fileNames = fs
    .readdirSync(langPath)
    .filter(file => file.endsWith('.md') && !file.startsWith('_'));

  const terms: Term[] = fileNames.map(fileName => {

    const slug = fileName.replace(/\.md$/, '');

    const fullPath = path.join(
      langPath,
      fileName
    );

    const markdown = fs.readFileSync(
      fullPath,
      'utf8'
    ).replace(/\r\n/g, '\n');

    const sections = parseSections(markdown);

    const title = extractTitle(markdown) || slug;

    return {

      slug,

      title,

      category: extractCategory(
        markdown,
        language
      ),

      plainEnglish: extractSection(
        sections,
        'plainEnglish',
        language
      ),

      analogy: '',

      inContext: '',

      contextMeaning: '',

      whyItMatters: undefined,

      relatedTerms: [],

      language,

      content: markdown,

    };

  });

  return terms.sort((a, b) =>
    a.title.localeCompare(b.title)
  );
}

export function getTermBySlug(
  slug: string,
  language: string = 'en'
): Term | null {

  const langPath = path.join(
    glossaryDirectory,
    language
  );

  const fullPath = path.join(
    langPath,
    `${slug}.md`
  );

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const markdown = fs.readFileSync(
    fullPath,
    'utf8'
  ).replace(/\r\n/g, '\n');

  const sections = parseSections(markdown);

  const title = extractTitle(markdown) || slug;

  const context = extractContextMeaning(
    extractSection(
      sections,
      'inContext',
      language
    ),
    language
  );

  return {

    slug,

    title,

    category: extractCategory(
      markdown,
      language
    ),

    plainEnglish: extractSection(
      sections,
      'plainEnglish',
      language
    ),

    analogy: extractSection(
      sections,
      'analogy',
      language
    ),

    inContext: context.quote,

    contextMeaning: context.meaning,

    whyItMatters:
      extractSection(
        sections,
        'whyItMatters',
        language
      ) || undefined,

    relatedTerms: extractList(
      extractSection(
        sections,
        'relatedTerms',
        language
      )
    ),

    language,

    content: markdown,

  };

}