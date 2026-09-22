'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import { useEffect, useState, use } from 'react';
import type { Term } from '@/lib/glossary';

const langLabel: Record<string, string> = {
  en: 'English',
  sw: 'Swahili',
  pcm: 'Pidgin',
  ki: 'Kikuyu',
  yo: 'Yoruba',
  lwg: 'Wanga',
  ig: 'Igbo',
};

const sectionLabels: Record<string, Record<string, string>> = {
  plainEnglish: { en: 'Plain English', sw: 'Maelezo Rahisi', pcm: 'Plain Pidgin', ki: 'Gĩthũngũ', yo: 'Ìtumọ̀ Rọrùn' },
  analogy:      { en: 'Analogy', sw: 'Mfano wa Kila Siku', pcm: 'Analogy', ki: 'Mfano wa Kila Siku', yo: 'Àpẹẹrẹ' },
  inContext:    { en: 'In Context', sw: 'Jinsi Inavyotumiwa', pcm: 'In Context', ki: 'Jinsi Inavyotumiwa', yo: 'Ní Ìtumọ̀ Gidi' },
  contextMeaning: { en: 'What this means:', sw: 'Maana yake:', pcm: 'What this means:', ki: 'Maana yake:', yo: 'Ìtumọ̀ èyí:' },
  whyItMatters: { en: 'Why It Matters', sw: 'Kwa Nini Ni Muhimu', pcm: 'Why It Matters', ki: 'Kwa Nini Ni Muhimu', yo: 'Kí Ló Dé Tí Ó Fi Ṣe Pátáki?' },
  relatedTerms: { en: 'Related Terms', sw: 'Maneno Yanayohusiana', pcm: 'Related Terms', ki: 'Maneno Yanayohusiana', yo: 'Àwọn Ọ̀rọ̀ Tó Ní Ìbáṣepọ̀' },
};

function label(section: string, lang: string) {
  return sectionLabels[section]?.[lang] ?? sectionLabels[section]?.['en'] ?? section;
}

