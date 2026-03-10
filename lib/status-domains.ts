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

const AI_SERVICES = [
  "chatgpt.com",
  "openai.com",
  "platform.openai.com",
  "anthropic.com",
  "claude.ai",
  "gemini.google.com",
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
  "notebooklm.google.com",
] as const

const CLOUD_PROVIDERS = [
  "aws.amazon.com",
  "console.aws.amazon.com",
  "status.aws.amazon.com",
  "cloud.google.com",
  "console.cloud.google.com",
  "azure.com",
  "portal.azure.com",
  "status.azure.com",
  "cloudflare.com",
  "dash.cloudflare.com",
  "workers.cloudflare.com",
  "vercel.com",
  "status.vercel.com",
  "supabase.com",
  "status.supabase.com",
  "render.com",
  "fly.io",
  "railway.app",
  "digitalocean.com",
  "linode.com",
  "heroku.com",
  "netlify.com",
  "mongodb.com",
  "planetscale.com",
  "neon.tech",
] as const

const GAMING_PLATFORMS = [
  "steamcommunity.com",
  "store.steampowered.com",
  "epicgames.com",
  "fortnite.com",
  "xbox.com",
  "playstation.com",
  "nintendo.com",
  "battle.net",
  "blizzard.com",
  "ea.com",
  "origin.com",
  "ubisoft.com",
  "riotgames.com",
  "leagueoflegends.com",
  "valorant.com",
  "roblox.com",
  "minecraft.net",
  "gog.com",
  "itch.io",
  "fandom.com",
  "ign.com",
  "gamespot.com",
  "polygon.com",
  "metacritic.com",
  "twitch.tv",
] as const

const NEWS_SITES = [
  "bbc.com",
  "cnn.com",
  "nytimes.com",
  "wsj.com",
  "ft.com",
  "bloomberg.com",
  "reuters.com",
  "theguardian.com",
  "washingtonpost.com",
  "forbes.com",
  "time.com",
  "economist.com",
  "nbcnews.com",
  "abcnews.go.com",
  "cbsnews.com",
  "apnews.com",
  "aljazeera.com",
  "npr.org",
  "usatoday.com",
  "news.ycombinator.com",
  "techcrunch.com",
  "theverge.com",
  "wired.com",
  "engadget.com",
  "arstechnica.com",
] as const

const EDUCATION_PLATFORMS = [
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
  "canvas.instructure.com",
  "blackboard.com",
  "moodle.org",
  "open.edu",
  "mit.edu",
  "stanford.edu",
  "harvard.edu",
  "wikipedia.org",
] as const

const DESIGN_TOOLS = [
  "figma.com",
  "canva.com",
  "adobe.com",
  "photoshop.adobe.com",
  "illustrator.adobe.com",
  "framer.com",
  "webflow.com",
  "dribbble.com",
  "behance.net",
  "invisionapp.com",
  "sketch.com",
  "zeplin.io",
  "miro.com",
  "notion.so",
  "penpot.app",
  "coolors.co",
  "fontawesome.com",
  "unsplash.com",
  "pexels.com",
  "freepik.com",
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
  AI_SERVICES,
  FINANCE_TOOLS,
  CLOUD_PROVIDERS,
  GAMING_PLATFORMS,
  NEWS_SITES,
  EDUCATION_PLATFORMS,
  DESIGN_TOOLS,
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

export type StatusCategory =
  | "social"
  | "messaging"
  | "streaming"
  | "developer-tools"
  | "saas"
  | "ai"
  | "finance"
  | "ecommerce"
  | "productivity"
  | "cloud"
  | "gaming"
  | "news"
  | "education"
  | "design"

export type StatusDomain = {
  domain: string
  category: StatusCategory
  displayName: string
}

const RAW_STATUS_DOMAINS = dedupeDomains(BASE_STATUS_DOMAIN_GROUPS)

const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  "aws.amazon.com": "AWS",
  "chatgpt.com": "ChatGPT",
  "claude.ai": "Claude",
  "x.com": "X",
  "gmail.com": "Gmail",
  "github.com": "GitHub",
  "gitlab.com": "GitLab",
  "youtube.com": "YouTube",
  "youtube.tv": "YouTube TV",
  "primevideo.com": "Prime Video",
  "disneyplus.com": "Disney+",
  "hbomax.com": "HBO Max",
  "tv.apple.com": "Apple TV",
  "music.apple.com": "Apple Music",
  "teams.microsoft.com": "Microsoft Teams",
  "zoom.us": "Zoom",
  "line.me": "LINE",
  "kakao.com": "Kakao",
  "openai.com": "OpenAI",
  "perplexity.ai": "Perplexity",
  "character.ai": "Character.AI",
  "npmjs.com": "npm",
  "npmjs.org": "npm",
  "pypi.org": "PyPI",
  "crates.io": "crates.io",
  "go.dev": "Go",
  "react.dev": "React",
  "nextjs.org": "Next.js",
  "tailwindcss.com": "Tailwind CSS",
  "cloudflare.com": "Cloudflare",
  "digitalocean.com": "DigitalOcean",
  "microsoft.com": "Microsoft",
  "apple.com": "Apple",
  "bbc.com": "BBC",
  "nytimes.com": "The New York Times",
  "wsj.com": "The Wall Street Journal",
  "ft.com": "Financial Times",
  "reddit.com": "Reddit",
  "discord.com": "Discord",
  "notion.so": "Notion",
  "figma.com": "Figma",
  "canva.com": "Canva",
  "adobe.com": "Adobe",
}

