const HIGH_PRIORITY_DOMAINS = [
  "chatgpt.com",
  "reddit.com",
  "discord.com",
  "youtube.com",
  "google.com",
  "gmail.com",
  "github.com",
  "stripe.com",
  "netflix.com",
  "amazon.com",
  "openai.com",
  "cloudflare.com",
  "x.com",
  "instagram.com",
  "facebook.com",
  "tiktok.com",
  "linkedin.com",
  "whatsapp.com",
  "slack.com",
  "zoom.us",
  "notion.so",
  "figma.com",
  "shopify.com",
  "vercel.com",
  "supabase.com",
  "npmjs.com",
  "aws.amazon.com",
  "gitlab.com",
  "stackoverflow.com",
  "apple.com",
  "microsoft.com",
  "bing.com",
  "paypal.com",
  "wise.com",
  "coinbase.com",
  "binance.com",
  "roblox.com",
  "spotify.com",
  "primevideo.com",
  "hulu.com",
  "disneyplus.com",
  "twitch.tv",
  "pinterest.com",
  "quora.com",
  "imdb.com",
  "bbc.com",
  "cnn.com",
  "nytimes.com",
  "wikipedia.org",
  "yahoo.com",
] as const

const MAJOR_INTERNET_PLATFORMS = [
  "duckduckgo.com",
  "baidu.com",
  "yandex.ru",
  "yandex.com",
  "office.com",
  "live.com",
  "outlook.com",
  "onedrive.com",
  "icloud.com",
  "dropbox.com",
  "box.com",
  "adobe.com",
  "canva.com",
  "grammarly.com",
  "medium.com",
  "substack.com",
  "wordpress.com",
  "wix.com",
  "squarespace.com",
  "airtable.com",
  "zapier.com",
  "asana.com",
  "trello.com",
  "monday.com",
  "atlassian.com",
  "jira.com",
  "confluence.com",
  "bitbucket.org",
  "salesforce.com",
  "hubspot.com",
  "zendesk.com",
  "intercom.com",
  "freshworks.com",
  "linear.app",
  "clickup.com",
  "webflow.com",
  "framer.com",
  "namecheap.com",
  "godaddy.com",
  "cloudflarestatus.com",
  "statuspage.io",
  "uptimerobot.com",
  "newrelic.com",
  "datadoghq.com",
  "splunk.com",
  "elastic.co",
  "grafana.com",
  "sentry.io",
  "postman.com",
  "insomnia.rest",
  "nordvpn.com",
  "proton.me",
  "protonmail.com",
  "duck.com",
  "mozilla.org",
  "firefox.com",
  "opera.com",
  "brave.com",
  "safari.com",
  "intel.com",
  "amd.com",
  "nvidia.com",
  "arm.com",
  "qualcomm.com",
  "samsung.com",
  "xiaomi.com",
  "huawei.com",
  "sony.com",
  "lg.com",
  "panasonic.com",
  "toshiba.com",
  "lenovo.com",
  "dell.com",
  "hp.com",
  "acer.com",
  "asus.com",
  "walmart.com",
  "target.com",
  "costco.com",
  "bestbuy.com",
  "homedepot.com",
  "lowes.com",
  "ikea.com",
  "wayfair.com",
  "booking.com",
  "airbnb.com",
  "uber.com",
  "lyft.com",
  "doordash.com",
  "ubereats.com",
  "grubhub.com",
  "expedia.com",
  "tripadvisor.com",
  "kayak.com",
] as const

const GOOGLE_SERVICES = [
  "maps.google.com",
  "news.google.com",
  "docs.google.com",
  "drive.google.com",
  "calendar.google.com",
  "meet.google.com",
  "photos.google.com",
  "translate.google.com",
  "play.google.com",
  "trends.google.com",
  "analytics.google.com",
  "ads.google.com",
  "search.google.com",
  "workspace.google.com",
  "cloud.google.com",
  "mail.google.com",
  "bard.google.com",
  "gemini.google.com",
  "firebase.google.com",
  "developers.google.com",
  "console.cloud.google.com",
  "myaccount.google.com",
  "gstatic.com",
  "googleapis.com",
  "g.co",
  "goo.gl",
  "googlevideo.com",
  "blogger.com",
  "blogspot.com",
  "withgoogle.com",
] as const

