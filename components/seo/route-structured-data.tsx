"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"

import { getToolSeoEntry } from "@/lib/seo-route-map"
import { serializeJsonLd } from "@/lib/sanitize"

function formatSegment(segment: string) {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

const ROOT_SEGMENT_LABELS: Record<string, string> = {
  tools: "Tools",
  learn: "Learn",
  blog: "Blog",
  compare: "Compare",
  comparisons: "Comparisons",
  about: "About",
  privacy: "Privacy",
  support: "Support",
  terms: "Terms",
  labs: "Labs",
  "verify-claims": "Verify Claims",
}

export function RouteStructuredData() {
  const pathname = usePathname()

  if (!pathname || pathname === "/") return null

  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://plain.tools/",
    },
  ]

  segments.forEach((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`
    const isRootSegment = index === 0
    const label = isRootSegment
      ? (ROOT_SEGMENT_LABELS[segment] ?? formatSegment(segment))
      : segment
    const position = index + 2

    const resolvedLabel =
      segments[0] === "tools" && index === 1
        ? (getToolSeoEntry(segment)?.name ?? formatSegment(segment))
        : formatSegment(label)

    breadcrumbItems.push({
      "@type": "ListItem",
      position,
      name: resolvedLabel,
      item: `https://plain.tools${path}`,
    })
  })

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  }

  const schemas: object[] = [breadcrumbSchema]

  if (segments[0] === "tools" && segments[1]) {
    const tool = getToolSeoEntry(segments[1])
    if (tool) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: `Plain - ${tool.name}`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web Browser",
        url: `https://plain.tools${pathname}`,
        description: tool.description,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      })
    }
  }

  if (segments[0] === "learn" && segments[1] && segments[1] !== "glossary") {
    const headline = formatSegment(segments[1])
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline,
      author: {
        "@type": "Person",
        name: "Plain Team",
      },
      datePublished: "2026-03-03",
      dateModified: "2026-03-03",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://plain.tools${pathname}`,
      },
    })
  }

  if (
    segments[0] === "blog" &&
    segments[1] &&
    segments[1] !== "category" &&
    segments[1] !== "opengraph-image"
  ) {
    const headline = formatSegment(segments[1])
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline,
      author: {
        "@type": "Organization",
        name: "Plain Editorial",
      },
      datePublished: "2026-03-03",
      dateModified: "2026-03-03",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://plain.tools${pathname}`,
      },
    })
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={`${pathname}-schema-${index}`}
          id={`${pathname}-schema-${index}`.replace(/\//g, "-")}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}
    </>
  )
}

