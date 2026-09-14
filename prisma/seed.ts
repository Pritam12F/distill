import "dotenv/config";
import { hashUrl } from "@/services/pipeline/hasher";
import { prisma } from "@/lib/prisma";

const DAY = 24 * 60 * 60 * 1000;
const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000);

async function seedDb() {
  const firstSeed = prisma.$transaction(async (tx) => {
    await tx.user.deleteMany({
      where: {
        email: { in: ["pritam@distill.local", "maya@distill.local"] },
      },
    });

    const pritam = await tx.user.create({
      data: {
        email: "pritam@distill.local",
        name: "Pritam",
        password: "seeded-not-a-real-hash",
        emailVerified: true,
        topics: {
          create: [
            {
              name: "Artificial intelligence",
              sources: [
                "https://techcrunch.com/category/artificial-intelligence/feed/",
                "https://www.technologyreview.com/feed/",
                "https://simonwillison.net",
              ],
            },
            {
              name: "Climate tech",
              sources: [
                "https://reneweconomy.com.au/feed/",
                "https://www.pv-magazine.com/feed/",
              ],
            },
            {
              name: "Startups",
              sources: [
                "https://inc42.com/feed/",
                "https://entrackr.com/feed/",
              ],
            },
          ],
        },
      },
      include: { topics: { orderBy: { createdAt: "asc" } } },
    });

    const [ai, climate, startups] = pritam.topics;

    const d1 = await tx.digest.create({
      data: {
        userId: pritam.id,
        topicId: ai.id,
        headline:
          "OpenAI's reasoning model overtakes Google on coding benchmarks",
        consensus:
          "Three of the four sources report the same headline result: a 4–7% improvement on HumanEval over the previous best, with the gain holding across two independent evaluations run outside the lab that produced it. [S1][S3] Coverage agrees the improvement is concentrated in multi-step problems rather than single-function completions, which is the harder and more commercially interesting case. [S1][S4]",
        conflict:
          "[S2] reports training costs fell sharply this cycle, while [S4] cites people familiar with the budget saying costs rose roughly 30% year over year. Neither figure has been independently verified.",
        signal:
          "If the multi-step gains hold outside benchmarks, autonomous coding agents become viable six to twelve months earlier than most roadmaps assume.",
        articles: {
          create: [
            {
              userId: pritam.id,
              sourceId: "S1",
              title:
                "Independent evaluation reproduces the coding benchmark gain",
              url: "https://arstechnica.com/example-one",
              oneLine:
                "The clearest look at how the result was verified outside the lab.",
              publishedAt: hoursAgo(6),
              reaction: "LIKE",
            },
            {
              userId: pritam.id,
              sourceId: "S2",
              title: "Training costs fell sharply this cycle, company says",
              url: "https://theverge.com/example-two",
              oneLine: "The claim the rest of the coverage is arguing about.",
              publishedAt: hoursAgo(9),
              reaction: null,
            },
            {
              userId: pritam.id,
              sourceId: "S3",
              title:
                "What the HumanEval numbers actually measure, and what they quietly leave out of the final reported score",
              url: "https://reuters.com/example-three",
              oneLine:
                "Useful if you want to know how much the benchmark is actually worth.",
              publishedAt: hoursAgo(20),
              reaction: "DISLIKE",
            },
            {
              userId: pritam.id,
              sourceId: "S4",
              title:
                "Enterprise buyers are already rewriting procurement timelines",
              url: "https://ft.com/example-four",
              oneLine:
                "Where the benchmark result turns into budget decisions.",
              publishedAt: null,
              reaction: null,
            },
          ],
        },
      },
      include: {
        articles: {
          select: {
            url: true,
            title: true,
          },
        },
      },
    });

    // Today — no conflict, only 2 articles. The common case in production.
    const d2 = await tx.digest.create({
      data: {
        userId: pritam.id,
        topicId: climate.id,
        headline:
          "Battery storage costs fall below $100/kWh for the first time",
        consensus:
          "Both sources put the figure in the same range and attribute the drop to manufacturing scale rather than a chemistry breakthrough. [S1][S2] Neither expects the trend to reverse within the next two quarters.",
        conflict: null,
        signal:
          "Grid interconnection queues, not cell prices, are now the binding constraint on deployment.",
        articles: {
          create: [
            {
              userId: pritam.id,
              sourceId: "S1",
              title: "Storage crosses the hundred dollar line",
              url: "https://reneweconomy.com.au/example-one",
              oneLine: "The number everyone else is citing this week.",
              publishedAt: hoursAgo(4),
              reaction: null,
            },
            {
              userId: pritam.id,
              sourceId: "S2",
              title: "Why manufacturing scale beat the chemistry breakthrough",
              url: "https://pv-magazine.com/example-two",
              oneLine: "Explains the mechanism behind the price drop.",
              publishedAt: hoursAgo(18),
              reaction: null,
            },
          ],
        },
      },
      include: {
        articles: {
          select: {
            url: true,
            title: true,
          },
        },
      },
    });

    // Yesterday — populates the home page's second section.
    const d3 = await tx.digest.create({
      data: {
        userId: pritam.id,
        topicId: startups.id,
        createdAt: new Date(Date.now() - DAY),
        headline: "Indian fintech funding hits an eighteen-month high",
        consensus:
          "Sources agree the quarter's total is the strongest since early 2025, driven by three late-stage rounds rather than broad early-stage activity. [S1][S2]",
        conflict:
          "[S1] frames this as a genuine recovery, while [S2] argues the concentration in three deals makes it a statistical artefact.",
        signal:
          "Seed-stage volume is still flat, so this is not yet a signal for founders raising a first round.",
        articles: {
          create: [
            {
              userId: pritam.id,
              sourceId: "S1",
              title: "Fintech leads a quiet recovery in Indian venture funding",
              url: "https://inc42.com/example-one",
              oneLine: "The optimistic read on the quarter's numbers.",
              publishedAt: hoursAgo(28),
              reaction: null,
            },
            {
              userId: pritam.id,
              sourceId: "S2",
              title: "Three deals do not make a recovery",
              url: "https://entrackr.com/example-two",
              oneLine: "The counterargument, with the deal-level breakdown.",
              publishedAt: hoursAgo(33),
              reaction: null,
            },
          ],
        },
      },
      include: {
        articles: {
          select: {
            url: true,
            title: true,
          },
        },
      },
    });

    // Hashing URLs
    const hasehedURLs = [...d1.articles, ...d2.articles, ...d3.articles].map(
      (a) => ({ urlHash: hashUrl(a.url), title: a.title }),
    );

    const seenArticles = await Promise.allSettled(
      hasehedURLs.map(({ title, urlHash }) => {
        return tx.seenArticle.create({
          data: { urlHash: urlHash, userId: pritam.id, title },
          select: {
            id: true,
            title: true,
          },
        });
      }),
    );

    seenArticles.forEach((a, i) => {
      if (a.status === "rejected") {
        console.error(
          `No. ${i + 1} article failed to get hashed because: ${a.reason}`,
        );
      }
    });
  });

  const secondSeed = prisma.$transaction(async (tx) => {
    const maya = await tx.user.create({
      data: {
        email: "maya@distill.local",
        name: "Maya",
        password: "seeded-not-a-real-hash",
        emailVerified: true,
        topics: {
          create: [
            {
              name: "Geopolitics",
              sources: [
                "https://foreignpolicy.com/feed/",
                "https://www.foreignaffairs.com/rss.xml",
              ],
            },
            {
              // Same topic name as Pritam. The @@unique is on [userId, name],
              // so this is allowed — worth confirming it doesn't collide.
              name: "Artificial intelligence",
              sources: ["https://www.technologyreview.com/feed/"],
            },
          ],
        },
      },
      include: { topics: { orderBy: { createdAt: "asc" } } },
    });

    const [geo] = maya.topics;

    const d1 = await tx.digest.create({
      data: {
        userId: maya.id,
        topicId: geo.id,
        headline: "Export controls are reshaping semiconductor supply chains",
        consensus:
          "Both sources describe the same shift: manufacturers are duplicating capacity across jurisdictions rather than optimising for cost. [S1][S2]",
        conflict: null,
        signal:
          "Expect lead times to lengthen before they shorten, even as total capacity rises.",
        articles: {
          create: [
            {
              userId: maya.id,
              sourceId: "S1",
              title: "The quiet reindustrialisation of chip manufacturing",
              url: "https://foreignpolicy.com/example-one",
              oneLine: "The structural argument, with the capacity numbers.",
              publishedAt: hoursAgo(7),
              reaction: null,
            },
            {
              userId: maya.id,
              sourceId: "S2",
              title: "Duplication is the new efficiency",
              url: "https://foreignaffairs.com/example-two",
              oneLine: "Why firms are accepting higher costs on purpose.",
              publishedAt: hoursAgo(15),
              reaction: null,
            },
          ],
        },
      },
      include: {
        articles: {
          select: {
            url: true,
            title: true,
          },
        },
      },
    });
  });

  const result = await Promise.allSettled([firstSeed, secondSeed]);

  result.forEach((p, i) => {
    if (p.status === "rejected") {
      console.error(`Transaction no: ${i + 1} failed - ${p.reason}`);
    }
  });
}

seedDb()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    console.log("Database was seeded successfully!");
    prisma.$disconnect();
  });
