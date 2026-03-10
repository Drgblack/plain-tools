import { buildMetaDescription } from "@/lib/page-metadata"
import type {
  ProgrammaticExplanationBlock,
  ProgrammaticFaq,
  ProgrammaticHowToStep,
  ProgrammaticPageData,
  ProgrammaticRelatedTool,
} from "@/lib/programmatic-content"
import { getSiteStatusContext, normalizeSiteInput } from "@/lib/site-status"
import { EXTENDED_STATUS_OUTAGE_HISTORY_DOMAINS } from "@/lib/status-trends-extended"
import { getToolBySlug, type ToolDefinition } from "@/lib/tools-catalogue"

const statusTool = getToolBySlug("site-status-checker")

if (!statusTool) {
  throw new Error("Site status checker tool definition is missing.")
}

type StatusProgrammaticBundle = {
  breadcrumbs: Array<{ href?: string; label: string }>
  canonicalPath: string
  desc: string
  featureList: string[]
  heroBadges: string[]
  h1: string
  liveToolDescription: string
  page: ProgrammaticPageData
  siloLinks: Array<{ href: string; label: string }>
  title: string
}

type StatusMarket = {
  slug: string
  label: string
}

type StatusIspSeed = {
  slug: string
  label: string
}

const GENERIC_REGION_SLUGS = new Set([
  "com",
  "net",
  "org",
  "gov",
  "edu",
  "info",
  "int",
  "pro",
  "dev",
  "tech",
  "top",
  "news",
  "name",
  "cat",
  "mobi",
  "xyz",
])

export const POPULAR_STATUS_TLDS = [
  "ac","ad","ae","af","ag","ai","al","am","ao","aq","ar","as","at","au","aw","ax","az",
  "ba","bb","bd","be","bf","bg","bh","bi","bj","bm","bn","bo","br","bs","bt","bw","by","bz",
  "ca","cat","cc","cd","cf","cg","ch","ci","ck","cl","cm","cn","co","com","com.ar","com.au","com.br","com.cn",
  "com.hk","com.mx","com.my","com.ph","com.pl","com.sg","com.tr","com.tw","com.ua","com.vn","co.id","co.il","co.in","co.jp","co.ke","co.kr","co.nz","co.th","co.uk","co.za",
  "cr","cu","cv","cx","cy","cz","de","dev","dj","dk","dm","do","dz",
  "ec","edu","ee","eg","es","et","eu",
  "fi","fm","fo","fr",
  "ga","gd","ge","gf","gg","gh","gi","gl","gm","gn","gov","gov.uk","gr","gt","gu","gw",
  "hk","hn","hr","ht","hu",
  "id","ie","il","im","in","info","int","io","iq","ir","is","it",
  "je","jm","jo","jp",
  "ke","kg","kh","ki","km","kn","kr","kw","ky","kz",
  "la","lb","lc","li","lk","lt","lu","lv","ly",
  "ma","mc","md","me","mg","mk","ml","mn","mo","mobi","ms","mt","mu","mv","mw","mx","my","mz",
  "na","name","net","net.au","net.br","net.cn","net.in","net.nz","net.ru","news","nf","ng","nl","no","np","nu",
  "nz",
  "om","org","org.au","org.br","org.cn","org.hk","org.in","org.nz","org.uk","org.za",
  "pa","pe","pf","ph","pk","pl","pm","pn","pr","pro","pt","pw","py",
  "qa",
  "re","ro","rs","ru","rw",
  "sa","sb","sc","se","sg","sh","si","sk","sm","sn","so","sr","ss","st","su","sv","sx","sy","sz",
  "tc","td","tech","tf","tg","th","tj","tk","tl","tm","tn","to","top","tr","tt","tv","tw","tz",
  "ua","ug","uk","us","uy","uz",
  "vc","ve","vg","vi","vn","vu",
  "ws",
  "xyz",
  "ye","yt",
  "za","zm","zw",
] as const

