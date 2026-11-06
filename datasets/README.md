---
license: cc-by-sa-4.0
language:
  - sw
task_categories:
  - text-generation
tags:
  - bitcoin
  - swahili
  - instruction-tuning
  - low-resource
---

# Bitcoin Plain Talk — Swahili Instruction Dataset

Instruction/output pairs generated from the [Bitcoin Plain Talk](https://bitcoin-plain-talk.vercel.app)
glossary — plain-language Bitcoin explanations, analogies, and real-world
examples, translated into Swahili by the project's community contribution
portal.

## Files

- `bitcoin-plain-talk-sw.jsonl` — Swahili instruction/output pairs.

## Schema

Each line is a JSON object:

```json
{
  "instruction": "Eleza UTXO kwa Kiswahili, kwa maneno rahisi.",
  "output": "<plain Swahili explanation>",
  "term_en": "UTXO",
  "source_url": "https://bitcoin-plain-talk.vercel.app/glossary/utxo?lang=sw"
}
```

Four variants per glossary term:

1. **Direct explanation** — the plain-language definition.
2. **Analogy-only** — the everyday-life comparison.
3. **Example-only** — the real-world usage example plus what it means.
4. **Combined long-form** — all of the above plus "why it matters," phrased
   as an answer for someone completely new to Bitcoin.

## Regenerating

The dataset is derived directly from `glossary/sw/*.md` in the main repo, so
it grows automatically as more terms get translated:

```bash
npm run export:dataset -- --lang sw
```

## Validating

Check that every dataset file is well-formed and up to date with the glossary:

```bash
npm run validate:datasets
```

It verifies that each line is valid JSON with all four fields, that every
`source_url` points to an existing glossary file, that each term has all
four variants, and that the number of terms matches `glossary/<lang>/`.
It exits with code 1 and a message per problem if anything fails.

## License

CC BY-SA 4.0, matching the license already carried by the underlying
Bitcoin/Swahili glossary content (consistent with the Mastering Bitcoin
Swahili translation). Attribution: Bitcoin Plain Talk contributors.

## Publishing to Hugging Face Hub

This directory is not yet pushed to a public dataset repo. To publish it:

```bash
pip install huggingface_hub
huggingface-cli login
huggingface-cli upload <your-org>/bitcoin-plain-talk-sw datasets/bitcoin-plain-talk-sw.jsonl
huggingface-cli upload <your-org>/bitcoin-plain-talk-sw datasets/README.md README.md
```

Publishing is a manual, one-time step — pick the target Hugging Face
namespace and run this yourself once you're ready to make it public.
