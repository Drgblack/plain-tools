import type { Metadata } from "next"

import { NetworkToolPage } from "@/components/seo/network-tool-page"
import { SiteStatusCheckerToolClient } from "@/components/tools/network-tools-client"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Site status checker tool",
  description:
    "Run a direct browser HEAD check for a URL, then review HTTP status and response timing. No Plain Tools relay; some sites may block browser probes.",
  path: "/tools/site-status-checker",
  image: "/og/default.png",
})

export default function SiteStatusCheckerToolPage() {
  return (
    <NetworkToolPage
      title="Site Status Checker"
      intro={[
        "This tool gives you a fast browser-side way to test whether a URL responds to a simple HEAD request and how long that response takes. It is useful when a website feels slow, appears unavailable, or needs a quick reachability check before you spend time troubleshooting DNS, application code, or local network settings. Because the request is made directly by your browser, the result reflects what your own connection can reach rather than what a remote Plain Tools server can reach.",
        "That direct approach also means the page is honest about limitations. Some sites block cross-origin browser probes or reject HEAD requests even though the service itself is up. When that happens, this checker reports the browser failure instead of pretending the site is down. In practice, that makes it a good first-pass diagnostic tool: if the page responds cleanly, you have a quick baseline. If the probe is blocked, move to a dedicated status page or a same-origin test endpoint to separate application outages from browser policy restrictions.",
      ]}
      howItWorks={[
        "Enter a full URL or same-origin path and let the page normalise it into a valid HTTP or HTTPS address.",
        "Run a direct browser HEAD request and measure the elapsed time from the start of the request to the response.",
        "Read the status code, reachability signal, and response time together before deciding whether the issue is the target service, browser policy, or your local connection.",
      ]}
      caveats={[
        "A browser failure here can mean CORS or HEAD restrictions rather than a real outage on the target service.",
        "The result only reflects what your own browser can reach from the current network path.",
        "For a cleaner baseline, test a same-origin URL or a CORS-friendly endpoint before assuming the checker itself is the issue.",
      ]}
      relatedTools={[
        { label: "DNS Lookup", href: "/tools/dns-lookup" },
        { label: "Ping Test", href: "/tools/ping-test" },
        { label: "What Is My IP", href: "/tools/what-is-my-ip" },
      ]}
      relatedGuides={[
        {
          label: "Is it down for everyone or just me?",
          href: "/learn/is-it-down-for-everyone-or-just-me",
        },
        {
          label: "What response time means in uptime check",
          href: "/learn/what-response-time-means-in-uptime-check",
        },
      ]}
    >
      <SiteStatusCheckerToolClient />
    </NetworkToolPage>
  )
}