const CATEGORY_RULES: Array<{ category: StatusCategory; pattern: RegExp }> = [
  {
    category: "ai",
    pattern:
      /(chatgpt|openai|anthropic|claude|gemini|perplexity|poe\.com|character\.ai|jasper|copy\.ai|writesonic|runway|stability|huggingface|midjourney)/,
  },
  {
    category: "cloud",
    pattern:
      /(aws|amazonaws|azure|cloud\.google|cloudflare|digitalocean|linode|heroku|render\.com|fly\.io|vercel|supabase|neon\.tech|planetscale|railway|kubernetes|terraform|hashicorp)/,
  },
  {
    category: "developer-tools",
    pattern:
      /(github|gitlab|bitbucket|npmjs|pypi|packagist|crates\.io|golang|go\.dev|rust-lang|nodejs|deno|bun\.sh|docker|jenkins|circleci|travis|vitejs|webpack|babeljs|typescriptlang|nextjs|react\.dev|vuejs|nuxt|svelte|astro\.build|tailwindcss|eslint|prettier|vitest|jestjs|playwright|cypress|storybook|postman|insomnia|owasp)/,
  },
  {
    category: "streaming",
    pattern:
      /(youtube|netflix|primevideo|disneyplus|hulu|max\.com|hbomax|paramountplus|peacocktv|spotify|soundcloud|deezer|pandora|tidal|bandcamp|twitch|vimeo|dailymotion|crunchyroll|fubo|sling|pluto\.tv|roku)/,
  },
  {
    category: "gaming",
    pattern:
      /(steam|epicgames|roblox|xbox|playstation|nintendo|riotgames|ea\.com|ubisoft|battle\.net|minecraft|valorant|fortnite|origin\.com|gog\.com|itch\.io)/,
  },
  {
    category: "finance",
    pattern:
      /(stripe|paypal|wise|coinbase|binance|kraken|robinhood|fidelity|vanguard|visa|mastercard|americanexpress|chase|wellsfargo|citi|hsbc|barclays|monzo|revolut|n26|klarna|afterpay|affirm|cash\.app|zelle|moneygram|westernunion|oanda|tradingview|investing\.com)/,
  },
  {
    category: "ecommerce",
    pattern:
      /(amazon|ebay|walmart|target|bestbuy|costco|homedepot|lowes|ikea|wayfair|etsy|aliexpress|temu|shein|rakuten|mercadolibre|flipkart|shopify|zalando|asos|zara|uniqlo|nike|adidas|booking|airbnb|doordash|ubereats|grubhub|deliveroo|justeat|instacart|newegg|overstock)/,
  },
  {
    category: "messaging",
    pattern:
      /(discord|slack|whatsapp|telegram|signal|viber|line\.me|kakao|wechat|messenger|teams\.microsoft|zoom\.us|skype|webex|clubhouse|twilio|vonage|messagebird)/,
  },
  {
    category: "social",
    pattern:
      /(reddit|facebook|instagram|threads|tiktok|snapchat|pinterest|linkedin|x\.com|twitter|quora|tumblr|vk\.com|weibo|mastodon|bluesky)/,
  },
  {
    category: "design",
    pattern:
      /(figma|canva|adobe|dribbble|behance|invision|framer|webflow|sketch|zeplin|miro|loom|descript)/,
  },
  {
    category: "education",
    pattern:
      /(coursera|edx|khanacademy|udemy|udacity|futurelearn|quizlet|duolingo|blackboard|instructure|canvas|academia|researchgate|wikipedia|mit\.edu|harvard\.edu|stanford\.edu|open\.edu)/,
  },
  {
    category: "news",
    pattern:
      /(bbc|cnn|nytimes|wsj|ft\.com|bloomberg|reuters|aljazeera|foxnews|nbcnews|abcnews|theguardian|washingtonpost|economist|forbes|time\.com)/,
  },
  {
    category: "productivity",
    pattern:
      /(notion|airtable|asana|trello|monday|clickup|todoist|evernote|dropbox|box\.com|calendly|docusign|hellosign|pandadoc|typeform|jotform|surveymonkey|grammarly|coda\.io|smartsheet|intercom|zendesk|freshdesk|hubspot|salesforce|mailchimp|zapier|atlassian|jira|confluence|onedrive|office\.com|outlook\.com)/,
  },
]

