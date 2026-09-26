import fs from 'fs';
import path from 'path';
import { getCategoryLabel, getContextMeaningLabel, getSectionLabel, type SectionKey } from './glossary-labels';

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

function getSectionHeader(section: SectionKey, language: string): string {
  return `## ${getSectionLabel(section, language)}`;
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