# Translation and Localization Guide 🌐

Thank you for helping make Bitcoin understandable in more African languages. You do not need to be a developer, but you should be fluent in the target language and comfortable writing for beginners.

## Translation Goal

Translate meaning, not individual words. A good entry should sound natural to a native speaker, preserve the Bitcoin concept accurately, and use an everyday analogy that fits the community.

## Currently Supported Languages

| Language | Folder code |
| :--- | :--- |
| English (source) | `en` |
| Swahili | `sw` |
| Nigerian Pidgin | `pcm` |
| Kikuyu | `ki` |
| Yoruba | `yo` |
| Wanga  | `lwg` |
| Igbo | `ig` |

Translations live in `glossary/<language-code>/`. If your language is not listed, open an issue before creating a new folder so maintainers can agree on its name, code, writing system, and reviewers.

## Before You Start

1. Check the repository issues and existing files to make sure nobody is already translating the term.
2. Comment on an existing translation issue or open a new one and request assignment.
3. Choose an English source file from `glossary/en/`.
4. Find a fluent speaker who can review the translation, if possible.

Do not translate an English entry that is incomplete or technically unclear. Open an issue or propose an English correction first so every language starts from an accurate source.

## Translate a Glossary Entry

1. Copy the matching English file into the target language folder. Keep the same lowercase filename and `.md` extension.

   ```bash
   cp glossary/en/utxo.md glossary/sw/utxo.md
   ```

2. Translate the reader-facing content while keeping the Markdown structure intact. Use `glossary/_template.md` and existing entries in the target language as references.
3. Preserve the section order, heading levels, category field, list formatting, and final `---` separator. Translate section labels consistently with other entries in the same language.
4. Keep related-term names and the main term recognizable so entries can be connected across languages.
5. Preview the result and compare it with the English source before opening a pull request.

## Writing Guidelines

- Write naturally for native speakers; avoid word-for-word translation.
- Prefer common, everyday vocabulary over academic language.
- Keep the meaning and security implications of the English source.
- Keep established Bitcoin terms, such as `Bitcoin`, `Lightning Network`, or `UTXO`, when there is no widely understood equivalent, then explain them in the target language.
- Adapt an analogy when the English example is unfamiliar locally, but do not change the underlying concept.
- Use one spelling and dialect consistently within an entry.
- Preserve intentional capitalization, code, links, numbers, and Markdown formatting.
- Never add investment promises, price predictions, or financial advice.

## Bitcoin-Specific Accuracy

Small wording changes can create dangerous misunderstandings. Take extra care with `private key`, `seed phrase`, `custodial`, `confirmation`, `transaction fee`, and similar security or transaction terms.

If you are unsure whether a translation is technically accurate, flag the phrase in the pull request and request review from both a fluent speaker and someone familiar with Bitcoin. It is better to leave a recognized Bitcoin term with a clear explanation than to invent a misleading equivalent.

## Translation Review Checklist

### Language reviewer

- Does it sound natural when read aloud?
- Is the spelling, grammar, dialect, and writing system consistent?
- Will a beginner understand it without reading the English version?
- Is the analogy familiar and culturally respectful?

### Bitcoin reviewer

- Does it preserve the source meaning?
- Are keys, custody, transactions, and security concepts described safely?
- Has any important limitation or warning been lost?
- Do the example and analogy still represent the concept accurately?

## Submit Your Contribution

Create a focused branch and commit:

```bash
git checkout -b translation/sw-utxo
git add glossary/sw/utxo.md
git commit -m "translation: add Swahili UTXO glossary entry"
```

Open a pull request that includes:

- The language and dialect or regional variant, if relevant
- The source English entry
- The name or GitHub handle of a language reviewer, when available
- Any words, technical choices, or adapted analogies that need discussion
- `Closes #<issue-number>` when the work has an assigned issue

Keep one language or a small related group of entries per pull request so reviewers can give careful feedback.

## Translating the Website or Documentation

The glossary is the project's current localization format. Before translating interface text or a full document, open an issue to agree on the file location, language code, and update process. This prevents a translation from becoming disconnected when the English source changes.

## Maintaining a Translation

A translation may need another review when its English source changes. Native speakers can also contribute by reviewing open pull requests, reporting unclear wording, and updating older entries for consistency.

By contributing, you agree that your translation will be distributed under the project's MIT License. Thank you—every carefully reviewed translation helps someone learn Bitcoin in a language they are comfortable using.