const NAMED_STATUS_REGION_MARKETS: StatusMarket[] = [
  { slug: "us", label: "United States" },
  { slug: "uk", label: "United Kingdom" },
  { slug: "de", label: "Germany" },
  { slug: "fr", label: "France" },
  { slug: "it", label: "Italy" },
  { slug: "es", label: "Spain" },
  { slug: "nl", label: "Netherlands" },
  { slug: "be", label: "Belgium" },
  { slug: "se", label: "Sweden" },
  { slug: "no", label: "Norway" },
  { slug: "dk", label: "Denmark" },
  { slug: "fi", label: "Finland" },
  { slug: "pl", label: "Poland" },
  { slug: "pt", label: "Portugal" },
  { slug: "ie", label: "Ireland" },
  { slug: "ch", label: "Switzerland" },
  { slug: "at", label: "Austria" },
  { slug: "cz", label: "Czech Republic" },
  { slug: "gr", label: "Greece" },
  { slug: "ro", label: "Romania" },
  { slug: "hu", label: "Hungary" },
  { slug: "tr", label: "Turkey" },
  { slug: "ua", label: "Ukraine" },
  { slug: "il", label: "Israel" },
  { slug: "ae", label: "United Arab Emirates" },
  { slug: "sa", label: "Saudi Arabia" },
  { slug: "qa", label: "Qatar" },
  { slug: "eg", label: "Egypt" },
  { slug: "za", label: "South Africa" },
  { slug: "ng", label: "Nigeria" },
  { slug: "ke", label: "Kenya" },
  { slug: "gh", label: "Ghana" },
  { slug: "ma", label: "Morocco" },
  { slug: "in", label: "India" },
  { slug: "pk", label: "Pakistan" },
  { slug: "bd", label: "Bangladesh" },
  { slug: "lk", label: "Sri Lanka" },
  { slug: "np", label: "Nepal" },
  { slug: "th", label: "Thailand" },
  { slug: "vn", label: "Vietnam" },
  { slug: "my", label: "Malaysia" },
  { slug: "sg", label: "Singapore" },
  { slug: "id", label: "Indonesia" },
  { slug: "ph", label: "Philippines" },
  { slug: "hk", label: "Hong Kong" },
  { slug: "tw", label: "Taiwan" },
  { slug: "jp", label: "Japan" },
  { slug: "kr", label: "South Korea" },
  { slug: "cn", label: "China" },
  { slug: "au", label: "Australia" },
  { slug: "nz", label: "New Zealand" },
  { slug: "ca", label: "Canada" },
  { slug: "mx", label: "Mexico" },
  { slug: "br", label: "Brazil" },
  { slug: "ar", label: "Argentina" },
  { slug: "cl", label: "Chile" },
  { slug: "co", label: "Colombia" },
  { slug: "pe", label: "Peru" },
  { slug: "uy", label: "Uruguay" },
  { slug: "ec", label: "Ecuador" },
  { slug: "ve", label: "Venezuela" },
  { slug: "do", label: "Dominican Republic" },
  { slug: "cr", label: "Costa Rica" },
  { slug: "pa", label: "Panama" },
  { slug: "gt", label: "Guatemala" },
  { slug: "sv", label: "El Salvador" },
  { slug: "hn", label: "Honduras" },
  { slug: "ni", label: "Nicaragua" },
  { slug: "pr", label: "Puerto Rico" },
  { slug: "is", label: "Iceland" },
  { slug: "lu", label: "Luxembourg" },
  { slug: "mt", label: "Malta" },
  { slug: "cy", label: "Cyprus" },
] as const

function toRegionLabelFromSlug(slug: string) {
  return `${slug.toUpperCase()} market`
}

const AUTO_STATUS_REGION_MARKETS = Array.from(
  new Set(
    POPULAR_STATUS_TLDS.filter((slug) =>
      /^[a-z]{2,3}$/.test(slug) && !GENERIC_REGION_SLUGS.has(slug)
    )
  )
)
  .filter(
    (slug) => !NAMED_STATUS_REGION_MARKETS.some((entry) => entry.slug === slug)
  )
  .map((slug) => ({ slug, label: toRegionLabelFromSlug(slug) }))

export const STATUS_REGION_MARKETS: StatusMarket[] = [
  ...NAMED_STATUS_REGION_MARKETS,
  ...AUTO_STATUS_REGION_MARKETS,
]