function toDisplayName(domain: string) {
  const normalized = domain.trim().toLowerCase()
  const override = DISPLAY_NAME_OVERRIDES[normalized]
  if (override) return override

  const baseLabel = normalized.replace(/^www\./, "").split(".")[0] ?? normalized
  return baseLabel
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function inferCategory(domain: string): StatusCategory {
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(domain)) return rule.category
  }
  return "saas"
}

/**
 * Canonical structured status dataset used by /status/[site], hubs, and sitemaps.
 */
export const STATUS_DOMAINS: StatusDomain[] = RAW_STATUS_DOMAINS.map((domain) => ({
  domain,
  category: inferCategory(domain),
  displayName: toDisplayName(domain),
}))

export const STATUS_DOMAIN_NAMES = STATUS_DOMAINS.map((entry) => entry.domain)
export const STATUS_DOMAIN_SET = new Set(STATUS_DOMAIN_NAMES)

export const STATUS_CATEGORIES: StatusCategory[] = [
  "social",
  "messaging",
  "streaming",
  "developer-tools",
  "saas",
  "ai",
  "finance",
  "ecommerce",
  "productivity",
  "cloud",
  "gaming",
  "news",
  "education",
  "design",
]

/**
 * Primary category set used for high-intent "is [site] down" discovery.
 * These map closely to the major search clusters we want to win first.
 */
export const STATUS_PRIMARY_CATEGORIES: StatusCategory[] = [
  "social",
  "streaming",
  "ai",
  "developer-tools",
  "finance",
  "ecommerce",
  "productivity",
  "cloud",
  "gaming",
  "news",
]

export const STATUS_CATEGORY_META: Record<
  StatusCategory,
  { title: string; description: string }
> = {
  social: {
    title: "Social platform status",
    description:
      "Check whether major social platforms are down right now and jump to canonical outage pages.",
  },
  messaging: {
    title: "Messaging service status",
    description:
      "Check live availability for chat and messaging platforms with practical troubleshooting guidance.",
  },
  streaming: {
    title: "Streaming service status",
    description:
      "Check whether streaming platforms are down, degraded, or responding slowly.",
  },
  "developer-tools": {
    title: "Developer tool status",
    description:
      "Monitor status checks for code hosting, package registries, and developer infrastructure.",
  },
  saas: {
    title: "SaaS platform status",
    description:
      "Browse uptime checks for common SaaS products and workflow platforms.",
  },
  ai: {
    title: "AI service status",
    description:
      "Check whether AI platforms and assistant services are currently down or degraded.",
  },
  finance: {
    title: "Finance platform status",
    description:
      "Check live status for payments, banking, and finance services.",
  },
  ecommerce: {
    title: "Ecommerce platform status",
    description:
      "Check availability of ecommerce marketplaces, retail platforms, and ordering services.",
  },
  productivity: {
    title: "Productivity app status",
    description:
      "Check productivity and collaboration tools for outages and response issues.",
  },
  cloud: {
    title: "Cloud platform status",
    description:
      "Check cloud and hosting provider routes for availability and response-time issues.",
  },
  gaming: {
    title: "Gaming platform status",
    description:
      "Check gaming platforms and services for outages and login issues.",
  },
  news: {
    title: "News site status",
    description:
      "Check status pages for major news publishers and media websites.",
  },
  education: {
    title: "Education platform status",
    description:
      "Check learning and education services for current downtime and access issues.",
  },
  design: {
    title: "Design tool status",
    description:
      "Check design and creative tool platforms for outages and service degradation.",
  },
}