const GOOGLE_COUNTRY_TLDS = [
  "com", "co.uk", "de", "fr", "it", "es", "pt", "nl", "be", "ch", "at", "ie", "se", "no", "dk",
  "fi", "pl", "cz", "sk", "hu", "ro", "bg", "gr", "tr", "ru", "ua", "lt", "lv", "ee", "hr", "si",
  "rs", "ba", "mk", "al", "me", "is", "lu", "li", "mt", "cy", "il", "ae", "sa", "qa", "kw", "bh",
  "om", "jo", "lb", "eg", "ma", "tn", "dz", "za", "ng", "ke", "gh", "tz", "ug", "et", "cm", "sn",
  "ci", "in", "pk", "bd", "lk", "np", "bt", "mm", "th", "vn", "my", "sg", "id", "ph", "hk", "tw",
  "jp", "kr", "cn", "au", "nz", "fj", "pg", "ws", "to", "mx", "ca", "us", "br", "ar", "cl", "co",
  "pe", "ve", "uy", "py", "bo", "ec", "do", "cr", "pa", "gt", "sv", "hn", "ni", "pr",
] as const

const GOOGLE_REGIONAL_DOMAINS = GOOGLE_COUNTRY_TLDS.map((tld) => `google.${tld}`)

const DEVELOPER_TOOLS = [
  "nodejs.org",
  "deno.com",
  "bun.sh",
  "python.org",
  "pypi.org",
  "rubygems.org",
  "php.net",
  "packagist.org",
  "golang.org",
  "go.dev",
  "rust-lang.org",
  "crates.io",
  "swift.org",
  "kotlinlang.org",
  "maven.org",
  "gradle.org",
  "docker.com",
  "hub.docker.com",
  "kubernetes.io",
  "helm.sh",
  "terraform.io",
  "hashicorp.com",
  "ansible.com",
  "puppet.com",
  "chef.io",
  "jenkins.io",
  "circleci.com",
  "travis-ci.com",
  "githubusercontent.com",
  "raw.githubusercontent.com",
  "githubstatus.com",
  "gitlabstatus.com",
  "readthedocs.io",
  "npmjs.org",
  "jsdelivr.net",
  "unpkg.com",
  "cdnjs.com",
  "vitejs.dev",
  "webpack.js.org",
  "babeljs.io",
  "typescriptlang.org",
  "nextjs.org",
  "react.dev",
  "vuejs.org",
  "nuxt.com",
  "svelte.dev",
  "astro.build",
  "tailwindcss.com",
  "eslint.org",
  "prettier.io",
  "vitest.dev",
  "jestjs.io",
  "playwright.dev",
  "cypress.io",
  "storybook.js.org",
  "supabase.com",
  "planetscale.com",
  "neon.tech",
  "railway.app",
  "render.com",
  "fly.io",
  "digitalocean.com",
  "linode.com",
  "heroku.com",
  "replit.com",
  "codesandbox.io",
  "stackblitz.com",
  "gitpod.io",
  "codepen.io",
  "glitch.com",
  "npmtrends.com",
  "openjsf.org",
  "web.dev",
  "w3.org",
  "developer.mozilla.org",
  "caniuse.com",
  "owasp.org",
] as const

const SAAS_PRODUCTS = [
  "zoom.us", "teams.microsoft.com", "meet.google.com", "webex.com", "skype.com", "slack.com",
  "discord.com", "notion.so", "clickup.com", "asana.com", "monday.com", "todoist.com", "evernote.com",
  "miro.com", "figma.com", "canva.com", "invisionapp.com", "zeplin.io", "framer.com", "webflow.com",
  "shopify.com", "bigcommerce.com", "woocommerce.com", "mailchimp.com", "klaviyo.com", "sendgrid.com",
  "brevo.com", "activecampaign.com", "convertkit.com", "hubspot.com", "salesforce.com", "pipedrive.com",
  "freshsales.io", "zendesk.com", "freshdesk.com", "intercom.com", "drift.com", "helpscout.com",
  "stripe.com", "squareup.com", "adyen.com", "checkout.com", "wise.com", "revolut.com", "xero.com",
  "quickbooks.intuit.com", "waveapps.com", "plaid.com", "ramp.com", "brex.com", "bill.com",
  "airtable.com", "coda.io", "retable.io", "smartsheet.com", "gist.github.com", "loom.com",
  "cal.com", "calendly.com", "acuityscheduling.com", "docusign.com", "hellosign.com", "pandaDoc.com",
  "typeform.com", "tally.so", "formstack.com", "jotform.com", "surveymonkey.com", "qualtrics.com",
  "mixpanel.com", "amplitude.com", "segment.com", "hotjar.com", "fullstory.com", "heap.io",
  "newrelic.com", "datadoghq.com", "appdynamics.com", "pagerduty.com", "opsgenie.com", "statuspage.io",
  "twilio.com", "vonage.com", "messagebird.com", "braze.com", "onesignal.com", "customer.io",
  "auth0.com", "okta.com", "clerk.com", "stytch.com", "fusionauth.io", "workos.com",
  "1password.com", "lastpass.com", "dashlane.com", "bitwarden.com", "keepersecurity.com",
  "dropbox.com", "box.com", "egnyte.com", "pcloud.com", "sync.com",
  "openai.com", "anthropic.com", "perplexity.ai", "poe.com", "character.ai", "writesonic.com",
  "jasper.ai", "copy.ai", "grammarly.com", "otter.ai", "descript.com", "runwayml.com",
] as const