export const STATUS_ISP_SEEDS: StatusIspSeed[] = [
  { slug: "att", label: "AT&T" },
  { slug: "verizon", label: "Verizon" },
  { slug: "tmobile", label: "T-Mobile" },
  { slug: "comcast", label: "Comcast Xfinity" },
  { slug: "spectrum", label: "Spectrum" },
  { slug: "cox", label: "Cox" },
  { slug: "vodafone", label: "Vodafone" },
  { slug: "orange", label: "Orange" },
  { slug: "telefonica", label: "Telefonica" },
  { slug: "bt", label: "BT" },
  { slug: "virgin-media", label: "Virgin Media" },
  { slug: "rogers", label: "Rogers" },
  { slug: "bell", label: "Bell" },
  { slug: "telstra", label: "Telstra" },
  { slug: "optus", label: "Optus" },
  { slug: "jio", label: "Jio" },
  { slug: "airtel", label: "Airtel" },
  { slug: "telkom", label: "Telkom" },
  { slug: "mtn", label: "MTN" },
  { slug: "etisalat", label: "Etisalat" },
  { slug: "du", label: "du" },
  { slug: "sky", label: "Sky Broadband" },
  { slug: "kpn", label: "KPN" },
  { slug: "telenor", label: "Telenor" },
  { slug: "telia", label: "Telia" },
  { slug: "movistar", label: "Movistar" },
  { slug: "tim", label: "TIM" },
  { slug: "telefonica-o2", label: "O2" },
  { slug: "free", label: "Free" },
  { slug: "sfr", label: "SFR" },
  { slug: "proximus", label: "Proximus" },
  { slug: "vodacom", label: "Vodacom" },
  { slug: "singtel", label: "Singtel" },
  { slug: "starhub", label: "StarHub" },
  { slug: "globe", label: "Globe" },
  { slug: "smart", label: "Smart" },
  { slug: "ais", label: "AIS" },
  { slug: "dtac", label: "DTAC" },
  { slug: "telmex", label: "Telmex" },
  { slug: "izzi", label: "izzi" },
  { slug: "frontier", label: "Frontier" },
  { slug: "centurylink", label: "CenturyLink" },
  { slug: "shaw", label: "Shaw" },
  { slug: "ee", label: "EE" },
  { slug: "three", label: "Three" },
  { slug: "eir", label: "eir" },
  { slug: "bouygues", label: "Bouygues Telecom" },
  { slug: "telekom", label: "Deutsche Telekom" },
  { slug: "globe-at-home", label: "Globe At Home" },
  { slug: "maxis", label: "Maxis" },
  { slug: "celcom", label: "Celcom" },
  { slug: "m1", label: "M1" },
] as const

export const STATUS_REGION_BASE_DOMAINS = EXTENDED_STATUS_OUTAGE_HISTORY_DOMAINS.slice(0, 1100)
export const STATUS_REGION_COUNTRY_VARIANTS = STATUS_REGION_MARKETS.slice(0, 132)

function countWords(values: string[]) {
  return values.join(" ").trim().split(/\s+/).filter(Boolean).length
}

function buildPageData(input: {
  canonicalPath: string
  description: string
  explanationBlocks: ProgrammaticExplanationBlock[]
  faq: ProgrammaticFaq[]
  howItWorks: string[]
  howToSteps: ProgrammaticHowToStep[]
  intro: string[]
  paramLabel: string
  paramSlug: string
  privacyNote: string[]
  relatedTools: ProgrammaticRelatedTool[]
  title: string
  tool: ToolDefinition
  whyUsersNeedThis: string[]
}) {
  return {
    ...input,
    wordCount: countWords([
      input.title,
      input.description,
      ...input.intro,
      ...input.whyUsersNeedThis,
      ...input.howItWorks,
      ...input.howToSteps.flatMap((step) => [step.name, step.text]),
      ...input.explanationBlocks.flatMap((block) => [block.title, ...block.paragraphs]),
      ...input.privacyNote,
      ...input.faq.flatMap((item) => [item.question, item.answer]),
    ]),
  } satisfies ProgrammaticPageData
}

