import Link from "next/link"

const sections = [
  {
    title: "Adobe and AI-era terms backlash",
    body: "In June 2024, Adobe published two separate updates after widespread concern about Terms language and how content access could be interpreted in AI-era workflows. For professionals handling legal, financial, and client-confidential PDFs, that moment showed how quickly trust can depend on policy wording instead of technical guarantees. Plain cannot do this. Architecturally.",
    sources: [
      {
        href: "https://blog.adobe.com/en/publish/2024/06/06/clarification-adobe-terms-of-use",
        label: "Adobe clarification (June 6, 2024)",
      },
      {
        href: "https://blog.adobe.com/en/publish/2024/06/10/updating-adobes-terms-of-use",
        label: "Adobe update (June 10, 2024)",
      },
    ],
  },
  {
    title: "DocuSign and AI training disclosures",
    body: "DocuSign's AI Attachment documents when de-identified customer data may be used to develop or improve AI systems and how opt-out controls apply. This may be acceptable in some enterprise contexts, but it still means teams must continuously audit legal terms and controls as products evolve. Plain cannot do this. Architecturally.",
    sources: [
      {
        href: "https://www.docusign.com/legal/terms-and-conditions/ai-attachment-docusign-services",
        label: "DocuSign AI Attachment",
      },
    ],
  },
  {
    title: "The wider cloud PDF pattern",
    body: "Most online PDF platforms are built around server-side processing and upload-first workflows, which naturally expands retention, logging, and policy scope over time. Whether the business model is subscriptions, automation, or AI add-ons, the document path still depends on cloud infrastructure you do not control. Plain cannot do this. Architecturally.",
    sources: [
      {
        href: "https://smallpdf.com/blog/smallpdf-online-toolbox",
        label: "Smallpdf upload workflow overview",
      },
      {
        href: "https://www.ilovepdf.com/help/terms",
        label: "iLovePDF terms",
      },
    ],
  },
]

export function WhyPlainExists() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            The PDF industry has a trust problem.
          </h2>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-xl border border-white/[0.08] bg-[oklch(0.15_0.006_250)] p-5"
            >
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
              <p className="mt-3 text-xs text-muted-foreground/80">
                Sources:{" "}
                {section.sources.map((source, index) => (
                  <span key={source.href}>
                    <Link
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-accent"
                    >
                      {source.label}
                    </Link>
                    {index < section.sources.length - 1 ? " · " : ""}
                  </span>
                ))}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

