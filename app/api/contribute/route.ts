import { NextRequest, NextResponse } from 'next/server';
import { getInstallationOctokit, getRepoTarget } from '@/lib/github-app';
import {
  CATEGORIES,
  LANGUAGES,
  renderTermMarkdown,
  slugify,
  type TermSubmission,
} from '@/lib/glossary-submission';
import { isRateLimited } from '@/lib/rate-limit';

const MAX_FIELD_LENGTH = 2000;
const MAX_RELATED_TERMS = 10;

interface SubmitBody extends TermSubmission {
  slug?: string;
  /** Honeypot — real users never fill this in. */
  website?: string;
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= MAX_FIELD_LENGTH;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
  }

  let body: SubmitBody;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body.');
  }

  if (body.website) {
    // Honeypot tripped — pretend success so bots don't learn to leave it blank.
    return NextResponse.json({ url: null }, { status: 200 });
  }

  if (body.mode !== 'new' && body.mode !== 'translate') {
    return badRequest('mode must be "new" or "translate".');
  }

  const language = LANGUAGES.find((l) => l.code === body.language);
  if (!language) {
    return badRequest('Unsupported language.');
  }

  const category = CATEGORIES.find((c) => c === body.category);
  if (!category) {
    return badRequest('Unsupported category.');
  }

  const requiredFields: (keyof TermSubmission)[] = [
    'term',
    'plainEnglish',
    'analogy',
    'inContextQuote',
    'inContextMeaning',
    'whyItMatters',
  ];
  for (const field of requiredFields) {
    if (!isNonEmptyString(body[field])) {
      return badRequest(`Field "${field}" is required.`);
    }
  }

  if (
    !Array.isArray(body.relatedTerms) ||
    body.relatedTerms.length > MAX_RELATED_TERMS ||
    !body.relatedTerms.every((t) => isNonEmptyString(t))
  ) {
    return badRequest('relatedTerms must be a list of up to 10 non-empty strings.');
  }

  if (body.contributorName && !isNonEmptyString(body.contributorName)) {
    return badRequest('contributorName is too long.');
  }

  let slug: string;
  if (body.mode === 'translate') {
    if (!isNonEmptyString(body.slug)) {
      return badRequest('slug is required when translating an existing term.');
    }
    slug = slugify(body.slug);
    if (language.code === 'en') {
      return badRequest('Translations must target a non-English language.');
    }
  } else {
    slug = slugify(body.term);
  }

  if (!slug) {
    return badRequest('Could not derive a valid slug from the term name.');
  }

  const targetPath = `glossary/${language.code}/${slug}.md`;

  try {
    const octokit = await getInstallationOctokit();
    const { owner, repo } = getRepoTarget();

    if (body.mode === 'translate') {
      const englishPath = `glossary/en/${slug}.md`;
      try {
        await octokit.repos.getContent({ owner, repo, path: englishPath });
      } catch (err) {
        const status = (err as { status?: number }).status;
        if (status === 404) {
          return badRequest('No existing English entry found for that term.');
        }
        throw err;
      }
    }

    try {
      await octokit.repos.getContent({ owner, repo, path: targetPath });
      return NextResponse.json(
        { error: 'A glossary entry already exists at that language/term. Please suggest an edit on GitHub instead.' },
        { status: 409 }
      );
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status !== 404) throw err;
    }

    const { data: repoData } = await octokit.repos.get({ owner, repo });
    const baseBranch = repoData.default_branch;

    const { data: ref } = await octokit.git.getRef({ owner, repo, ref: `heads/${baseBranch}` });
    const baseSha = ref.object.sha;

    const branchName = `contribute/${language.code}-${slug}-${Date.now()}`;
    await octokit.git.createRef({ owner, repo, ref: `refs/heads/${branchName}`, sha: baseSha });

    const markdown = renderTermMarkdown({ ...body, language: language.code, category });

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: targetPath,
      branch: branchName,
      message: `content: add ${language.name} entry for ${body.term}`,
      content: Buffer.from(markdown, 'utf-8').toString('base64'),
    });

    const attribution = body.contributorName ? `\n\nSubmitted by: ${body.contributorName}` : '';
    const { data: pr } = await octokit.pulls.create({
      owner,
      repo,
      title: `content: add ${language.name} entry for ${body.term}`,
      head: branchName,
      base: baseBranch,
      body: `Submitted through the [/contribute](https://bitcoin-plain-talk.vercel.app/contribute) web form.\n\nLanguage: ${language.name}\nTerm: ${body.term}\nMode: ${body.mode === 'translate' ? 'Translation of existing entry' : 'New entry'}${attribution}\n\nPlease review for accuracy, tone, and formatting before merging.`,
    });

    return NextResponse.json({ url: pr.html_url }, { status: 201 });
  } catch (error) {
    console.error('Failed to create glossary submission PR:', error);
    return NextResponse.json({ error: 'Something went wrong while submitting. Please try again later.' }, { status: 500 });
  }
}