function getMarketLabel(country: string) {
  return (
    STATUS_REGION_COUNTRY_VARIANTS.find((entry) => entry.slug === country)?.label ??
    country.toUpperCase()
  )
}

export function statusRegionPathFor(site: string, country: string) {
  return `/status/${encodeURIComponent(site)}-${country}`
}

export function statusIspPathFor(isp: string, country: string) {
  return `/status/${isp}-in-${country}`
}

export function parseStatusRegionFlatSlug(slug: string) {
  const normalizedSlug = decodeURIComponent(slug).trim().toLowerCase()
  if (!normalizedSlug || normalizedSlug.endsWith("-outage-history")) return null
  if (normalizedSlug.includes("-in-")) return null

  const divider = normalizedSlug.lastIndexOf("-")
  if (divider < 1) return null

  const sitePart = normalizedSlug.slice(0, divider)
  const countryPart = normalizedSlug.slice(divider + 1)
  if (!STATUS_REGION_COUNTRY_VARIANTS.some((entry) => entry.slug === countryPart)) return null

  const normalizedSite = normalizeSiteInput(sitePart)
  if (!normalizedSite) return null

  return { country: countryPart, site: normalizedSite }
}

export function parseStatusIspFlatSlug(slug: string) {
  const normalizedSlug = decodeURIComponent(slug).trim().toLowerCase()
  const match = /^([a-z0-9-]+)-in-([a-z0-9-]+)$/.exec(normalizedSlug)
  if (!match) return null

  const [, isp, country] = match
  if (!STATUS_ISP_SEEDS.some((entry) => entry.slug === isp)) return null
  if (!STATUS_REGION_COUNTRY_VARIANTS.some((entry) => entry.slug === country)) return null

  return { country, isp }
}

export function getStatusRegionPaths() {
  return STATUS_REGION_BASE_DOMAINS.flatMap((site) =>
    STATUS_REGION_COUNTRY_VARIANTS.map((country) =>
      statusRegionPathFor(site, country.slug)
    )
  )
}

export function getStatusIspPaths() {
  return STATUS_ISP_SEEDS.flatMap((isp) =>
    STATUS_REGION_COUNTRY_VARIANTS.map((country) =>
      statusIspPathFor(isp.slug, country.slug)
    )
  )
}

export function getStatusRegionStaticParams(limit = 3500) {
  return getStatusRegionPaths()
    .slice(0, limit)
    .map((path) => {
      const match = /^\/status\/(.+)-([a-z0-9-]+)$/.exec(path)
      if (!match) return null
      return { country: match[2], site: decodeURIComponent(match[1] ?? "") }
    })
    .filter((value): value is { country: string; site: string } => Boolean(value))
}

export function getStatusIspStaticParams(limit = 900) {
  return getStatusIspPaths()
    .slice(0, limit)
    .map((path) => {
      const match = /^\/status\/([a-z0-9-]+)-in-([a-z0-9-]+)$/.exec(path)
      if (!match) return null
      return { country: match[2], isp: match[1] }
    })
    .filter((value): value is { country: string; isp: string } => Boolean(value))
}

function buildRegionRelatedTools(site: string, country: string): ProgrammaticRelatedTool[] {
  const marketLabel = getMarketLabel(country)

  return [
    {
      description: `Run a fresh live check for ${site}.`,
      href: `/status/${encodeURIComponent(site)}`,
      name: `Status for ${site}`,
    },
    {
      description: `Review recent instability patterns for ${site}.`,
      href: `/status/${encodeURIComponent(site)}-outage-history`,
      name: `${site} outage history`,
    },
    {
      description: `Inspect DNS while troubleshooting ${site} in ${marketLabel}.`,
      href: `/dns/${encodeURIComponent(site)}`,
      name: "DNS lookup",
    },
    {
      description: "Measure latency from your own network after the live check.",
      href: "/ping-test",
      name: "Ping test",
    },
    {
      description: `See what else is trending in ${marketLabel}-relevant outage traffic.`,
      href: "/status/trending",
      name: "Trending checks",
    },
    {
      description: "Check public IP context for local network troubleshooting.",
      href: "/what-is-my-ip",
      name: "What is my IP",
    },
  ]
}

