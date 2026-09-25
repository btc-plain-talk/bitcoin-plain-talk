import fs from "fs";
import path from "path";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SiteHeader from "@/components/SiteHeader";
import { getAllTerms } from "@/lib/glossary";

function getStats() {
  const glossaryDirectory = path.join(process.cwd(), "glossary");
  const languageCount = fs
    .readdirSync(glossaryDirectory, { withFileTypes: true })
    .filter(entry => entry.isDirectory()).length;
  const termCount = getAllTerms("en").length;
  const roundedTermCount = Math.floor(termCount / 10) * 10;

  return {
    termCount: `${roundedTermCount}+`,
    languageCount: `${languageCount}`,
  };
}

export default function Home() {
  const { termCount, languageCount } = getStats();

  return (
    <div className="min-h-screen" style={{ background: "var(--brand-sand)" }}>
      <SiteHeader />

      {/* Hero Section */}
      <section
        className="py-20 sm:py-32"
        style={{ background: "linear-gradient(to bottom, #FCF7EF, var(--brand-sand))" }}
      >
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p
            className="mb-6 text-xs font-bold tracking-widest uppercase"
            style={{ color: "var(--brand-teal)", fontFamily: "var(--font-manrope)" }}
          >
            Bitcoin Education for Africa
          </p>

          <h2
            className="text-5xl font-extrabold tracking-tight sm:text-7xl"
            style={{ color: "var(--brand-ink)", fontFamily: "var(--font-sora)", lineHeight: 1.1 }}
          >
            Bitcoin, in your{" "}
            <span style={{ color: "var(--brand-orange)" }}>language.</span>
          </h2>

          <p
            className="mt-6 text-lg leading-8 sm:text-xl"
            style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}
          >
            No finance degree required. No developer background needed. Just clear, honest
            explanations written by real people — starting with Africa.
          </p>

          <div className="mt-10 flex justify-center">
            <SearchBar variant="hero" />
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-10">
            {[
              { stat: termCount, label: "Bitcoin Terms" },
              { stat: languageCount, label: "Languages" },
              { stat: "100%", label: "Open Source" },
            ].map(({ stat, label }) => (
              <div key={label} className="text-center">
                <div
                  className="text-4xl font-extrabold"
                  style={{ color: "var(--brand-orange)", fontFamily: "var(--font-sora)" }}
                >
                  {stat}
                </div>
                <div
                  className="mt-1 text-sm font-medium"
                  style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Terms */}
      <section className="py-16 sm:py-24" style={{ background: "var(--brand-sand)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p
              className="mb-3 text-xs font-bold tracking-widest uppercase"
              style={{ color: "var(--brand-teal)", fontFamily: "var(--font-manrope)" }}
            >
              Start Here
            </p>
            <h3
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--brand-ink)", fontFamily: "var(--font-sora)" }}
            >
              Featured Terms
            </h3>
            <p
              className="mt-4 text-lg"
              style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}
            >
              Start your Bitcoin journey with these essential concepts
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                slug: "mempool",
                title: "Mempool",
                body: "A waiting room for Bitcoin transactions that haven't been confirmed yet.",
              },
              {
                slug: "utxo",
                title: "UTXO",
                body: "Unspent Transaction Output — the pieces of bitcoin you actually own and can spend.",
              },
              {
                slug: "hashrate",
                title: "Hashrate",
                body: "The total computing power securing the Bitcoin network — the network's heartbeat.",
              },
            ].map((term) => (
              <Link
                key={term.slug}
                href={`/glossary/${term.slug}`}
                className="card-link group rounded-2xl p-6"
                style={{ background: "var(--brand-shell)" }}
              >
                <div className="flex items-start justify-between">
                  <h4
                    className="text-xl font-bold"
                    style={{ color: "var(--brand-ink)", fontFamily: "var(--font-sora)" }}
                  >
                    {term.title}
                  </h4>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold"
                    style={{ background: "#FFE8C0", color: "var(--brand-rust)" }}
                  >
                    EN
                  </span>
                </div>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}
                >
                  {term.body}
                </p>
                <div
                  className="mt-4 flex items-center text-sm font-semibold"
                  style={{ color: "var(--brand-rust)", fontFamily: "var(--font-manrope)" }}
                >
                  Read more →
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/glossary"
              className="hover-rust-bg inline-flex items-center gap-2 rounded-full px-8 py-3 font-bold text-white transition-colors"
              style={{ background: "var(--brand-orange)", fontFamily: "var(--font-manrope)" }}
            >
              Browse All Terms
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20" style={{ background: "var(--brand-shell)" }}>
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h3
            className="text-3xl font-bold sm:text-4xl"
            style={{ color: "var(--brand-ink)", fontFamily: "var(--font-sora)" }}
          >
            Help Build Bitcoin Education for Africa
          </h3>
          <p
            className="mt-4 text-lg"
            style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}
          >
            You don't need to be a developer to contribute. If you can explain something clearly — you belong here.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contribute"
              className="hover-rust-bg inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-bold text-white transition-colors"
              style={{ background: "var(--brand-orange)", fontFamily: "var(--font-manrope)" }}
            >
              Start Contributing
            </Link>
            <a
              href="https://github.com/btc-plain-talk/bitcoin-plain-talk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-rust-tint inline-flex items-center justify-center gap-2 rounded-full border-2 px-8 py-3 font-bold transition-colors"
              style={{
                borderColor: "var(--brand-rust)",
                color: "var(--brand-rust)",
                background: "transparent",
                fontFamily: "var(--font-manrope)",
              }}
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12" style={{ borderColor: "#2a1e16", background: "var(--brand-ink)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <img src="/logo-full-lockup-reversed.svg" alt="Bitcoin Plain Talk" height="28" style={{ height: 28 }} />
            <p
              className="text-sm"
              style={{ color: "#b8a090", fontFamily: "var(--font-manrope)" }}
            >
              Free to use, share, and build on
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
