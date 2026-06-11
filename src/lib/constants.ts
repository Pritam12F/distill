// src/lib/constants.ts

export type SourceType = "rss" | "newsapi" | "url";

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
      { type: "url", value: "https://simonwillison.net" },
      { type: "url", value: "https://www.interconnects.ai" },
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
      { type: "url", value: "https://web.dev/blog" },
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
      { type: "url", value: "https://www.bleepingcomputer.com" },
    ],
  },
  {
    name: "Open Source",
    sources: [
      { type: "rss", value: "https://opensource.com/feed" },
      { type: "rss", value: "https://github.blog/feed/" },
      { type: "rss", value: "https://lwn.net/headlines/rss" },
      { type: "newsapi", value: "open source software" },
      { type: "url", value: "https://thenewstack.io" },
    ],
  },
  {
    name: "Developer Tools",
    sources: [
      { type: "rss", value: "https://changelog.com/feed" },
      { type: "rss", value: "https://stackoverflow.blog/feed/" },
      { type: "rss", value: "https://about.gitlab.com/atom.xml" },
      { type: "newsapi", value: "developer tools productivity" },
      { type: "url", value: "https://vercel.com/blog" },
      { type: "url", value: "https://railway.app/blog" },
    ],
  },
  {
    name: "System Design",
    sources: [
      { type: "rss", value: "https://engineering.fb.com/feed/" },
      { type: "rss", value: "https://netflixtechblog.com/feed" },
      { type: "rss", value: "https://eng.uber.com/feed/" },
      { type: "rss", value: "https://slack.engineering/feed/" },
      { type: "url", value: "https://blog.bytebytego.com" },
      { type: "url", value: "https://highscalability.com" },
    ],
  },
  {
    name: "Blockchain & Crypto",
    sources: [
      { type: "rss", value: "https://coindesk.com/arc/outboundfeeds/rss/" },
      { type: "rss", value: "https://cointelegraph.com/rss" },
      { type: "rss", value: "https://decrypt.co/feed" },
      { type: "newsapi", value: "cryptocurrency blockchain" },
      { type: "url", value: "https://www.theblockcrypto.com" },
    ],
  },
  {
    name: "Cloud Computing",
    sources: [
      { type: "rss", value: "https://aws.amazon.com/blogs/aws/feed/" },
      { type: "rss", value: "https://cloud.google.com/blog/rss.xml" },
      { type: "rss", value: "https://azure.microsoft.com/en-us/blog/feed/" },
      { type: "newsapi", value: "cloud computing infrastructure" },
      { type: "url", value: "https://thenewstack.io/cloud-native" },
    ],
  },
  {
    name: "Hardware & Chips",
    sources: [
      { type: "rss", value: "https://www.anandtech.com/rss/" },
      { type: "rss", value: "https://semianalysis.com/feed" },
      { type: "newsapi", value: "semiconductor chips nvidia" },
      { type: "url", value: "https://www.nextplatform.com" },
      { type: "url", value: "https://www.tomshardware.com/news" },
    ],
  },
  {
    name: "Space Technology",
    sources: [
      { type: "rss", value: "https://www.nasa.gov/rss/dyn/breaking_news.rss" },
      { type: "rss", value: "https://spacenews.com/feed/" },
      { type: "rss", value: "https://www.space.com/feeds/all" },
      { type: "newsapi", value: "space exploration SpaceX" },
      { type: "url", value: "https://arstechnica.com/science/space" },
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
      { type: "url", value: "https://www.theinformation.com" },
      { type: "url", value: "https://newsletter.pragmaticengineer.com" },
    ],
  },
  {
    name: "Personal Finance",
    sources: [
      { type: "rss", value: "https://www.mrmoneymustache.com/feed/" },
      { type: "rss", value: "https://affordanything.com/feed/" },
      { type: "rss", value: "https://www.getrichslowly.org/feed/" },
      { type: "newsapi", value: "personal finance investing savings" },
      { type: "url", value: "https://www.investopedia.com/news" },
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
      { type: "url", value: "https://www.wsj.com/news/markets" },
    ],
  },
  {
    name: "Entrepreneurship",
    sources: [
      { type: "rss", value: "https://www.entrepreneur.com/latest.rss" },
      { type: "rss", value: "https://hbr.org/feed" },
      { type: "rss", value: "https://nav.al/feed" },
      { type: "newsapi", value: "entrepreneurship business founder" },
      { type: "url", value: "https://paulgraham.com/articles.html" },
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
      { type: "url", value: "https://www.project-syndicate.org" },
    ],
  },
  {
    name: "Real Estate",
    sources: [
      { type: "rss", value: "https://www.inman.com/feed/" },
      { type: "rss", value: "https://therealdeal.com/feed/" },
      { type: "newsapi", value: "real estate housing market property" },
      { type: "url", value: "https://www.housingwire.com" },
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
      { type: "url", value: "https://e360.yale.edu" },
      { type: "url", value: "https://www.climatecentral.org" },
    ],
  },
  {
    name: "Biotechnology",
    sources: [
      { type: "rss", value: "https://www.fiercebiotech.com/rss.xml" },
      { type: "rss", value: "https://www.statnews.com/feed/" },
      { type: "rss", value: "https://endpts.com/feed/" },
      { type: "newsapi", value: "biotechnology CRISPR gene therapy" },
      { type: "url", value: "https://www.biospace.com/news" },
    ],
  },
  {
    name: "Neuroscience",
    sources: [
      { type: "rss", value: "https://neurosciencenews.com/feed/" },
      { type: "rss", value: "https://www.nature.com/neuro.rss" },
      { type: "newsapi", value: "neuroscience brain research" },
      {
        type: "url",
        value: "https://www.scientificamerican.com/mind-and-brain/",
      },
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
      { type: "url", value: "https://medicalxpress.com" },
    ],
  },
  {
    name: "Renewable Energy",
    sources: [
      { type: "rss", value: "https://reneweconomy.com.au/feed/" },
      { type: "rss", value: "https://www.pv-magazine.com/feed/" },
      { type: "rss", value: "https://electrek.co/feed/" },
      { type: "newsapi", value: "renewable energy solar wind battery" },
      { type: "url", value: "https://www.energy-storage.news" },
    ],
  },
  {
    name: "Physics",
    sources: [
      { type: "rss", value: "https://physicsworld.com/feed/" },
      { type: "rss", value: "https://www.quantamagazine.org/physics/feed/" },
      { type: "newsapi", value: "physics quantum mechanics particle" },
      { type: "url", value: "https://phys.org/physics-news/" },
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
      { type: "url", value: "https://www.stratfor.com" },
      { type: "url", value: "https://carnegieendowment.org" },
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
      { type: "url", value: "https://thewire.in" },
      { type: "url", value: "https://scroll.in/topic/politics" },
    ],
  },
  {
    name: "US Politics",
    sources: [
      { type: "rss", value: "https://rss.politico.com/politics-news.xml" },
      { type: "rss", value: "https://thehill.com/feed/" },
      { type: "rss", value: "https://feeds.npr.org/1014/rss.xml" },
      { type: "newsapi", value: "US politics Congress White House" },
      { type: "url", value: "https://fivethirtyeight.com" },
      { type: "url", value: "https://www.axios.com/politics" },
    ],
  },
  {
    name: "Human Rights",
    sources: [
      { type: "rss", value: "https://www.hrw.org/rss.xml" },
      { type: "rss", value: "https://www.amnesty.org/en/feed/" },
      { type: "newsapi", value: "human rights democracy freedom" },
      { type: "url", value: "https://www.opendemocracy.net" },
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
      { type: "url", value: "https://warontherocks.com" },
      { type: "url", value: "https://www.janes.com/defence-news" },
    ],
  },

  // ─── CULTURE & SOCIETY ──────────────────────────────────────────────
  {
    name: "Philosophy",
    sources: [
      { type: "rss", value: "https://dailynous.com/feed/" },
      { type: "rss", value: "https://philosophybites.libsyn.com/rss" },
      { type: "newsapi", value: "philosophy ethics moral" },
      { type: "url", value: "https://aeon.co/philosophy" },
      {
        type: "url",
        value: "https://www.philosophybasics.com/general_news.html",
      },
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
      { type: "url", value: "https://www.apa.org/news/press/releases" },
    ],
  },
  {
    name: "Education",
    sources: [
      { type: "rss", value: "https://www.edsurge.com/feed.rss" },
      { type: "rss", value: "https://www.edweek.org/feeds/news.xml" },
      { type: "newsapi", value: "education learning schools university" },
      { type: "url", value: "https://www.insidehighered.com" },
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
      { type: "url", value: "https://www.psychiatrictimes.com" },
    ],
  },
  {
    name: "Food & Nutrition",
    sources: [
      { type: "rss", value: "https://www.seriouseats.com/atom.xml" },
      { type: "rss", value: "https://www.eater.com/rss/index.xml" },
      { type: "newsapi", value: "food nutrition diet health" },
      { type: "url", value: "https://www.bonappetit.com/news" },
    ],
  },
  {
    name: "Travel",
    sources: [
      { type: "rss", value: "https://www.lonelyplanet.com/news/feed" },
      { type: "rss", value: "https://www.nomadicmatt.com/feed/" },
      { type: "newsapi", value: "travel destinations tourism" },
      { type: "url", value: "https://www.thepointsguy.com" },
    ],
  },

  // ─── ARTS & ENTERTAINMENT ───────────────────────────────────────────
  {
    name: "Film & Cinema",
    sources: [
      { type: "rss", value: "https://deadline.com/feed/" },
      { type: "rss", value: "https://variety.com/feed/" },
      { type: "newsapi", value: "film cinema movies box office" },
      { type: "url", value: "https://www.rogerebert.com/reviews" },
      { type: "url", value: "https://letterboxd.com" },
    ],
  },
  {
    name: "Music",
    sources: [
      { type: "rss", value: "https://pitchfork.com/feed/feed-news/rss" },
      { type: "rss", value: "https://www.nme.com/feed" },
      { type: "newsapi", value: "music album artist release" },
      { type: "url", value: "https://www.stereogum.com" },
    ],
  },
  {
    name: "Gaming",
    sources: [
      { type: "rss", value: "https://www.ign.com/articles.rss" },
      { type: "rss", value: "https://kotaku.com/rss" },
      { type: "rss", value: "https://www.eurogamer.net/feed" },
      { type: "newsapi", value: "video games gaming release" },
      { type: "url", value: "https://www.rockpapershotgun.com" },
    ],
  },
  {
    name: "Books & Literature",
    sources: [
      { type: "rss", value: "https://www.theguardian.com/books/rss" },
      { type: "rss", value: "https://lithub.com/feed/" },
      { type: "rss", value: "https://www.nybooks.com/feed/" },
      { type: "newsapi", value: "books literature author novel" },
      { type: "url", value: "https://www.publishersweekly.com" },
    ],
  },
  {
    name: "Sports",
    sources: [
      { type: "rss", value: "https://www.espn.com/espn/rss/news" },
      { type: "rss", value: "https://feeds.bbci.co.uk/sport/rss.xml" },
      { type: "rss", value: "https://www.skysports.com/rss/12040" },
      { type: "newsapi", value: "sports football cricket tennis" },
      { type: "url", value: "https://theathletic.com" },
    ],
  },

  // ─── SPECIFIC BEATS ─────────────────────────────────────────────────
  {
    name: "Electric Vehicles",
    sources: [
      { type: "rss", value: "https://electrek.co/feed/" },
      { type: "rss", value: "https://insideevs.com/feed/latest/all/" },
      { type: "newsapi", value: "electric vehicles EV Tesla" },
      { type: "url", value: "https://www.motortrend.com/ev/" },
    ],
  },
  {
    name: "Future of Work",
    sources: [
      { type: "rss", value: "https://www.fastcompany.com/work-life/rss" },
      { type: "rss", value: "https://remote.com/blog/rss.xml" },
      { type: "newsapi", value: "future of work remote hybrid office" },
      { type: "url", value: "https://www.worklife.news" },
    ],
  },
  {
    name: "Privacy & Surveillance",
    sources: [
      { type: "rss", value: "https://www.eff.org/rss/updates.xml" },
      { type: "rss", value: "https://privacyinternational.org/feed" },
      { type: "newsapi", value: "privacy data surveillance" },
      { type: "url", value: "https://themarkup.org" },
    ],
  },
  {
    name: "Longevity & Anti-aging",
    sources: [
      { type: "rss", value: "https://www.lifespan.io/news/feed/" },
      { type: "rss", value: "https://www.aging-us.com/rss/news" },
      { type: "newsapi", value: "longevity anti-aging lifespan" },
      { type: "url", value: "https://www.fightaging.org" },
      { type: "url", value: "https://www.levf.org/news" },
    ],
  },
  {
    name: "Nuclear Energy",
    sources: [
      { type: "rss", value: "https://www.world-nuclear-news.org/rss" },
      { type: "rss", value: "https://www.ans.org/news/rss/" },
      { type: "newsapi", value: "nuclear energy reactor fusion" },
      { type: "url", value: "https://www.powermag.com/nuclear" },
    ],
  },
  {
    name: "India Tech",
    sources: [
      { type: "rss", value: "https://inc42.com/feed/" },
      { type: "rss", value: "https://entrackr.com/feed/" },
      { type: "rss", value: "https://yourstory.com/feed" },
      { type: "newsapi", value: "India startup tech Bangalore" },
      { type: "url", value: "https://the-ken.com" },
      { type: "url", value: "https://www.medianama.com" },
    ],
  },
  {
    name: "Urban Planning",
    sources: [
      { type: "rss", value: "https://www.planetizen.com/rss.xml" },
      { type: "rss", value: "https://www.citylab.com/feed/" },
      { type: "newsapi", value: "urban planning city infrastructure" },
      { type: "url", value: "https://strongtowns.org/journal" },
      { type: "url", value: "https://www.governing.com" },
    ],
  },
];
