export const NETWORK_SAMPLE_DOMAINS = [
  "plain.tools",
  "google.com",
  "youtube.com",
  "facebook.com",
  "instagram.com",
  "whatsapp.com",
  "reddit.com",
  "wikipedia.org",
  "x.com",
  "linkedin.com",
  "github.com",
  "gitlab.com",
  "openai.com",
  "chatgpt.com",
  "claude.ai",
  "anthropic.com",
  "amazon.com",
  "aws.amazon.com",
  "cloudflare.com",
  "workers.dev",
  "microsoft.com",
  "office.com",
  "apple.com",
  "icloud.com",
  "netflix.com",
  "spotify.com",
  "dropbox.com",
  "box.com",
  "figma.com",
  "notion.so",
  "slack.com",
  "discord.com",
  "zoom.us",
  "stripe.com",
  "paypal.com",
  "shopify.com",
  "vercel.com",
  "netlify.com",
  "digitalocean.com",
  "fastly.com",
  "akamai.com",
  "cloudfront.net",
  "mozilla.org",
  "wordpress.com",
  "medium.com",
  "substack.com",
  "nytimes.com",
  "bbc.com",
  "cnn.com",
  "theguardian.com",
  "stackoverflow.com",
  "npmjs.com",
  "pypi.org",
  "docker.com",
  "kubernetes.io",
  "oracle.com",
  "salesforce.com",
  "hubspot.com",
  "zendesk.com",
  "intercom.com",
  "sendgrid.com",
  "mailchimp.com",
  "proton.me",
  "tiktok.com",
  "adobe.com",
  "canva.com",
  "telegram.org",
  "signal.org",
  "trello.com",
  "atlassian.com",
  "jira.com",
  "confluence.com",
] as const

export const NETWORK_SAMPLE_IPS = [
  "1.1.1.1",
  "1.0.0.1",
  "8.8.8.8",
  "8.8.4.4",
  "9.9.9.9",
  "149.112.112.112",
  "208.67.222.222",
  "208.67.220.220",
  "64.6.64.6",
  "64.6.65.6",
  "76.76.2.0",
  "76.76.21.21",
  "104.16.132.229",
  "151.101.1.69",
  "172.64.145.59",
  "185.199.108.153",
  "2606:4700:4700::1111",
  "2606:4700:4700::1001",
  "2001:4860:4860::8888",
  "2001:4860:4860::8844",
  "2620:fe::fe",
  "2620:fe::9",
] as const

export type NetworkMetadataExample = {
  description: string
  path: string
  title: string
}

export function getSampleDomains(limit = NETWORK_SAMPLE_DOMAINS.length) {
  return NETWORK_SAMPLE_DOMAINS.slice(0, limit)
}

export function getSampleIps(limit = NETWORK_SAMPLE_IPS.length) {
  return NETWORK_SAMPLE_IPS.slice(0, limit)
}

export const NETWORK_LOOKUP_METADATA_EXAMPLES: NetworkMetadataExample[] = [
  {
    path: "/dns/google.com",
    title: "DNS Lookup for google.com – A, MX, NS, TXT Records | Plain Tools",
    description:
      "Check DNS records for google.com including A, MX, NS, TXT, SOA, and CNAME answers. Review TTL values, nameservers, and mail-routing clues with a privacy-first lookup.",
  },
  {
    path: "/dns/github.com",
    title: "DNS Lookup for github.com – A, MX, NS, TXT Records | Plain Tools",
    description:
      "Inspect github.com DNS records, nameservers, TXT verification entries, and TTL values. Useful for nameserver checks, mail routing, and propagation troubleshooting.",
  },
  {
    path: "/dns/stripe.com",
    title: "DNS Lookup for stripe.com – A, MX, NS, TXT Records | Plain Tools",
    description:
      "View stripe.com DNS answers with A, AAAA, MX, NS, TXT, SOA, and CNAME coverage. Check nameserver delegation, TTL windows, and domain-verification records.",
  },
  {
    path: "/ip/8.8.8.8",
    title: "IP Address 8.8.8.8 Lookup – Location, ISP, ASN | Plain Tools",
    description:
      "Lookup IP address 8.8.8.8 for ISP, ASN, organization, and approximate location. Useful for routing checks, DNS correlation, and public-IP ownership review.",
  },
  {
    path: "/ip/1.1.1.1",
    title: "IP Address 1.1.1.1 Lookup – Location, ISP, ASN | Plain Tools",
    description:
      "Inspect IP address 1.1.1.1 for ASN, ISP, organization, and geolocation context. Compare IP ownership with DNS answers and continue into status or ping checks.",
  },
  {
    path: "/ip/2606%3A4700%3A4700%3A%3A1111",
    title: "IP Address 2606:4700:4700::1111 Lookup – Location, ISP, ASN | Plain Tools",
    description:
      "Check IPv6 address 2606:4700:4700::1111 for provider, ASN, routing ownership, and approximate location. Includes privacy notes and next-step network diagnostics.",
  },
]
