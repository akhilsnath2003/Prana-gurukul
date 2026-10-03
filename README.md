# Prana Gurukul — complete Next.js website

Standalone Next.js App Router version of your presentation website. Includes the same page, copy, photography, responsive styles, scroll story, programme tabs, FAQ accordion, navigation, visit-request dialog and FAQ chat.

## Run locally

Install Node.js 22 LTS or newer, extract the ZIP, and open this folder in VS Code.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production

```bash
npm run build
npm start
```

See DEPLOYMENT.md for the Vercel deployment and security setup. The website works without API keys; enabling the distributed rate limiter requires server-side Upstash Redis credentials. Rate limiting is not active until configured.

## Edit the website

- `app/page.tsx`: homepage sections, programme descriptions, FAQ answers, chatbot rules, contact details and form behaviour.
- `app/globals.css`: colours, fonts, responsive layouts and animations.
- `app/layout.tsx`: page title, description and favicon metadata.
- `public/images/`: both supplied school photographs, optimised as WebP.
- `public/favicon.svg`: sprout favicon.
- `components/ui/`: accessible tabs, accordion, dialogs and slide-out panels.

## Interactions

Scroll effects use GSAP timelines and ScrollTrigger with native scrolling. Mobile uses a shorter, stacked story. Reduced-motion preferences are respected.

Ask Prana is a local keyword-based FAQ assistant, not a generative AI chatbot. It answers from bundled prospectus information and directs unknown questions to the school. Conversations are not saved to a server.

The visit form prepares an email in the visitor's email app. It does not send automatically, store leads or confirm appointments. Connect an email or form service if automatic submissions are needed.

Fees, timings, age eligibility, transport and daycare are not invented; parents are directed to the school for confirmation.

## Notes

This source uses standard Next.js scripts instead of the hosted demo's Vinext/Cloudflare adapter. The visible design and assets are preserved. Hosting credentials, deployment IDs, environment secrets, build files and node_modules are excluded. The sprout wordmark is the demo branding, not an extracted copy of the prospectus logo.

Before public launch, have the school approve the copy, contact details and child-photo usage. Test the final deployment on phone and desktop.
