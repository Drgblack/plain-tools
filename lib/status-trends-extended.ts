import {
  STATUS_CLOUD_DOMAINS,
  STATUS_DOMAIN_NAMES,
  STATUS_ECOMMERCE_DOMAINS,
  STATUS_FINANCE_DOMAINS,
  STATUS_GAMING_DOMAINS,
  STATUS_SOCIAL_DOMAINS,
  STATUS_STREAMING_DOMAINS,
} from "@/lib/status-domains"

type TrendingCategorySeed = {
  category: string
  description: string
  label: string
  popularSites: string[]
}

function uniqueDomains(...groups: ReadonlyArray<ReadonlyArray<string>>) {
  return Array.from(
    new Set(
      groups
        .flatMap((group) => [...group])
        .map((domain) => domain.trim().toLowerCase())
        .filter(Boolean)
    )
  )
}

function pickSites(domains: string[], limit = 18) {
  return uniqueDomains(domains).slice(0, limit)
}

const AI_TOOL_DOMAINS = [
  "chatgpt.com",
  "openai.com",
  "platform.openai.com",
  "chat.openai.com",
  "anthropic.com",
  "claude.ai",
  "console.anthropic.com",
  "gemini.google.com",
  "notebooklm.google.com",
  "perplexity.ai",
  "poe.com",
  "character.ai",
  "huggingface.co",
  "stability.ai",
  "midjourney.com",
  "runwayml.com",
  "replicate.com",
  "cohere.com",
  "mistral.ai",
  "groq.com",
  "you.com",
  "phind.com",
  "copy.ai",
  "jasper.ai",
  "writesonic.com",
  "suno.com",
  "elevenlabs.io",
  "gamma.app",
  "beautiful.ai",
  "replit.com",
  "cursor.com",
  "bolt.new",
  "lovable.dev",
  "v0.dev",
  "deepseek.com",
  "manus.ai",
] as const

const DEVELOPER_SERVICE_DOMAINS = [
  "github.com",
  "githubstatus.com",
  "gitlab.com",
  "bitbucket.org",
  "npmjs.com",
  "pypi.org",
  "rubygems.org",
  "packagist.org",
  "docker.com",
  "hub.docker.com",
  "kubernetes.io",
  "terraform.io",
  "jenkins.io",
  "circleci.com",
  "travis-ci.com",
  "vercel.com",
  "netlify.com",
  "render.com",
  "railway.app",
  "fly.io",
  "digitalocean.com",
  "linode.com",
  "supabase.com",
  "neon.tech",
  "planetscale.com",
  "mongodb.com",
  "postgresql.org",
  "mysql.com",
  "sentry.io",
  "datadoghq.com",
  "newrelic.com",
  "grafana.com",
  "statuspage.io",
  "postman.com",
  "insomnia.rest",
  "vitejs.dev",
  "nextjs.org",
  "react.dev",
  "vuejs.org",
  "astro.build",
] as const

const PRODUCTIVITY_DOMAINS = [
  "notion.so",
  "figma.com",
  "miro.com",
  "airtable.com",
  "coda.io",
  "asana.com",
  "clickup.com",
  "monday.com",
  "trello.com",
  "slack.com",
  "discord.com",
  "zoom.us",
  "teams.microsoft.com",
  "meet.google.com",
  "webex.com",
  "calendly.com",
  "cal.com",
  "loom.com",
  "canva.com",
  "framer.com",
  "webflow.com",
  "dropbox.com",
  "box.com",
  "egnyte.com",
  "1password.com",
  "bitwarden.com",
  "lastpass.com",
  "dashlane.com",
  "grammarly.com",
  "otter.ai",
  "descript.com",
  "surveymonkey.com",
] as const

const EDUCATION_DOMAINS = [
  "canvas.instructure.com",
  "blackboard.com",
  "moodle.org",
  "coursera.org",
  "edx.org",
  "udemy.com",
  "udacity.com",
  "khanacademy.org",
  "duolingo.com",
  "quizlet.com",
  "skillshare.com",
  "futurelearn.com",
  "brilliant.org",
  "academia.edu",
  "researchgate.net",
  "mit.edu",
  "harvard.edu",
  "stanford.edu",
  "open.edu",
  "wgu.edu",
  "schoology.com",
  "powerschool.com",
  "instructure.com",
  "turnitin.com",
] as const

