import { getCategoryLabel, getContextMeaningLabel, getSectionLabel } from './glossary';

export const CATEGORIES = [
  'Community',
  'Economy',
  'Mining',
  'Network',
  'Privacy',
  'Security',
  'Technology',
  'Transactions',
] as const;

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Swahili' },
  { code: 'pcm', name: 'Pidgin' },
  { code: 'ki', name: 'Kikuyu' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'lwg', name: 'Wanga'},
  { code: 'ig', name: 'Igbo' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

export interface TermSubmission {
  mode: 'new' | 'translate';
  language: string;
  /** English term name — also used as the H1 for every language, matching existing convention. */
  term: string;
  category: string;
  plainEnglish: string;
  analogy: string;
  inContextQuote: string;
  inContextMeaning: string;
  whyItMatters: string;
  relatedTerms: string[];
  contributorName?: string;
}

export function slugify(term: string): string {
  return term
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function renderTermMarkdown(submission: TermSubmission): string {
  const relatedTermsBlock = submission.relatedTerms
    .map((t) => `- ${t}`)
    .join('\n');

  const { language } = submission;

  return `# ${submission.term}

**${getCategoryLabel(language)}:** ${submission.category}

## ${getSectionLabel('plainEnglish', language)}

${submission.plainEnglish}

## ${getSectionLabel('analogy', language)}

${submission.analogy}

## ${getSectionLabel('inContext', language)}

*"${submission.inContextQuote}"*

**${getContextMeaningLabel(language)}:** ${submission.inContextMeaning}

## ${getSectionLabel('whyItMatters', language)}

${submission.whyItMatters}

## ${getSectionLabel('relatedTerms', language)}

${relatedTermsBlock}

---
`;
}
