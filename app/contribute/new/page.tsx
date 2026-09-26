'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import { CATEGORIES, LANGUAGES, slugify } from '@/lib/glossary-submission';
import { getCategoryLabel, getContextMeaningLabel, getSectionLabel, type SectionKey } from '@/lib/glossary-labels';

interface EnglishTerm {
  slug: string;
  title: string;
}

type Mode = 'new' | 'translate';
type Status = 'idle' | 'submitting' | 'success' | 'error';

const inputStyle = {
  background: 'white',
  borderColor: '#e8d9c8',
  color: 'var(--brand-ink)',
  fontFamily: 'var(--font-manrope)',
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold" style={{ color: 'var(--brand-ink)', fontFamily: 'var(--font-manrope)' }}>
        {label}
      </span>
      {hint && (
        <span className="mt-1 block text-xs" style={{ color: '#8a7360', fontFamily: 'var(--font-manrope)' }}>
          {hint}
        </span>
      )}
      <div className="mt-2">{children}</div>
    </label>
  );
}

export default function NewSubmissionPage() {
  const [mode, setMode] = useState<Mode>('new');
  const [language, setLanguage] = useState('sw');
  const [englishTerms, setEnglishTerms] = useState<EnglishTerm[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [plainEnglish, setPlainEnglish] = useState('');
  const [analogy, setAnalogy] = useState('');
  const [inContextQuote, setInContextQuote] = useState('');
  const [inContextMeaning, setInContextMeaning] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [relatedTerms, setRelatedTerms] = useState('');
  const [contributorName, setContributorName] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const [englishTermsError, setEnglishTermsError] = useState(false);
  const [existingSlugs, setExistingSlugs] = useState<Set<string>>(new Set());
  const [existingSlugsError, setExistingSlugsError] = useState(false);

  const translateLanguages = useMemo(() => LANGUAGES.filter((l) => l.code !== 'en'), []);

  useEffect(() => {
    if (mode !== 'translate') return;
    let cancelled = false;
    fetch('/api/terms?lang=en&limit=1000')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setEnglishTerms((data.items ?? []).map((t: { slug: string; title: string }) => ({ slug: t.slug, title: t.title })));
        setEnglishTermsError(false);
      })
      .catch(() => {
        if (cancelled) return;
        setEnglishTerms([]);
        setEnglishTermsError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [mode]);

  // Pre-check for a duplicate entry in the target language, so we can warn
  // before the user fills out the whole form and hits the server's 409.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/terms?lang=${language}&limit=1000`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const items: { slug: string }[] = data.items ?? [];
        setExistingSlugs(new Set(items.map((t) => t.slug)));
        setExistingSlugsError(false);
      })
      .catch(() => {
        if (!cancelled) setExistingSlugsError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [language]);

  const effectiveSlug = selectedSlug || englishTerms[0]?.slug || '';
  const selectedEnglishTerm = englishTerms.find((t) => t.slug === effectiveSlug);

  const candidateSlug = mode === 'translate' ? effectiveSlug : slugify(term);
  const isDuplicate = candidateSlug !== '' && existingSlugs.has(candidateSlug);
  const languageName = LANGUAGES.find((l) => l.code === language)?.name ?? language;

  // Show field labels as the section headings the entry will be saved under,
  // in the selected language. The English label moves into the hint so
  // contributors still know what each field is for. Languages without a
  // translated heading keep the English label.
  function fieldText(heading: string, englishHeading: string, englishLabel: string, hint?: string) {
    if (language === 'en' || heading === englishHeading) {
      return { label: englishLabel, hint };
    }
    return { label: heading, hint: hint ? `${englishLabel} · ${hint}` : englishLabel };
  }
  const sectionText = (section: SectionKey, englishLabel: string, hint?: string) =>
    fieldText(getSectionLabel(section, language), getSectionLabel(section, 'en'), englishLabel, hint);

  const categoryText = fieldText(getCategoryLabel(language), getCategoryLabel('en'), 'Category');
  const plainText = sectionText('plainEnglish', 'Plain English explanation', 'One clear sentence, no jargon');
  const analogyText = sectionText('analogy', 'Analogy', 'A relatable comparison from everyday life');
  const exampleText = sectionText('inContext', 'Example sentence', 'An example sentence you might actually see or hear using this term');
  const meaningText = fieldText(getContextMeaningLabel(language), getContextMeaningLabel('en'), 'What that example means');
  const whyText = sectionText('whyItMatters', 'Why it matters', 'Why should someone new to Bitcoin care?');
  const relatedText = sectionText('relatedTerms', 'Related terms', 'Comma-separated, e.g. Satoshi, Wallet, Blockchain');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');
    setPrUrl(null);

    const termName = mode === 'translate' ? selectedEnglishTerm?.title ?? '' : term;

    const payload = {
      mode,
      language,
      slug: mode === 'translate' ? effectiveSlug : undefined,
      term: termName,
      category,
      plainEnglish,
      analogy,
      inContextQuote,
      inContextMeaning,
      whyItMatters,
      relatedTerms: relatedTerms
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      contributorName: contributorName.trim() || undefined,
      website,
    };

    try {
      const res = await fetch('/api/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setPrUrl(data.url);
    } catch {
      setStatus('error');
      setMessage('Could not reach the server. Please check your connection and try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen" style={{ background: 'var(--brand-sand)' }}>
        <main className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold" style={{ color: 'var(--brand-ink)', fontFamily: 'var(--font-sora)' }}>
            Thank you!
          </h2>
          <p className="mt-4 text-lg" style={{ color: '#5a3e2b', fontFamily: 'var(--font-manrope)' }}>
            Your submission has been opened as a pull request for a maintainer to review.
          </p>
          {prUrl && (
            <a
              href={prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full px-8 py-3 font-bold text-white"
              style={{ background: 'var(--brand-orange)', fontFamily: 'var(--font-manrope)' }}
            >
              View the pull request →
            </a>
          )}
          <div className="mt-8">
            <Link href="/contribute" className="font-semibold" style={{ color: 'var(--brand-rust)' }}>
              ← Back to Contribute
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--brand-sand)' }}>
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--brand-ink)', fontFamily: 'var(--font-sora)' }}>
            Suggest a Term
          </h2>
          <p className="mt-3 text-lg" style={{ color: '#5a3e2b', fontFamily: 'var(--font-manrope)' }}>
            Fill in the form below. We&apos;ll open it as a pull request for a maintainer to review — no GitHub account needed.
          </p>
        </div>

        <div className="mb-6 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setMode('new')}
            className="rounded-full px-5 py-2 text-sm font-bold transition-colors"
            style={
              mode === 'new'
                ? { background: 'var(--brand-orange)', color: 'white' }
                : { background: 'var(--brand-shell)', color: 'var(--brand-ink)', border: '1px solid #e8d9c8' }
            }
          >
            Add a new concept
          </button>
          <button
            type="button"
            onClick={() => setMode('translate')}
            className="rounded-full px-5 py-2 text-sm font-bold transition-colors"
            style={
              mode === 'translate'
                ? { background: 'var(--brand-orange)', color: 'white' }
                : { background: 'var(--brand-shell)', color: 'var(--brand-ink)', border: '1px solid #e8d9c8' }
            }
          >
            Translate an existing term
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border p-8" style={{ background: 'var(--brand-shell)', borderColor: '#e8d9c8' }}>
          {/* Honeypot — hidden from real users */}
          <div style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
            <label>
              Leave this field blank
              <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </label>
          </div>

          {mode === 'translate' ? (
            <>
              <Field label="Existing English term">
                <select
                  required
                  value={effectiveSlug}
                  onChange={(e) => setSelectedSlug(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  style={inputStyle}
                >
                  {englishTerms.length === 0 && (
                    <option value="">{englishTermsError ? 'Could not load terms' : 'Loading terms…'}</option>
                  )}
                  {englishTerms.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.title}
                    </option>
                  ))}
                </select>
                {englishTermsError && (
                  <p className="mt-2 text-sm font-semibold" style={{ color: '#b3261e', fontFamily: 'var(--font-manrope)' }}>
                    Couldn&apos;t load the list of existing terms. Please refresh the page and try again.
                  </p>
                )}
              </Field>
              <Field label="Translate into">
                <select
                  required
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  style={inputStyle}
                >
                  {translateLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          ) : (
            <>
              <Field label="Term name" hint="Exactly as it should appear, e.g. Multisig">
                <input
                  required
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  style={inputStyle}
                />
              </Field>
              <Field label="Language">
                <select
                  required
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  style={inputStyle}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          )}

          {isDuplicate && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border p-4 text-sm font-semibold"
              style={{ borderColor: '#f3c6c6', background: '#fdecec', color: '#8c2320', fontFamily: 'var(--font-manrope)' }}
            >
              <span aria-hidden="true">⚠️</span>
              <span>
                This term already exists in {languageName}. Want to suggest an edit on GitHub instead of submitting a duplicate?
              </span>
            </div>
          )}

          <Field label={categoryText.label} hint={categoryText.hint}>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              style={inputStyle}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label={plainText.label} hint={plainText.hint}>
            <textarea
              required
              rows={2}
              value={plainEnglish}
              onChange={(e) => setPlainEnglish(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              style={inputStyle}
            />
          </Field>

          <Field label={analogyText.label} hint={analogyText.hint}>
            <textarea
              required
              rows={3}
              value={analogy}
              onChange={(e) => setAnalogy(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              style={inputStyle}
            />
          </Field>

          <Field label={exampleText.label} hint={exampleText.hint}>
            <input
              required
              value={inContextQuote}
              onChange={(e) => setInContextQuote(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              style={inputStyle}
            />
          </Field>

          <Field label={meaningText.label} hint={meaningText.hint}>
            <textarea
              required
              rows={2}
              value={inContextMeaning}
              onChange={(e) => setInContextMeaning(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              style={inputStyle}
            />
          </Field>

          <Field label={whyText.label} hint={whyText.hint}>
            <textarea
              required
              rows={2}
              value={whyItMatters}
              onChange={(e) => setWhyItMatters(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              style={inputStyle}
            />
          </Field>

          <Field label={relatedText.label} hint={relatedText.hint}>
            <input
              value={relatedTerms}
              onChange={(e) => setRelatedTerms(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              style={inputStyle}
            />
          </Field>

          <Field label="Your name (optional)" hint="For credit in the pull request">
            <input
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              style={inputStyle}
            />
          </Field>

          {status === 'error' && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border p-4 text-sm font-semibold"
              style={{ borderColor: '#f3c6c6', background: '#fdecec', color: '#8c2320', fontFamily: 'var(--font-manrope)' }}
            >
              <span aria-hidden="true">⚠️</span>
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting' || isDuplicate}
            className="w-full rounded-full px-8 py-3 font-bold text-white transition-colors disabled:opacity-60"
            style={{ background: 'var(--brand-orange)', fontFamily: 'var(--font-manrope)' }}
          >
            {status === 'submitting' ? 'Submitting…' : 'Submit for review'}
          </button>

          {existingSlugsError && (
            <p className="text-center text-xs" style={{ color: '#8a7360', fontFamily: 'var(--font-manrope)' }}>
              Couldn&apos;t check for existing entries — duplicates will still be caught when you submit.
            </p>
          )}
        </form>
      </main>
    </div>
  );
}