const SECURITY_DOMAINS = [
  "cloudflare.com",
  "okta.com",
  "auth0.com",
  "clerk.com",
  "stytch.com",
  "workos.com",
  "duo.com",
  "1password.com",
  "lastpass.com",
  "dashlane.com",
  "bitwarden.com",
  "keepersecurity.com",
  "proton.me",
  "protonmail.com",
  "nordvpn.com",
  "expressvpn.com",
  "surfshark.com",
  "malwarebytes.com",
  "crowdstrike.com",
  "sentinelone.com",
  "akamai.com",
  "fastly.com",
  "imperva.com",
  "dnsimple.com",
  "namecheap.com",
  "godaddy.com",
] as const

const GOVERNMENT_AND_HEALTH_DOMAINS = [
  "irs.gov",
  "ssa.gov",
  "medicare.gov",
  "medicaid.gov",
  "healthcare.gov",
  "cdc.gov",
  "nih.gov",
  "va.gov",
  "travel.state.gov",
  "uscis.gov",
  "gov.uk",
  "service.gov.uk",
  "nhs.uk",
  "hmrc.gov.uk",
  "revenue.ie",
  "service-public.fr",
  "bund.de",
  "canada.ca",
  "service.nsw.gov.au",
  "my.gov.au",
  "ato.gov.au",
  "cra-arc.gc.ca",
  "sars.gov.za",
  "who.int",
] as const

const TRAVEL_AND_DELIVERY_DOMAINS = [
  "uber.com",
  "lyft.com",
  "doordash.com",
  "ubereats.com",
  "grubhub.com",
  "deliveroo.co.uk",
  "justeat.com",
  "instacart.com",
  "gopuff.com",
  "booking.com",
  "airbnb.com",
  "expedia.com",
  "tripadvisor.com",
  "kayak.com",
  "trip.com",
  "skyscanner.net",
  "southwest.com",
  "delta.com",
  "united.com",
  "americanairlines.com",
  "ryanair.com",
  "easyjet.com",
  "grab.com",
  "bolt.eu",
] as const

const STATUS_HOSTS = [
  "status.openai.com",
  "status.anthropic.com",
  "status.github.com",
  "status.gitlab.com",
  "www.githubstatus.com",
  "www.githubstatus.net",
  "status.stripe.com",
  "status.cloud.google.com",
  "status.aws.amazon.com",
  "status.azure.com",
  "status.vercel.com",
  "status.supabase.com",
  "status.render.com",
  "status.cloudflare.com",
  "www.cloudflarestatus.com",
  "status.notion.so",
  "status.figma.com",
  "status.shopify.com",
  "status.zoom.us",
  "status.slack.com",
  "status.discord.com",
  "status.atlassian.com",
  "status.datadoghq.com",
  "status.newrelic.com",
  "status.twilio.com",
  "status.docker.com",
  "status.heroku.com",
  "status.netlify.com",
  "status.digitalocean.com",
  "status.auth0.com",
] as const

