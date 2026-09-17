# Distill — Current Bugs

Audit date: **2026-09-15** · Branch `main` @ `b87fdd1` (with uncommitted working-tree changes)

---

## How to read this

Every entry has an ID (`B-01`…), the exact file and line, what actually happens,
how to see it happen, and the smallest fix that makes it correct. Nothing in this
document has been changed in the codebase — it is a worklist only.

**Verification baseline for this audit:**

| Check              | Result                             |
| ------------------ | ---------------------------------- |
| `npx tsc --noEmit` | ✅ passes clean (0 errors)         |
| `npx next build`   | ✅ passes clean                    |
| `npx eslint src`   | ❌ **crashes** — see [B-31](#b-31) |

That first row is the important one: **the type checker and the build both pass.**
Every bug below is a runtime/logic bug that no automated gate in this repo will
ever catch, largely because they hide behind `!` non-null assertions, `as` casts,
optional fields, and `Promise.allSettled` swallowing rejections.

### Severity legend

|           | Meaning                                                                |
| --------- | ---------------------------------------------------------------------- |
| 🔴 **P0** | Security hole, data leak, or a core user flow that is outright broken  |
| 🟠 **P1** | Feature silently produces wrong output, or crashes on a reachable path |
| 🟡 **P2** | Wrong behaviour in an edge case, wasted money/latency, bad UX          |
| ⚪ **P3** | Dead code, cleanup, hygiene                                            |

### Index

| ID            | Severity | Area          | One-liner                                                                                     |
| ------------- | -------- | ------------- | --------------------------------------------------------------------------------------------- |
| [B-01](#b-01) | 🔴 P0    | Auth UI       | Sign-in and sign-up both send the **name** field as the email                                 |
| [B-02](#b-02) | 🔴 P0    | Auth UI       | Auth form never calls `preventDefault` — page reloads, **password lands in the URL**          |
| [B-03](#b-03) | 🔴 P0    | Server action | `generateFirstDigest` has **no auth check** — run the pipeline as any user - Intentional      |
| [B-04](#b-04) | 🔴 P0    | API           | `GET /api/digests/[id]` has **no session check** — read any user's digest - Intentional       |
| [B-05](#b-05) | 🔴 P0    | API           | `PATCH /api/digest-articles/[id]` has **no ownership check**                                  |
| [B-06](#b-06) | 🔴 P0    | API           | `GET /api/digest-articles/[id]` uses `&&` where it needs `\|\|` — auth bypass                 |
| [B-07](#b-07) | 🔴 P0    | Pipeline      | **SSRF**: user-supplied topic sources are fetched server-side, unvalidated - Intentional      |
| [B-08](#b-08) | 🟠 P1    | Pipeline      | Citation ids never match — `[S1]` markers are **silently deleted** from digests - Intentional |
| [B-09](#b-09) | 🟠 P1    | Pipeline      | LLM relevancy scores are **thrown away** — id mismatch makes every score 0                    |
| [B-10](#b-10) | 🟠 P1    | Email         | Sent emails have **no `oneLine` text and the wrong date** on every source                     |
| [B-11](#b-11) | 🟠 P1    | Email         | "Read full digest" links use `topicId` → **every link 500s**                                  |
| [B-12](#b-12) | 🟠 P1    | Digest page   | `isOwner` reads `digestDetails` **before** the null check → 500 instead of 404                |
| [B-13](#b-13) | 🟠 P1    | Styling       | Dark mode **can never activate** — every `dark:` class in the app is dead                     |
| [B-14](#b-14) | 🟠 P1    | Toasts        | `toasterId` ≠ toast id — error toasts **never render**, spinners never dismiss                |
| [B-15](#b-15) | 🟠 P1    | Onboarding    | Duplicate random picks → **TypeError on first chip click** (~6.5% of sessions)                |
| [B-16](#b-16) | 🟠 P1    | Onboarding    | `onTopicClick` has a stale-closure dependency array                                           |
| [B-17](#b-17) | 🟠 P1    | Email         | Subject prompt, zod schema, and user prompt **all disagree**; result is discarded             |
| [B-18](#b-18) | 🟠 P1    | Pipeline      | Email failures are swallowed twice — always logs "Email sent successfully"                    |
| [B-19](#b-19) | 🟠 P1    | Topics        | Source `type` (`rss` vs `newsapi`) is **discarded** on save                                   |
| [B-20](#b-20) | 🟠 P1    | Scripts       | `manual-pipeline.ts` passes `rssSources` where `sources` is expected → **0 RSS articles**     |
| [B-21](#b-21) | 🟠 P1    | Scripts       | `if (!filterArticles.length)` checks the function, not the array                              |
| [B-22](#b-22) | 🟠 P1    | Seed          | Two seed transactions race each other; `finally` always prints success                        |
| [B-23](#b-23) | 🟠 P1    | Nav           | Log out button does nothing; menu links are nested wrong                                      |
| [B-24](#b-24) | 🟠 P1    | Routing       | 5 linked routes don't exist: `/settings` `/archive` `/profile` `/terms` `/privacy`            |
| [B-25](#b-25) | 🟡 P2    | Digest page   | Topic chip colour is **nondeterministic** and disagrees with the card                         |
| [B-26](#b-26) | 🟡 P2    | Digest page   | Every source is labelled with a raw UUID instead of `1, 2, 3`                                 |
| [B-27](#b-27) | 🟡 P2    | Digest page   | Loads **every digest of every user** into memory on each request                              |
| [B-28](#b-28) | 🟡 P2    | Landing       | `errorDecoder(error)` on a string discards the real error message                             |
| [B-29](#b-29) | 🟡 P2    | Landing       | Same error toasted up to 3×; `getMetadata` fan-out from the browser                           |
| [B-30](#b-30) | 🟡 P2    | Auth UI       | You cannot clear an input — empty string falls through the `if/else` chain                    |
| [B-31](#b-31) | 🟡 P2    | Tooling       | **`pnpm lint` crashes** — eslint-plugin-react incompatible with ESLint 10                     |
| [B-32](#b-32) | 🟡 P2    | API           | Wrong HTTP status codes throughout (`400` for auth, `402` for validation)                     |
| [B-33](#b-33) | 🟡 P2    | Proxy         | API routes 302-redirect to an HTML page instead of returning 401 JSON                         |
| [B-34](#b-34) | 🟡 P2    | Proxy         | `/api/digests/:path*` is missing from the matcher (compounds B-04)                            |
| [B-35](#b-35) | 🟡 P2    | Actions       | `revalidatePath` called with an article id where a digest id is needed                        |
| [B-36](#b-36) | 🟡 P2    | Actions       | `getDailySummary` returns a `data` object full of `undefined` when empty                      |
| [B-37](#b-37) | 🟡 P2    | Home          | Digest generation has no pending state → double-click runs the pipeline twice                 |
| [B-38](#b-38) | 🟡 P2    | Reactions     | Server action throws; the client never catches it                                             |
| [B-39](#b-39) | 🟡 P2    | Share         | `typeof navigator === undefined` is always false; `useMemo` misses `pathName`                 |
| [B-40](#b-40) | 🟡 P2    | Email         | `unsubscribeUrl` is hardcoded to `""`                                                         |
| [B-41](#b-41) | 🟡 P2    | Schema        | No FK indexes; `seen_article` grows forever; no duplicate-digest constraint                   |
| [B-42](#b-42) | 🟡 P2    | Pipeline      | Empty topic lists still trigger a paid LLM call                                               |
| [B-43](#b-43) | 🟡 P2    | Dates         | Day boundaries are hardcoded UTC; card dates render as `2026-09-15`                           |
| [B-44](#b-44) | 🟡 P2    | Scripts       | `add-test-user.ts` swallows errors then reports them as success                               |
| [B-45](#b-45) | ⚪ P3    | Cleanup       | Entire `src/app/api/*` surface is unreachable from the frontend                               |
| [B-46](#b-46) | ⚪ P3    | Cleanup       | 12 unused dependencies; build tooling in `dependencies`                                       |
| [B-47](#b-47) | ⚪ P3    | Cleanup       | Dead files, dead fields, duplicate CSS keys, a11y nits                                        |

---

---

# 🔴 P0 — Critical

<a id="b-01"></a>

## B-01 · Sign-in and sign-up both send the _name_ field as the email

**`src/components/auth.tsx:70`, `src/components/auth.tsx:88`**

```ts
// loginHandler — line 69-72
const { data, error } = await authClient.signIn.email({
  email: credentialsState.name!, // ← .name, not .email
  password: credentialsState.password,
});

// signupHandler — line 86-90
const { data, error } = await authClient.signUp.email({
  name: credentialsState.name!,
  email: credentialsState.name!, // ← .name again
  password: credentialsState.password,
});
```

The `email` piece of state is written by the email input (line 156) and then
**never read by anything**. Both handlers read `name` instead.

On the sign-in page it is worse: the name input is only rendered when
`authType === "signup"` (line 128), so on `/signin` the `name` field is
permanently `""`. Sign-in therefore always posts an empty email address.

`signupHandler` also has `useCallback(..., [])` on line 101 — an empty dependency
array closing over `credentialsState`. Even if the field were right, it would
submit the initial `{email:"", name:"", password:""}` forever.

**Reproduce:** Go to `/signin`, enter valid credentials, submit. better-auth
rejects it. Go to `/signup`, enter `Pritam` / `p@example.com` / a password —
the account is created with the email `Pritam`.

**Fix:** use `credentialsState.email` in both handlers; add `credentialsState` to
`signupHandler`'s dependency array (or drop the `useCallback`).

---

<a id="b-02"></a>

## B-02 · Auth form never calls `preventDefault` — the password ends up in the URL

**`src/components/auth.tsx:125`**

```tsx
<form onSubmit={authType === "signin" ? loginHandler : signupHandler}>
```

`loginHandler` and `signupHandler` take **no arguments** (lines 68, 85) and so
never call `e.preventDefault()`. The browser performs its default native form
submission: a `GET` to the current URL with every input serialised as a query
parameter, which unloads the page and aborts the in-flight `authClient` call.

Because the inputs are uncontrolled and have `id` but **no `name` attribute**,
what actually lands in the URL depends on the browser, but the shape of the bug
is: _the form navigates away before auth can complete, and a `type="password"`
field is being submitted through a `GET` form._ Any input that does pick up a
name is written into the address bar, browser history, and the server access log
in cleartext.

Combined with [B-01](#b-01), email/password auth does not work at all right now.

**Reproduce:** Open `/signup`, fill the form, press Enter. The page reloads
instead of registering you.

**Fix:** `onSubmit={(e) => { e.preventDefault(); handler(); }}`, and give the
inputs `name` attributes plus `required`.

---

<a id="b-03"></a>

## B-03 · `generateFirstDigest` is an unauthenticated server action

**`src/actions/generate-first.ts:10-48`**

```ts
export async function generateFirstDigest(userDetails: {
  id: string;
  name: string;
  email: string;
}) {
  // ...no auth.api.getSession() anywhere in this file...
  const user = await prisma.user.findFirst({ where: { id: userDetails.id } });
  let result = await core(user.topics, userDetails);
```

The caller supplies the user id, name, and email. The action trusts all three.
Compare `src/actions/onboard.ts:15` and `src/actions/reaction.ts:18`, which both
open with a `getSession` check — this one doesn't.

A server action is a public POST endpoint. `proxy.ts`'s matcher (line 24-35)
does not include `/`, so this endpoint is not gated at the edge either.

Three separate problems:

1. **IDOR.** Anyone can run the pipeline for any user id and read back that
   user's generated digests in the response (`data.digests`).
2. **Email injection.** `userDetails.email` is passed straight through `core()`
   to `sendDailyEmail` (`src/pipeline/index.ts:145`), so an attacker chooses
   both the recipient and, indirectly via the victim's topics, the content.
3. **Cost amplification / DoS.** Each call fans out to dozens of outbound HTTP
   fetches, several `gpt-5-nano` calls, and a real Resend send. There is no rate
   limit and no idempotency key.

**Fix:** derive `id`/`name`/`email` from `auth.api.getSession({ headers: await headers() })`
inside the action and delete the `userDetails` parameter entirely. Add a
per-user cooldown (e.g. reject if a digest already exists for today).

---

<a id="b-04"></a>

## B-04 · `GET /api/digests/[id]` reads any user's digest

**`src/app/api/digests/[id]/route.ts:12-16`**

```ts
const digest = await prisma.digest.findFirst({
  // Scope by userId so a user can only read their own digests.
  where: { id }, // ← the comment is a lie; no userId
  include: { articles: true },
});
```

The comment describes the intended behaviour. The code does not implement it.
There is also no `getSession` call anywhere in the file — compare the sibling
`src/app/api/digests/route.ts:7`, which does check.

This is compounded by [B-34](#b-34): `proxy.ts` matches `"/api/digests"` exactly
but not `"/api/digests/:path*"`, so the edge doesn't gate it either. Digest ids
are UUIDs, so this isn't trivially enumerable, but any leaked id grants
permanent, unauthenticated access to that digest and all of its articles.

**Fix:** add a session check and `where: { id, userId: session.user.id }`.
If public sharing is intentional (the share dialog in `digest-share.tsx:84` says
_"Anyone with this link can read it"_), that should be an explicit opt-in flag on
the Digest row, not an accidental omission.

---

<a id="b-05"></a>

## B-05 · `PATCH /api/digest-articles/[id]` lets you react to anyone's article

**`src/app/api/digest-articles/[id]/route.ts:38-45`**

```ts
const updatedArticle = await prisma.digestArticle.update({
  where: { id: digestId }, // ← no userId
  data: { reaction },
});
```

The session is fetched at line 11 and checked for existence at line 15, but
`session.user.id` is never used in the query. Any signed-in user can write a
reaction onto any other user's article by id, and the 200 response body
(`data: updatedArticle`) returns that article's full contents — title, url,
`oneLine`, `userId` — so it's an information disclosure as well as a write.

The equivalent server action, `src/actions/reaction.ts:27-34`, gets this right:

```ts
where: { userId: session.user.id, id: articleId },
```

**Fix:** copy that `where` clause into the route handler.

---

<a id="b-06"></a>

## B-06 · `GET /api/digest-articles/[id]` — `&&` where `||` was meant

**`src/app/api/digest-articles/[id]/route.ts:71-82`**

```ts
if (!id && !session) {
  // ← only bails when BOTH are missing
  return NextResponse.json({
    error: "No digestId or userId provided/authorized",
  });
}

const allDigests = await prisma.digestArticle.findMany({
  where: {
    id: id,
    userId: session?.user.id, // ← undefined when signed out
  },
});
```

`id` always comes from the route segment, so it is never empty — which means the
guard can never fire, and an unauthenticated request sails straight through. At
that point `session?.user.id` evaluates to `undefined`, and Prisma **drops
`undefined` filters entirely**, so the query degrades to `where: { id }` and
returns the article regardless of who owns it.

Same class of hole as [B-05](#b-05), but reachable with no session at all.

Two further nits in the same handler: the error response on line 72 returns
**HTTP 200** with an `error` body, and the variable/message say "all digests"
when `id` is a unique key so the result is at most one row.

**Fix:** `if (!session) return 401;` then `where: { id, userId: session.user.id }`.

---

<a id="b-07"></a>

## B-07 · SSRF — user-supplied source URLs are fetched server-side, unvalidated

**`src/zod/topic.ts:10-13` → `src/pipeline/scrapers/rss.ts:20` → `src/pipeline/scrapers/extractor.ts:32`**

The validation on a topic source is:

```ts
sources: z.array(z.string().min(1, { error: "Source cannot be empty string" }));
```

Any non-empty string. Not a URL, no scheme allow-list, no host deny-list, no
length cap, and no limit on how many. `onBoardUser` (`src/actions/onboard.ts:38-44`)
applies **no zod validation at all** — it takes whatever array the client sends.

Those strings flow to `parser.parseURL(f)` (`rss.ts:21`) and then to a raw
`fetch(url)` in `extractor.ts:32`, executed **from the server, on a scheduled
cron job, with no egress restrictions**. The response body is parsed by
Readability, stored in the digest, and emailed to the user.

That is a complete SSRF read primitive:

```
POST /api/topics { "topicName": "x", "sources": ["http://169.254.169.254/latest/meta-data/iam/security-credentials/"] }
POST /api/topics { "topicName": "y", "sources": ["http://localhost:5432", "file:///etc/passwd"] }
```

…then trigger the pipeline (which [B-03](#b-03) lets you do on demand) and read
the exfiltrated content out of the resulting digest or email.

Mitigating factors, such as they are: `isUseableContent` requires >200 chars of
extracted text (`extractor.ts:26`), and there is a 10s `AbortSignal.timeout`
(line 40). Neither is a security control.

**Fix:**

- Validate with `z.url()` and restrict `protocol` to `https:` (and `http:` only
  if you must).
- Resolve the hostname and reject loopback, link-local (`169.254.0.0/16`),
  and RFC1918 ranges — before _and_ after redirects (`redirect: "manual"` or a
  vetted agent), otherwise a public URL can 302 into the metadata service.
- Cap `sources` length (the UI says "up to five topics"; nothing enforces it).
- Run `onBoardUser`'s input through `addTopicSchema` like the API route does.

---

---

# 🟠 P1 — High

<a id="b-08"></a>

## B-08 · Citation markers never resolve — `[S1]` is silently deleted from every digest

This is the highest-impact _product_ bug: the consensus and conflict paragraphs
shown on the digest page are missing their citations, or showing raw UUIDs.

**The chain:**

| Step                              | File:line                                     | Value                                                                             |
| --------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------- |
| 1. Article gets an id             | `src/pipeline/scrapers/extractor.ts:15`       | `id: uuidv4()` → `"8f3a2b1c-…"`                                                   |
| 2. Prompt labels it               | `src/utils/prompt-builder.ts:13`              | `` `[${a.id}]` `` → `[8f3a2b1c-…]`                                                |
| 3. System prompt shows an example | `src/constants/prompts/index.ts:41`           | _"using their ids in square brackets, e.g. `[S1][S3]`"_                           |
| 4. Stored as-is                   | `src/pipeline/digest-repository.ts:59`        | `sourceId: a.id` → a UUID                                                         |
| 5. Page parses citations          | `src/components/consensus-conflict.tsx:11`    | `input.split(/(\[S\d+\])/)`                                                       |
| 6. Page looks up the source       | `src/components/consensus-conflict.tsx:17-21` | `articles.find(a => a.sourceId === part.slice(1,-1))` — compares a UUID to `"S1"` |

Whichever instruction the model follows, it loses:

- **Model writes `[S1]`** (following the example in step 3) → the regex matches,
  `find` compares `"8f3a2b1c-…" === "S1"`, returns `undefined`, and line 21
  `if (!source) return null;` **deletes the citation from the rendered prose.**
  The sentence silently loses its reference.
- **Model writes `[8f3a2b1c-…]`** (following the literal instruction in step 2)
  → `\[S\d+\]` doesn't match, so `return part` on line 38 prints the **raw UUID
  inline in the body text**.

The seed data proves what was intended — `prisma/seed.ts:69,80,100` all use
`sourceId: "S1"`, `"S2"`, `"S3"`, and the seeded `consensus` strings contain
`[S1][S3]`. The seeded digests render correctly; nothing the pipeline produces
does.

**Fix:** stop using the UUID as the citation label. In `core()`
(`src/pipeline/index.ts:61-66`) assign a stable per-digest ordinal —
`id: \`S${i + 1}\``— when building the synthesis input, keep a map back to the
real article so`publishedAt`can still be joined, and persist that`S`-form as
`sourceId`. Then step 6 matches.

**Also in this file:** `consensus-conflict.tsx:26-31` renders an in-page anchor
(`href="#source-1"`) with `target="_blank"` — clicking a citation opens a blank
new tab instead of scrolling down to the source. And the `<section>` on line 64
renders its beige panel background unconditionally while its _contents_ are
gated on `conflict &&` (line 65), so a digest with no conflict shows an empty
coloured box.

---

<a id="b-09"></a>

## B-09 · LLM relevancy scores are computed, paid for, and thrown away

**`src/utils/prompt-builder.ts:31` vs `src/pipeline/filter.ts:109-129`**

The relevancy prompt labels each article `[S1]`, `[S2]`, … :

```ts
// prompt-builder.ts:29-34
${articles.map((a, i) => `[S${i + 1}]
Title: ${a.title}
Content: ${a.article.slice(0, 300)}`)}
```

The model dutifully returns `{ ratings: [{ id: "S1", score: 8 }, …] }`. Then:

```ts
// filter.ts:109-113
results.forEach((r) => {
  if (r.id != null) relevancyScoresMap.set(r.id, r.score);   // keys: "S1","S2"…
});

// filter.ts:125-127
contentRelevancy: relevancyScoresMap.has(a.id)               // a.id is a UUID
  ? relevancyScoresMap.get(a.id)
  : 0,
```

`has(uuid)` is **always false**. Every article gets `contentRelevancy: 0`, the
`.sort()` on line 129 is a no-op on a uniform key, and `.slice(0, 3)` just keeps
whatever order the crude keyword count produced. The entire LLM ranking step is
a paid no-op.

Two compounding problems in the same prompt:

1. `[S${i + 1}]` **restarts at 1 inside each topic section**, so even with
   matching ids, article `S1` of "Climate" would collide with `S1` of "AI" in a
   single flat `Map`.
2. `RELEVANCY_SYSTEM_PROMPT` (`src/constants/prompts/index.ts:3`) tells the model
   each article comes "with an id, title, and content" — the user prompt never
   emits an `id:` line at all, only the bracket label.

**Fix:** emit the real `a.id` in the prompt (globally unique, so no collision),
or key `relevancyScoresMap` by the same `S`-ordinal you generate — but pick one
scheme and use it in both places. Fixing this alongside [B-08](#b-08) with a
single shared ordinal scheme is the cleanest path.

---

<a id="b-10"></a>

## B-10 · Sent emails have no summary text and the wrong date on every source

**`src/pipeline/digest-repository.ts:49-77` → `src/emails/digest-email.tsx:85-95`**

`addDigestsToRepo` returns articles from `createManyAndReturn` with a narrow
select:

```ts
const articles = await tx.digestArticle.createManyAndReturn({
  data: d.articles.map(/* … */),
  select: { id: true, title: true, url: true }, // ← no oneLine, no publishedAt
});
// …
return { ...digest, topic: digest.topic.name, articles };
//                                            ^^^^^^^^ overwrites digest.articles,
//                                            which *did* select oneLine+publishedAt
```

The spread on line 77 pulls in `digest.articles` (which selected `oneLine` and
`publishedAt` on lines 40-45), and then the explicit `articles` key immediately
**overwrites it** with the three-field version.

That object flows through `core()` → `structured` (`src/pipeline/index.ts:123-131`)
→ `sendDailyEmail`. The template then does:

```tsx
// digest-email.tsx:86
const published = formatDate(article.publishedAt ?? new Date());
// digest-email.tsx:93
{
  article.oneLine;
}
```

- `article.oneLine` is `undefined` → **the one-line "why this matters" blurb is
  blank for every source in every email.**
- `article.publishedAt` is `undefined` → `?? new Date()` kicks in → **every
  source is stamped with today's date**, regardless of when it was published.

TypeScript doesn't catch this because `src/types/email.ts:5-6` declares both
fields optional.

This is doubly annoying because the pipeline goes out of its way to thread
`publishedAt` through — see the comment at `src/pipeline/index.ts:69-73` and the
`publishedAtById` map — and then the repository layer drops it on the floor.

**Fix:** add `oneLine: true, publishedAt: true` to the `createManyAndReturn`
select on line 65. (Also worth renaming the local so the shadowing on line 77 is
obvious.)

---

<a id="b-11"></a>

## B-11 · "Read full digest" in every email links to a topic id, not a digest id

**`src/emails/digest-email.tsx:100`**

```tsx
<Link href={`${baseUrl}/digest/${digest.topicId}`}>Read full digest →</Link>
```

The route is `src/app/(main)/digest/[id]/page.tsx`, and it looks the id up in a
map keyed by **digest id** (`page.tsx:38-41`, `getAllDigests().get(id)`).
Passing a `topicId` produces a lookup miss.

A lookup miss should be a 404 — but because of [B-12](#b-12) it is a **500** for
any signed-in reader. Which is exactly who clicks a link in their own briefing.

So: the primary call-to-action in the product's primary channel is a hard error,
for every digest, in every email.

**Fix:** `${baseUrl}/digest/${digest.id}`. Note that `EmailDigest`
(`src/types/email.ts:9-17`) doesn't currently carry `id` at all, so
`core()`'s `structured` mapping (`src/pipeline/index.ts:123-131`) needs to pass
it through too.

---

<a id="b-12"></a>

## B-12 · Digest page dereferences before the null check → 500 instead of 404

**`src/app/(main)/digest/[id]/page.tsx:74-87`**

```ts
const digestDetails = (await getAllDigests()).get(id) as Digest & { … };

const session = await auth.api.getSession({ headers: await headers() });

const isOwner = session ? session.user.id === digestDetails.userId : false;
//                                            ^^^^^^^^^^^^^ read here…

if (!digestDetails) {          // …checked here.
  return notFound();
}
```

The `as` cast on line 74 launders `Record<string, any> | undefined` into a
non-optional type, which is why `tsc` stays silent.

Behaviour splits on auth state, which makes it easy to miss in testing:

- **Signed out** → the ternary short-circuits to `false`, the null check runs,
  you get a correct 404.
- **Signed in** → `digestDetails.userId` throws `TypeError: Cannot read
properties of undefined`, which surfaces as a **500**.

**Reproduce:** sign in, visit `/digest/not-a-real-id`.

**Fix:** move the `if (!digestDetails) return notFound();` above the session
call, and drop the `as` cast so the compiler can see the real type.

---

<a id="b-13"></a>

## B-13 · Dark mode can never turn on — every `dark:` class in the app is dead

**`src/app/globals.css:5`**

```css
@custom-variant dark (&:where(.dark, .dark *));
```

This overrides Tailwind v4's default `dark` variant (which is
`@media (prefers-color-scheme: dark)`) with a **class-based** one. Which is a
fine choice — except nothing in the codebase ever puts `.dark` on an element:

```
$ grep -rn "next-themes\|ThemeProvider\|classList.add\|documentElement" src
(none)
```

`src/app/layout.tsx:41-44` renders:

```tsx
<html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}>
```

No `dark`, no theme provider, no toggle, no `colorScheme` in `metadata`.

Meanwhile essentially every component in the app is written with a full dark
palette — `landing.tsx`, `home.tsx`, `digest-card.tsx`, `navbar.tsx`,
`auth.tsx`, `topic-chooser.tsx`, `account-menu.tsx`, the digest page, and the
`.dark {}` token block at `globals.css:90`. All of it is unreachable. A user on
a dark-mode OS gets the cream `#FBF6EE` light theme.

**Fix:** pick one —

- **Class-based (keeps the current CSS):** add `next-themes`, wrap the body, and
  set `suppressHydrationWarning` on `<html>`. Gives you a user-facing toggle.
- **Media-based (no JS):** delete line 5 and change the `.dark {}` block at
  line 90 to `@media (prefers-color-scheme: dark) { :root { … } }`. Follows the
  OS automatically, one-line change.

Either way also set `export const metadata = { colorScheme: "light dark" }` so
form controls and scrollbars match.

---

<a id="b-14"></a>

## B-14 · `toasterId` is not a toast id — error toasts never render, spinners never dismiss

**`src/components/home.tsx:25-46`**

```ts
const toastId = String(toast.loading("Generating...")); // number → string

toast.error(error.reason, { toasterId: toastId });
toast.dismiss(toastId);
```

Two independent defects, both confirmed against the installed `sonner` build:

**1. `toasterId` addresses a `<Toaster>` component, not a toast.**
From `node_modules/sonner/dist/index.mjs:987-989`:

```js
return toasts.filter((toast) => toast.toasterId === id); // for a Toaster WITH an id
// …
return toasts.filter((toast) => !toast.toasterId); // for a Toaster WITHOUT one
```

`src/app/layout.tsx:46` renders a bare `<Toaster />` with no `toasterId`, so it
only renders toasts where `toast.toasterId` is falsy. Passing
`{ toasterId: "3" }` routes the toast to a Toaster instance that doesn't exist.
**The error message and the success message are never shown to the user.**

The option you want for updating an existing toast is `id`, not `toasterId`.

**2. `String()` breaks the dismiss.**
`toast.loading()` returns `string | number`, and in practice an auto-incrementing
**number**. `dismiss` publishes `{ id, dismiss: true }` to subscribers
(`index.mjs:227-250`) and the renderer matches on strict equality — `"3" !== 3`.
**The "Generating..." spinner stays on screen forever.**

Since generation takes minutes, the user watches a permanent spinner and then
receives no feedback at all when it finishes or fails.

**Fix:**

```ts
const toastId = toast.loading("Generating..."); // keep the number
// …
toast.error(error.reason, { id: toastId }); // updates in place
// …
toast.success(data.message, { id: toastId });
```

Updating in place replaces the loading toast, so the separate `toast.dismiss`
calls on lines 38 and 45 can go.

---

<a id="b-15"></a>

## B-15 · Onboarding throws a TypeError on the first chip click, ~6.5% of the time

**`src/app/onboarding/page.tsx:5-7` → `src/components/topic-chooser.tsx:83-87`**

```tsx
// onboarding/page.tsx — three INDEPENDENT draws, duplicates allowed
const [one, two, three] = Array.from({ length: 3 }).map(() =>
  Math.floor(Math.random() * SUGGESTED_TOPICS.length),
);
// …
<TopicChooser selectedIndices={[one, two, three]} />;
```

With 45 entries in `SUGGESTED_TOPICS`, the chance of at least one collision is
`1 - (44/45)(43/45) ≈ 6.5%`. When it happens, `new Set(selectedIndexes)` on
`topic-chooser.tsx:81` has size **2**, not 3.

`logicHandler` only has cases for `3`, `4`, and `5` (lines 22-69). Size 2 hits
`default: break` and returns `undefined`. Then:

```ts
const { newIndexes, message } = logicHandler(
  currSelected.size,
  currSelected,
  topicIdx,
)!;
//                                                                              ^ silences TS
```

→ **`TypeError: Cannot destructure property 'newIndexes' of undefined`**, and the
onboarding page — the only path a new user can take to reach the product —
crashes on the first click.

The same crash occurs from size 0, 1, or >5 if state ever reaches there.

**Fix:** deduplicate the picks in `onboarding/page.tsx` (shuffle-and-take, or a
`Set` loop). Independently, give `logicHandler` a real `default` branch that
returns `{ newIndexes: [...currentSet] }` and drop the `!`. The `!` is what
turned a would-be compile error into a production crash.

**Adjacent, same file:** the footer counter on line 131 is the literal string
`"3 of 5 selected"` and never updates; `disabled={false}` on line 135 is
hardcoded so the submit button can be double-clicked; and the submit handler
(lines 149-153) only acts on `success`, so a failed `onBoardUser` — including the
very common _"Error adding topics or already present"_ — shows the user nothing
at all.

---

<a id="b-16"></a>

## B-16 · `onTopicClick` has the wrong dependency array

**`src/components/topic-chooser.tsx:74-96`**

```ts
const onTopicClick = useCallback(
  (e) => {
    const currSelected = new Set(selectedIndexes); // ← reads STATE
    // …
  },
  [setSelectedIndexes, selectedIndices, logicHandler],
  //                   ^^^^^^^^^^^^^^^ the PROP, not the state
);
```

The callback closes over `selectedIndexes` (state, line 16) but lists
`selectedIndices` (the prop, line 12) as the dependency. The prop never changes,
so under standard React semantics the callback is never re-created and every
click after the first reads the initial selection — selections appear to revert
or fail to toggle.

`logicHandler`'s dependency array (line 71) is likewise `[setSelectedIndexes]`
when the function body uses none of its closure.

> **Caveat:** `next.config.ts:5` enables `reactCompiler: true`, and the compiler's
> auto-memoization may currently mask the stale read. That makes this a latent
> bug rather than a guaranteed one — but the dependency array is wrong either
> way, and it will bite the moment the compiler is disabled or the component is
> restructured. The lint rule that would have caught this
> (`react-hooks/exhaustive-deps`) **cannot run** — see [B-31](#b-31).

**Fix:** `[selectedIndexes, logicHandler]`. Setter functions from `useState` are
stable and don't belong in dependency arrays.

---

<a id="b-17"></a>

## B-17 · Email subject: the prompt, the schema, and the user prompt all disagree — and the result is discarded

Four files, four different ideas of what this step produces.

**1.** `src/constants/prompts/index.ts:98-103` demands two fields:

```
{ "subject": "string", "preheader": "string" }
```

**2.** `src/zod/email.ts:3-5` constrains the structured output to one field, with
a different name:

```ts
export const titleSummarySchema = z.object({
  name: z.string().min(5, { message: "Too short of a title" }),
});
```

**3.** `src/utils/prompt-builder.ts:54` tells the model to skip JSON entirely:

> _"Return only the subject line."_

**4.** `src/pipeline/index.ts:133-140` reads `output.name`.

The zod schema wins at the API layer (it constrains generation), so you get a
`name` — but the model is fighting three contradictory instructions to produce
it, and **`preheader` is never generated at all**, despite the prompt spending
eight lines (lines 84-87, 91-92) specifying it.

**Then the result is thrown away anyway.** `src/pipeline/email.tsx:10-14`
ignores `props.emailTitle` and hardcodes its own subject:

```tsx
subject: `Your daily digests on ${props.digests.slice(0,2)
  .map(d => d.topic.trim().toLowerCase()).join(", ").concat(" and more...")}`,
```

Which is _exactly_ the generic newsletter phrasing the system prompt forbids on
line 91 (_"Never use generic newsletter phrasing: 'Your daily digest'…"_).

The generated `emailTitle` does still get used — as the `<Preview>` text
(`digest-email.tsx:42`) and the `<h1>` (line 48). So the LLM call isn't entirely
wasted, it's just not doing the job it was written for.

Also: `" and more..."` is concatenated unconditionally, so a user with one topic
gets _"Your daily digests on climate and more..."_.

**Fix:** make the schema `{ subject, preheader }` to match the system prompt,
rewrite `buildTitlePrompt` to stop asking for bare text, pass `output.subject`
into `sendDailyEmail` as the real `subject`, and render `preheader` in
`<Preview>`.

---

<a id="b-18"></a>

## B-18 · Email failures are swallowed twice; the pipeline always logs success

**`src/pipeline/email.tsx:6-23` and `src/pipeline/index.ts:142-156`**

```tsx
// email.tsx
export async function sendDailyEmail(props: SendEmail) {
  try {
    return await resend.emails.send({ … });
  } catch (err) {
    console.error(/* … */);
    return null;                       // ← swallowed here
  }
}
```

```ts
// index.ts
try {
  await sendDailyEmail({ … });
  console.log("Email sent successfully");   // ← unconditional
} catch (err) {
  console.error("Error sending email");     // ← unreachable
}
```

Because `sendDailyEmail` never rejects, the outer `catch` is dead code and the
success line prints on every run, including total failure.

Worse, Resend's SDK **does not throw on API errors** — it returns
`{ data: null, error: {...} }`. So a rejected send (bad API key, unverified
domain, rate limit, suppressed recipient) doesn't even reach the inner `catch`.
The return value is never inspected in either file.

Net effect: **email delivery can be 100% broken and the logs will say it's fine.**

Also in `email.tsx`: `from: "pritam@distill.devzy.live"` is hardcoded rather than
read from env, so staging sends as production.

**Fix:** have `sendDailyEmail` check the `{ data, error }` shape and either
return a discriminated result or throw; have `core()` branch on it and include
the outcome in the value it returns.

---

<a id="b-19"></a>

## B-19 · Topic source `type` is discarded on save, so every source is treated as RSS

**`src/actions/onboard.ts:42`**

`SUGGESTED_TOPICS` carefully tags each source (`src/constants/constants.ts:9-17`):

```ts
sources: [
  {
    type: "rss",
    value: "https://techcrunch.com/category/artificial-intelligence/feed/",
  },
  { type: "newsapi", value: "artificial intelligence" }, // a SEARCH TERM
];
```

Onboarding flattens that to a bare string array:

```ts
sources: t.sources.map((s) => s.value),
```

and `Topic.sources` in the schema is `String[]` (`prisma/schema.prisma:34`) with
nowhere to put the type. Downstream, `rssScraper` treats **every** entry as a
feed URL (`src/pipeline/scrapers/rss.ts:20-21`):

```ts
const sources = t.sources!;
const parsedFeeds = await Promise.allSettled(
  sources.map((f) => parser.parseURL(f)),
);
```

So `parser.parseURL("artificial intelligence")` is attempted on every topic,
every run. It rejects, `Promise.allSettled` absorbs it, and `promiseResolver`
(`src/utils/resolver.ts`) filters it out — **completely silently, with no log
line**. Around 40 of the ~130 configured sources are wasted work on every run.

Meanwhile the newsapi path (`src/pipeline/scrapers/newsapi.ts:35`) never uses
those curated search terms at all — it calls `getNewsSources(t.name)` with the
raw topic name. So `"web development javascript"` is never queried; `"Web
Development"` is.

(Separately: `getNewsSources` queries the **Guardian** Content API, not NewsAPI,
despite the filename, function name, and `type: "newsapi"` tag. And
`newsapi.ts:14` falls back to `?? "test"` for a missing key, which 401s.)

**Fix:** either store the type — `sources Json[]`, or a separate `Source` model
with a `type` column — or split into `rssSources String[]` / `searchTerms
String[]`. Then have `rssScraper` read only the former and `getNewsData` read the
latter.

---

<a id="b-20"></a>

## B-20 · `manual-pipeline.ts` passes `rssSources` where `sources` is expected

**`src/scripts/manual-pipeline.ts:20-23`**

```ts
const topicObjects = topics.map((t) => ({
  name: t.name,
  rssSources: t.sources.filter((s) => s.type === "rss").map((u) => u.value),
}));
// …
const rssArticles = (await rssScraper(topicObjects)) ?? [];
```

`rssScraper` reads `t.sources` (`src/pipeline/scrapers/rss.ts:17`):

```ts
const sources = t.sources!;                                  // undefined
const parsedFeeds = await Promise.allSettled(sources.map(…)); // TypeError
```

`TopicsType.sources` is optional (`src/types/pipeline.ts:33`) and `topicObjects`
is a variable rather than a fresh object literal, so TypeScript's excess-property
check never fires and `tsc` passes. The `!` on line 17 does the rest.

At runtime, `sources.map` throws on every topic. Every throw lands inside the
`Promise.allSettled` on line 15, gets filtered out by `promiseResolver`, and
**the script reports zero RSS articles with no error output whatsoever.**

**Fix:** name the key `sources`. Removing the `!` on `rss.ts:17` in favour of
`t.sources ?? []` would have turned this into a visible empty result instead of
a swallowed crash.

---

<a id="b-21"></a>

## B-21 · `if (!filterArticles.length)` tests the function, not the array

**`src/scripts/manual-pipeline.ts:50-59`**

```ts
const filteredArticles = await filterArticles(deduplicated);

if (!filterArticles.length) {        // ← filterArticles, the imported function
  console.error("No articles left after filtration");
  return { success: false, … };
}
```

`Function.prototype.length` is the arity — `filterArticles` takes one parameter,
so this is `!1` → `false`. **The guard never fires.** The script proceeds with an
empty `filteredArticles`, runs a synthesis pass over nothing, and sends an empty
email.

Off-by-one-character; invisible to `tsc` because both expressions are valid.

**Fix:** `if (!filteredArticles.length)`.

---

<a id="b-22"></a>

## B-22 · Seed transactions race each other, and `finally` always claims success

**`prisma/seed.ts:9`, `:239`, `:312`, `:326-329`**

**Race.** `prisma.$transaction(...)` starts executing the moment it's called —
it isn't deferred until `await`. So `firstSeed` (line 9) and `secondSeed`
(line 239) are **both in flight** before line 312:

```ts
const result = await Promise.allSettled([firstSeed, secondSeed]);
```

`firstSeed` opens with a `deleteMany` for _both_ emails (lines 10-14), including
Maya's. `secondSeed` creates Maya (line 240). The interleaving decides the
outcome:

- delete commits first → Maya created → fine.
- Maya created first, then the delete lands → **Maya is wiped**, and her digest
  cascades away with her.
- Both run concurrently against the same rows → unique-constraint violation on
  `user.email`, or a deadlock.

Non-deterministic across runs, and worse on a re-seed against a populated DB.

**Ordering assumption.** Line 51:

```ts
const [ai, climate, startups] = pritam.topics; // include: { topics: { orderBy: { createdAt: "asc" } } }
```

All three topics are created inside one transaction, and Postgres'
`CURRENT_TIMESTAMP` (what `@default(now())` compiles to) returns the
**transaction start time** — identical for all three rows. `ORDER BY "createdAt"`
over three identical values has no defined tiebreak, so `climate` can land in
the `ai` slot and the seeded digests get attached to the wrong topics.

**False success.** Lines 321-329:

```ts
seedDb()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    console.log("Database was seeded successfully!"); // ← unconditional
    prisma.$disconnect(); // ← not awaited
  });
```

`Promise.allSettled` on line 312 never rejects, so `seedDb()` resolves even when
**both** transactions failed. The `catch` is unreachable and the success banner
always prints. The only signal is the `console.error` on line 316, which is
easily lost in scrollback.

**Also:** seeded users get no `Account` row, so `pritam@distill.local` and
`maya@distill.local` **cannot sign in** — there's no password hash for
better-auth to check. And `src/actions/daily-summary.ts:12` reads
`test_user@devzy.live`, which this seed never creates (that's `add-test-user.ts`),
so `pnpm db:seed` alone leaves the landing page's sample section empty.

**Fix:** `await firstSeed; await secondSeed;` (sequential — they aren't
independent). Order topics by `name` or create them one at a time and capture the
returned rows. Re-throw from `seedDb` when any transaction rejects, and move the
success log into `.then()`.

---

<a id="b-23"></a>

## B-23 · Log out does nothing; menu links are nested inside menu items

**`src/components/account-menu.tsx:56-75`**

```tsx
<DropdownMenuItem className="… text-[#8A3A24] …">
  <LogOut className="size-4" />
  Log out
</DropdownMenuItem>
```

No `onClick`. No `authClient.signOut()`. **There is no way to log out of the
application.** `authClient` is never imported in this file.

The Profile and Settings items (lines 56-68) have the inverse problem — the
`<Link>` is nested _inside_ the `DropdownMenuItem` rather than being what the item
renders:

```tsx
<DropdownMenuItem className={itemClass}>
  <Link href="/profile">…</Link>
</DropdownMenuItem>
```

The item is `role="menuitem"` and owns the padding, focus ring, and keyboard
handling; the anchor is a child covering only the inner content. Clicking the
padded area activates the menu item (closing the menu) without navigating, and
the menu's activation handler can dismiss the item before the anchor's default
navigation runs. Both targets are also dead routes ([B-24](#b-24)).

**Fix:** add an `onClick` that calls `authClient.signOut()` and refreshes. For
the links, use the `render` prop (the pattern already used correctly at
`src/components/ui/dialog.tsx:65`) so the item _becomes_ the anchor:
`<DropdownMenuItem render={<Link href="/settings" />}>`.

---

<a id="b-24"></a>

## B-24 · Five linked routes don't exist

Confirmed against `next build` output — the app has exactly these routes:

```
/  /_not-found  /api/auth/[...all]  /api/digest-articles/[id]  /api/digests
/api/digests/[id]  /api/topics  /api/topics/[id]  /digest/[id]  /onboarding
/signin  /signup
```

Every one of these links 404s:

| Target      | Linked from                                                                   |
| ----------- | ----------------------------------------------------------------------------- |
| `/settings` | `navbar.tsx:60`, `account-menu.tsx:64`, `home.tsx:76`, `digest-email.tsx:111` |
| `/archive`  | `navbar.tsx:53`, `home.tsx:110`                                               |
| `/profile`  | `account-menu.tsx:57`                                                         |
| `/terms`    | `auth.tsx:228`                                                                |
| `/privacy`  | `auth.tsx:235`                                                                |

`/settings` and `/archive` are additionally listed in `proxy.ts:28-29`'s matcher,
so the proxy runs a full `getSession` DB round-trip before serving the 404.

`proxy.ts:34` also matches `"/api/feedback/:path*"`, which doesn't exist either.

The `/settings` link is the worst of these — it's the email footer's "Manage
topics" link _and_ the only escape hatch offered on the empty-state home screen.

**Fix:** build the pages, or remove the links. `/terms` and `/privacy` at minimum
should exist before this collects real signups.

---

---

# 🟡 P2 — Medium

<a id="b-25"></a>

## B-25 · Topic chip colour is nondeterministic and disagrees between card and detail page

**`src/app/(main)/digest/[id]/page.tsx:89-100` vs `src/actions/digest-recent.ts:46-48`**

Two completely different colour algorithms for the same topic:

```ts
// digest-recent.ts (the card) — hash of the first character
accentIndex: [m.topic.name].reduce((acc, curr) => acc + curr.charCodeAt(0), 0) % topicColors.length,

// digest/[id]/page.tsx (the detail page) — position in the user's topic list
const topicIdx = digestDetails.topic.user.topics.findIndex((t) => t.id === digestDetails.topic.id);
```

So a topic renders gold on the home card and olive on its own page.

Three further problems with the detail-page version:

1. **No `ORDER BY`.** `getAllDigests` selects `topic.user.topics` with only
   `{ id: true }` and no ordering (`page.tsx:21-30`). Postgres may return those
   rows in any order, so `topicIdx` — and the colour — **can change between two
   requests for the same page**.
2. **No modulo.** Line 99 is `topicColors[topicIdx]`, unguarded. A user with 6+
   topics gets `undefined` for the 6th onward → `class="… undefined"`.
   `digest-card.tsx:16` gets this right with `accentIndex % topicColors.length`.
3. **No `-1` guard.** `findIndex` returning `-1` also yields `undefined`.

Note the card's own hash is weak too — `[m.topic.name].reduce(...)` builds a
single-element array and sums the first char code of that one string, so it's
just `name.charCodeAt(0) % 5`. "Climate" and "Cybersecurity" collide.

**Fix:** put the colour derivation in one exported helper (hash the whole topic
**id**, apply the modulo, guard `-1`) and call it from both places.

---

<a id="b-26"></a>

## B-26 · Every source on the digest page is labelled with a raw UUID

**`src/app/(main)/digest/[id]/page.tsx:142-150`**

```tsx
{digestDetails.articles.map((source, i) => (
  <li key={source.sourceId} id={`source-${source.sourceId}`} …>
    <span className="mt-0.5 shrink-0 text-xs …">
      {source.sourceId}          {/* ← renders "8f3a2b1c-4d5e-…" */}
    </span>
```

The `i` from the map (line 142) is bound and never used — the styling (`text-xs`,
`shrink-0`, a narrow gutter column) is clearly built for a short ordinal marker.
With pipeline-generated data (`sourceId` = a UUID, see [B-08](#b-08)) a 36-char
string is jammed into that gutter and blows out the layout.

Seeded data renders correctly because the seed uses `"S1"`, `"S2"`, `"S3"`.
Fixing [B-08](#b-08) fixes the display here too.

**Fix:** render `{i + 1}` (or the `S`-form once [B-08](#b-08) lands), and keep
`sourceId` for the anchor target so citation links still resolve.

---

<a id="b-27"></a>

## B-27 · Digest page loads every digest of every user on every request

**`src/app/(main)/digest/[id]/page.tsx:14-45`**

```ts
const getAllDigests = cache(async () => {
  const allDigests = await prisma.digest.findMany({      // no where, no take
    include: {
      articles: true,                                    // every article body
      topic: { select: { name: true, user: { select: { topics: { select: { id: true } } } } }, … },
    },
  });

  const digestLookup = new Map<string, Record<string, any>>();
  allDigests.forEach((d) => { if (!digestLookup.has(d.id)) digestLookup.set(d.id, d); });
  return digestLookup;
});
```

To render one digest, this fetches **the entire `digest` table** — with every
joined `digest_article` row and a nested topic/user/topics join — and builds a
`Map` in memory, just to `.get(id)` one entry.

`react`'s `cache()` dedupes only within a single request (it's used twice:
`generateMetadata` line 57 and the page body line 74), so this is one full table
scan per page view. With a thousand users × a few digests a day × several
articles each, this is tens of thousands of rows per request. It's also a
cross-tenant read, which makes the missing ownership check on line 83 more
consequential than it looks.

The `if (!digestLookup.has(d.id))` guard on line 39 is also dead — `d.id` is the
primary key, so duplicates are impossible.

**Fix:**

```ts
const getDigest = cache(async (id: string) =>
  prisma.digest.findUnique({
    where: { id },
    include: { articles: true, topic: true },
  }),
);
```

---

<a id="b-28"></a>

## B-28 · `errorDecoder` on a string discards the real error message

**`src/context/landing-samples.tsx:28-34`**

```ts
const { error, data } = await getDailySummary();

if (error) {
  const errMsg = errorDecoder(error);   // error is already a string
```

`getDailySummary` returns `{ error: string }` (`src/actions/daily-summary.ts:58-60`,
where `errorDecoder` has _already_ been applied on line 55). Running it through
again:

```ts
// src/utils/error-decoder.ts:2
return error instanceof Error ? error.message : "Unknown error occured";
```

A `string` is not an `Error`, so the real message is replaced by the literal
`"Unknown error occured"` — both in the toast and in the context state that
`sample-landing.tsx` surfaces.

**Fix:** `setError(error); toast.error(error, …)`. `errorDecoder` is for the
`unknown` in a `catch` block, not for a value that's already a string.

---

<a id="b-29"></a>

## B-29 · The same landing error is toasted three times; `getMetadata` fans out from the browser

**`src/context/landing-samples.tsx:33` + `src/components/sample-landing.tsx:11-15, 49-53`**

The provider toasts the error (line 33), and then **both** consumers subscribe to
the same `error` value from context and toast it again:

```tsx
// sample-landing.tsx — identical block in SampleArticles AND SampleSummary
useEffect(() => {
  if (error) toast.error(error);
}, [error]);
```

Both components are mounted simultaneously on the landing page
(`landing.tsx:142` and `:204`), so one failure produces **three stacked toasts**
of `"Unknown error occured"` ([B-28](#b-28)) on the first screen a visitor sees.

Separately, `landing-samples.tsx:38-48` calls `getMetadata` once per article:

```ts
const articles = await Promise.all(data.articles.map(async (a) => {
  const websiteName = await getMetadata(a.url);
```

`landing-samples.tsx` is `"use client"`, so `microlink.io` runs **in the
visitor's browser**, with `createClient()` and no API key — the anonymous free
tier, which is aggressively rate-limited and subject to CORS. On a marketing
page this is N third-party round-trips per visitor to render decorative initials.

Two smaller issues in the rendered output:

- `source: a.url` (line 41) puts a raw URL where the template expects a source
  _name_ — `sample-landing.tsx:30-32` renders it `uppercase tracking-[0.14em]`
  and truncated.
- `initials: websiteName.data?.title?.toString()[0] ?? "U"` (line 43) —
  `microlink.ts:9` types the response as `Metadata` imported **from `"next"`**
  (line 3), which is the page-metadata type and unrelated to microlink's
  response. Next's `Metadata["title"]` can be an object, so `.toString()[0]`
  can yield `"["` from `"[object Object]"`.
- `sample-landing.tsx:76` does `[topic, conflict].map(tag => <span key={tag}>…)`
  — when `conflict` is `null` this renders an empty pill with `key={undefined}`,
  and if both are undefined React warns about duplicate keys.

**Fix:** toast in exactly one place (the provider). Move `getMetadata` server-side
into `getDailySummary` — it's already a server action — or drop it and derive
initials from the URL hostname. Type the microlink response properly.

---

<a id="b-30"></a>

## B-30 · You cannot clear an auth input

**`src/components/auth.tsx:38-66`**

```ts
const onInputChange = useCallback(
  ({ email, password, name }) => {
    if (email) {
      setCredentialsState((s) => ({ ...s, email }));
    } else if (password) {
      setCredentialsState((s) => ({ ...s, password }));
    } else if (name) {
      setCredentialsState((s) => ({ ...s, name }));
    }
  },
  [setCredentialsState],
);
```

Each input calls this with exactly one key (lines 138, 157, 174). The guards test
**truthiness**, so `""` — the value you get from selecting-all and deleting —
falls through every branch and nothing updates.

The stale value stays in state and is what gets submitted. Backspacing to empty
and retyping works (the retyped value is truthy), but clear-and-submit sends the
old text, and clear-and-leave-blank silently submits the pre-clear value.

**Fix:** test presence, not truthiness — `if (email !== undefined)` — or simply
`setCredentialsState(s => ({ ...s, ...patch }))`. Better still, make the inputs
controlled (`value={credentialsState.email}`) so state and DOM can't diverge.

---

<a id="b-31"></a>

## B-31 · `pnpm lint` crashes — ESLint cannot run at all

```
$ npx eslint src
Oops! Something went wrong! :(
ESLint: 10.10.0
TypeError: Error while loading rule 'react/display-name': contextOrFilename.getFilename is not a function
    at resolveBasedir (node_modules/.pnpm/eslint-plugin-react@7.37.5_eslint@10.10.0_jiti@2.7.0_/…/version.js:31:100)
```

`eslint-plugin-react@7.37.5` (pulled in transitively by `eslint-config-next`) is
not compatible with ESLint 10's rule-context API. The crash happens on the first
file, so **zero files are linted** — `package.json:8`'s `"lint": "eslint"` fails
with exit code 2 on every invocation.

This is not cosmetic. It's _why_ several bugs in this document are still here:

- [B-16](#b-16) (bad dependency array) → `react-hooks/exhaustive-deps`
- `digest-recent.ts:38,54`, `page.tsx:142`, `navbar.tsx:73,105`, `seed.ts:268`
  (unused bindings) → `@typescript-eslint/no-unused-vars`
- [B-26](#b-26)'s unused `i` → same rule
- `pipeline/index.ts:154` (`catch (err)` never used) → same rule

**Fix:** pin a compatible pair — either drop to ESLint 9.x, or upgrade
`eslint-config-next` / add a `pnpm.overrides` entry forcing an
`eslint-plugin-react` release with ESLint 10 support. Verify with
`npx eslint src` exiting 0 or 1 (not 2).

---

<a id="b-32"></a>

## B-32 · HTTP status codes are wrong throughout the API

| File:line                              | Condition        | Returns                         | Should be |
| -------------------------------------- | ---------------- | ------------------------------- | --------- |
| `api/topics/route.ts:13`               | no session       | `400`                           | `401`     |
| `api/topics/route.ts:40`               | no session       | `400`                           | `401`     |
| `api/topics/route.ts:49`               | zod parse failed | `403`                           | `400`     |
| `api/topics/[id]/route.ts:13`          | no session       | `400`                           | `401`     |
| `api/topics/[id]/route.ts:21`          | zod parse failed | `403`                           | `400`     |
| `api/topics/[id]/route.ts:64`          | missing id       | `403`                           | `400`     |
| `api/digests/route.ts:12`              | no session       | `400` + `"userId not provided"` | `401`     |
| `api/digest-articles/[id]/route.ts:16` | no session       | `400`                           | `401`     |
| `api/digest-articles/[id]/route.ts:24` | missing id       | `403`                           | `400`     |
| `api/digest-articles/[id]/route.ts:31` | invalid body     | **`402` Payment Required**      | `400`     |
| `api/digest-articles/[id]/route.ts:72` | unauthorised     | **`200`** + error body          | `401`     |

`402 Payment Required` for a malformed request body is the standout. A `200` with
an `error` key is the most dangerous, since any client checking `res.ok` treats
it as success.

Also: the message on `api/digests/route.ts:12` says `"userId not provided"` when
the actual condition is "no session", and `api/topics/route.ts:50` returns
`"invalid data shape: { topicName: string; }"` — a schema description that omits
`sources`. Neither returns the zod issues, so a client can't tell which field
failed.

**Fix:** standardise on `401` unauthenticated / `403` authenticated-but-forbidden
/ `400` malformed, and return `parsed.error.issues` on validation failures.

---

<a id="b-33"></a>

## B-33 · API routes 302-redirect to an HTML page instead of returning 401 JSON

**`src/proxy.ts:12-14`**

```ts
if (!session && !checkPublic) {
  return NextResponse.redirect(new URL("/signin", request.url));
}
```

`checkPublic` only covers `/signin` and `/signup` (line 4), so every matched
`/api/*` path — `/api/topics`, `/api/topics/:path*`, `/api/digests`,
`/api/digest-articles/:path*` (lines 30-33) — gets a **302 to an HTML login
page** when unauthenticated.

`fetch` follows redirects by default, so a client calling these endpoints gets
`200 OK` with `Content-Type: text/html` and the sign-in page markup. Any
`await res.json()` then throws `SyntaxError: Unexpected token '<'` — an error
that points nowhere near the actual cause.

It also breaks non-GET verbs: a 302 response to a `PATCH` is re-issued as a `GET`
per the fetch spec, so the request is silently converted rather than rejected.

**Fix:** branch on the path in the proxy —

```ts
if (!session && pathName.startsWith("/api/")) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

---

<a id="b-34"></a>

## B-34 · `/api/digests/:path*` is missing from the proxy matcher

**`src/proxy.ts:24-35`**

```ts
matcher: [
  "/signin", "/signup", "/onboarding", "/archive", "/settings",
  "/api/topics/:path*",          // ← wildcard present
  "/api/topics",
  "/api/digests",                // ← exact only, NO wildcard
  "/api/digest-articles/:path*", // ← wildcard present
  "/api/feedback/:path*",        // ← route doesn't exist
],
```

`/api/topics` and `/api/digest-articles` each get both an exact and a wildcard
entry. `/api/digests` gets only the exact form, so **`/api/digests/[id]` is not
matched by the proxy**.

That's the same route that has no in-handler session check ([B-04](#b-04)). The
two gaps line up exactly, which is how the hole stayed open — the wildcard
pattern was copied for two of three siblings.

**Fix:** add `"/api/digests/:path*"`. And fix [B-04](#b-04) regardless — the
proxy is defence in depth, not the authorisation boundary. The Next.js 16 proxy
docs are explicit that proxy code "can run outside of your application's main
runtime", so it must not be the only check.

Also drop the dead `/api/feedback/:path*`, `/archive`, and `/settings` entries
until those routes exist ([B-24](#b-24)) — each one costs a `getSession` DB
round-trip on the way to a 404.

---

<a id="b-35"></a>

## B-35 · `revalidatePath` is given an article id where a digest id belongs

**`src/actions/reaction.ts:37`**

```ts
revalidatePath(`/digest/${articleId}`);
```

The dynamic segment in `/digest/[id]` is a **digest** id (`page.tsx:74` looks it
up in a digest-keyed map). `articleId` is a `DigestArticle.id`. The path being
invalidated corresponds to no real page, and the page the user is actually
looking at — the digest containing that article — is never revalidated.

In practice the optimistic update in `reaction.tsx:22` masks it until a hard
reload, at which point the stale cached page can show the old reaction state.

**Fix:** pass the digest id down to `ReactionsSection` (it's right there at
`page.tsx:74`) and revalidate that. `revalidatePath("/digest/[id]", "page")`
would also work if you'd rather invalidate the whole segment.

---

<a id="b-36"></a>

## B-36 · `getDailySummary` returns a `data` object full of `undefined`

**`src/actions/daily-summary.ts:39-53`**

```ts
const lastDigest = result?.digests[0];

return {
  data: {
    topic:    lastDigest?.topic.name!,     // undefined, typed as string
    headline: lastDigest?.headline!,       // undefined, typed as string
    articles: lastDigest?.articles.map(…) ?? [],
    conflict: lastDigest?.conflict!,       // undefined OR null, typed as string
    summaryPoints: lastDigest?.articles.map(a => a.oneLine) ?? [],
  },
};
```

When no digest exists — no `test_user@devzy.live` row, or that user has no
digests — this still returns a **populated-looking** `data` object whose fields
are all `undefined`. The `!` assertions on lines 43, 44, and 50 hide it from
`tsc`; `SampleOtherDataType` (`src/types/digest.ts:21-26`) declares all three as
non-nullable `string`.

The consumer checks `if (data && data.articles.length > 0)`
(`landing-samples.tsx:37`), so it happens to bail out — but `conflict` can be
legitimately `null` even on a _successful_ fetch (the schema allows it,
`prisma/schema.prisma:49`), which produces the empty chip described in
[B-29](#b-29).

Two more issues here:

- **Over-fetch.** The query selects **all** of the user's digests with **all**
  their articles (lines 14-35) and then uses `[0]`. Add `take: 1`.
- **Wasteful mapping.** Lines 46-49 spread each article and then set
  `oneLine: undefined` to strip it — while line 51 maps the same array again to
  collect those very `oneLine` values. Just don't select it twice.

**Fix:** return `{ error: "No sample digest available" }` when `lastDigest` is
undefined, drop the `!` assertions, and make `conflict` `string | null` in the
type.

---

<a id="b-37"></a>

## B-37 · Digest generation has no pending state — double-click runs the pipeline twice

**`src/components/home.tsx:19-47, 68-73`**

```tsx
<Button onClick={onGenerate} className="…">
  Generate first digest
</Button>
```

No `disabled`, no `useTransition`, no ref guard. `onGenerate` awaits
`generateFirstDigest`, which runs the **entire pipeline** — dozens of outbound
fetches, several LLM calls, DB writes, and an email send. On a typical topic set
that's minutes.

During which:

- The button stays live. Every click starts another full run.
- Concurrent runs race in `addDigestsToRepo`; `SeenArticle` has
  `@@unique([urlHash, userId])` and `skipDuplicates: true` (`digest-repository.ts:74`)
  so that write survives, but nothing prevents duplicate `Digest` rows
  ([B-41](#b-41)) — you get two digests for the same topic, same day, and two
  emails.
- Thanks to [B-14](#b-14) the "Generating..." toast never clears and no
  success/error toast ever appears, so the user has no signal that anything is
  happening — which is precisely what makes them click again.

There's also a **serverless timeout** problem: a Next.js server action on Vercel
defaults to 60s (300s on Pro). A multi-minute pipeline will be killed mid-flight,
leaving partial digests written and no email sent.

The guard on lines 20-23 is dead code — it returns early when
`currDigests.length > 0`, but the button only renders inside the
`currDigests.length === 0` branch (line 57).

**Fix:** wrap in `useTransition` and set `disabled={isPending}`. For the timeout,
move the pipeline to a queued background job and have the action only enqueue it.

---

<a id="b-38"></a>

## B-38 · Reaction failures surface as an unhandled rejection

**`src/components/reaction.tsx:19-31` + `src/actions/reaction.ts:22, 50`**

The action throws on both failure paths:

```ts
if (!session || !session.user) throw new Error("User not authenticated");
// …
} catch (err) { console.error(message); throw new Error(message); }
```

The client never catches:

```ts
startTransition(async () => {
  setOptimisticReaction(newReaction);
  const updated = await updateReaction({ reaction: newReaction, articleId });
  if (updated.success) console.log("reaction updated successfully");
});
```

No `try`/`catch`. A rejection inside the `startTransition` async callback
propagates to the nearest error boundary — and there is **no `error.tsx`** in the
route tree — so the user gets Next's default error screen (or, in production, a
blank one) for a thumbs-up click.

The likeliest trigger is routine: the session expires while the page is open.

The optimistic update is also never rolled back, so if the boundary is ever added
the UI would still show the failed reaction as applied.

**Fix:** wrap the await in `try`/`catch`, toast the failure, and let React revert
the optimistic value. Add an `error.tsx` boundary for the `(main)` segment while
you're there. The `console.log` on line 29 should come out too.

---

<a id="b-39"></a>

## B-39 · Share dialog: broken SSR guard, stale URL, unguarded clipboard, dead buttons

**`src/components/digest-share.tsx`**

**Line 111 — the guard is always false:**

```ts
if (typeof navigator === undefined) {
  return;
}
```

`typeof` returns the **string** `"undefined"`, never the `undefined` value. This
comparison is always `false`, so the guard never fires. (It's also moot in an
`onClick`, but the intent was clearly SSR-safety.)

**Line 34 — missing dependency:**

```ts
const fullUrl = useMemo(() => `${baseUrl}${pathName}`, [baseUrl]);
```

`pathName` (from `usePathname()`, line 32) is used but not listed. `baseUrl` is a
constant prop, so the memo never recomputes — after a client-side navigation to a
different digest, the dialog still offers the **previous** digest's URL.

**Lines 36-43 — unguarded `ClipboardItem`:**

```ts
const clipboardItem = new ClipboardItem({ "text/plain": text });
await navigator.clipboard.write([clipboardItem]);
```

No `try`/`catch`. `ClipboardItem` and `navigator.clipboard.write` are unavailable
on non-secure origins and in some browsers; the rejection is unhandled, and
`toast.success("Copied digest url")` on line 116 never runs — so a failed copy
looks identical to nothing happening. `navigator.clipboard.writeText(text)` has
far wider support and is all that's needed for plain text.

**Lines 130-143 — three dead buttons:** Twitter, WhatsApp, and Email all render
with full styling and **no `onClick`**.

**Line 52 — stray `DialogClose`:** rendered as a direct child of `Dialog`,
outside `DialogContent`, so it's an always-visible empty button floating above
the footer.

**Lines 90-108 — the input fights the user:** `readOnly` with `value={value}`,
where `onFocus` sets the value to the URL and `onBlur` clears it back to `""`,
while the `placeholder` shows a truncated `fullUrl.slice(0, 40) + "..."`. Field
contents vanish on blur.

**Fix:** delete the `typeof` guard, add `pathName` to the deps, switch to
`writeText` in a `try`/`catch` with an error toast, wire or remove the three
share buttons, move `DialogClose` inside `DialogContent`, and make the input a
plain `readOnly` field with `value={fullUrl}`.

---

<a id="b-40"></a>

## B-40 · `unsubscribeUrl` is hardcoded to an empty string

**`src/pipeline/index.ts:148`, `src/scripts/manual-pipeline.ts:117`**

```ts
unsubscribeUrl: "",
```

Which renders as `<a href="">Unsubscribe</a>` (`digest-email.tsx:115`) — an empty
href resolves to the _current document_, so in an email client it does nothing or
reloads the message.

There is no unsubscribe mechanism anywhere: no token, no route, and no column on
`User` to record the preference. `pipeline()` (`src/pipeline/index.ts:24-26`)
selects **every** user unconditionally and emails all of them.

Beyond the UX problem, a functioning unsubscribe link is a legal requirement for
commercial email under CAN-SPAM, and a practical one for staying out of spam
folders — bulk senders increasingly require `List-Unsubscribe` headers.

**Fix:** add an `unsubscribedAt DateTime?` (or `emailOptIn Boolean @default(true)`)
column, filter it in `pipeline()`'s `findMany`, add a signed-token
`/unsubscribe` route, and set the `List-Unsubscribe` and
`List-Unsubscribe-Post` headers on the Resend call.

---

<a id="b-41"></a>

## B-41 · Schema: missing FK indexes, unbounded `seen_article`, no duplicate-digest constraint

**`prisma/schema.prisma`**

**1. No indexes on foreign keys.** Postgres does _not_ auto-index FK columns.
`Session` and `Account` both have `@@index([userId])` (lines 100, 123) — but the
app's own hot tables don't:

| Model           | Unindexed                        | Query that needs it                                           |
| --------------- | -------------------------------- | ------------------------------------------------------------- |
| `Digest`        | `userId`, `topicId`, `createdAt` | `digest-recent.ts:15-22` filters `userId` + `createdAt` range |
| `DigestArticle` | `digestId`, `userId`             | every `include: { articles: true }`                           |
| `SeenArticle`   | `userId`                         | `deduplicate.ts:11-15` fetches all rows per user, per run     |

`getDigests` is on the home page's critical path and currently does a sequential
scan of `digest` on every load.

**2. `seen_article` grows forever.** There's an `@@index([seenAt])` on line 88 —
and nothing in the codebase ever queries, sorts, or prunes by `seenAt`. The index
exists for a retention job that was never written. Meanwhile
`deduplicate.ts:11-15` loads **every** seen article for the user on every run:

```ts
const seenArticlesFetched = await prisma.seenArticle.findMany({
  where: { userId },
});
```

with no `select` (so it pulls `id`, `title`, and `seenAt` it never uses) and no
date window. After a year of daily runs that's thousands of rows per user, read
in full, to build a `Set` of hashes.

**3. Nothing prevents duplicate digests.** No unique constraint on
`(userId, topicId, <day>)`. Two pipeline runs on the same day — or two clicks of
the button ([B-37](#b-37)) — create duplicate digests for the same topic. The
only guard is the UI check in `home.tsx:20`.

**4. Smaller items:**

- `Digest` has `createdAt` but no `updatedAt`, unlike every other model.
- `Topic.updatedAt` (line 39) carries both `@default(now())` _and_ `@updatedAt`,
  which no other model does.
- `User` has no `timezone`, though the pipeline is described as "each morning"
  and [B-43](#b-43) hardcodes UTC day boundaries.

**Fix:** add `@@index([userId, createdAt])` to `Digest`, `@@index([digestId])`
and `@@index([userId])` to `DigestArticle`, `@@index([userId])` to `SeenArticle`.
Add `select: { urlHash: true }` and a `seenAt: { gte: ninetyDaysAgo }` window to
the dedupe query, plus a prune job. Add
`@@unique([userId, topicId, createdAt])` or a date-truncated equivalent.

---

<a id="b-42"></a>

## B-42 · Users with no topics still trigger a paid LLM call

**`src/pipeline/index.ts:24-26` → `src/pipeline/filter.ts:57-107`**

```ts
const users = await prisma.user.findMany({
  select: { id: true, topics: true, email: true, name: true },
}); // every user, unconditionally
```

No filter on having topics, on `emailVerified`, or on any opt-out. For a user
with zero topics the chain is:

`getArticles([])` → `[]` → `removeDuplicates` → `[]` → `filterArticles([])` →
`scoredGroups = []` → `shortlisted = []` → **`rateRelevancy([])`**.

And `rateRelevancy` has no early return (`filter.ts:38-48`):

```ts
const userPrompt = buildRelevancyUserPrompt(groups);   // "\n\nRate each article's relevance…"
const { output } = await generateText({ model: customOpenAI("gpt-5-nano"), … });
```

A `gpt-5-nano` request is issued with an essentially empty prompt, for every
empty user, on every nightly run. It either returns an empty array or fails
schema validation and throws — which `filter.ts:114` catches and logs as
_"Relevancy rating failed; falling back to keyword ranking"_, a misleading
message for a run that had nothing to rank.

The seeded `test_user@devzy.live` and any signup that abandons onboarding are
both in this bucket.

**Fix:** `where: { topics: { some: {} } }` on the `findMany`, plus a
`if (!groups.length) return [];` guard at the top of `rateRelevancy` and
`filterArticles`.

---

<a id="b-43"></a>

## B-43 · Day boundaries are hardcoded UTC; card dates render as ISO strings

**`src/actions/digest-recent.ts:10-13, 44`**

```ts
const timeNow = new Date();
timeNow.setUTCHours(0, 0, 0, 0);
const yesterday = new Date(timeNow.getTime() - 86_400_000);
const tomorrow = new Date(timeNow.getTime() + 86_400_000);
```

"Today" and "Yesterday" on the home page are UTC days. For the project's own
apparent timezone (IST, UTC+5:30), a digest generated by the 02:00 UTC cron
(`src/scripts/cron.ts:8`) lands at 07:30 IST — fine — but anything after 05:30
IST rolls into the _next_ UTC day and shows under the wrong heading. For a US
user (UTC-5 to -8) the "Today" section is empty for most of their waking day.

`User` has no `timezone` column to fix this with ([B-41](#b-41)).

Hardcoding `86_400_000` also ignores DST — in zones that observe it, "yesterday"
is 23 or 25 hours once a year.

**Date formatting** — `digest-recent.ts:44`:

```ts
date: m.createdAt.toISOString().split("T")[0],    // "2026-09-15"
```

But `DigestCardProps.date` documents the expected format
(`src/types/digest.ts:10`):

```ts
date: string; // "Jun 10" or "Today"
```

So the card renders `2026-09-15` where the design calls for `Today`.
`digest-email.tsx` gets this right with `Intl.DateTimeFormat` (line 26), and the
digest page uses `toLocaleDateString("en-GB", …)` (page.tsx:110) — three
different date formats across three surfaces.

**Also in this action:** `isUnread: true` is hardcoded on lines 45 and 61 — there
is no read-tracking anywhere, so every digest shows the unread accent bar forever.
`consensus` is set on lines 40 and 56 but isn't part of `DigestCardProps`, so it's
serialised across the RSC boundary and discarded. The `i` parameter is bound in
both `.map()`s (lines 38, 54) and never used. And the two `.map()` bodies are
byte-identical — worth extracting.

**Fix:** store a timezone per user and compute boundaries with `date-fns-tz`
(already a dependency, currently unused). Format dates in the component with a
`"Today" / "Yesterday" / "Jun 10"` helper shared across all three surfaces.

---

<a id="b-44"></a>

## B-44 · `add-test-user.ts` swallows its error and then reports it as success

**`src/scripts/add-test-user.ts:32-45`**

```ts
} catch (err) {
  return errorDecoder(err);       // ← returns the message as the "id"
}
// …
addTestUser()
  .then((res) => {
    console.log(`Test user of ID ${res} was added`);
    process.exit(0);              // ← always exit 0
  })
  .catch((err) => { … process.exit(1); });   // ← unreachable
```

The `catch` converts a failure into a resolved string, so the promise never
rejects, the `.catch` is dead, and a failed run prints:

```
Test user of ID Unique constraint failed on the fields: (`email`) was added
```

…and exits **0**. In CI that's a green build over a failed seed.

**Also:** line 1 is `"use server"` on a standalone CLI script. It doesn't break
`tsx` execution, but the directive means _"every export in this file is a
publicly callable server action"_ — so if this module is ever imported from the
app (even transitively), `addTestUser` becomes an unauthenticated public endpoint
that creates database rows.

And there's no `await prisma.$disconnect()` — `process.exit(0)` just tears the
process down with the connection open.

**Fix:** drop the `catch` (or re-throw), drop the `"use server"`, and
`await prisma.$disconnect()` before exiting.

---

---

# ⚪ P3 — Cleanup

<a id="b-45"></a>

## B-45 · The entire `src/app/api/*` surface is unreachable from the frontend

Nothing in `src/` calls these routes:

```
$ grep -rn "fetch(" src
src/pipeline/scrapers/extractor.ts:32:      await fetch(url, {      ← the only fetch, and it's outbound
```

No `fetch("/api/…")`, no `axios` against a relative path, no TanStack Query, no
SWR. `src/app/api/topics`, `/api/topics/[id]`, `/api/digests`, `/api/digests/[id]`,
and `/api/digest-articles/[id]` are referenced **only** by `proxy.ts`'s matcher.
The app reaches the database exclusively through server components and the five
server actions in `src/actions/`.

So five publicly-reachable, internet-facing endpoints — three of which have
authorisation holes ([B-04](#b-04), [B-05](#b-05), [B-06](#b-06)) — exist purely
as attack surface with no callers.

`/api/digest-articles/[id]`'s `PATCH` duplicates `src/actions/reaction.ts`, and
`/api/topics`' `GET` duplicates what a server component can query directly.

**Fix:** delete them, or — if they're meant as a public/mobile API — fix the
authorisation, fix the status codes ([B-32](#b-32)), and version them. Leaving
them as unused-but-exposed is the worst of both options.

---

<a id="b-46"></a>

## B-46 · Twelve unused dependencies; build tooling shipped to production

Verified by grepping every import site in `src/` and `prisma/`:

**Zero imports — safe to remove:**

`lodash` · `@types/lodash` · `es-toolkit` · `fastest-levenshtein` · `clsx` ·
`tailwind-merge` · `@ai-sdk/anthropic` · `html-react-parser` · `react-from-dom` ·
`bcrypt` · `@types/bcrypt` · `date-fns` · `date-fns-tz` · `@rtcoder/string-to-color`

Notes on a few:

- `clsx` + `tailwind-merge` are superseded by the `cn` package
  (`src/components/ui/*.tsx` all `import { cn } from "cn"`).
- `lodash` **and** `es-toolkit` are both present and both unused.
- `fastest-levenshtein` **and** `string-comparison` overlap; only the latter is
  used (`src/pipeline/deduplicate.ts:2`).
- `bcrypt` is a leftover from hand-rolled auth — migration
  `20260914074630_fixing_user_schema` drops `user.password`, and better-auth
  handles hashing now.
- `date-fns-tz` is unused but is exactly what [B-43](#b-43) needs. Keep it.

**Imported only by dead files:**

- `openai` → only `src/lib/openai.ts`, which nothing imports.
- `@anthropic-ai/sdk` → only `src/lib/anthropic.ts`, which nothing imports.
  That file constructs `new Anthropic({ apiKey: process.env["ANTHROPIC_API_KEY"] })`
  at module scope, and `ANTHROPIC_API_KEY` isn't in `.env.example` — so the first
  import of this file throws. A live landmine.

**In `dependencies` but build-time only** (`package.json:29,30,50,53`):

`eslint` · `eslint-config-next` · `prisma` · `shadcn`

These belong in `devDependencies`. `prisma` (the CLI) is arguably needed for
`postinstall: prisma generate` on some hosts, but the other three inflate the
production install for nothing.

**Also:** `.env.example:12` has a typo — `GITHUBN_CLIENT_SECRET` (stray N). Both
`GITHUB_*` vars are unused anyway; `src/lib/auth.ts:15-20` only configures Google.

---

<a id="b-47"></a>

## B-47 · Dead files, dead fields, duplicate CSS keys, a11y nits

**Dead files** (zero importers):

| File                               | Note                                                                               |
| ---------------------------------- | ---------------------------------------------------------------------------------- |
| `src/lib/openai.ts`                | superseded by `src/lib/custom-openai.ts`                                           |
| `src/lib/anthropic.ts`             | throws on import if `ANTHROPIC_API_KEY` is unset                                   |
| `src/emails/components/button.tsx` | never imported                                                                     |
| `src/components/ui/field.tsx`      | only importer of `ui/label.tsx` + `ui/separator.tsx`, which are otherwise dead too |

**Dead code paths:**

- `src/pipeline/scrapers/newsapi.ts:9` — `getNewsSources`' default parameter
  `"artificial intelligence"` is never used; the only caller always passes
  `t.name` (line 35).
- `src/app/(main)/digest/[id]/page.tsx:39` — `if (!digestLookup.has(d.id))` can
  never be false; `d.id` is the primary key.
- `src/components/home.tsx:20-23` — early return on `currDigests.length > 0`,
  inside a branch that only renders when it's `0`.
- `src/pipeline/scrapers/concurrency-limiter.ts:9` — `if (limiter <= 0) return null`
  returns `null` from a function typed `ArticleType[] | null`, forcing `?? []`
  at all three call sites. Returning `[]` would remove the need.
- `src/pipeline/index.ts:154` — `catch (err)` binds a variable it never uses
  (see also [B-18](#b-18)).

**Unused bindings** (all of these would be caught by lint if [B-31](#b-31) were
fixed): `digest-recent.ts:38,54` (`i`), `page.tsx:142` (`i`), `navbar.tsx:73,105`
(`auth` in `MarketingVariant`), `seed.ts:268` (`d1` in `secondSeed`),
`manual-pipeline.ts:130` (`r`).

**Duplicate keys in `@theme inline`** — `src/app/globals.css`:

```css
--font-sans: var(--font-sans); /* line 11 */
--font-heading: var(--font-sans); /* line 12 */
--font-mono: var(--font-geist-mono); /* line 13 */
/* … 36 lines later … */
--font-sans: var(--font-sans); /* line 50 — duplicate */
--font-mono: var(--font-geist-mono); /* line 51 — duplicate */
--font-heading: var(--font-serif); /* line 52 — CONTRADICTS line 12 */
```

Last declaration wins, so `--font-heading` resolves to serif. The sans value on
line 12 is silently overridden — harmless today, confusing tomorrow.

**Accessibility / semantics:**

- `src/components/navbar.tsx:18` wraps the whole navbar in `<main>`. Every page
  also renders its own `<main>` (`page.tsx`, `onboarding/page.tsx`,
  `digest/[id]/page.tsx`, `auth.tsx`, `landing.tsx`), so **every page has two
  `<main>` landmarks** and the first one is a navbar. Should be `<header>` or a
  plain `<div>`; the `<nav>` inside is already correct.
- `src/components/navbar.tsx:46` — `aria-current="page"` is hardcoded on the Home
  link, so screen readers announce Home as the current page from every route.
- `src/components/consensus-conflict.tsx:26-31` — in-page anchor
  (`href="#source-…"`) with `target="_blank"`; see [B-08](#b-08).
- `src/components/auth.tsx:136-179` — inputs have no `name`, no `required`, no
  `autoComplete`; password managers can't fill them, and the "At least 8
  characters" hint on line 182 isn't enforced client-side.

**Type lies worth cleaning up** (each one currently hides a real bug from `tsc`):

| File:line                   | The lie                                                                    |
| --------------------------- | -------------------------------------------------------------------------- |
| `daily-summary.ts:43,44,50` | `!` on values that are genuinely `undefined` ([B-36](#b-36))               |
| `digest/[id]/page.tsx:74`   | `as Digest & {…}` on a `.get()` that returns `undefined` ([B-12](#b-12))   |
| `topic-chooser.tsx:87`      | `!` on a `logicHandler` that returns `undefined` ([B-15](#b-15))           |
| `rss.ts:17`                 | `t.sources!` on an optional field ([B-20](#b-20))                          |
| `pipeline/index.ts:62,63`   | `art.title!`, `art.url!` on optional fields                                |
| `utils/microlink.ts:3`      | `Metadata` imported from `"next"` for a microlink response ([B-29](#b-29)) |
| `types/pipeline.ts:41-54`   | `DigestRepoType` is declared but never used anywhere                       |

---

---

## Suggested order of attack

**First — stop the bleeding (a few hours, unblocks everything else):**

1. [B-01](#b-01) + [B-02](#b-02) — email/password auth doesn't work at all. Nothing else can be tested end-to-end until this is fixed.
2. [B-31](#b-31) — get ESLint running. It would have caught [B-16](#b-16) and most of [B-47](#b-47) for free, and it guards everything you fix after this.
3. [B-15](#b-15) — new users hit a crash on the onboarding page ~1 time in 15.

**Second — close the security holes (half a day):**

4. [B-03](#b-03) — unauthenticated pipeline trigger. Highest blast radius: IDOR + arbitrary email send + unbounded cost.
5. [B-07](#b-07) — SSRF. Needs URL validation _and_ a private-IP check that survives redirects.
6. [B-04](#b-04) / [B-05](#b-05) / [B-06](#b-06) / [B-34](#b-34) — or just delete the API routes entirely ([B-45](#b-45)), which closes all four at once since nothing calls them.

**Third — make the product actually produce correct output (a day):**

7. [B-08](#b-08) + [B-09](#b-09) — fix both with one shared `S`-ordinal scheme. This is the core value proposition: citations that resolve and sources ranked by relevance.
8. [B-10](#b-10) + [B-11](#b-11) — a two-line select fix and a one-word href fix; together they repair the email, which is the primary delivery channel.
9. [B-17](#b-17) + [B-18](#b-18) — subject lines and knowing whether sends succeeded.

**Fourth — the visible polish (a day):**

10. [B-13](#b-13) — one line of CSS resurrects the dark theme the whole app was already written for.
11. [B-14](#b-14) — users currently get no feedback at all from the generate button.
12. [B-12](#b-12), [B-23](#b-23), [B-24](#b-24), [B-25](#b-25), [B-26](#b-26) — 500s, no logout, dead links, wrong colours, UUIDs in the layout.

Everything else is P2/P3 and can be picked off opportunistically. [B-41](#b-41)
(indexes) is worth doing before you have real traffic rather than after.
