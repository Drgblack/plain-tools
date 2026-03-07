export type StatusLandingOutageType = {
  title: string
  description: string
}

export type StatusLandingPageConfig = {
  slug: "chatgpt" | "discord" | "youtube" | "reddit"
  domain: string
  title: string
  metaDescription: string
  intro: string
  outageTypes: StatusLandingOutageType[]
  troubleshootingSteps: string[]
  relatedStatuses: string[]
  faqs: Array<{
    question: string
    answer: string
  }>
}

export const STATUS_LANDING_PAGES: StatusLandingPageConfig[] = [
  {
    slug: "chatgpt",
    domain: "chatgpt.com",
    title: "Is ChatGPT Down Right Now?",
    metaDescription:
      "Check whether ChatGPT is down right now with live status, response time, and practical steps to separate global outages from local connection issues.",
    intro:
      "If ChatGPT is not loading, returning errors, or timing out, the fastest first step is a live status check against the host itself. This page is built for the exact query pattern people search during incidents: is ChatGPT down right now. You get a current up or down result, response-time context, and a clear timestamp for the last check so you can decide whether the issue is active or already recovering. ChatGPT outages are often partial rather than complete, with sign-in, chat generation, and API-like paths failing differently. That can make incidents look random. Use the status panel below as your first signal, then run DNS and latency checks to decide if the problem is global or local to your network. The goal is quick, practical diagnosis, not guesswork.",
    outageTypes: [
      {
        title: "Platform-wide incident",
        description:
          "Core ChatGPT routes fail or time out for many users at the same time.",
      },
      {
        title: "Partial service degradation",
        description:
          "Login, message generation, or session restore fails while other pages still load.",
      },
      {
        title: "Local access issue",
        description:
          "The service is up globally, but your DNS, ISP path, or firewall blocks access.",
      },
    ],
    troubleshootingSteps: [
      "Run the live check below and confirm the current up or down result.",
      "Compare response time over two to three checks to spot recovery or degradation trend.",
      "Run DNS lookup for chatgpt.com and confirm resolver answers are valid.",
      "Test from another network profile, such as mobile hotspot, to isolate local issues.",
      "If ChatGPT remains down globally, wait and retry later rather than repeated hard refresh loops.",
    ],
    relatedStatuses: ["discord", "youtube", "reddit"],
    faqs: [
      {
        question: "How do I verify whether ChatGPT is actually down?",
        answer:
          "Use the live status result on this page, then compare with DNS and latency checks to confirm whether the issue is global or local.",
      },
      {
        question: "Why can ChatGPT be up for others but not for me?",
        answer:
          "Local resolver issues, ISP routing changes, or enterprise network policy can block access even when the service is reachable globally.",
      },
      {
        question: "What does response time tell me during an outage?",
        answer:
          "High or unstable response time often signals degradation before full failure and helps you track whether service quality is improving.",
      },
    ],
  },
  {
    slug: "discord",
    domain: "discord.com",
    title: "Is Discord Down Right Now?",
    metaDescription:
      "Check whether Discord is down right now with live status, response time, and practical troubleshooting for chat, voice, and login issues.",
    intro:
      "When Discord stops working, it is often unclear whether the issue is a full outage, a voice-only incident, or a local network problem. This page gives you a direct answer-first check for the query is Discord down right now, then helps you interpret what the result means. You can see current status, response timing, and the latest check timestamp in one place. Discord outages frequently appear as partial incidents: text chat may work while voice or media delivery fails, or login loops may affect one region only. That is why a single refresh is not enough. Use the live panel first, then follow the troubleshooting steps below to distinguish service degradation from local connection problems. You should get a faster decision on whether to wait, switch network, or continue deeper diagnostics.",
    outageTypes: [
      {
        title: "Messaging outage",
        description:
          "Channels load slowly, messages fail to send, or updates arrive with delay.",
      },
      {
        title: "Voice and media incident",
        description:
          "Voice channels disconnect, calls fail, or media attachments do not load correctly.",
      },
      {
        title: "Authentication disruption",
        description:
          "Users cannot sign in, sessions expire unexpectedly, or account routes fail.",
      },
    ],
    troubleshootingSteps: [
      "Check the live Discord status result and note the last-checked timestamp.",
      "Retry once and compare response-time changes to confirm trend direction.",
      "Run DNS lookup for discord.com and verify records resolve correctly.",
      "Test Discord on another network to rule out local ISP or firewall issues.",
      "If status remains down globally, pause retries and wait for service recovery.",
    ],
    relatedStatuses: ["chatgpt", "youtube", "reddit"],
    faqs: [
      {
        question: "Why does Discord sometimes fail for voice but not text?",
        answer:
          "Discord services are segmented. Voice, chat, and media routes can degrade independently during partial incidents.",
      },
      {
        question: "How can I check Discord status quickly?",
        answer:
          "Run a live status check on this page, then confirm with DNS and latency checks for a practical second signal.",
      },
      {
        question: "Can local network issues mimic a Discord outage?",
        answer:
          "Yes. DNS cache problems, ISP routing changes, and policy filters can create local failures while the service remains up globally.",
      },
    ],
  },
  {
    slug: "youtube",
    domain: "youtube.com",
    title: "Is YouTube Down Right Now?",
    metaDescription:
      "Check whether YouTube is down right now with live status, response timing, and troubleshooting for streaming, regional, and connection issues.",
    intro:
      "If videos will not load, buffering is constant, or the site fails to open, this page helps you answer the high-intent query is YouTube down right now with a live check and context you can act on. You get current status, response-time data, and a last-checked timestamp so you can quickly see whether the issue is ongoing. YouTube incidents are often regional or delivery-layer based, which means the homepage can load while playback quality collapses on specific routes. In other cases, a local resolver or connection path creates the same symptoms as a global outage. Use the status panel below as your first decision point, then follow the practical checks to identify whether the problem is YouTube-wide, region-specific, or limited to your current network path.",
    outageTypes: [
      {
        title: "Streaming delivery degradation",
        description:
          "Video playback stalls, quality drops aggressively, or media routes fail intermittently.",
      },
      {
        title: "Regional outage",
        description:
          "Service quality varies by location because CDN edges or transit paths degrade unevenly.",
      },
      {
        title: "Local connection problem",
        description:
          "Your network path is unstable even while YouTube remains healthy for other users.",
      },
    ],
    troubleshootingSteps: [
      "Run the live YouTube status check and capture the latest response-time value.",
      "Check whether the homepage loads but playback fails, which suggests delivery-layer issues.",
      "Run a ping or latency test to detect local network instability.",
      "Retry on another connection profile to separate local from regional problems.",
      "If status shows down for repeated checks, wait for upstream recovery and re-test later.",
    ],
    relatedStatuses: ["chatgpt", "discord", "reddit"],
    faqs: [
      {
        question: "Why can YouTube be up but videos still buffer badly?",
        answer:
          "The main host may respond while media delivery routes or regional CDN edges are degraded.",
      },
      {
        question: "How do I check whether YouTube outages are regional?",
        answer:
          "Compare status and playback behaviour across two networks or locations when possible to spot region-specific issues.",
      },
      {
        question: "Does response time prove video quality?",
        answer:
          "No. It is a useful availability signal, but playback quality also depends on media route and local bandwidth conditions.",
      },
    ],
  },
  {
    slug: "reddit",
    domain: "reddit.com",
    title: "Is Reddit Down Right Now?",
    metaDescription:
      "Check whether Reddit is down right now with live status, response time, and troubleshooting for overload, API, and local access issues.",
    intro:
      "Reddit outages can look inconsistent: one minute feeds load, the next minute posting fails or media refuses to render. This page is designed for the query is Reddit down right now and gives a live status result with response-time context and a clear last-checked timestamp. That helps you decide quickly whether the issue is likely a platform incident, heavy-traffic overload, or something specific to your connection. During major events, Reddit can experience partial degradation where API and content delivery routes fail unevenly. A simple page refresh can hide that pattern. Use the live check below as your first signal, then follow the structured troubleshooting steps to distinguish server overload scenarios from local DNS or routing problems. The goal is a practical diagnosis path you can repeat instead of guessing.",
    outageTypes: [
      {
        title: "Traffic overload",
        description:
          "High demand causes feed latency spikes, delayed posting, or intermittent failures.",
      },
      {
        title: "API or route-specific incident",
        description:
          "Some Reddit features fail while others remain reachable, creating mixed behaviour.",
      },
      {
        title: "Local resolver or route issue",
        description:
          "Your DNS or network path fails while Reddit continues to serve most users.",
      },
    ],
    troubleshootingSteps: [
      "Run the live Reddit status check and compare at least two consecutive results.",
      "Check whether read-only browsing works while posting or voting fails.",
      "Run DNS lookup for reddit.com to validate resolver behaviour.",
      "Try a different network profile to isolate local path problems.",
      "If overload persists globally, retry later rather than repeated rapid refreshes.",
    ],
    relatedStatuses: ["chatgpt", "discord", "youtube"],
    faqs: [
      {
        question: "Why does Reddit feel down during high-traffic events?",
        answer:
          "Traffic surges can overload specific routes first, which causes partial failures before full service disruption.",
      },
      {
        question: "How can I tell whether Reddit is down or my network is the issue?",
        answer:
          "Use the live check first, then compare DNS and latency results and test from a second network if available.",
      },
      {
        question: "Can Reddit be up while posting still fails?",
        answer:
          "Yes. API or write-related paths can degrade while general page access remains available.",
      },
    ],
  },
]

const statusLandingPageMap = new Map(
  STATUS_LANDING_PAGES.map((page) => [page.slug, page])
)

export function getStatusLandingPage(slug: string) {
  return statusLandingPageMap.get(slug)
}

export function getStatusLandingPageOrThrow(slug: string) {
  const page = getStatusLandingPage(slug)
  if (!page) {
    throw new Error(`Missing status landing page config for slug: ${slug}`)
  }
  return page
}
