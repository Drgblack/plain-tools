"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"

import { getToolSeoEntry } from "@/lib/seo-route-map"
import { serializeJsonLd } from "@/lib/sanitize"
import { buildHowToSchema } from "@/lib/structured-data"

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
    const toolName = tool?.name ?? formatSegment(segments[1])
    const toolDescription =
      tool?.description ??
      `${toolName} processes files locally in your browser with a no-upload workflow.`

    schemas.push({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `Plain - ${toolName}`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web Browser",
      url: `https://plain.tools${pathname}`,
      description: toolDescription,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    })

    const toolHowTo = buildHowToSchema(
      `How to use ${toolName}`,
      toolDescription,
      [
        {
          name: "Open the tool",
          text: `Go to ${toolName} and choose the file you want to process.`,
        },
        {
          name: "Configure options",
          text: "Set processing options before running the tool.",
        },
        {
          name: "Process locally",
          text: "Run the tool in your browser and keep file handling on-device.",
        },
        {
          name: "Download output",
          text: "Download the result and review it before sharing.",
        },
      ]
    )
    schemas.push(toolHowTo)
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

    const learnHowTo = buildHowToSchema(
      `How to use this ${headline} guide`,
      `Follow the ${headline} learn article to apply a privacy-first workflow in practice.`,
      [
        {
          name: "Read the quick answer",
          text: "Start with the opening section to understand scope and constraints.",
        },
        {
          name: "Apply the practical steps",
          text: "Follow the article sections and adapt steps to your file workflow.",
        },
        {
          name: "Verify behaviour",
          text: "Use verification guidance and confirm processing assumptions in your browser.",
        },
      ]
    )
    schemas.push(learnHowTo)
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
