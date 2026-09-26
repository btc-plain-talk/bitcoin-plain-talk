# Bitcoin Plain Talk

**Making Bitcoin understandable in every African language, one concept at a time.**

Bitcoin Plain Talk is an open-source glossary that explains Bitcoin concepts in simple, everyday language.

Instead of technical definitions filled with jargon, Bitcoin Plain Talk uses relatable examples and analogies rooted in African experiences to help more people understand Bitcoin without needing a technical background.

The project also translates Bitcoin concepts into African languages, making Bitcoin knowledge more accessible while creating valuable language datasets that can support future AI development across the continent.

## The Problem

For many people discovering Bitcoin, the technology itself is not the biggest barrier.

The language is.

Terms like:

* UTXO
* Mempool
* Lightning Network
* Seed Phrase
* Channel Liquidity

can feel intimidating to newcomers.

This creates a knowledge gap where people become interested in Bitcoin but struggle to understand the concepts needed to participate confidently.

The challenge becomes even greater when educational resources are only available in English.

Across Africa, millions of people learn and communicate primarily in local languages, yet most Bitcoin education remains inaccessible to them.

## Why Bitcoin Plain Talk Exists

Bitcoin Plain Talk exists to make Bitcoin education easier, more relatable, and more inclusive.

We believe:

* Bitcoin knowledge should not require technical expertise
* Local languages deserve high-quality educational resources
* Clear explanations accelerate adoption
* Better language resources create opportunities beyond Bitcoin

Every translation added to this project helps more people understand Bitcoin while also contributing to the growth of digital resources in African languages.

## What Bitcoin Plain Talk Does

Bitcoin Plain Talk combines:

* Plain-language Bitcoin explanations
* African-context analogies
* Community-driven translations
* Open-source educational resources
* Language dataset creation

All in one collaborative project that anyone can contribute to.

## Features

### Bitcoin Glossary

Simple explanations for commonly misunderstood Bitcoin concepts.

Examples include:

* Bitcoin Wallet
* Private Keys
* Seed Phrases
* Mempool
* UTXOs
* Mining
* Nodes
* Lightning Network
* Payment Channels
* Routing

### African Language Translations

Educational content translated into local African languages.

Current focus includes:

* Yoruba
* Nigerian Pidgin
* Swahili
* Kikuyu
* Wanga
* Igbo

Future languages may include:

* Amharic
* Hausa
* Zulu
* Xhosa
* Twi
* Luganda

### Local Analogies

Concepts explained through examples people already understand.

Examples:

* Market trading
* Mobile money
* Community savings groups
* Local transportation systems
* Everyday cash transactions

### Open Educational Resource

All content is openly available for learning, sharing, and improvement.

## Why This Matters Beyond Bitcoin

Bitcoin Plain Talk is also helping build digital language infrastructure for Africa.

Every translation contributes to:

* Better language datasets
* More representation for African languages online
* Improved AI training resources
* Better language models
* Lower barriers for developers building local-language products

Better data leads to better AI tools for African communities.

## Project Structure

```text
bitcoin-plain-talk/
├── glossary/
│   ├── _template.md      # Template every entry follows
│   ├── en/               # English (source entries)
│   │   ├── wallet.md
│   │   ├── seed-phrase.md
│   │   ├── mempool.md
│   │   ├── utxo.md
│   │   └── lightning-network.md
│   ├── sw/               # Swahili
│   ├── pcm/              # Nigerian Pidgin
│   ├── yo/               # Yoruba
│   ├── ki/               # Kikuyu
│   ├── ig/               # Igbo
│   └── lwg/              # Wanga
├── app/                  # Next.js website
├── lib/                  # Glossary parsing and contribution logic
├── scripts/              # Glossary generator and dataset export
├── docs/                 # Contributor guides
└── README.md
```

A translation must use the **same file name as the English entry**. For example, the Yoruba version of `glossary/en/seed-phrase.md` goes in `glossary/yo/seed-phrase.md`. The website uses the file name to link a term across languages.

## Who Can Contribute?

You do not need to be a developer to contribute.

We welcome:

### Bitcoin Learners

Help identify confusing explanations and suggest simpler alternatives.

### Native Language Speakers

Translate concepts into your local language.

### Educators

Improve explanations and educational accuracy.

### Writers

Rewrite content to make it clearer and easier to understand.

### Developers

Help build tools, workflows, and infrastructure around the glossary.

### Researchers

Help organize, validate, and improve language datasets.

## How to Contribute

### Option 1: Improve an Existing Definition

* Find a glossary entry
* Suggest a simpler explanation
* Submit a pull request

### Option 2: Add a Translation

* Choose a concept
* Translate it into your language
* Submit your contribution

### Option 3: Add a New Concept

* Create a new glossary entry
* Explain it in plain language
* Include an everyday analogy

### Option 4: Review Contributions

* Check translations
* Verify accuracy
* Improve clarity

## Contribution Principles

Every glossary entry should aim to be:

* Simple
* Accurate
* Beginner-friendly
* Culturally relatable
* Easy to translate

Avoid unnecessary jargon whenever possible.

If a technical term must be used, explain it clearly.

## Future Goals

Bitcoin Plain Talk is evolving toward:

* Support for 50+ African languages
* Community translation reviews
* Audio explanations
* Visual learning resources
* AI-ready language datasets
* Open APIs for developers
* Educational partnerships across Africa

## Getting Started

Fork the repository:

```bash
git clone https://github.com/btc-plain-talk/bitcoin-plain-talk.git
```

Navigate into the project:

```bash
cd bitcoin-plain-talk
cd glossary
```

Choose a concept, language, or improvement area and start contributing.

Example:

```bash
cd ki
```

Add a translated file in the folder, using the same file name as the English entry.

## License

MIT License

## Acknowledgments

Thank you to:

* Bitcoin educators
* Open-source contributors
* Language translators
* African language communities
* Everyone helping make Bitcoin easier to understand

## Join the Mission

Bitcoin should be understandable by anyone, regardless of technical background or language.

If you speak an African language, write, teach, translate, research, or simply care about making Bitcoin more accessible, we'd love your contribution.

Every word matters.
