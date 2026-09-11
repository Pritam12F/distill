# Distill — 7 day plan

Six hours a day. The goal at the end of the week is not a finished product — it's five real people receiving a real digest in a real inbox.

The two days that matter most are Thursday and Friday. Everything before them is setup. It is very easy to spend seven days polishing the digest page and never send an email to anyone.

---

## Monday — close out the digest page

**Bug fixes (1h)**

- [x] Delete the hardcoded `sources` array — the border logic still reads `sources.length` instead of `digestDetails.articles.length`
- [x] Replace `return null` with `notFound()` from `next/navigation`
- [x] Fix header date: `toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })`
- [x] Fix `publishedAt` format: `{ day: 'numeric', month: 'short' }` so it matches
- [x] Add `target="_blank" rel="noopener noreferrer"` to source links
- [x] Derive `accentIndex` from the topic instead of hardcoding `0` — use the topic's position in the user's topic list so a topic keeps its colour day to day

**Reactions (2h)**

- [x] `reactToArticle` server action — session check, ownership check, update, `revalidatePath`
- [x] Accept `null` as a reaction value so an active thumb can be toggled off
- [x] Wire `ReactionsSection` with `useOptimistic` + `startTransition`
- [x] Both buttons, one parameterised handler
- [-] Verify the thumb stays filled after revalidation — if it reverts, revalidation isn't firing

**Sharing (1.5h)**

- [x] `ShareButton` client component — clipboard write, "Link copied" for 2s, `navigator.share` fallback
- [x] `generateMetadata` on the digest page — title from `headline`, description from `signal`, OG tags
- [-] Test the preview by pasting a link into Slack or WhatsApp

**isOwner (1h)**

- [x] Compare session user to `digest.userId`
- [x] Hide reaction buttons when not owner
- [x] Swap share button for a "Get your own briefing" link to `/` when not owner

- [x] Write a seed file for prisma

**Buffer (0.5h)** — something above will take longer than expected.

---

## Tuesday — onboarding

Nothing else this week matters if a new user can't create topics.

**Topic picker (3h)**

- [x] Render `SUGGESTED_TOPICS` as selectable chips
- [x] Local `useState` for selection — no Context needed
- [x] Enforce a max (5 topics) with a visible count
- [x] Empty-selection state on the submit button

**Submission (2h)**

- [x] Server action creating `Topic` rows, copying `name` and `sources` from the constant
- [x] Redirect to `/home` on success
- [x] Handle the case where a user already has topics — skip onboarding, straight to home

**Home empty state (1h)**

- [x] Branch the empty state: no topics at all vs topics but no digests yet. "Your first briefing is on its way" is wrong for someone who hasn't picked anything

- [x] Add suitable navbar

---

## Wednesday — deploy and schedule

**Deploy (2h)**

- [ ] Hosted Postgres — Neon or Supabase free tier
- [ ] `prisma migrate deploy` against it
- [ ] Deploy to Vercel, all env vars set
- [ ] Confirm auth works in production — better-auth needs correct `BASE_URL`

**Cron (3h)**

- [ ] `node-cron` will not work on Vercel's serverless model. Use a cron route: `GET /api/cron/digest` guarded by a secret header, plus `vercel.json` schedule
- [ ] Loop users, loop their topics, one `Digest` per topic
- [ ] `Promise.allSettled` so one failure doesn't kill the run
- [ ] One email per user containing all their topics — not one email per topic
- [ ] Log token cost per run

**Manual trigger (1h)**

- [ ] A way to fire the cron route by hand so you're not waiting for 2am to test

---

## Thursday — real email

**Domain (2h)**

- [ ] Buy a domain if you haven't
- [ ] Verify it in Resend, SPF and DKIM records
- [ ] Wait out DNS propagation — start this first thing, it's the only blocking wait this week
- [ ] Swap `onboarding@resend.dev` for the real sender

**End to end (3h)**

- [ ] Trigger a full production run
- [ ] Read the email that arrives. Check it on mobile, not just desktop
- [ ] Check `conflict` renders when present and collapses cleanly when null
- [ ] Click every link — sources, "read full digest", unsubscribe
- [ ] Confirm the digest page loads for a logged-out visitor

**Fix what you find (1h)** — you will find something.

---

## Friday — be a user

**Use it (2h)**

- [ ] Subscribe with your own account, real topics you actually care about
- [ ] Read the digest as a reader, not a builder. Is the headline sharp? Does `signal` say anything useful? Is `conflict` firing, or null every single time?
- [ ] If conflict is always null, that's the most important finding of the week — your main differentiator isn't working and the synthesis prompt needs revisiting

**Prompt tuning (2h)**

- [ ] Adjust the synthesis prompt based on what you read
- [ ] Re-run, re-read. This is the highest-leverage hour of the week

**Landing page (2h)**

- [ ] Replace the placeholder digest on the landing page with a real generated one
- [ ] Swap `hello@distill.news` for your real address
- [ ] Remove the `<Image>` block if you still don't have an asset — the section works without it

---

## Saturday — topics management

The first thing a real user will ask for is a way to change what they follow.

- [ ] `/settings` page — list topics, add, rename, delete
- [ ] Wire up the `PATCH` and `DELETE` topic routes that already exist and are unused
- [ ] Confirm deleting a topic cascades to its digests without error
- [ ] Nav bar in `(app)/layout.tsx` — Home, Archive, Settings, with `aria-current` on the active link

Skip delivery-time configuration. It needs a schema change and timezone-aware cron. Not this week.

---

## Sunday — five people

**Ship it (2h)**

- [ ] Final pass on the signup flow as if you'd never seen it
- [ ] Make sure a broken pipeline run doesn't produce a blank page or a silent failure
- [ ] Basic error logging so you find out when something breaks

**Recruit (2h)**

- [ ] Five people who actually read news. Friends, classmates, anyone
- [ ] Sit with at least one of them while they sign up and watch where they hesitate

**Watch (2h)**

- [ ] Note who opens the email over the following days
- [ ] Ask two of them what they'd change

---

## Not this week

Archive page, delivery-time settings, custom per-topic sources, delete-digest, React Query, dark mode toggle, per-topic "nothing today" lines.

None of these block a person from receiving a digest. Every one of them is a reasonable thing to spend a day on once someone is actually using the product and tells you it matters.
