import {
  EXTENDED_STATUS_TRENDING_CATEGORIES,
  getExtendedStatusTrendingCategoryEntry,
  getExtendedStatusTrendingPopularSites,
  isExtendedStatusTrendingCategory,
} from "@/lib/status-trends-extended"

type DeepTrendingCategorySeed = {
  category: string
  description: string
  keywords: string[]
  label: string
  popularSites: string[]
}

function uniqueSites(...groups: ReadonlyArray<ReadonlyArray<string>>) {
  return Array.from(
    new Set(
      groups.flatMap((group) =>
        group.map((site) => site.trim().toLowerCase()).filter(Boolean)
      )
    )
  )
}

const EXTRA_STATUS_TRENDING_CATEGORIES: DeepTrendingCategorySeed[] = [
  {
    category: "cdn",
    label: "CDN Providers",
    description: "Content-delivery and edge platforms where latency and caching failures create sharp incident demand.",
    keywords: ["cdn outage", "edge outage", "cdn status"],
    popularSites: uniqueSites(["cloudflare.com", "fastly.com", "akamai.com", "cdn77.com", "jsdelivr.net", "cdnjs.com"]),
  },
  {
    category: "email-services",
    label: "Email Services",
    description: "Email delivery and mailbox platforms where login, sync, and send failures create strong search spikes.",
    keywords: ["email outage", "mail down", "inbox not working"],
    popularSites: uniqueSites(["gmail.com", "outlook.com", "yahoo.com", "proton.me", "mail.google.com", "sendgrid.com", "mailchimp.com"]),
  },
  {
    category: "government-sites",
    label: "Government Sites",
    description: "Public-sector service portals where outages block benefits, filing, and identity workflows.",
    keywords: ["government site down", "public service outage", "gov portal outage"],
    popularSites: uniqueSites(["irs.gov", "ssa.gov", "healthcare.gov", "gov.uk", "uscis.gov", "va.gov", "my.gov.au"]),
  },
  {
    category: "banks-payments",
    label: "Banks and Payments",
    description: "Bank logins, transfers, cards, and payment rails with unusually strong user urgency.",
    keywords: ["bank outage", "payment outage", "banking down"],
    popularSites: uniqueSites(["chase.com", "bankofamerica.com", "wellsfargo.com", "paypal.com", "stripe.com", "squareup.com"]),
  },
  {
    category: "b2b-saas",
    label: "B2B SaaS",
    description: "Operational SaaS products used by teams that create both traffic and stronger advertiser value.",
    keywords: ["saas outage", "workspace outage", "b2b software status"],
    popularSites: uniqueSites(["notion.so", "asana.com", "monday.com", "clickup.com", "salesforce.com", "hubspot.com"]),
  },
  {
    category: "customer-support",
    label: "Customer Support",
    description: "Support, ticketing, and chat systems where failures create immediate operational impact.",
    keywords: ["support platform down", "ticketing outage", "chat support outage"],
    popularSites: uniqueSites(["zendesk.com", "intercom.com", "freshdesk.com", "helpscout.com", "drift.com"]),
  },
  {
    category: "video-conferencing",
    label: "Video Conferencing",
    description: "Meeting platforms where call failures generate fast same-day query volume.",
    keywords: ["zoom down", "meeting outage", "video conference outage"],
    popularSites: uniqueSites(["zoom.us", "teams.microsoft.com", "meet.google.com", "webex.com", "whereby.com"]),
  },
  {
    category: "file-storage",
    label: "File Storage",
    description: "Cloud storage and document repositories where sync or auth problems block daily work.",
    keywords: ["storage outage", "cloud drive down", "sync not working"],
    popularSites: uniqueSites(["dropbox.com", "box.com", "onedrive.com", "drive.google.com", "egnyte.com"]),
  },
  {
    category: "delivery-logistics",
    label: "Delivery and Logistics",
    description: "Delivery, ride, and logistics apps where outages affect orders, dispatch, and tracking.",
    keywords: ["delivery app down", "logistics outage", "tracking service outage"],
    popularSites: uniqueSites(["doordash.com", "ubereats.com", "instacart.com", "uber.com", "lyft.com", "deliveroo.co.uk"]),
  },
  {
    category: "travel-booking",
    label: "Travel Booking",
    description: "Travel planning and booking services with strong incident-day demand.",
    keywords: ["travel site down", "booking outage", "flight app down"],
    popularSites: uniqueSites(["booking.com", "airbnb.com", "expedia.com", "tripadvisor.com", "kayak.com", "trip.com"]),
  },
  {
    category: "dns-providers",
    label: "DNS Providers",
    description: "DNS and registrar services where resolver or control-panel problems cause broad downstream incidents.",
    keywords: ["dns provider outage", "registrar outage", "dns control panel down"],
    popularSites: uniqueSites(["cloudflare.com", "namecheap.com", "godaddy.com", "dnsimple.com", "route53.amazonaws.com"]),
  },
  {
    category: "registrars",
    label: "Registrars",
    description: "Domain registrars and DNS dashboards where incident impact spreads into website availability checks.",
    keywords: ["registrar down", "domain management outage", "nameserver issue"],
    popularSites: uniqueSites(["godaddy.com", "namecheap.com", "hover.com", "porkbun.com", "gandi.net"]),
  },
  {
    category: "ai-coding",
    label: "AI Coding Tools",
    description: "AI-assisted coding tools and copilots with high-value developer demand.",
    keywords: ["ai coding outage", "copilot down", "cursor down"],
    popularSites: uniqueSites(["cursor.com", "bolt.new", "v0.dev", "replit.com", "github.com", "openai.com"]),
  },
  {
    category: "ai-image",
    label: "AI Image Tools",
    description: "Generative image and media tools where rendering failures create fresh long-tail demand.",
    keywords: ["ai image generator down", "render outage", "image ai outage"],
    popularSites: uniqueSites(["midjourney.com", "stability.ai", "runwayml.com", "replicate.com", "canva.com"]),
  },
  {
    category: "ai-apis",
    label: "AI APIs",
    description: "API-first AI providers with commercial-intent incident traffic.",
    keywords: ["ai api outage", "openai api down", "anthropic api down"],
    popularSites: uniqueSites(["platform.openai.com", "console.anthropic.com", "cohere.com", "mistral.ai", "groq.com"]),
  },
  {
    category: "payment-rails",
    label: "Payment Rails",
    description: "Card and wallet rails that affect checkout flows beyond a single app.",
    keywords: ["payment rail outage", "card network down", "wallet not working"],
    popularSites: uniqueSites(["visa.com", "mastercard.com", "americanexpress.com", "apple.com", "google.com", "paypal.com"]),
  },
  {
    category: "brokerage-trading",
    label: "Brokerage and Trading",
    description: "Brokerage and market tools with especially strong RPM during market-hour incidents.",
    keywords: ["brokerage down", "trading app outage", "investing platform outage"],
    popularSites: uniqueSites(["robinhood.com", "fidelity.com", "etrade.com", "schwab.com", "coinbase.com", "tradingview.com"]),
  },
  {
    category: "workplace-chat",
    label: "Workplace Chat",
    description: "Enterprise chat and async communication systems with clear operational outage intent.",
    keywords: ["work chat down", "slack down", "teams outage"],
    popularSites: uniqueSites(["slack.com", "teams.microsoft.com", "discord.com", "workplace.com", "chat.google.com"]),
  },
  {
    category: "collaboration-docs",
    label: "Collaboration Docs",
    description: "Docs and workspace products where sync and sharing issues block teams.",
    keywords: ["docs outage", "workspace docs down", "sharing not working"],
    popularSites: uniqueSites(["docs.google.com", "notion.so", "coda.io", "airtable.com", "confluence.com"]),
  },
  {
    category: "tax-benefits",
    label: "Tax and Benefits",
    description: "Tax filing and benefits portals with high urgency during deadlines and pay cycles.",
    keywords: ["tax portal down", "benefits site outage", "government benefits outage"],
    popularSites: uniqueSites(["irs.gov", "ssa.gov", "medicare.gov", "medicaid.gov", "hmrc.gov.uk", "cra-arc.gc.ca"]),
  },
  {
    category: "health-portals",
    label: "Health Portals",
    description: "Healthcare record and account portals where login failures are both high stress and high intent.",
    keywords: ["patient portal down", "health app outage", "medical records outage"],
    popularSites: uniqueSites(["mychart.com", "healthcare.gov", "nhs.uk", "va.gov", "my.clevelandclinic.org"]),
  },
  {
    category: "cdn-security",
    label: "CDN and Security Edge",
    description: "Edge security providers where outages can look like global website failures.",
    keywords: ["cdn security outage", "waf outage", "edge security down"],
    popularSites: uniqueSites(["cloudflare.com", "akamai.com", "fastly.com", "imperva.com", "sucuri.net"]),
  },
  {
    category: "mobile-wallets",
    label: "Mobile Wallets",
    description: "Mobile-first money apps and wallets with strong consumer urgency.",
    keywords: ["mobile wallet down", "wallet app outage", "cash app down"],
    popularSites: uniqueSites(["cash.app", "venmo.com", "paypal.com", "apple.com", "google.com", "revolut.com"]),
  },
  {
    category: "creator-payments",
    label: "Creator Payments",
    description: "Platforms where creator revenue flows depend on uptime and payment delivery.",
    keywords: ["creator platform down", "payout outage", "patreon down"],
    popularSites: uniqueSites(["patreon.com", "substack.com", "shopify.com", "stripe.com", "paypal.com", "youtube.com"]),
  },
  {
    category: "shopping-checkout",
    label: "Shopping Checkout",
    description: "Checkout-heavy commerce surfaces where outage intent maps cleanly to revenue impact.",
    keywords: ["checkout down", "shopping payment outage", "cart not working"],
    popularSites: uniqueSites(["amazon.com", "shopify.com", "etsy.com", "walmart.com", "target.com", "bestbuy.com"]),
  },
  {
    category: "vpn-services",
    label: "VPN Services",
    description: "VPN and privacy-network providers where outages blur the line between local and provider-side failure.",
    keywords: ["vpn outage", "vpn down", "privacy network outage"],
    popularSites: uniqueSites(["nordvpn.com", "expressvpn.com", "surfshark.com", "proton.me", "windscribe.com", "cyberghostvpn.com"]),
  },
  {
    category: "search-engines",
    label: "Search Engines",
    description: "Search providers where homepage, index, or result issues drive immediate user checks.",
    keywords: ["search engine down", "google down", "bing outage"],
    popularSites: uniqueSites(["google.com", "google.co.uk", "bing.com", "duckduckgo.com", "yahoo.com", "baidu.com"]),
  },
  {
    category: "browsers-sync",
    label: "Browsers and Sync",
    description: "Browser account, sync, and identity ecosystems where auth and data-sync failures create high-friction incidents.",
    keywords: ["browser sync down", "browser account outage", "sync outage"],
    popularSites: uniqueSites(["chrome.google.com", "firefox.com", "mozilla.org", "opera.com", "brave.com", "microsoft.com"]),
  },
  {
    category: "maps-navigation",
    label: "Maps and Navigation",
    description: "Mapping and navigation services where outages affect travel, delivery, and location workflows immediately.",
    keywords: ["maps down", "navigation outage", "gps app down"],
    popularSites: uniqueSites(["maps.google.com", "waze.com", "apple.com", "citymapper.com", "uber.com", "lyft.com"]),
  },
  {
    category: "ride-hailing",
    label: "Ride Hailing",
    description: "Ride and dispatch platforms where service issues carry same-day demand and payment sensitivity.",
    keywords: ["ride app down", "uber down", "lyft outage"],
    popularSites: uniqueSites(["uber.com", "lyft.com", "bolt.eu", "grab.com", "free-now.com"]),
  },
  {
    category: "airlines-booking",
    label: "Airlines and Booking",
    description: "Airline, rail, and booking sites where outages affect check-in, ticketing, and live travel decisions.",
    keywords: ["airline outage", "booking down", "check in not working"],
    popularSites: uniqueSites(["delta.com", "united.com", "americanairlines.com", "southwest.com", "booking.com", "expedia.com"]),
  },
  {
    category: "tax-filing",
    label: "Tax Filing",
    description: "Tax preparation and filing services with high deadline pressure and strong search urgency.",
    keywords: ["tax filing down", "irs outage", "tax software outage"],
    popularSites: uniqueSites(["irs.gov", "turbotax.intuit.com", "hrblock.com", "taxslayer.com", "freetaxusa.com"]),
  },
  {
    category: "benefits-portals",
    label: "Benefits Portals",
    description: "Benefits, payroll, and government access portals that create practical outage demand around pay and claims.",
    keywords: ["benefits portal down", "payroll outage", "claims portal outage"],
    popularSites: uniqueSites(["ssa.gov", "medicare.gov", "medicaid.gov", "adp.com", "workday.com", "my.gov.au"]),
  },
  {
    category: "identity-auth",
    label: "Identity and Auth",
    description: "Identity providers and SSO tools where one failure can break many downstream services.",
    keywords: ["sso outage", "auth outage", "login provider down"],
    popularSites: uniqueSites(["okta.com", "auth0.com", "clerk.com", "stytch.com", "workos.com", "duo.com"]),
  },
  {
    category: "package-registries",
    label: "Package Registries",
    description: "Package distribution services where outages break installs, deployments, and CI pipelines.",
    keywords: ["registry outage", "npm down", "pypi outage"],
    popularSites: uniqueSites(["npmjs.com", "pypi.org", "rubygems.org", "packagist.org", "crates.io", "maven.org"]),
  },
  {
    category: "ci-cd",
    label: "CI and CD",
    description: "Build, deploy, and release pipelines with high operational urgency during incidents.",
    keywords: ["ci outage", "deploy outage", "pipeline down"],
    popularSites: uniqueSites(["github.com", "gitlab.com", "circleci.com", "travis-ci.com", "jenkins.io", "vercel.com"]),
  },
  {
    category: "domain-hosting",
    label: "Domain and Hosting",
    description: "Domain, DNS, and hosting control surfaces where outages spill into website availability problems.",
    keywords: ["hosting outage", "domain panel down", "registrar issue"],
    popularSites: uniqueSites(["godaddy.com", "namecheap.com", "cloudflare.com", "hostinger.com", "siteground.com", "bluehost.com"]),
  },
  {
    category: "news-publishers",
    label: "News Publishers",
    description: "Major publishers where breaking-news surges and paywall issues drive repeat checks.",
    keywords: ["news site down", "publisher outage", "news app not working"],
    popularSites: uniqueSites(["bbc.com", "cnn.com", "nytimes.com", "theguardian.com", "reuters.com", "bloomberg.com"]),
  },
  {
    category: "sports-services",
    label: "Sports Services",
    description: "Sports broadcasters, score apps, and fantasy products with intense event-day traffic.",
    keywords: ["sports app down", "fantasy outage", "scores not updating"],
    popularSites: uniqueSites(["espn.com", "dazn.com", "fubo.tv", "draftkings.com", "fanduel.com", "sofascore.com"]),
  },
  {
    category: "crypto-wallets",
    label: "Crypto Wallets",
    description: "Wallet, exchange, and on-ramp products where outages affect access and transfers directly.",
    keywords: ["wallet down", "crypto exchange outage", "transfer not working"],
    popularSites: uniqueSites(["coinbase.com", "binance.com", "kraken.com", "metamask.io", "phantom.app", "ledger.com"]),
  },
  {
    category: "creator-platforms",
    label: "Creator Platforms",
    description: "Creator, publishing, and audience products with high direct-to-income sensitivity during incidents.",
    keywords: ["creator platform down", "substack down", "patreon outage"],
    popularSites: uniqueSites(["patreon.com", "substack.com", "medium.com", "youtube.com", "twitch.tv", "gumroad.com"]),
  },
  {
    category: "ad-platforms",
    label: "Ad Platforms",
    description: "Advertising and campaign tools where outages affect spend, attribution, and revenue quickly.",
    keywords: ["ads platform down", "campaign manager outage", "ad account issue"],
    popularSites: uniqueSites(["ads.google.com", "facebook.com", "linkedin.com", "taboola.com", "outbrain.com", "thetradedesk.com"]),
  },
  {
    category: "marketing-automation",
    label: "Marketing Automation",
    description: "Email and lifecycle platforms where incidents impact sends, tracking, and revenue attribution.",
    keywords: ["marketing automation outage", "email send outage", "crm workflow down"],
    popularSites: uniqueSites(["mailchimp.com", "klaviyo.com", "activecampaign.com", "customer.io", "braze.com", "convertkit.com"]),
  },
  {
    category: "work-hubs",
    label: "Work Hubs",
    description: "Workspace and all-in-one tools that combine docs, tasks, chat, and automation for teams.",
    keywords: ["workspace outage", "work hub down", "team app outage"],
    popularSites: uniqueSites(["notion.so", "slack.com", "monday.com", "clickup.com", "coda.io", "airtable.com"]),
  },
  {
    category: "code-hosting",
    label: "Code Hosting",
    description: "Source hosting and developer collaboration products with high operational impact.",
    keywords: ["code hosting down", "github down", "gitlab outage"],
    popularSites: uniqueSites(["github.com", "gitlab.com", "bitbucket.org", "azure.com", "sourceforge.net"]),
  },
]

