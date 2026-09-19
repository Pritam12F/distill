import "dotenv/config";
import { prisma } from "@/lib/prisma";

const EMAIL = "pritam@distill.local";
const DAY = 24 * 60 * 60 * 1000;

const TOPICS = [
  {
    name: "Artificial intelligence",
    sources: [
      "https://techcrunch.com/category/artificial-intelligence/feed/",
      "https://www.technologyreview.com/feed/",
    ],
    headlines: [
      "OpenAI's reasoning model overtakes Google on coding benchmarks",
      "Open-weight models close the gap on frontier labs",
      "Inference costs fall for the third quarter running",
      "Agent frameworks converge on a common tool-calling spec",
      "Training data disclosure becomes a procurement requirement",
      "Small models beat large ones on structured extraction",
      "Chip supply loosens as new fabs come online",
      "Evaluation benchmarks face a reproducibility problem",
      "Enterprise adoption shifts from pilots to production",
      "Context windows stop being the differentiator",
    ],
  },
  {
    name: "Climate tech",
    sources: [
      "https://reneweconomy.com.au/feed/",
      "https://www.pv-magazine.com/feed/",
    ],
    headlines: [
      "Battery storage costs fall below $100/kWh for the first time",
      "Grid interconnection queues become the binding constraint",
      "Heat pump installations outpace gas boilers in three markets",
      "Green hydrogen projects scale back on cost pressure",
      "Solar manufacturing overcapacity pushes prices lower",
      "Carbon removal contracts pass a billion dollars",
      "Offshore wind faces a second year of cancellations",
      "Transmission permitting reform advances in two jurisdictions",
      "Long-duration storage finds its first commercial niche",
      "Industrial electrification outpaces forecasts",
    ],
  },
  {
    name: "Startups",
    sources: ["https://inc42.com/feed/", "https://entrackr.com/feed/"],
    headlines: [
      "Indian fintech funding hits an eighteen-month high",
      "Seed rounds shrink as later-stage capital returns",
      "Three late-stage deals distort the quarterly totals",
      "Down rounds stop being taboo",
      "Secondary markets absorb employee liquidity pressure",
      "Vertical SaaS outperforms horizontal platforms on retention",
      "Founder compensation data becomes public for the first time",
      "Bootstrapped companies capture attention at scale",
      "Corporate venture arms retreat from early stages",
      "Acquisition activity concentrates among five buyers",
    ],
  },
  {
    name: "Geopolitics",
    sources: [
      "https://foreignpolicy.com/feed/",
      "https://www.foreignaffairs.com/rss.xml",
    ],
    headlines: [
      "Export controls reshape semiconductor supply chains",
      "Trade corridors reroute around contested waters",
      "Critical minerals agreements multiply across three continents",
      "Sanctions enforcement shifts toward financial intermediaries",
      "Defence budgets rise faster than economic growth",
      "Regional blocs gain ground on global institutions",
      "Undersea cable security becomes a policy priority",
      "Energy dependence redraws diplomatic alignments",
      "Migration pressure tests border agreements",
      "Currency arrangements fragment along political lines",
    ],
  },
  {
    name: "Web development",
    sources: ["https://css-tricks.com/feed/", "https://frontendfoc.us/rss"],
    headlines: [
      "Server components settle into mainstream framework defaults",
      "Build tooling consolidates around two ecosystems",
      "Baseline browser support simplifies CSS decisions",
      "View transitions ship across all major engines",
      "Type-safe routing arrives in three frameworks at once",
      "Bundle size regressions get caught in CI by default",
      "Container queries displace breakpoint-driven layouts",
      "Edge rendering loses ground to regional deployment",
      "Accessibility tooling moves into the editor",
      "Package managers agree on a lockfile format",
    ],
  },
];

const SOURCES = [
  { name: "Reuters", host: "reuters.com" },
  { name: "The Verge", host: "theverge.com" },
  { name: "Ars Technica", host: "arstechnica.com" },
  { name: "Financial Times", host: "ft.com" },
  { name: "Bloomberg", host: "bloomberg.com" },
];

const ONE_LINERS = [
  "The clearest account of how the result was verified.",
  "The claim the rest of the coverage is arguing about.",
  "Useful if you want the numbers behind the headline.",
  "Where this turns into budget decisions.",
  "The counterargument, with the underlying data.",
];

async function main() {
  await prisma.user.deleteMany({ where: { email: EMAIL } });

  const user = await prisma.user.create({
    data: {
      email: EMAIL,
      name: "Pritam",
      topics: {
        create: TOPICS.map((t) => ({ name: t.name, sources: t.sources })),
      },
    },
    include: { topics: { orderBy: { createdAt: "asc" } } },
  });

  let created = 0;

  // 10 days back, 5 topics per day = 50 digests.
  for (let dayOffset = 0; dayOffset < 10; dayOffset++) {
    for (const [topicIndex, topic] of user.topics.entries()) {
      const spec = TOPICS[topicIndex];
      const headline = spec.headlines[dayOffset];

      // Roughly every third digest has no conflict, and one in four is unread.
      const hasConflict = (dayOffset + topicIndex) % 3 !== 0;
      const hasRead = dayOffset > 0 || topicIndex > 2;

      // Stagger creation times within the 2am hour so ordering is stable.
      const createdAt = new Date(
        Date.now() - dayOffset * DAY - topicIndex * 60 * 1000,
      );

      const articleCount = 2 + ((dayOffset + topicIndex) % 3); // 2 to 4

      await prisma.digest.create({
        data: {
          userId: user.id,
          topicId: topic.id,
          createdAt,
          hasRead,
          headline,
          consensus: `Most sources agree on the central claim, with two independent accounts reaching the same figure. [S1][S2] Coverage differs on how durable the effect is likely to be, though none of the sources treat it as a short-term anomaly.`,
          conflict: hasConflict
            ? `[S1] reports the trend accelerating, while [S2] cites people close to the matter describing it as flat year over year. Neither figure has been independently verified.`
            : null,
          signal: `If this holds outside the reported sample, the practical timeline moves forward by roughly two quarters.`,
          articles: {
            create: Array.from({ length: articleCount }, (_, i) => {
              const source = SOURCES[(topicIndex + i) % SOURCES.length];
              return {
                userId: user.id,
                sourceId: `S${i + 1}`,
                title: `${source.name} on ${headline.slice(0, 48).toLowerCase()}`,
                url: `https://${source.host}/${topic.id.slice(0, 8)}-${dayOffset}-${i}`,
                oneLine: ONE_LINERS[i % ONE_LINERS.length],
                publishedAt: new Date(
                  createdAt.getTime() - (i + 1) * 3 * 60 * 60 * 1000,
                ),
                reaction: i === 0 && dayOffset % 4 === 0 ? "LIKE" : null,
              };
            }),
          },
        },
      });

      created++;
    }
  }

  console.log(`\nSeeded ${EMAIL}`);
  console.log(`  ${user.topics.length} topics`);
  console.log(`  ${created} digests across 10 days`);
  console.log(`  ~${created * 3} articles\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
