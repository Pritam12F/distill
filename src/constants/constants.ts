// src/lib/constants.ts

export type SourceType = "rss" | "newsapi";

export type Source = {
  type: SourceType;
  value: string;
};

export type SuggestedTopic = {
  name: string;
  sources: Source[];
};

export const SUGGESTED_TOPICS: SuggestedTopic[] = [
  // ─── TECH ───────────────────────────────────────────────────────────
  {
    name: "Artificial Intelligence",
    sources: [
      {
        type: "rss",
        value: "https://techcrunch.com/category/artificial-intelligence/feed/",
      },
      { type: "rss", value: "https://www.technologyreview.com/feed/" },
      { type: "rss", value: "https://huggingface.co/blog/feed.xml" },
      { type: "newsapi", value: "artificial intelligence" },
    ],
  },
  {
    name: "Web Development",
    sources: [
      { type: "rss", value: "https://css-tricks.com/feed/" },
      { type: "rss", value: "https://www.smashingmagazine.com/feed/" },
      { type: "rss", value: "https://frontendfoc.us/rss" },
      { type: "rss", value: "https://blog.chromium.org/feeds/posts/default" },
      { type: "newsapi", value: "web development javascript" },
    ],
  },
  {
    name: "Cybersecurity",
    sources: [
      { type: "rss", value: "https://krebsonsecurity.com/feed/" },
      { type: "rss", value: "https://www.darkreading.com/rss.xml" },
      { type: "rss", value: "https://feeds.feedburner.com/TheHackersNews" },
      { type: "rss", value: "https://www.schneier.com/feed/atom/" },
      { type: "newsapi", value: "cybersecurity data breach" },
    ],
  },
  {
    name: "Open Source",
    sources: [
      { type: "rss", value: "https://opensource.com/feed" },
      { type: "rss", value: "https://github.blog/feed/" },
      { type: "rss", value: "https://lwn.net/headlines/rss" },
      { type: "newsapi", value: "open source software" },
    ],
  },
  {
    name: "Developer Tools",
    sources: [
      { type: "rss", value: "https://changelog.com/feed" },
      { type: "rss", value: "https://stackoverflow.blog/feed/" },
      { type: "rss", value: "https://about.gitlab.com/atom.xml" },
      { type: "newsapi", value: "developer tools productivity" },
    ],
  },
  {
    name: "System Design",
    sources: [
      { type: "rss", value: "https://engineering.fb.com/feed/" },
      { type: "rss", value: "https://netflixtechblog.com/feed" },
      { type: "rss", value: "https://eng.uber.com/feed/" },
      { type: "rss", value: "https://slack.engineering/feed/" },
    ],
  },
  {
    name: "Blockchain & Crypto",
    sources: [
      { type: "rss", value: "https://coindesk.com/arc/outboundfeeds/rss/" },
      { type: "rss", value: "https://cointelegraph.com/rss" },
      { type: "rss", value: "https://decrypt.co/feed" },
      { type: "newsapi", value: "cryptocurrency blockchain" },
    ],
  },
  {
    name: "Cloud Computing",
    sources: [
      { type: "rss", value: "https://aws.amazon.com/blogs/aws/feed/" },
      { type: "rss", value: "https://cloud.google.com/blog/rss.xml" },
      { type: "rss", value: "https://azure.microsoft.com/en-us/blog/feed/" },
      { type: "newsapi", value: "cloud computing infrastructure" },
    ],
  },
  {
    name: "Hardware & Chips",
    sources: [
      { type: "rss", value: "https://www.anandtech.com/rss/" },
      { type: "rss", value: "https://semianalysis.com/feed" },
      { type: "newsapi", value: "semiconductor chips nvidia" },
    ],
  },
  {
    name: "Space Technology",
    sources: [
      { type: "rss", value: "https://www.nasa.gov/rss/dyn/breaking_news.rss" },
      { type: "rss", value: "https://spacenews.com/feed/" },
      { type: "rss", value: "https://www.space.com/feeds/all" },
      { type: "newsapi", value: "space exploration SpaceX" },
    ],
  },

  // ─── BUSINESS & FINANCE ─────────────────────────────────────────────
  {
    name: "Startups & VC",
    sources: [
      { type: "rss", value: "https://techcrunch.com/category/startups/feed/" },
      { type: "rss", value: "https://www.strictlyvc.com/feed/" },
      { type: "rss", value: "https://bothsidesofthetable.com/feed" },
      { type: "newsapi", value: "startup venture capital funding" },
    ],
  },
  {
    name: "Personal Finance",
    sources: [
      { type: "rss", value: "https://www.mrmoneymustache.com/feed/" },
      { type: "rss", value: "https://affordanything.com/feed/" },
      { type: "rss", value: "https://www.getrichslowly.org/feed/" },
      { type: "newsapi", value: "personal finance investing savings" },
    ],
  },
  {
    name: "Stock Market",
    sources: [
      {
        type: "rss",
        value: "https://feeds.marketwatch.com/marketwatch/topstories/",
      },
      { type: "rss", value: "https://www.ft.com/markets?format=rss" },
      { type: "rss", value: "https://feeds.bloomberg.com/markets/news.rss" },
      { type: "newsapi", value: "stock market equities S&P 500" },
    ],
  },
  {
    name: "Entrepreneurship",
    sources: [
      { type: "rss", value: "https://www.entrepreneur.com/latest.rss" },
      { type: "rss", value: "https://hbr.org/feed" },
      { type: "rss", value: "https://nav.al/feed" },
      { type: "newsapi", value: "entrepreneurship business founder" },
    ],
  },
  {
    name: "Global Economy",
    sources: [
      {
        type: "rss",
        value: "https://www.economist.com/finance-and-economics/rss.xml",
      },
      { type: "rss", value: "https://feeds.reuters.com/reuters/businessNews" },
      { type: "rss", value: "https://www.imf.org/en/News/rss?language=eng" },
      { type: "newsapi", value: "global economy inflation GDP" },
    ],
  },
  {
    name: "Real Estate",
    sources: [
      { type: "rss", value: "https://www.inman.com/feed/" },
      { type: "rss", value: "https://therealdeal.com/feed/" },
      { type: "newsapi", value: "real estate housing market property" },
    ],
  },

  // ─── SCIENCE ────────────────────────────────────────────────────────
  {
    name: "Climate & Environment",
    sources: [
      { type: "rss", value: "https://www.theguardian.com/environment/rss" },
      { type: "rss", value: "https://insideclimatenews.org/feed/" },
      { type: "rss", value: "https://www.carbonbrief.org/feed" },
      { type: "newsapi", value: "climate change environment emissions" },
    ],
  },
  {
    name: "Biotechnology",
    sources: [
      { type: "rss", value: "https://www.fiercebiotech.com/rss.xml" },
      { type: "rss", value: "https://www.statnews.com/feed/" },
      { type: "rss", value: "https://endpts.com/feed/" },
      { type: "newsapi", value: "biotechnology CRISPR gene therapy" },
    ],
  },
  {
    name: "Neuroscience",
    sources: [
      { type: "rss", value: "https://neurosciencenews.com/feed/" },
      { type: "rss", value: "https://www.nature.com/neuro.rss" },
      { type: "newsapi", value: "neuroscience brain research" },
    ],
  },
  {
    name: "Medical Research",
    sources: [
      {
        type: "rss",
        value:
          "https://www.nejm.org/action/showFeed?jc=nejm&type=etoc&feed=rss",
      },
      {
        type: "rss",
        value: "https://www.thelancet.com/rssfeed/lancet_online.xml",
      },
      { type: "rss", value: "https://www.statnews.com/feed/" },
      { type: "newsapi", value: "medical research clinical trial" },
    ],
  },
  {
    name: "Renewable Energy",
    sources: [
      { type: "rss", value: "https://reneweconomy.com.au/feed/" },
      { type: "rss", value: "https://www.pv-magazine.com/feed/" },
      { type: "rss", value: "https://electrek.co/feed/" },
      { type: "newsapi", value: "renewable energy solar wind battery" },
    ],
  },
  {
    name: "Physics",
    sources: [
      { type: "rss", value: "https://physicsworld.com/feed/" },
      { type: "rss", value: "https://www.quantamagazine.org/physics/feed/" },
      { type: "newsapi", value: "physics quantum mechanics particle" },
    ],
  },

  // ─── WORLD & POLITICS ───────────────────────────────────────────────
  {
    name: "Geopolitics",
    sources: [
      { type: "rss", value: "https://foreignpolicy.com/feed/" },
      { type: "rss", value: "https://www.foreignaffairs.com/rss.xml" },
      { type: "rss", value: "https://feeds.reuters.com/Reuters/worldNews" },
      { type: "newsapi", value: "geopolitics international relations" },
    ],
  },
  {
    name: "Indian Politics",
    sources: [
      { type: "rss", value: "https://indianexpress.com/section/india/feed/" },
      {
        type: "rss",
        value: "https://www.thehindu.com/news/national/feeder/default.rss",
      },
      {
        type: "rss",
        value: "https://feeds.feedburner.com/ndtvnews-india-news",
      },
      { type: "newsapi", value: "India politics BJP Congress" },
    ],
  },
  {
    name: "US Politics",
    sources: [
      { type: "rss", value: "https://rss.politico.com/politics-news.xml" },
      { type: "rss", value: "https://thehill.com/feed/" },
      { type: "rss", value: "https://feeds.npr.org/1014/rss.xml" },
      { type: "newsapi", value: "US politics Congress White House" },
    ],
  },
  {
    name: "Human Rights",
    sources: [
      { type: "rss", value: "https://www.hrw.org/rss.xml" },
      { type: "rss", value: "https://www.amnesty.org/en/feed/" },
      { type: "newsapi", value: "human rights democracy freedom" },
    ],
  },
  {
    name: "Defence & Military",
    sources: [
      {
        type: "rss",
        value: "https://www.defensenews.com/arc/outboundfeeds/rss/",
      },
      { type: "rss", value: "https://breakingdefense.com/feed/" },
      { type: "newsapi", value: "military defence NATO weapons" },
    ],
  },

  // ─── CULTURE & SOCIETY ──────────────────────────────────────────────
  {
    name: "Philosophy",
    sources: [
      { type: "rss", value: "https://dailynous.com/feed/" },
      { type: "rss", value: "https://philosophybites.libsyn.com/rss" },
      { type: "newsapi", value: "philosophy ethics moral" },
    ],
  },
  {
    name: "Psychology",
    sources: [
      {
        type: "rss",
        value: "https://www.psychologytoday.com/us/front-page/feed",
      },
      { type: "rss", value: "https://digest.bps.org.uk/feed/" },
      { type: "newsapi", value: "psychology behavior mental" },
    ],
  },
  {
    name: "Education",
    sources: [
      { type: "rss", value: "https://www.edsurge.com/feed.rss" },
      { type: "rss", value: "https://www.edweek.org/feeds/news.xml" },
      { type: "newsapi", value: "education learning schools university" },
    ],
  },
  {
    name: "Mental Health",
    sources: [
      {
        type: "rss",
        value: "https://www.mind.org.uk/news-campaigns/news/rss/",
      },
      { type: "rss", value: "https://www.mentalhealthamerica.net/rss.xml" },
      { type: "newsapi", value: "mental health anxiety depression therapy" },
    ],
  },
  {
    name: "Food & Nutrition",
    sources: [
      { type: "rss", value: "https://www.seriouseats.com/atom.xml" },
      { type: "rss", value: "https://www.eater.com/rss/index.xml" },
      { type: "newsapi", value: "food nutrition diet health" },
    ],
  },
  {
    name: "Travel",
    sources: [
      { type: "rss", value: "https://www.lonelyplanet.com/news/feed" },
      { type: "rss", value: "https://www.nomadicmatt.com/feed/" },
      { type: "newsapi", value: "travel destinations tourism" },
    ],
  },

  // ─── ARTS & ENTERTAINMENT ───────────────────────────────────────────
  {
    name: "Film & Cinema",
    sources: [
      { type: "rss", value: "https://deadline.com/feed/" },
      { type: "rss", value: "https://variety.com/feed/" },
      { type: "newsapi", value: "film cinema movies box office" },
    ],
  },
  {
    name: "Music",
    sources: [
      { type: "rss", value: "https://pitchfork.com/feed/feed-news/rss" },
      { type: "rss", value: "https://www.nme.com/feed" },
      { type: "newsapi", value: "music album artist release" },
    ],
  },
  {
    name: "Gaming",
    sources: [
      { type: "rss", value: "https://www.ign.com/articles.rss" },
      { type: "rss", value: "https://kotaku.com/rss" },
      { type: "rss", value: "https://www.eurogamer.net/feed" },
      { type: "newsapi", value: "video games gaming release" },
    ],
  },
  {
    name: "Books & Literature",
    sources: [
      { type: "rss", value: "https://www.theguardian.com/books/rss" },
      { type: "rss", value: "https://lithub.com/feed/" },
      { type: "rss", value: "https://www.nybooks.com/feed/" },
      { type: "newsapi", value: "books literature author novel" },
    ],
  },
  {
    name: "Sports",
    sources: [
      { type: "rss", value: "https://www.espn.com/espn/rss/news" },
      { type: "rss", value: "https://feeds.bbci.co.uk/sport/rss.xml" },
      { type: "rss", value: "https://www.skysports.com/rss/12040" },
      { type: "newsapi", value: "sports football cricket tennis" },
    ],
  },

  // ─── SPECIFIC BEATS ─────────────────────────────────────────────────
  {
    name: "Electric Vehicles",
    sources: [
      { type: "rss", value: "https://electrek.co/feed/" },
      { type: "rss", value: "https://insideevs.com/feed/latest/all/" },
      { type: "newsapi", value: "electric vehicles EV Tesla" },
    ],
  },
  {
    name: "Future of Work",
    sources: [
      { type: "rss", value: "https://www.fastcompany.com/work-life/rss" },
      { type: "rss", value: "https://remote.com/blog/rss.xml" },
      { type: "newsapi", value: "future of work remote hybrid office" },
    ],
  },
  {
    name: "Privacy & Surveillance",
    sources: [
      { type: "rss", value: "https://www.eff.org/rss/updates.xml" },
      { type: "rss", value: "https://privacyinternational.org/feed" },
      { type: "newsapi", value: "privacy data surveillance" },
    ],
  },
  {
    name: "Longevity & Anti-aging",
    sources: [
      { type: "rss", value: "https://www.lifespan.io/news/feed/" },
      { type: "rss", value: "https://www.aging-us.com/rss/news" },
      { type: "newsapi", value: "longevity anti-aging lifespan" },
    ],
  },
  {
    name: "Nuclear Energy",
    sources: [
      { type: "rss", value: "https://www.world-nuclear-news.org/rss" },
      { type: "rss", value: "https://www.ans.org/news/rss/" },
      { type: "newsapi", value: "nuclear energy reactor fusion" },
    ],
  },
  {
    name: "India Tech",
    sources: [
      { type: "rss", value: "https://inc42.com/feed/" },
      { type: "rss", value: "https://entrackr.com/feed/" },
      { type: "rss", value: "https://yourstory.com/feed" },
      { type: "newsapi", value: "India startup tech Bangalore" },
    ],
  },
  {
    name: "Urban Planning",
    sources: [
      { type: "rss", value: "https://www.planetizen.com/rss.xml" },
      { type: "rss", value: "https://www.citylab.com/feed/" },
      { type: "newsapi", value: "urban planning city infrastructure" },
    ],
  },
];