export const STATUS_DOMAINS_BY_CATEGORY: Record<StatusCategory, StatusDomain[]> = STATUS_CATEGORIES
  .reduce(
    (accumulator, category) => {
      accumulator[category] = STATUS_DOMAINS.filter((entry) => entry.category === category)
      return accumulator
    },
    {} as Record<StatusCategory, StatusDomain[]>
  )

/**
 * Public count for UI copy, sitemap commentary, and QA checks.
 * Current curated dataset size intentionally exceeds 1,000 domains.
 */
export const STATUS_DOMAIN_COUNT = STATUS_DOMAINS.length

/**
 * Pre-render all curated status routes to maximize crawlable coverage.
 */
export const STATUS_STATIC_DOMAINS = STATUS_DOMAIN_NAMES

/**
 * Popular domains for internal links and home/status discovery.
 */
export const STATUS_POPULAR_DOMAINS = STATUS_DOMAIN_NAMES.slice(0, 120)

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

export const STATUS_HIGH_DEMAND_SITES = [
  "chatgpt.com",
  "discord.com",
  "reddit.com",
  "youtube.com",
  "github.com",
  "netflix.com",
  "gmail.com",
  "amazon.com",
  "instagram.com",
  "facebook.com",
] as const

export const STATUS_DEVELOPER_DOMAINS = STATUS_DOMAINS_BY_CATEGORY["developer-tools"].map(
  (entry) => entry.domain
)
export const STATUS_CLOUD_DOMAINS = STATUS_DOMAINS_BY_CATEGORY.cloud.map(
  (entry) => entry.domain
)
export const STATUS_FINANCE_DOMAINS = STATUS_DOMAINS_BY_CATEGORY.finance.map(
  (entry) => entry.domain
)
export const STATUS_GAMING_DOMAINS = STATUS_DOMAINS_BY_CATEGORY.gaming.map(
  (entry) => entry.domain
)
export const STATUS_SOCIAL_DOMAINS = Array.from(
  new Set([
    ...STATUS_DOMAINS_BY_CATEGORY.social.map((entry) => entry.domain),
    ...STATUS_DOMAINS_BY_CATEGORY.messaging.map((entry) => entry.domain),
  ])
)
export const STATUS_STREAMING_DOMAINS = STATUS_DOMAINS_BY_CATEGORY.streaming.map(
  (entry) => entry.domain
)
export const STATUS_SAAS_DOMAINS = STATUS_DOMAINS_BY_CATEGORY.saas.map((entry) => entry.domain)
export const STATUS_CONSUMER_DOMAINS = STATUS_DOMAIN_NAMES.slice(0, 160)

export type StatusTrendSegment =
  | "all"
  | "consumer"
  | "cloud"
  | "developer"
  | "finance"
  | "gaming"
  | "social"
  | "streaming"
  | "saas"

export const STATUS_TREND_SEGMENT_DOMAINS: Record<
  Exclude<StatusTrendSegment, "all">,
  string[]
> = {
  cloud: STATUS_CLOUD_DOMAINS,
  consumer: STATUS_CONSUMER_DOMAINS,
  developer: STATUS_DEVELOPER_DOMAINS,
  finance: STATUS_FINANCE_DOMAINS,
  gaming: STATUS_GAMING_DOMAINS,
  social: STATUS_SOCIAL_DOMAINS,
  streaming: STATUS_STREAMING_DOMAINS,
  saas: STATUS_SAAS_DOMAINS,
}