export const STATUS_TRENDING_CATEGORIES = [
  ...EXTENDED_STATUS_TRENDING_CATEGORIES.map((entry) => ({
    ...entry,
    keywords: [entry.category, entry.label.toLowerCase(), "status", "outage"],
  })),
  ...EXTRA_STATUS_TRENDING_CATEGORIES,
] as const

export type StatusTrendingCategory =
  (typeof STATUS_TRENDING_CATEGORIES)[number]["category"]

const STATUS_TRENDING_CATEGORY_SET = new Set(
  STATUS_TRENDING_CATEGORIES.map((entry) => entry.category)
)

export function isStatusTrendingCategory(value: string): value is StatusTrendingCategory {
  return STATUS_TRENDING_CATEGORY_SET.has(value as StatusTrendingCategory)
}

export function getStatusTrendingCategoryEntry(category: StatusTrendingCategory) {
  if (isExtendedStatusTrendingCategory(category)) {
    const existing = getExtendedStatusTrendingCategoryEntry(category)
    if (existing) {
      return {
        ...existing,
        keywords: [existing.category, existing.label.toLowerCase(), "status", "outage"],
      }
    }
  }

  return (
    STATUS_TRENDING_CATEGORIES.find((entry) => entry.category === category) ?? null
  )
}

export function getStatusTrendingPopularSites(
  category: StatusTrendingCategory,
  limit = 18
) {
  if (isExtendedStatusTrendingCategory(category)) {
    const sites = getExtendedStatusTrendingPopularSites(category, limit)
    if (sites.length > 0) return sites
  }

  const entry = getStatusTrendingCategoryEntry(category)
  if (!entry) return []
  return entry.popularSites.slice(0, limit)
}
