/**
 * Bitcoin glossary generator
 *
 * Scrapes term names + raw definitions from Bitcoin.org, then uses Claude to:
 *   1. Write a polished English markdown entry
 *   2. Translate it into every supported language
 *
 * Usage:
 *   node scripts/generate-glossary.mjs
 *   node scripts/generate-glossary.mjs --limit 5          # first 5 terms only
 *   node scripts/generate-glossary.mjs --lang sw,pcm       # specific languages
 *   node scripts/generate-glossary.mjs --translate-only    # skip scrape, use existing en/ files
 *   node scripts/generate-glossary.mjs --force             # overwrite existing files
 *   node scripts/generate-glossary.mjs --term "wallet"     # single term by slug
 *
 * Requires: ANTHROPIC_API_KEY env var
 */

import Anthropic from '@anthropic-ai/sdk';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GLOSSARY_DIR = path.join(__dirname, '..', 'glossary');

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

// Headers must match what lib/glossary.ts parses.
// Only Category and the main-definition header vary per language.
const LANGUAGES = [
  {
    code: 'sw',
    name: 'Swahili',
    plainEnglishHeader: 'Maelezo Rahisi',
    analogyHeader: 'Mfano wa Kila Siku',
    contextHeader: 'Jinsi Inavyotumiwa',
    whyHeader: 'Kwa Nini Ni Muhimu',
    relatedHeader: 'Maneno Yanayohusiana',
    categoryLabel: 'Kategoria',
    contextMeaningLabel: 'Maana yake',
  },
  {
    code: 'pcm',
    name: 'Nigerian Pidgin',
    plainEnglishHeader: 'Simple Tori',
    analogyHeader: 'E Be Like',
    contextHeader: 'How E Dey Used',
    whyHeader: 'Why E Matter',
    relatedHeader: 'Wordings Wey Relate',
    categoryLabel: 'Kain',
    contextMeaningLabel: 'Wetin dis mean',
  },
  {
    code: 'ki',
    name: 'Kikuyu',
    // NOTE: 'ki' isn't in lib/glossary.ts's MARKDOWN_LABELS yet (it falls
    // back to English headers), and the two existing ki/ entries use English
    // headers. Keep this in sync with lib/glossary.ts before changing it, or
    // newly generated entries won't parse.
    plainEnglishHeader: 'Plain English',
    analogyHeader: 'Analogy',
    contextHeader: 'In Context',
    whyHeader: 'Why It Matters',
    relatedHeader: 'Related Terms',
    categoryLabel: 'Category',
    contextMeaningLabel: 'What this means',
  },
  {
    code: 'yo',
    name: 'Yoruba',
    plainEnglishHeader: 'Ìtumọ̀ Rọrùn',
    analogyHeader: 'Àkàwé',
    contextHeader: 'Ní Àpẹẹrẹ',
    whyHeader: 'Ìdí Tí Ó Fi Ṣe Pàtàkì',
    relatedHeader: 'Àwọn Ọ̀rọ̀ Tí Ó Jọra',
    categoryLabel: 'Ẹ̀ka',
    contextMeaningLabel: 'Ìtumọ̀ èyí',
  },
];

// ─── Scraping ────────────────────────────────────────────────────────────────

async function scrapeTerms() {
  console.log('Scraping Bitcoin.org vocabulary...');
  const res = await fetch('https://bitcoin.org/en/vocabulary', {
    headers: { 'User-Agent': 'BitcoinPlainTalk/1.0 (educational glossary builder)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from Bitcoin.org`);

  const html = await res.text();
  const $ = cheerio.load(html);

  const terms = [];
  $('dt').each((_, el) => {
    const title = $(el).text().trim();
    const definition = $(el).next('dd').text().trim();
    if (title && definition && title.length < 60) {
      terms.push({ title, definition });
    }
  });

  console.log(`  Found ${terms.length} terms`);
  return terms;
}

// Load titles from existing en/ files as fallback
function loadExistingEnglishTerms() {
  const enDir = path.join(GLOSSARY_DIR, 'en');
  if (!fs.existsSync(enDir)) return [];
  return fs.readdirSync(enDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .map(f => {
      const slug = f.replace('.md', '');
      const content = fs.readFileSync(path.join(enDir, f), 'utf8');
      const title = content.split('\n')[0].replace(/^#\s*/, '');
      return { title, slug, existingContent: content };
    });
}

// ─── Claude calls ────────────────────────────────────────────────────────────

async function generateEnglish(term) {
  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `You are writing entries for a Bitcoin educational glossary aimed at people in Africa who are new to Bitcoin.

Term: "${term.title}"
Source definition: "${term.definition}"

Write a complete markdown entry in this EXACT format (no extra text before or after):

# ${term.title}

**Category:** [one of: Network | Transactions | Security | Mining | Economy | Technology]

## Plain English

[One sentence explaining the term WITHOUT any Bitcoin jargon. Must make sense to someone who has never used crypto.]

## Analogy

[A comparison using something familiar in everyday African life — mobile money like M-Pesa, market stalls, community savings groups (chama/ajo/susu), etc.]

## In Context

*"[An example sentence someone in Africa might actually hear or say using this term.]"*

**What this means:** [Plain explanation of that example sentence.]

## Why It Matters

[One short paragraph on why someone new to Bitcoin in Africa should understand this term.]

## Related Terms

- [2–3 related Bitcoin terms, one per line]

---`,
    }],
  });

  return extractText(message);
}

async function translateEntry(englishMarkdown, lang, termTitle) {
  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1200,
    messages: [{
      role: 'user',
      content: `Translate the following Bitcoin glossary entry into ${lang.name}.

ENGLISH ORIGINAL:
${englishMarkdown}

Produce the translation in this EXACT format (no extra text before or after):

# ${termTitle}

**${lang.categoryLabel}:** [keep the English category value as-is: Network / Transactions / Security / Mining / Economy / Technology]

## ${lang.plainEnglishHeader}

[Translation of Plain English section into natural ${lang.name}]

## ${lang.analogyHeader}

[Translate the analogy into ${lang.name}, keeping it grounded in everyday African life]

## ${lang.contextHeader}

*"[Translate the example sentence into ${lang.name}]"*

**${lang.contextMeaningLabel}:** [Translate the explanation into ${lang.name}]

## ${lang.whyHeader}

[Translate Why It Matters into ${lang.name}]

## ${lang.relatedHeader}

- [Keep related term names in English — they are Bitcoin technical terms]

---`,
    }],
  });

  return extractText(message);
}