const STREAMING_SERVICES = [
  "netflix.com", "primevideo.com", "disneyplus.com", "hulu.com", "max.com", "hbomax.com",
  "paramountplus.com", "peacocktv.com", "apple.com", "music.apple.com", "tv.apple.com",
  "spotify.com", "soundcloud.com", "deezer.com", "pandora.com", "tidal.com", "bandcamp.com",
  "youtube.com", "youtube.tv", "twitch.tv", "kick.com", "vimeo.com", "dailymotion.com",
  "crunchyroll.com", "funimation.com", "fubo.tv", "sling.com", "pluto.tv", "roku.com",
  "imdb.com", "letterboxd.com", "rottentomatoes.com", "metacritic.com", "steamcommunity.com",
] as const

const FINANCE_TOOLS = [
  "paypal.com", "wise.com", "stripe.com", "coinbase.com", "binance.com", "kraken.com", "gemini.com",
  "robinhood.com", "etrade.com", "fidelity.com", "charlesschwab.com", "schwab.com", "vanguard.com",
  "americanexpress.com", "visa.com", "mastercard.com", "discover.com", "capitalone.com", "chase.com",
  "bankofamerica.com", "wellsfargo.com", "citi.com", "hsbc.com", "barclays.com", "lloydsbank.com",
  "natwest.com", "santander.com", "ing.com", "bnpparibas.com", "societegenerale.com", "deutsche-bank.de",
  "ubs.com", "credit-suisse.com", "revolut.com", "monzo.com", "starlingbank.com", "n26.com",
  "klarna.com", "afterpay.com", "affirm.com", "zip.co", "venmo.com", "cash.app", "zellepay.com",
  "moneygram.com", "westernunion.com", "worldremit.com", "remitly.com", "xe.com", "oanda.com",
  "tradingview.com", "investing.com", "marketwatch.com", "bloomberg.com", "wsj.com", "ft.com",
] as const

const MESSAGING_APPS_AND_SOCIAL_NETWORKS = [
  "x.com", "twitter.com", "facebook.com", "instagram.com", "threads.net", "tiktok.com", "snapchat.com",
  "pinterest.com", "linkedin.com", "reddit.com", "quora.com", "tumblr.com", "vk.com", "weibo.com",
  "wechat.com", "line.me", "kakao.com", "telegram.org", "telegram.me", "signal.org", "viber.com",
  "whatsapp.com", "messenger.com", "discord.com", "slack.com", "teams.microsoft.com", "zoom.us",
  "skype.com", "clubhouse.com", "mastodon.social", "blueskyweb.xyz", "discord.gg",
] as const

const ECOMMERCE_PLATFORMS = [
  "amazon.com", "ebay.com", "walmart.com", "target.com", "bestbuy.com", "costco.com", "homedepot.com",
  "lowes.com", "ikea.com", "wayfair.com", "etsy.com", "aliexpress.com", "temu.com", "shein.com",
  "rakuten.com", "mercadolibre.com", "flipkart.com", "shopify.com", "zalando.com", "asos.com",
  "hm.com", "zara.com", "uniqlo.com", "nike.com", "adidas.com", "newbalance.com", "underarmour.com",
  "booking.com", "airbnb.com", "expedia.com", "trip.com", "tripadvisor.com", "kayak.com",
  "uber.com", "lyft.com", "doordash.com", "ubereats.com", "grubhub.com", "deliveroo.co.uk", "justeat.com",
  "instacart.com", "gopuff.com", "newegg.com", "microcenter.com", "bhphotovideo.com", "overstock.com",
] as const

const AMAZON_COUNTRY_TLDS = [
  "com", "co.uk", "de", "fr", "it", "es", "nl", "se", "pl", "com.be", "com.tr", "ae", "sa", "eg",
  "co.jp", "com.au", "com.br", "ca", "com.mx", "in", "sg",
] as const
const AMAZON_REGIONAL_DOMAINS = AMAZON_COUNTRY_TLDS.map((tld) => `amazon.${tld}`)

const BING_COUNTRY_TLDS = [
  "com", "co.uk", "de", "fr", "it", "es", "nl", "se", "pl", "pt", "tr", "ru", "jp", "kr",
  "com.au", "ca", "com.br", "com.mx", "in", "sg", "hk", "tw",
] as const
const BING_REGIONAL_DOMAINS = BING_COUNTRY_TLDS.map((tld) => `bing.${tld}`)