const TRENDING_CATEGORY_SEEDS: TrendingCategorySeed[] = [
  { category: "social", label: "Social Platforms", description: "High-churn consumer social networks and messaging apps where outage spikes create same-day traffic.", popularSites: pickSites([...STATUS_SOCIAL_DOMAINS]) },
  { category: "social-messaging", label: "Messaging Apps", description: "Messaging apps and chat networks where send failures and reconnect loops create urgent checks.", popularSites: pickSites(["whatsapp.com", "messenger.com", "telegram.org", "signal.org", "viber.com", "line.me", "kakao.com", "discord.com", "slack.com", "teams.microsoft.com", "zoom.us", "wechat.com"]) },
  { category: "social-creators", label: "Creator Platforms", description: "Short-form video and creator platforms where upload, comments, and live-stream outages spike rapidly.", popularSites: pickSites(["tiktok.com", "instagram.com", "youtube.com", "twitch.tv", "kick.com", "patreon.com", "substack.com", "medium.com", "x.com", "threads.net"]) },
  { category: "social-communities", label: "Community Platforms", description: "Forums, communities, and discussion products where login and posting failures trigger repeat search demand.", popularSites: pickSites(["reddit.com", "discord.com", "quora.com", "tumblr.com", "mastodon.social", "blueskyweb.xyz", "fandom.com", "stackoverflow.com"]) },
  { category: "social-enterprise", label: "Work Messaging", description: "Enterprise messaging and workplace collaboration systems with both team and operations search intent.", popularSites: pickSites(["slack.com", "teams.microsoft.com", "zoom.us", "webex.com", "discord.com", "meet.google.com", "skype.com"]) },
  { category: "cloud", label: "Cloud Platforms", description: "Cloud and hosting providers where downtime carries strong developer and business urgency.", popularSites: pickSites([...STATUS_CLOUD_DOMAINS]) },
  { category: "cloud-hosting", label: "Hosting & Deploy", description: "Hosting, deploy, and edge platforms where build and deployment outages create developer spike traffic.", popularSites: pickSites(["vercel.com", "netlify.com", "render.com", "fly.io", "railway.app", "heroku.com", "digitalocean.com", "linode.com", "cloudflare.com"]) },
  { category: "cloud-data", label: "Cloud Databases", description: "Managed database and backend services with incident-driven B2B demand.", popularSites: pickSites(["supabase.com", "neon.tech", "planetscale.com", "mongodb.com", "firebase.google.com", "console.cloud.google.com", "aws.amazon.com"]) },
  { category: "cloud-monitoring", label: "Observability", description: "Monitoring and incident-response tools where failures have direct operational urgency.", popularSites: pickSites(["datadoghq.com", "newrelic.com", "grafana.com", "sentry.io", "splunk.com", "pagerduty.com", "statuspage.io"]) },
  { category: "cloud-devops", label: "DevOps Platforms", description: "CI, orchestration, and automation products used in release and infrastructure workflows.", popularSites: pickSites(["github.com", "gitlab.com", "circleci.com", "travis-ci.com", "jenkins.io", "docker.com", "kubernetes.io", "terraform.io"]) },
  { category: "streaming", label: "Streaming Platforms", description: "Video, music, and creator platforms with playback and login outage demand.", popularSites: pickSites([...STATUS_STREAMING_DOMAINS]) },
  { category: "streaming-video", label: "Video Streaming", description: "Subscription video services where playback and authentication errors spike quickly.", popularSites: pickSites(["netflix.com", "primevideo.com", "disneyplus.com", "hulu.com", "max.com", "paramountplus.com", "peacocktv.com", "fubo.tv", "sling.com"]) },
  { category: "streaming-music", label: "Music Streaming", description: "Music services where playback, library sync, and billing issues drive repeat checks.", popularSites: pickSites(["spotify.com", "music.apple.com", "soundcloud.com", "deezer.com", "pandora.com", "tidal.com", "bandcamp.com"]) },
  { category: "creator-streaming", label: "Creator Streaming", description: "Live creator and upload platforms where stream health and chat failures dominate search intent.", popularSites: pickSites(["youtube.com", "twitch.tv", "kick.com", "vimeo.com", "dailymotion.com", "obsproject.com"]) },
  { category: "sports-streaming", label: "Sports Streaming", description: "Live sports broadcasters and ticket-linked streaming products with time-sensitive outage demand.", popularSites: pickSites(["espn.com", "dazn.com", "fubo.tv", "peacocktv.com", "foxsports.com", "nbcsports.com"]) },
  { category: "finance", label: "Finance Platforms", description: "Payments, banking, and trading services where downtime has unusually strong urgency and RPM.", popularSites: pickSites([...STATUS_FINANCE_DOMAINS]) },
  { category: "payments", label: "Payments & Checkout", description: "Checkout, wallet, and merchant payment tools where downtime has direct transaction impact.", popularSites: pickSites(["stripe.com", "paypal.com", "squareup.com", "adyen.com", "checkout.com", "klarna.com", "affirm.com", "afterpay.com", "zip.co"]) },
  { category: "banking", label: "Banking & Cards", description: "Retail banking, cards, and money-movement products where login or payments failures drive high-intent checks.", popularSites: pickSites(["chase.com", "bankofamerica.com", "wellsfargo.com", "capitalone.com", "americanexpress.com", "visa.com", "mastercard.com", "discover.com", "cash.app", "venmo.com"]) },
  { category: "trading", label: "Trading & Brokerages", description: "Brokerage and investing platforms with high urgency during market hours.", popularSites: pickSites(["robinhood.com", "etrade.com", "fidelity.com", "schwab.com", "vanguard.com", "coinbase.com", "binance.com", "kraken.com", "gemini.com", "tradingview.com"]) },
  { category: "neobanks", label: "Neobanks", description: "App-first banking and card services where outages affect budgeting, cards, and transfers at once.", popularSites: pickSites(["revolut.com", "monzo.com", "starlingbank.com", "n26.com", "wise.com", "cash.app", "zellepay.com"]) },
  { category: "gaming", label: "Gaming Platforms", description: "Gaming platforms, launchers, and online services with repeatable spike demand during outages.", popularSites: pickSites([...STATUS_GAMING_DOMAINS]) },
  { category: "pc-gaming", label: "PC Gaming", description: "PC gaming platforms, launchers, and publisher services with login and matchmaking incident traffic.", popularSites: pickSites(["store.steampowered.com", "steamcommunity.com", "epicgames.com", "battle.net", "ea.com", "ubisoft.com", "gog.com", "riotgames.com"]) },
  { category: "console-gaming", label: "Console Gaming", description: "Console networks, stores, and platform services where outages interrupt sessions and purchases.", popularSites: pickSites(["playstation.com", "xbox.com", "nintendo.com", "store.playstation.com", "support.xbox.com", "accounts.nintendo.com"]) },
  { category: "mobile-gaming", label: "Mobile Gaming", description: "Mobile-heavy gaming apps and publishers where login and purchase errors create long-tail demand.", popularSites: pickSites(["roblox.com", "supercell.com", "nianticlabs.com", "riotgames.com", "king.com", "scopely.com"]) },
  { category: "game-stores", label: "Game Stores", description: "Game stores and account services where checkout, patching, and downloads fail in visible ways.", popularSites: pickSites(["store.steampowered.com", "epicgames.com", "gog.com", "humblebundle.com", "itch.io", "battle.net"]) },
  { category: "esports", label: "Esports & Competitive", description: "Competitive gaming networks where queue, ladder, and tournament outages drive rapid search demand.", popularSites: pickSites(["leagueoflegends.com", "valorant.com", "faceit.com", "hltv.org", "esl.com"]) },
  { category: "ecommerce", label: "Ecommerce Platforms", description: "Retail, ordering, and marketplace services where outages hit both buyers and merchants.", popularSites: pickSites([...STATUS_ECOMMERCE_DOMAINS]) },
  { category: "marketplaces", label: "Marketplaces", description: "General marketplaces where listing, checkout, and delivery issues carry broad search demand.", popularSites: pickSites(["amazon.com", "ebay.com", "etsy.com", "mercadolibre.com", "aliexpress.com", "temu.com", "rakuten.com"]) },
  { category: "retail", label: "Retailers", description: "Large retailers where purchase, account, and order-tracking incidents drive consumer urgency.", popularSites: pickSites(["walmart.com", "target.com", "costco.com", "bestbuy.com", "homedepot.com", "lowes.com", "ikea.com", "wayfair.com"]) },
  { category: "fashion-retail", label: "Fashion Retail", description: "Apparel and fashion commerce brands with high mobile traffic and checkout sensitivity.", popularSites: pickSites(["zara.com", "hm.com", "asos.com", "uniqlo.com", "nike.com", "adidas.com", "shein.com"]) },
  { category: "food-delivery", label: "Food Delivery", description: "Delivery and ordering platforms where app failures immediately change same-day user behavior.", popularSites: pickSites(["doordash.com", "ubereats.com", "grubhub.com", "deliveroo.co.uk", "justeat.com", "gopuff.com", "instacart.com"]) },
  { category: "travel", label: "Travel Booking", description: "Travel sites where booking, check-in, and itinerary problems create high-intent traffic.", popularSites: pickSites(["booking.com", "airbnb.com", "expedia.com", "tripadvisor.com", "kayak.com", "trip.com", "skyscanner.net"]) },
  { category: "airlines", label: "Airlines", description: "Airline booking and check-in systems where downtime impacts travel-day behavior immediately.", popularSites: pickSites(["delta.com", "united.com", "americanairlines.com", "southwest.com", "ryanair.com", "easyjet.com"]) },
  { category: "ai-tools", label: "AI Tools", description: "AI chat, image, coding, and media services where outages spike quickly and carry strong advertiser value.", popularSites: pickSites([...AI_TOOL_DOMAINS]) },
  { category: "ai-chat", label: "AI Chat Assistants", description: "Chat-first AI products where demand spikes during visible outages or response issues.", popularSites: pickSites(["chatgpt.com", "claude.ai", "gemini.google.com", "perplexity.ai", "poe.com", "you.com", "phind.com", "deepseek.com"]) },
  { category: "ai-coding", label: "AI Coding Tools", description: "Coding copilots and prompt-based developer tools with strong commercial intent.", popularSites: pickSites(["cursor.com", "bolt.new", "v0.dev", "replit.com", "github.com", "openai.com", "anthropic.com", "lovable.dev"]) },
  { category: "ai-media", label: "AI Media Tools", description: "Generative media services where rendering, upload, or output failures create fresh long-tail searches.", popularSites: pickSites(["midjourney.com", "runwayml.com", "suno.com", "elevenlabs.io", "stability.ai", "replicate.com", "descript.com"]) },
  { category: "ai-enterprise", label: "Enterprise AI Platforms", description: "AI APIs and enterprise adoption platforms with stronger B2B incident intent.", popularSites: pickSites(["platform.openai.com", "console.anthropic.com", "cohere.com", "mistral.ai", "groq.com", "huggingface.co"]) },
  { category: "developer", label: "Developer Tools", description: "Developer tools and registries where downtime disrupts build and release workflows.", popularSites: pickSites([...DEVELOPER_SERVICE_DOMAINS]) },
  { category: "dev-repositories", label: "Code Repositories", description: "Hosted code platforms and artifact sources with mission-critical workflow impact.", popularSites: pickSites(["github.com", "gitlab.com", "bitbucket.org", "gist.github.com", "raw.githubusercontent.com"]) },
  { category: "dev-registries", label: "Package Registries", description: "Package registries and runtime ecosystems where outages break install and deployment steps.", popularSites: pickSites(["npmjs.com", "pypi.org", "rubygems.org", "packagist.org", "crates.io", "maven.org"]) },
  { category: "dev-observability", label: "Developer Observability", description: "Monitoring and logging products with strong operational urgency when degraded.", popularSites: pickSites(["datadoghq.com", "newrelic.com", "sentry.io", "grafana.com", "splunk.com", "appdynamics.com"]) },
  { category: "productivity", label: "Productivity Apps", description: "Productivity and collaboration tools where users search during sudden workflow interruptions.", popularSites: pickSites([...PRODUCTIVITY_DOMAINS]) },
  { category: "design-tools", label: "Design Tools", description: "Design, prototyping, and asset tools with strong creative-team reliance.", popularSites: pickSites(["figma.com", "canva.com", "framer.com", "webflow.com", "miro.com", "invisionapp.com", "sketch.com", "zeplin.io"]) },
  { category: "collaboration", label: "Collaboration Platforms", description: "Cross-functional collaboration tools used in reviews, planning, and work handoffs.", popularSites: pickSites(["notion.so", "slack.com", "teams.microsoft.com", "zoom.us", "meet.google.com", "airtable.com", "coda.io", "miro.com"]) },
  { category: "project-management", label: "Project Management", description: "Project and task platforms where service issues block execution for whole teams.", popularSites: pickSites(["asana.com", "clickup.com", "monday.com", "trello.com", "linear.app", "jira.com"]) },
  { category: "crm-support", label: "CRM & Support", description: "Customer-facing CRM and support tools with high B2B query value during incidents.", popularSites: pickSites(["salesforce.com", "hubspot.com", "zendesk.com", "intercom.com", "freshworks.com", "helpscout.com", "drift.com"]) },
  { category: "security", label: "Security Tools", description: "Identity, password, and security platforms where failures directly affect login and trust.", popularSites: pickSites([...SECURITY_DOMAINS]) },
  { category: "identity", label: "Identity Platforms", description: "Identity and access services where auth failures trigger immediate cross-product impact.", popularSites: pickSites(["okta.com", "auth0.com", "clerk.com", "stytch.com", "workos.com", "duo.com"]) },
  { category: "privacy-tools", label: "Privacy Tools", description: "Email, VPN, and privacy products where downtime can have unusually high trust sensitivity.", popularSites: pickSites(["proton.me", "protonmail.com", "nordvpn.com", "expressvpn.com", "surfshark.com", "duckduckgo.com"]) },
  { category: "education", label: "Education Platforms", description: "Learning and student platforms with durable search intent during login or assignment failures.", popularSites: pickSites([...EDUCATION_DOMAINS]) },
  { category: "student-systems", label: "Student Systems", description: "Student records, learning systems, and gradebook tools with institution-wide impact.", popularSites: pickSites(["canvas.instructure.com", "blackboard.com", "moodle.org", "powerschool.com", "schoology.com", "turnitin.com"]) },
  { category: "news-media", label: "News & Media", description: "News publishers and live information platforms with high traffic during breaking events.", popularSites: pickSites(["bbc.com", "cnn.com", "nytimes.com", "reuters.com", "theguardian.com", "bloomberg.com", "wsj.com", "ft.com"]) },
  { category: "government-health", label: "Government & Health", description: "Government, tax, health, and benefits services with high urgency when unavailable.", popularSites: pickSites([...GOVERNMENT_AND_HEALTH_DOMAINS]) },
  { category: "telecom", label: "Telecom & ISPs", description: "Connectivity providers and telecom brands where outages create broad same-day demand.", popularSites: pickSites(["att.com", "verizon.com", "tmobile.com", "vodafone.com", "telefonica.com", "rogers.com", "telstra.com", "bt.com"]) },
  { category: "maps-transport", label: "Maps & Transport", description: "Maps, ride-hailing, and transport platforms with location-sensitive incident demand.", popularSites: pickSites(["maps.google.com", "waze.com", "uber.com", "lyft.com", "grab.com", "bolt.eu", "citymapper.com"]) },
  { category: "shopping-apps", label: "Shopping Apps", description: "Mobile-first shopping products where app outages hit checkout and account access together.", popularSites: pickSites(["amazon.com", "walmart.com", "target.com", "temu.com", "shein.com", "instacart.com", "etsy.com"]) },
]