function extractText(message) {
  return message.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('')
    .trim();
}

// ─── File helpers ─────────────────────────────────────────────────────────────

function titleToSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function ensureDirs() {
  for (const code of ['en', ...LANGUAGES.map(l => l.code)]) {
    fs.mkdirSync(path.join(GLOSSARY_DIR, code), { recursive: true });
  }
}

// ─── Main pipeline ────────────────────────────────────────────────────────────

async function processTerm(term, opts) {
  const { force, languages } = opts;
  const slug = term.slug || titleToSlug(term.title);

  console.log(`\n▶ ${term.title} (${slug})`);

  // Step 1 — English
  const enPath = path.join(GLOSSARY_DIR, 'en', `${slug}.md`);
  let englishMarkdown;

  if (!force && fs.existsSync(enPath)) {
    englishMarkdown = fs.readFileSync(enPath, 'utf8');
    console.log(`  ✓ en (existing)`);
  } else if (term.existingContent) {
    englishMarkdown = term.existingContent;
    console.log(`  ✓ en (existing)`);
  } else {
    process.stdout.write(`  → Generating en...`);
    englishMarkdown = await generateEnglish(term);
    fs.writeFileSync(enPath, englishMarkdown);
    console.log(` done`);
  }

  // Step 2 — Translations
  for (const lang of languages) {
    const langPath = path.join(GLOSSARY_DIR, lang.code, `${slug}.md`);

    if (!force && fs.existsSync(langPath)) {
      console.log(`  ✓ ${lang.code} (existing)`);
      continue;
    }

    process.stdout.write(`  → Translating ${lang.code} (${lang.name})...`);
    const translated = await translateEntry(englishMarkdown, lang, term.title);
    fs.writeFileSync(langPath, translated);
    console.log(` done`);

    await delay(300); // avoid burst rate limits
  }
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const get = flag => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : null;
  };

  return {
    force: args.includes('--force'),
    translateOnly: args.includes('--translate-only'),
    limit: get('--limit') ? parseInt(get('--limit')) : null,
    termSlug: get('--term'),
    langFilter: get('--lang') ? get('--lang').split(',') : null,
  };
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY env var is not set.');
    process.exit(1);
  }

  const opts = parseArgs();
  const languages = opts.langFilter
    ? LANGUAGES.filter(l => opts.langFilter.includes(l.code))
    : LANGUAGES;

  ensureDirs();

  let terms;

  if (opts.translateOnly) {
    console.log('Using existing English files as source...');
    terms = loadExistingEnglishTerms();
  } else {
    try {
      terms = await scrapeTerms();
    } catch (err) {
      console.warn(`Scraping failed (${err.message}), falling back to existing English files.`);
      terms = loadExistingEnglishTerms();
    }
  }

  if (opts.termSlug) {
    terms = terms.filter(t => (t.slug || titleToSlug(t.title)) === opts.termSlug);
    if (!terms.length) {
      console.error(`No term found matching slug "${opts.termSlug}"`);
      process.exit(1);
    }
  }

  if (opts.limit) terms = terms.slice(0, opts.limit);

  console.log(`\nProcessing ${terms.length} term(s) into ${languages.map(l => l.code).join(', ')}...`);

  for (const term of terms) {
    await processTerm(term, { force: opts.force, languages });
  }

  console.log('\n✓ All done!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
