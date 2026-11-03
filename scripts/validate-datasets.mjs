/**
 * Bitcoin Plain Talk — dataset validation
 *
 * Checks every datasets/*.jsonl file and exits with code 1 if anything is wrong:
 *   - every line is valid JSON
 *   - instruction, output, term_en and source_url are present and non-empty
 *   - each source_url points to a glossary file that exists
 *   - each term has all 4 variants
 *   - the number of terms matches the number of entries in glossary/<lang>/
 *
 * Usage:
 *   node scripts/validate-datasets.mjs
 *   npm run validate:datasets
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATASETS_DIR = path.join(__dirname, '..', 'datasets');
const GLOSSARY_DIR = path.join(__dirname, '..', 'glossary');

const REQUIRED_FIELDS = ['instruction', 'output', 'term_en', 'source_url'];
const VARIANTS_PER_TERM = 4;
// .../glossary/<slug>?lang=<code>
const SOURCE_URL_PATTERN = /\/glossary\/([^/?#]+)\?lang=([a-z]+)$/;

const errors = [];
const fail = (message) => errors.push(message);

function countGlossaryEntries(lang) {
  const langDir = path.join(GLOSSARY_DIR, lang);
  if (!fs.existsSync(langDir)) return null;
  return fs
    .readdirSync(langDir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_')).length;
}

function validateFile(fileName) {
  const content = fs.readFileSync(path.join(DATASETS_DIR, fileName), 'utf8');
  const lines = content.split(/\r?\n/);

  const variantsPerTerm = new Map(); // "sw/address" -> number of lines
  const languages = new Set();

  lines.forEach((line, index) => {
    if (!line.trim()) return; // the exporter ends files with a blank line
    const where = `${fileName}:${index + 1}`;

    // 1. valid JSON
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      fail(`${where} is not valid JSON`);
      return;
    }
    if (record === null || typeof record !== 'object' || Array.isArray(record)) {
      fail(`${where} is not a JSON object`);
      return;
    }

    // 2. required fields
    for (const field of REQUIRED_FIELDS) {
      const value = record[field];
      if (typeof value !== 'string' || !value.trim()) {
        fail(`${where} is missing or has an empty "${field}"`);
      }
    }

    // 3. source_url points to a real glossary file
    const match = typeof record.source_url === 'string'
      ? record.source_url.match(SOURCE_URL_PATTERN)
      : null;
    if (!match) {
      if (record.source_url) {
        fail(`${where} has an unexpected source_url format: ${record.source_url}`);
      }
      return;
    }
    const [, slug, lang] = match;
    languages.add(lang);

    if (!fs.existsSync(path.join(GLOSSARY_DIR, lang, `${slug}.md`))) {
      fail(`${where} source_url points to glossary/${lang}/${slug}.md, which does not exist`);
    }

    const key = `${lang}/${slug}`;
    variantsPerTerm.set(key, (variantsPerTerm.get(key) ?? 0) + 1);
  });

  // 4. every term has all 4 variants
  for (const [key, count] of variantsPerTerm) {
    if (count !== VARIANTS_PER_TERM) {
      fail(`${fileName}: term "${key}" has ${count} of ${VARIANTS_PER_TERM} variants`);
    }
  }

  // 5. freshness: term count matches the glossary
  if (languages.size === 0) {
    fail(`${fileName}: no usable records found`);
  } else if (languages.size > 1) {
    fail(`${fileName}: mixes several languages (${[...languages].join(', ')})`);
  } else {
    const lang = [...languages][0];
    const entries = countGlossaryEntries(lang);
    if (entries === null) {
      fail(`${fileName}: glossary/${lang}/ does not exist`);
    } else if (entries !== variantsPerTerm.size) {
      fail(
        `${fileName} is out of date: it has ${variantsPerTerm.size} terms but ` +
        `glossary/${lang}/ has ${entries} entries. Regenerate it with ` +
        `"npm run export:dataset -- --lang ${lang}"`
      );
    }
  }
}

function main() {
  const files = fs.readdirSync(DATASETS_DIR).filter((f) => f.endsWith('.jsonl'));

  if (files.length === 0) {
    console.error('No .jsonl files found in datasets/');
    process.exit(1);
  }

  files.forEach(validateFile);

  if (errors.length > 0) {
    errors.forEach((e) => console.error(`✗ ${e}`));
    console.error(`\n${errors.length} problem(s) found.`);
    process.exit(1);
  }

  console.log(`All ${files.length} dataset file(s) passed.`);
}

main();