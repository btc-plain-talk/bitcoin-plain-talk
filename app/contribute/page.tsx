import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function ContributePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--brand-sand)" }}>
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <p
            className="mb-3 text-xs font-bold tracking-widest uppercase"
            style={{ color: "var(--brand-teal)", fontFamily: "var(--font-manrope)" }}
          >
            Open Source
          </p>
          <h2
            className="text-4xl font-extrabold tracking-tight sm:text-5xl"
            style={{ color: "var(--brand-ink)", fontFamily: "var(--font-sora)" }}
          >
            Contribute to Bitcoin Plain Talk
          </h2>
          <p className="mt-4 text-lg" style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}>
            Help make Bitcoin understandable for everyone
          </p>
          <Link
            href="/contribute/new"
            className="hover-rust-bg mt-8 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-bold text-white transition-colors"
            style={{ background: "var(--brand-orange)", fontFamily: "var(--font-manrope)" }}
          >
            Suggest a Term →
          </Link>
          <p className="mt-3 text-sm" style={{ color: "#8a7360", fontFamily: "var(--font-manrope)" }}>
            No GitHub account needed — fill in a form and we&apos;ll turn it into a pull request for review.
          </p>
        </div>

        <div className="space-y-8">
          {/* Why Contribute */}
          <section
            className="rounded-2xl border p-8"
            style={{ background: "var(--brand-shell)", borderColor: "#e8d9c8" }}
          >
            <h3 className="text-2xl font-bold" style={{ color: "var(--brand-ink)", fontFamily: "var(--font-sora)" }}>
              Why Contribute?
            </h3>
            <p className="mt-4" style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}>
              Bitcoin documentation is written by developers, for developers. But Bitcoin is for everyone.
            </p>
            <p className="mt-4" style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}>
              When someone in Nairobi reads "UTXO" or "mempool" for the first time, they shouldn't need
              to decode a whitepaper. They deserve an explanation that respects their intelligence without
              assuming their background.
            </p>
            <p className="mt-4 font-semibold" style={{ color: "var(--brand-ink)", fontFamily: "var(--font-manrope)" }}>
              You don't need to be a developer to contribute. If you can explain something clearly — you belong here.
            </p>
          </section>

          {/* How to Contribute */}
          <section
            className="rounded-2xl border p-8"
            style={{ background: "#FFF5E8", borderColor: "#ffd4a0" }}
          >
            <h3 className="text-2xl font-bold" style={{ color: "var(--brand-rust)", fontFamily: "var(--font-sora)" }}>
              How to Contribute
            </h3>

            <div className="mt-6 space-y-8">
              {[
                {
                  num: "1",
                  title: "Add a New Term",
                  content: (
                    <>
                      <p className="mt-4" style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}>
                        Easiest way: use the{" "}
                        <Link href="/contribute/new" className="font-bold underline" style={{ color: "var(--brand-rust)" }}>
                          Suggest a Term form
                        </Link>{" "}
                        — no GitHub account required, it opens a pull request for you.
                      </p>
                      <p className="mt-2 text-sm" style={{ color: "#8a7360", fontFamily: "var(--font-manrope)" }}>
                        Prefer working directly in GitHub? You can also:
                      </p>
                      <ol className="mt-2 space-y-2" style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}>
                        <li>• Fork the repository on GitHub</li>
                        <li>• Navigate to <code className="rounded px-2 py-0.5 text-sm" style={{ background: "#FFE8C0", color: "var(--brand-rust)" }}>/glossary</code></li>
                        <li>• Copy the <code className="rounded px-2 py-0.5 text-sm" style={{ background: "#FFE8C0", color: "var(--brand-rust)" }}>_template.md</code> file</li>
                        <li>• Fill in the term, explanation, analogy, example, and translation</li>
                        <li>• Submit a Pull Request</li>
                      </ol>
                    </>
                  ),
                },
                {
                  num: "2",
                  title: "Improve an Existing Explanation",
                  content: (
                    <p className="mt-4" style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}>
                      Found an explanation that's still confusing? Open an issue or submit a PR with a clearer version.
                    </p>
                  ),
                },
                {
                  num: "3",
                  title: "Add a Translation",
                  content: (
                    <p className="mt-4" style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}>
                      We need explanations in Swahili, Yoruba, Kikuyu, Wanga, Igbo, Pidgin, and more.
                      If you speak a language, you can contribute — use the{" "}
                      <Link href="/contribute/new" className="font-bold underline" style={{ color: "var(--brand-rust)" }}>
                        Suggest a Term form
                      </Link>{" "}
                      and pick &quot;Translate an existing term.&quot;
                    </p>
                  ),
                },
                {
                  num: "4",
                  title: "Review Contributions",
                  content: (
                    <p className="mt-4" style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}>
                      Read through open PRs and give feedback. Plain language is hard — a second pair of eyes always helps.
                    </p>
                  ),
                },
              ].map(({ num, title, content }) => (
                <div key={num}>
                  <h4 className="text-xl font-bold" style={{ color: "var(--brand-ink)", fontFamily: "var(--font-sora)" }}>
                    {num}. {title}
                  </h4>
                  {content}
                </div>
              ))}
            </div>
          </section>

          {/* Guidelines */}
          <section
            className="rounded-2xl border p-8"
            style={{ background: "var(--brand-shell)", borderColor: "#e8d9c8" }}
          >
            <h3 className="text-2xl font-bold" style={{ color: "var(--brand-rust)", fontFamily: "var(--font-sora)" }}>
              Contribution Guidelines
            </h3>
            <ul className="mt-6 space-y-3" style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}>
              <li>• Write like you're explaining to a smart friend who is new to Bitcoin</li>
              <li>• Avoid using other Bitcoin jargon in your explanation (or explain those terms too)</li>
              <li>• Analogies should feel familiar to everyday African life where possible</li>
              <li>• Keep explanations concise — if it's longer than a paragraph, it's probably too long</li>
              <li>• Be kind in reviews — this project is built for beginners, and so are many of our contributors</li>
            </ul>
          </section>

          {/* Term Structure */}
          <section
            className="rounded-2xl border p-8"
            style={{ background: "var(--brand-shell)", borderColor: "#e8d9c8" }}
          >
            <h3 className="text-2xl font-bold" style={{ color: "var(--brand-rust)", fontFamily: "var(--font-sora)" }}>
              Term Entry Structure
            </h3>
            <p className="mt-4" style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}>
              Each glossary entry should include:
            </p>
            <ul className="mt-4 space-y-2" style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}>
              <li>• <strong>The term</strong> — exactly as you'll encounter it</li>
              <li>• <strong>Plain language explanation</strong> — no jargon, no assumptions</li>
              <li>• <strong>Real-world analogy</strong> — something familiar to anchor the concept</li>
              <li>• <strong>Example in context</strong> — how it actually shows up in Bitcoin</li>
              <li>• <strong>Translation</strong> — Swahili (and growing to other African languages)</li>
            </ul>

            <div
              className="mt-6 rounded-xl p-4"
              style={{ background: "#FFE8C0" }}
            >
              <p className="text-sm font-bold" style={{ color: "var(--brand-rust)", fontFamily: "var(--font-manrope)" }}>
                Example: Mempool
              </p>
              <p className="mt-2 text-sm" style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}>
                <strong>Plain English:</strong> A waiting room for Bitcoin transactions that haven't been confirmed yet.
              </p>
              <p className="mt-2 text-sm" style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}>
                <strong>Analogy:</strong> Imagine sending a letter. Before it gets delivered, it sits in a sorting room at the post office. The mempool is that sorting room.
              </p>
              <p className="mt-2 text-sm" style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}>
                <strong>In context:</strong> "My transaction has been stuck in the mempool for an hour."
              </p>
            </div>
          </section>

          {/* CTA */}
          <section
            className="rounded-2xl border-2 p-8 text-center"
            style={{ borderColor: "var(--brand-orange)", background: "var(--brand-shell)" }}
          >
            <h3 className="text-2xl font-bold" style={{ color: "var(--brand-ink)", fontFamily: "var(--font-sora)" }}>
              Ready to Contribute?
            </h3>
            <p className="mt-4 text-lg" style={{ color: "#5a3e2b", fontFamily: "var(--font-manrope)" }}>
              Every explanation you add helps someone understand Bitcoin better.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="https://github.com/btc-plain-talk/bitcoin-plain-talk"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-rust-bg inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-bold text-white transition-colors"
                style={{ background: "var(--brand-orange)", fontFamily: "var(--font-manrope)" }}
              >
                View on GitHub →
              </a>
              <Link
                href="/glossary"
                className="hover-rust-tint inline-flex items-center justify-center gap-2 rounded-full border-2 px-8 py-3 font-bold transition-colors"
                style={{ borderColor: "var(--brand-rust)", color: "var(--brand-rust)", background: "transparent", fontFamily: "var(--font-manrope)" }}
              >
                Browse Glossary
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t py-12" style={{ borderColor: "#2a1e16", background: "var(--brand-ink)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <img src="/logo-full-lockup-reversed.svg" alt="Bitcoin Plain Talk" style={{ height: 28 }} />
            <p className="text-sm" style={{ color: "#b8a090", fontFamily: "var(--font-manrope)" }}>
              Free to use, share, and build on
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
