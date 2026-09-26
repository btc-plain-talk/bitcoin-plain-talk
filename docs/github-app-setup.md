# Setting up the GitHub App for /contribute

The `/contribute/new` form doesn't ask contributors to log in anywhere. Instead,
the server acts as a bot — it authenticates as a GitHub App, commits the
submitted entry to a new branch, and opens a pull request for a maintainer to
review. This is a one-time setup a repo owner needs to do manually in GitHub's
UI (it registers an app and generates a private key, so it isn't something to
automate).

## 1. Register the App

1. Go to `https://github.com/settings/apps/new` (use the account/org that owns
   the repo — currently `btc-plain-talk`).
2. Fill in:
   - **GitHub App name**: `Bitcoin Plain Talk Contributions` (must be globally
     unique on GitHub — add a suffix if it's taken)
   - **Homepage URL**: your deployed site URL (e.g. the Vercel URL)
   - **Webhook**: uncheck "Active" — this app doesn't need webhooks
3. Under **Repository permissions**, set:
   - **Contents**: Read and write
   - **Pull requests**: Read and write
   - **Metadata**: Read-only (selected automatically)
   Leave every other permission as "No access."
4. Under **Where can this GitHub App be installed?**, choose "Only on this
   account."
5. Click **Create GitHub App**.

## 2. Generate a private key

On the app's settings page, scroll to **Private keys** and click **Generate a
private key**. This downloads a `.pem` file — treat it like a password, it's
the credential the server uses to act as the bot.

## 3. Install the app on the repo

From the app's settings page, click **Install App** (left sidebar), then
choose the `btc-plain-talk` account and select **Only select repositories** →
`bitcoin-plain-talk`. After installing, note the installation ID from the
URL, e.g. `https://github.com/settings/installations/12345678` → `12345678`.

> If the repo previously lived under a different owner and had the app
> installed there, that installation doesn't carry over on a repo transfer —
> reinstall the app on the new owner and update `GITHUB_APP_INSTALLATION_ID`
> (and `GITHUB_REPO_OWNER`) below.

## 4. Set environment variables

Copy these into your deployment's environment variables (e.g. Vercel project
settings) and into a local `.env.local` for development — see `.env.example`:

- `GITHUB_APP_ID` — found on the app's settings page ("App ID")
- `GITHUB_APP_PRIVATE_KEY` — the full contents of the `.pem` file. Most env
  var inputs don't accept real newlines, so replace them with the literal
  characters `\n` (the app reads either form).
- `GITHUB_APP_INSTALLATION_ID` — from step 3
- `GITHUB_REPO_OWNER` / `GITHUB_REPO_NAME` — `btc-plain-talk` / `bitcoin-plain-talk`

## Notes

- The app can only touch the one repo it's installed on — its permissions
  don't extend to your other repos or account settings.
- Every submission opens a normal, reviewable pull request. Nothing merges
  automatically; a maintainer still approves everything that lands in `main`.
- The form has a honeypot field and a basic per-IP rate limit (5 submissions
  per 10 minutes) as a first line of defense against spam. It's in-memory, so
  it resets on redeploy and isn't a hard guarantee across serverless
  instances — revisit with a shared store (e.g. Upstash Redis) if abuse
  becomes a real problem.
