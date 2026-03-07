import Link from "next/link"

import { ToolFaqBlock } from "@/components/seo/tool-faq-block"
import { getToolSeoLinks } from "@/lib/seo/tranche1-link-map"
import {
  buildToolHowToSteps,
  buildToolSeoDescription,
  getToolPageProfile,
  type ToolFaqItem,
} from "@/lib/tool-page-content"
import { getToolBySlug } from "@/lib/tools-catalogue"

type RelatedToolLink = {
  label: string
  href: string
}

type ToolSeoContentProps = {
  toolName: string
  description: string
  steps: string[]
  faq: ToolFaqItem[]
  relatedTools: RelatedToolLink[]
}

type ToolFaqSectionBySlugProps = {
  toolSlug: string
  className?: string
}

type ToolSeoContentBySlugProps = {
  toolSlug: string
  className?: string
}

function splitParagraphs(description: string) {
  return description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

export function ToolSeoContent({
  toolName,
  description,
  steps,
  faq,
  relatedTools,
}: ToolSeoContentProps) {
  const paragraphs = splitParagraphs(description)

  return (
    <section className="space-y-6 rounded-2xl border border-border/80 bg-card/55 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
          About {toolName}
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground md:text-base">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
          How it works
        </h2>
        <ol className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground md:text-base">
          {steps.map((step, index) => (
            <li key={step} className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
              <span className="font-semibold text-foreground">{index + 1}. </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
          Why use local browser tools
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground md:text-base">
          <p>
            Local browser workflows reduce exposure for private files because the main processing path
            runs on your device instead of starting with an upload to a third-party service. That is
            useful when the document, image, text, or encoded payload contains work material, customer
            data, or anything you would rather review locally before sharing.
          </p>
          <p>
            Browser-based tools are also direct. You open the file, run the operation, and download the
            result without waiting for remote queues or account-gated limits. You can review Plain.tools
            privacy claims in{" "}
            <Link href="/verify-claims" className="font-medium text-accent hover:underline">
              Verify Claims
            </Link>
            .
          </p>
          <p>
            This page also includes answers to {faq.length} common questions and links to{" "}
            {relatedTools.length} related workflows, so you can validate the process first and move to the
            next step without leaving the tool cluster.
          </p>
        </div>
      </div>
    </section>
  )
}

export function ToolSeoContentBySlug({ toolSlug, className }: ToolSeoContentBySlugProps) {
  const tool = getToolBySlug(toolSlug)
  if (!tool) return null

  const profile = getToolPageProfile(tool)
  const relatedTools = getToolSeoLinks(tool.slug)?.relatedTools ?? []

  return (
    <div className={className}>
      <ToolSeoContent
        toolName={tool.name}
        description={buildToolSeoDescription(tool, profile)}
        steps={buildToolHowToSteps(tool)}
        faq={profile.faqs}
        relatedTools={relatedTools}
      />
    </div>
  )
}

export function ToolFaqSectionBySlug({ toolSlug, className }: ToolFaqSectionBySlugProps) {
  const tool = getToolBySlug(toolSlug)
  if (!tool) return null

  const profile = getToolPageProfile(tool)
  return <ToolFaqBlock faqs={profile.faqs} className={className} />
}