export default function TermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const currentLang = searchParams.get('lang') || 'en';
  const [term, setTerm] = useState<Term | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerm = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/terms/${slug}?lang=${currentLang}`);
        setTerm(response.ok ? await response.json() : null);
      } catch {
        setTerm(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTerm();
  }, [slug, currentLang]);

  const headerBar = <SiteHeader sticky />;

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--brand-sand)' }}>
        {headerBar}
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-lg" style={{ color: '#5a3e2b', fontFamily: 'var(--font-manrope)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!term) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--brand-sand)' }}>
        {headerBar}
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <img
            src="/subira-avatar.png"
            alt="Subira"
            className="subira-avatar-shake h-20 w-20 rounded-full object-cover shadow-lg"
            style={{ border: '3px solid var(--brand-shell)' }}
            width={400}
            height={400}
          />
          <p
            className="max-w-sm text-lg font-semibold"
            style={{ color: 'var(--brand-rust)', fontFamily: 'var(--font-manrope)' }}
          >
            {currentLang === 'sw'
              ? 'Aa, sina neno hilo bado — nimelitunza ili nilijumuishe hivi karibuni! 📝'
              : "Hmm, this one's not in my glossary yet — I've made a note to add it soon! 📝"}
          </p>
          <Link
            href="/glossary"
            className="hover-rust-bg mt-2 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white transition-colors"
            style={{ background: 'var(--brand-orange)', fontFamily: 'var(--font-manrope)' }}
          >
            ← Back to Glossary
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--brand-sand)' }}>
      {headerBar}

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          className="mb-8 flex items-center gap-2 text-sm"
          style={{ color: '#5a3e2b', fontFamily: 'var(--font-manrope)' }}
        >
          <Link href="/" className="hover-rust transition-colors" style={{ color: '#5a3e2b' }}>Home</Link>
          <span>/</span>
          <Link href="/glossary" className="hover-rust transition-colors" style={{ color: '#5a3e2b' }}>Glossary</Link>
          <span>/</span>
          <span style={{ color: 'var(--brand-ink)' }}>{term.title}</span>
        </nav>

        {/* Term Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl"
            style={{ color: 'var(--brand-ink)', fontFamily: 'var(--font-sora)' }}
          >
            {term.title}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-sm font-bold"
              style={{ background: '#FFE8C0', color: 'var(--brand-rust)', fontFamily: 'var(--font-manrope)' }}
            >
              {term.category}
            </span>
            <span
              className="rounded-full px-3 py-1 text-sm font-medium"
              style={{ background: 'rgba(31,138,122,0.12)', color: 'var(--brand-teal)', fontFamily: 'var(--font-manrope)' }}
            >
              {langLabel[currentLang] ?? currentLang}
            </span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Plain English */}
          <section
            className="rounded-2xl border p-8"
            style={{ background: 'var(--brand-shell)', borderColor: '#e8d9c8' }}
          >
            <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--brand-rust)', fontFamily: 'var(--font-sora)' }}>
              {label('plainEnglish', currentLang)}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--brand-ink)', fontFamily: 'var(--font-manrope)' }}>
              {term.plainEnglish}
            </p>
          </section>

          {/* Analogy */}
          {term.analogy && (
            <section
              className="rounded-2xl border p-8"
              style={{ background: '#FFF5E8', borderColor: '#ffd4a0' }}
            >
              <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--brand-rust)', fontFamily: 'var(--font-sora)' }}>
                {label('analogy', currentLang)}
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--brand-ink)', fontFamily: 'var(--font-manrope)' }}>
                {term.analogy}
              </p>
            </section>
          )}

          {/* In Context */}
          {term.inContext && (
            <section
              className="rounded-2xl border p-8"
              style={{ background: 'var(--brand-shell)', borderColor: '#e8d9c8' }}
            >
              <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--brand-rust)', fontFamily: 'var(--font-sora)' }}>
                {label('inContext', currentLang)}
              </h2>
              <blockquote
                className="border-l-4 pl-6 text-lg italic"
                style={{ borderColor: 'var(--brand-orange)', color: '#5a3e2b', fontFamily: 'var(--font-manrope)' }}
              >
                &quot;{term.inContext}&quot;
              </blockquote>
              {term.contextMeaning && (
                <p className="mt-4 text-base leading-relaxed" style={{ color: '#5a3e2b', fontFamily: 'var(--font-manrope)' }}>
                  <span className="font-semibold" style={{ color: 'var(--brand-ink)' }}>
                    {label('contextMeaning', currentLang)}
                  </span>{' '}
                  {term.contextMeaning}
                </p>
              )}
            </section>
          )}

          {/* Why It Matters */}
          {term.whyItMatters && (
            <section
              className="rounded-2xl border p-8"
              style={{ background: 'var(--brand-shell)', borderColor: '#e8d9c8' }}
            >
              <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--brand-rust)', fontFamily: 'var(--font-sora)' }}>
                {label('whyItMatters', currentLang)}
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--brand-ink)', fontFamily: 'var(--font-manrope)' }}>
                {term.whyItMatters}
              </p>
            </section>
          )}

          {/* Related Terms */}
          {term.relatedTerms.length > 0 && (
            <section
              className="rounded-2xl border p-8"
              style={{ background: 'var(--brand-shell)', borderColor: '#e8d9c8' }}
            >
              <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--brand-rust)', fontFamily: 'var(--font-sora)' }}>
                {label('relatedTerms', currentLang)}
              </h2>
              <ul className="space-y-2">
                {term.relatedTerms.map(relatedTerm => (
                  <li key={relatedTerm}>
                    <Link
                      href={`/glossary/${relatedTerm.toLowerCase().replace(/\s+/g, '-')}?lang=${currentLang}`}
                      className="hover-rust inline-flex items-center font-semibold transition-colors"
                      style={{ color: 'var(--brand-rust)', fontFamily: 'var(--font-manrope)' }}
                    >
                      → {relatedTerm}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Back Navigation */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/glossary"
            className="hover-rust-bg inline-flex items-center gap-2 rounded-full px-8 py-3 font-bold text-white transition-colors"
            style={{ background: 'var(--brand-orange)', fontFamily: 'var(--font-manrope)' }}
          >
            ← Back to Glossary
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t py-12" style={{ borderColor: '#2a1e16', background: 'var(--brand-ink)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <img src="/logo-full-lockup-reversed.svg" alt="Bitcoin Plain Talk" style={{ height: 28 }} />
            <p className="text-sm" style={{ color: '#b8a090', fontFamily: 'var(--font-manrope)' }}>
              Free to use, share, and build on
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