function buildIspRelatedTools(isp: string, country: string): ProgrammaticRelatedTool[] {
  const marketLabel = getMarketLabel(country)

  return [
    {
      description: `Run a fresh site check while testing ${isp} in ${marketLabel}.`,
      href: "/site-status",
      name: "Live status checker",
    },
    {
      description: "Use a DNS lookup to separate resolver issues from provider-wide outages.",
      href: "/dns-lookup",
      name: "DNS lookup",
    },
    {
      description: "Measure reachability and latency after the live check.",
      href: "/ping-test",
      name: "Ping test",
    },
    {
      description: `Review the current outage traffic around ${marketLabel}.`,
      href: "/status/trending",
      name: "Trending checks",
    },
    {
      description: "Check public IP context before assuming a provider-wide outage.",
      href: "/what-is-my-ip",
      name: "What is my IP",
    },
    {
      description: "Move back to the main status directory for service-specific pages.",
      href: "/status",
      name: "Status directory",
    },
  ]
}

export function getStatusRegionBundle(siteInput: string, country: string): StatusProgrammaticBundle | null {
  const site = normalizeSiteInput(siteInput)
  const marketLabel = getMarketLabel(country)
  if (!site) return null
  if (!STATUS_REGION_COUNTRY_VARIANTS.some((entry) => entry.slug === country)) return null

  const siteContext = getSiteStatusContext(site)
  const canonicalPath = statusRegionPathFor(site, country)
  const title = `Is ${site} Down in ${marketLabel}? | Plain Tools`
  const desc = buildMetaDescription(
    `Check whether ${site} is down in ${marketLabel}, compare local-versus-global outage clues, and run a privacy-first anonymous status check on Plain Tools.`
  )

  return {
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/status", label: "Status" },
      { href: `/status/${encodeURIComponent(site)}`, label: site },
      { label: marketLabel },
    ],
    canonicalPath,
    desc,
    featureList: [
      `Regional status context for ${marketLabel}`,
      "Live browser-first status checker",
      "Anonymous check - no data stored",
      "DNS, ping, and outage-history follow-up links",
    ],
    heroBadges: ["regional status", "anonymous check", "no data stored", "browser-first"],
    h1: `Is ${site} Down in ${marketLabel}?`,
    liveToolDescription:
      `Run a fresh check for ${site} or another domain while comparing local-versus-global outage clues for ${marketLabel}.`,
    page: buildPageData({
      canonicalPath,
      description: desc,
      explanationBlocks: [
        {
          title: `Why ${marketLabel} users search this page`,
          paragraphs: [
            `A regional status route answers a more specific question than a generic up-or-down page. Users in ${marketLabel} are often trying to decide whether ${site} is unavailable globally, flaky only on their route, or being affected by a resolver, ISP, or regional transit issue that is invisible to people elsewhere.`,
            `That is why this page exists as its own indexable route. It preserves the exact search intent, gives a local explanation frame, and keeps the next checks close by instead of forcing the user back to a generic status hub.`,
          ],
        },
        {
          title: "How to separate a local failure from a wider outage",
          paragraphs: [
            `The first step is still the live status check. After that, compare DNS results, latency, and whether the service is trending more broadly. A domain can be up globally while still failing on one regional path because of peering issues, resolver problems, CDN behavior, or provider-specific blocks.`,
            `That layered troubleshooting flow is the main SEO value of this route. It turns a narrow query like "${site} down ${marketLabel.toLowerCase()}" into a useful page with a clear next-step sequence instead of a thin one-line answer.`,
          ],
        },
        {
          title: "Why the privacy angle still matters",
          paragraphs: [
            "Status routes do not need document uploads, but they still benefit from a privacy-first posture. The check is anonymous, no account is required, and the page does not need to know who you are to be useful.",
            "That matters because status pages are frequently opened from work devices, shared networks, and support contexts where low-friction, anonymous diagnostics are more trustworthy than a bloated dashboard.",
          ],
        },
        {
          title: `How regional status pages help ${marketLabel} users act faster`,
          paragraphs: [
            `The practical value of a regional route is decision speed. Someone in ${marketLabel} does not only want to know whether ${site} is alive somewhere on the internet. They want to know whether the incident is likely broad enough to wait out, local enough to escalate to the network team, or specific enough to test on another route immediately.`,
            "That is why the page combines status, history, DNS, and latency links instead of pretending one response label is the whole answer. Search demand stays high when the page reduces uncertainty and keeps the next action obvious.",
          ],
        },
      ],
      faq: [
        { question: `Is ${site} down in ${marketLabel} right now?`, answer: `Use the live checker on this page to test ${site}, then compare the result with DNS, latency, and outage-history context.` },
        { question: `Why might ${site} look down in ${marketLabel} but up elsewhere?`, answer: "Regional CDN issues, ISP routing, DNS resolver problems, or local network policies can make a service look locally unavailable even when the broader platform is up." },
        { question: "Does this page store my activity?", answer: "No. This is an anonymous check and no personal data or uploaded files are required." },
        { question: "What should I check after the live result?", answer: "Open outage history, run a DNS lookup, and compare latency so you can separate a local problem from a wider service incident." },
        { question: "Why give this route its own URL?", answer: "Because regional outage intent is different from a generic global status query, and the page can give more relevant follow-up steps when that intent is explicit." },
        { question: "Can I use this route for another country?", answer: `Yes. The related links and status directory make it easy to open the same service in another market context.` },
        { question: "Why is regional context useful even if the service is technically up?", answer: "A service can respond globally while still failing on one route, ISP path, or CDN edge. Regional context helps separate those cases instead of flattening them into one generic answer." },
      ],
      howItWorks: [
        `Run the live check first. If ${site} responds, use the page to test whether the issue is more likely local to ${marketLabel}. If it fails, compare the outage-history route and the trending pages to see whether the incident appears broader.`,
        "The point of the route is not only to say up or down. It is to help the user decide what kind of problem they are actually dealing with before they escalate, switch networks, or assume the provider is fully offline.",
        `Because the page stays browser-first and anonymous, you can move through that workflow quickly from a laptop, mobile browser, support desk, or restricted corporate network.`,
      ],
      howToSteps: [
        { name: "Run the live status check", text: `Start by checking ${site} from this route so you have a current answer instead of relying on old reports.` },
        { name: `Compare the result with ${marketLabel} context`, text: `If the result looks inconsistent with what users in ${marketLabel} are seeing, the problem may be local rather than global.` },
        { name: "Check DNS and latency", text: "DNS and ping are the fastest way to separate resolver issues and route quality problems from a real provider outage." },
        { name: "Review outage history", text: "The history route helps you decide whether the current incident fits a repeated pattern or looks like a fresh event." },
      ],
      intro: [
        `Users searching whether ${site} is down in ${marketLabel} are usually beyond the generic "is it down?" stage. They already suspect that the service may be broken differently in one market, one network path, or one provider region.`,
        `This page is built for that exact intent. It combines the live checker with practical follow-up steps, a privacy-first presentation, and enough local context to stand on its own as a useful status route.`,
        `That additional context is what keeps the route from becoming thin. The page is not just a duplicate of the global status URL with a country name added. It exists to explain the local-versus-global troubleshooting path that regional searchers actually need.`,
      ],
      paramLabel: `${site} in ${marketLabel}`,
      paramSlug: `${site}-${country}`,
      privacyNote: [
        "Anonymous check - no data stored. The page does not need an account, a document upload, or any personal identifier to answer the status question.",
        "That light-touch design keeps the route useful for support, operations, and personal troubleshooting without turning it into a tracking-heavy dashboard.",
        "It also makes the route safer to use from support laptops, shared workplace devices, and mobile sessions where the user wants a quick answer without leaving a lot of new application state behind.",
      ],
      relatedTools: buildRegionRelatedTools(site, country),
      title,
      tool: statusTool,
      whyUsersNeedThis: [
        `Regional outage pages matter because users rarely search them by accident. When someone searches for ${site} in ${marketLabel}, they are usually trying to confirm whether the problem is market-specific, ISP-specific, or broader than their own connection.`,
        `That makes the page different from a generic checker. It has to explain what happened, what to test next, and how to avoid confusing a local path problem with a full platform outage. The internal links are built around that operational need instead of generic site navigation, especially for ${siteContext.segmentLabel.toLowerCase()} properties where regional delivery patterns can differ.`,
        `That specificity is also what makes the page safer to scale. The market, the domain, and the diagnostic next steps all change the wording enough that the route is genuinely useful for the exact searcher landing on it.`,
      ],
    }),
    siloLinks: [
      { href: `/status/${encodeURIComponent(site)}`, label: `Status for ${site}` },
      { href: `/status/${encodeURIComponent(site)}-outage-history`, label: `${site} outage history` },
      { href: "/status/trending", label: "Trending outage checks" },
      { href: "/network-tools", label: "Network tools" },
    ],
    title,
  }
}