const EXTENDED_DOMAIN_SEEDS = uniqueDomains(
  STATUS_DOMAIN_NAMES,
  STATUS_CLOUD_DOMAINS,
  STATUS_ECOMMERCE_DOMAINS,
  STATUS_FINANCE_DOMAINS,
  STATUS_GAMING_DOMAINS,
  STATUS_SOCIAL_DOMAINS,
  STATUS_STREAMING_DOMAINS,
  AI_TOOL_DOMAINS,
  DEVELOPER_SERVICE_DOMAINS,
  PRODUCTIVITY_DOMAINS,
  EDUCATION_DOMAINS,
  SECURITY_DOMAINS,
  GOVERNMENT_AND_HEALTH_DOMAINS,
  TRAVEL_AND_DELIVERY_DOMAINS,
  STATUS_HOSTS
)

export const EXTENDED_STATUS_TRENDING_CATEGORIES = TRENDING_CATEGORY_SEEDS.map((entry) => ({
  ...entry,
  popularSites: pickSites(entry.popularSites, 18),
})) as const

export type ExtendedStatusTrendingCategory =
  (typeof EXTENDED_STATUS_TRENDING_CATEGORIES)[number]["category"]

export const EXTENDED_STATUS_TRENDING_CATEGORY_SET = new Set(
  EXTENDED_STATUS_TRENDING_CATEGORIES.map((entry) => entry.category)
)

export const EXTENDED_STATUS_OUTAGE_HISTORY_DOMAINS = EXTENDED_DOMAIN_SEEDS

export const EXTENDED_STATUS_TREND_SEGMENT_DOMAINS = Object.fromEntries(
  EXTENDED_STATUS_TRENDING_CATEGORIES.map((entry) => [entry.category, entry.popularSites])
) as Record<ExtendedStatusTrendingCategory, string[]>

export function isExtendedStatusTrendingCategory(
  value: string
): value is ExtendedStatusTrendingCategory {
  return EXTENDED_STATUS_TRENDING_CATEGORY_SET.has(value as ExtendedStatusTrendingCategory)
}

export function getExtendedStatusTrendingCategoryEntry(
  category: ExtendedStatusTrendingCategory
) {
  return (
    EXTENDED_STATUS_TRENDING_CATEGORIES.find((entry) => entry.category === category) ?? null
  )
}

export function getExtendedStatusTrendingPopularSites(
  category: ExtendedStatusTrendingCategory,
  limit = 12
) {
  const entry = getExtendedStatusTrendingCategoryEntry(category)
  if (!entry) return []
  return entry.popularSites.slice(0, limit)
}
