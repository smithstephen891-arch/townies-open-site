# Townies Open

Landing page for the Townies Open golf tournament — **April 17–18, 2027**.

A single page: the logo, the dates, a coming-soon note, and an interest form.
Registration isn't open yet, so the form is the only thing to do here.

Next.js (App Router) + Tailwind CSS 4, deployed on Vercel at
[towniesgolf.com](https://towniesgolf.com).

## Running it

```bash
npm run dev
```

It works with no environment variables at all: submissions are logged to the
server console instead of being emailed. See `.env.example` for the full list.

## The interest form

`src/components/InterestForm.tsx` posts to `src/app/api/interest/route.ts`,
which does two things with each submission:

1. **Emails** it to `towniesopen@gmail.com` (override with `INTEREST_TO_EMAIL`),
   with reply-to set to the sender, via [Resend](https://resend.com).
2. **Upserts** the person into a Mailchimp audience, tagged
   `townies-open-2027`. Skipped and logged when the Mailchimp keys are unset —
   it never fails the submission.

Bot protection is three layers, all of which return a normal success so bots
get no signal: a `website` honeypot field, a minimum five seconds between page
load and submit, and a per-IP rate limit of 5 per 10 minutes. The rate limit
lives in serverless instance memory, so it's a flood brake rather than a hard
guarantee.

**Resend only sends from a verified domain.** `towniesgolf.com` has to be
added under Domains in the Resend account, with the DKIM/SPF records at the
registrar, before mail actually flows.

## Brand assets

`public/images/` holds the source art: `townies-open-logo.png` (arched
wordmark plus the golf-ball mascot) and `golf-ball-mascot.png`. The share card
and favicons are generated from those:

```bash
node scripts/generate-assets.mjs
```

That writes `og.png`, `icon-512.png` and `apple-icon.png` into the same
directory. Outputs are committed, so only re-run it if the source art changes.

Colors live as Tailwind theme tokens in `src/app/globals.css`:

| Token        | Hex       | Used for                         |
| ------------ | --------- | -------------------------------- |
| `forest`     | `#3d513f` | page background (matches the art) |
| `acid`       | `#dcd641` | wordmark yellow, dates, buttons  |
| `celery`     | `#e6e8b0` | body text                        |
| `grey-green` | `#585b58` | the interest-form band           |

Type is Poppins throughout.

## Deploying

`main` auto-deploys to Vercel. Environment variables are set in the Vercel
project settings, not in this repo.