export function getStatusIspBundle(isp: string, country: string): StatusProgrammaticBundle | null {
  const ispEntry = STATUS_ISP_SEEDS.find((entry) => entry.slug === isp)
  const marketLabel = getMarketLabel(country)
  if (!ispEntry) return null
  if (!STATUS_REGION_COUNTRY_VARIANTS.some((entry) => entry.slug === country)) return null

  const canonicalPath = statusIspPathFor(isp, country)
  const title = `Is It Down for Me on ${ispEntry.label} in ${marketLabel}? | Plain Tools`
  const desc = buildMetaDescription(
    `Check whether a site issue might be local to ${ispEntry.label} in ${marketLabel}, with an anonymous status check, DNS follow-up, and privacy-first troubleshooting on Plain Tools.`
  )

  return {
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/status", label: "Status" },
      { href: "/status/trending", label: "Trending" },
      { label: `${ispEntry.label} in ${marketLabel}` },
    ],
    canonicalPath,
    desc,
    featureList: [
      `ISP-specific status troubleshooting for ${marketLabel}`,
      "Anonymous check - no data stored",
      "DNS and latency follow-up guidance",
      "Related live status routes and outage history pages",
    ],
    heroBadges: ["isp-specific", "local routing", "anonymous check", "privacy-first"],
    h1: `Is It Down for Me on ${ispEntry.label} in ${marketLabel}?`,
    liveToolDescription:
      `Run a live check for any domain while troubleshooting local network conditions on ${ispEntry.label} in ${marketLabel}.`,
    page: buildPageData({
      canonicalPath,
      description: desc,
      explanationBlocks: [
        {
          title: `Why ISP-specific status pages exist`,
          paragraphs: [
            `Users often blame the service first, but many outages are really path problems: an ISP route issue, resolver problem, packet loss, or region-specific congestion. This page exists to capture that "down for me" intent for ${ispEntry.label} in ${marketLabel}.`,
            "That makes it more than a generic blog post. The route is an operational page that keeps the live checker, DNS checks, and broader outage pages in one place so the user can move through a real diagnosis flow.",
          ],
        },
        {
          title: "How to tell provider problems from platform problems",
          paragraphs: [
            "Start with the live check. If the service responds normally from the checker but still fails on your own connection, DNS, ping, and another network path are the next best comparisons.",
            `That sequence is especially useful for ${ispEntry.label} in ${marketLabel}, where local routing or resolver behavior may create a false impression that the site itself is fully down.`,
          ],
        },
        {
          title: "Why this route keeps the privacy model minimal",
          paragraphs: [
            "A page like this should not require a login or collect extra data just to answer a routing question. The check is anonymous, the troubleshooting is browser-first, and the page focuses on practical next steps instead of account capture.",
            "That keeps the route usable in support settings, on shared devices, and during fast-moving incident windows when the user just needs an answer.",
          ],
        },
        {
          title: `How ${ispEntry.label} pages reduce false outage assumptions`,
          paragraphs: [
            `ISP-specific routes exist because users often escalate the wrong thing first. A broken resolver, congested route, or misbehaving provider edge can look identical to a full platform outage unless the page explicitly walks through the comparison steps.`,
            `That is what this route adds for ${marketLabel}. It gives the user a cleaner way to test the service, compare network signals, and decide whether the next action belongs with the provider, the target platform, or the local device.`,
          ],
        },
      ],
      faq: [
        { question: `Is the problem local to ${ispEntry.label} in ${marketLabel}?`, answer: "Use the live checker first. If the service responds from the checker but still fails on your own connection, the problem may be local to your ISP path or resolver." },
        { question: "Does this page confirm a provider outage?", answer: "Not by itself. It helps you compare a live site result with DNS, latency, and broader status context so you can judge whether the issue is local." },
        { question: "Do you store my network data?", answer: "No. The page is designed as an anonymous check and no personal data is stored." },
        { question: "What should I test next?", answer: "Run a DNS lookup, compare another network, and review the service's outage-history page to see whether others are seeing the same pattern." },
        { question: "Why make ISP-specific pages indexable?", answer: "Because 'down for me' search intent is different from a global outage query, and the follow-up steps are different too." },
        { question: "Can I use this with another provider or country?", answer: "Yes. The status matrix includes other provider-country combinations for the same troubleshooting flow." },
        { question: "Why is an ISP page better than a generic support article?", answer: "Because it keeps the live checker and the network follow-up steps on one route, which is much more useful during an actual incident than reading generic advice with no working diagnostic path." },
      ],
      howItWorks: [
        "This route starts with a generic live site check and then frames the result through a local-network lens. If the service appears up, the next job is isolating DNS, route, or resolver issues on the connection you are using.",
        "That is why the page links to ping, DNS, and status history. It turns a vague 'down for me' search into a concrete series of tests instead of stopping at one up/down label.",
        "Because the route stays anonymous and browser-first, it is easy to use during real outage spikes without adding another account system or tracking-heavy dashboard into the process.",
      ],
      howToSteps: [
        { name: "Run a live site check", text: "Test the domain you actually care about rather than assuming the ISP is at fault first." },
        { name: "Compare with DNS and latency", text: "If DNS is broken or latency is abnormal, the issue may be local to the provider path instead of the target service." },
        { name: "Cross-check outage history", text: "A history pattern helps separate a repeat service issue from a one-off local connectivity problem." },
        { name: "Retry from another network", text: "Comparing mobile, office, or home connections is still one of the cleanest ways to isolate an ISP issue." },
      ],
      intro: [
        `Searchers landing on a page like this are usually asking a practical question: is the site broken, or is it just broken for me on ${ispEntry.label} in ${marketLabel}? That is a different problem from a generic global status query.`,
        "This route is built to answer that narrower question with the live checker, operational troubleshooting steps, and privacy-first diagnostics that do not require an account or stored personal data.",
        "That focus is what makes the page useful enough to scale. It is written around a specific provider-country troubleshooting context rather than a generic uptime paragraph with a new keyword pasted into it.",
      ],
      paramLabel: `${ispEntry.label} in ${marketLabel}`,
      paramSlug: `${isp}-in-${country}`,
      privacyNote: [
        "Anonymous check - no data stored. The page is designed for local troubleshooting without turning the workflow into a tracking system.",
        "That keeps it practical for support desks, home users, and team operations that just need fast status context and a sensible next step.",
        "The minimal data model is part of the product value. Users can troubleshoot quickly, compare routes, and move on without creating another account trail just to ask whether a service is reachable.",
      ],
      relatedTools: buildIspRelatedTools(isp, country),
      title,
      tool: statusTool,
      whyUsersNeedThis: [
        `Provider-specific status pages attract search demand because users often cannot tell whether a failure belongs to ${ispEntry.label}, the target site, or their own network environment. A useful route should help them separate those possibilities quickly.`,
        `That is why this page focuses on sequence: run the live status check, test DNS and latency, compare history, and only then decide whether the problem looks local to ${marketLabel} or broad enough to treat as a service-wide incident.`,
        `The page also has stronger advertiser value than a generic outage article because it sits closer to real support, connectivity, and provider choice decisions. That makes it worth keeping substantial and tightly scoped.`,
      ],
    }),
    siloLinks: [
      { href: "/status", label: "Status directory" },
      { href: "/status/trending", label: "Trending outage checks" },
      { href: "/network-tools", label: "Network tools" },
      { href: "/site-status", label: "Live status checker" },
    ],
    title,
  }
}