const EBAY_COUNTRY_TLDS = [
  "com", "co.uk", "de", "fr", "it", "es", "nl", "ie", "at", "pl", "ca", "com.au", "com.sg",
] as const
const EBAY_REGIONAL_DOMAINS = EBAY_COUNTRY_TLDS.map((tld) => `ebay.${tld}`)

const GLOBAL_BRAND_ROOTS = [
  "microsoft",
  "apple",
  "samsung",
  "sony",
  "xiaomi",
  "huawei",
  "lenovo",
  "dell",
  "hp",
  "intel",
  "amd",
  "nvidia",
  "nike",
  "adidas",
  "zara",
  "hm",
  "ikea",
  "booking",
  "airbnb",
  "uber",
  "walmart",
  "target",
  "costco",
  "bestbuy",
  "shopify",
  "stripe",
  "paypal",
  "notion",
  "figma",
  "slack",
] as const

const GLOBAL_BRAND_TLDS = [
  "com",
  "co.uk",
  "de",
  "fr",
  "it",
  "es",
  "nl",
  "se",
  "pl",
  "ca",
  "com.au",
  "com.br",
  "com.mx",
  "in",
  "jp",
  "kr",
  "sg",
  "tr",
  "ae",
  "sa",
] as const

const GLOBAL_BRAND_REGIONAL_DOMAINS = GLOBAL_BRAND_ROOTS.flatMap((root) =>
  GLOBAL_BRAND_TLDS.map((tld) => `${root}.${tld}`)
)

const BASE_STATUS_DOMAIN_GROUPS = [
  HIGH_PRIORITY_DOMAINS,
  MAJOR_INTERNET_PLATFORMS,
  GOOGLE_SERVICES,
  GOOGLE_REGIONAL_DOMAINS,
  DEVELOPER_TOOLS,
  SAAS_PRODUCTS,
  STREAMING_SERVICES,
  FINANCE_TOOLS,
  MESSAGING_APPS_AND_SOCIAL_NETWORKS,
  ECOMMERCE_PLATFORMS,
  AMAZON_REGIONAL_DOMAINS,
  BING_REGIONAL_DOMAINS,
  EBAY_REGIONAL_DOMAINS,
  GLOBAL_BRAND_REGIONAL_DOMAINS,
] as const

function dedupeDomains(groups: readonly (readonly string[])[]) {
  const seen = new Set<string>()
  const ordered: string[] = []

  for (const group of groups) {
    for (const domain of group) {
      const normalized = domain.trim().toLowerCase().replace(/\s+/g, "")
      if (!normalized) continue
      if (seen.has(normalized)) continue
      seen.add(normalized)
      ordered.push(normalized)
    }
  }

  return ordered
}

/**
 * Canonical status domain dataset for programmatic SEO.
 * This list is intentionally curated and grouped by high-intent utility categories.
 */
export const STATUS_DOMAINS = dedupeDomains(BASE_STATUS_DOMAIN_GROUPS)

/**
 * Pre-rendered status pages. Keep this subset focused on highest-demand routes.
 * Remaining STATUS_DOMAINS resolve via dynamic fallback in /status/[site].
 */
export const STATUS_STATIC_DOMAINS = STATUS_DOMAINS.slice(0, 320)

/**
 * Popular domains for hub links, related blocks, and trend defaults.
 */
export const STATUS_POPULAR_DOMAINS = STATUS_DOMAINS.slice(0, 64)

export const STATUS_TRENDING_DEFAULT = [
  "chatgpt.com",
  "discord.com",
  "reddit.com",
  "youtube.com",
  "netflix.com",
  "github.com",
  "stripe.com",
  "google.com",
] as const

export const STATUS_DEVELOPER_DOMAINS = [...DEVELOPER_TOOLS]
export const STATUS_SOCIAL_DOMAINS = [...MESSAGING_APPS_AND_SOCIAL_NETWORKS]
export const STATUS_STREAMING_DOMAINS = [...STREAMING_SERVICES]
export const STATUS_SAAS_DOMAINS = [...SAAS_PRODUCTS]
export const STATUS_CONSUMER_DOMAINS = [...HIGH_PRIORITY_DOMAINS]

export type StatusTrendSegment =
  | "all"
  | "consumer"
  | "developer"
  | "social"
  | "streaming"
  | "saas"

export const STATUS_TREND_SEGMENT_DOMAINS: Record<
  Exclude<StatusTrendSegment, "all">,
  string[]
> = {
  consumer: STATUS_CONSUMER_DOMAINS,
  developer: STATUS_DEVELOPER_DOMAINS,
  social: STATUS_SOCIAL_DOMAINS,
  streaming: STATUS_STREAMING_DOMAINS,
  saas: STATUS_SAAS_DOMAINS,
}
