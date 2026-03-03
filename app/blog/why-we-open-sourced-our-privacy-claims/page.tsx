import type { Metadata } from "next"
import Link from "next/link"
import {
  BlogArticle,
  ArticleSection,
  ArticleParagraph,
  ArticleList,
  ArticleNote,
  ShareQuote,
} from "@/components/blog-article"

export const metadata: Metadata = {
  title: "Why We Open-Sourced Our Privacy Claims",
  description: "Why Plain built a verifiable privacy model instead of policy-first marketing, and how /verify-claims turns architecture into testable evidence. Learn practical.",
  authors: [{ name: "Plain Editorial" }],
  openGraph: {
    type: "article",
    title: "Why We Open-Sourced Our Privacy Claims",
    description:
      "Privacy claims should be testable. This is the architecture and reasoning behind Plain's public verification workflow.",
    url: "https://plain.tools/blog/why-we-open-sourced-our-privacy-claims",
    publishedTime: "2026-03-03T00:00:00Z",
    authors: ["Plain Editorial"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why We Open-Sourced Our Privacy Claims",
    description:
      "If a privacy claim cannot be verified in DevTools, it is not a guarantee. How Plain designed for verification-first trust.",
  },
  alternates: {
    canonical: "https://plain.tools/blog/why-we-open-sourced-our-privacy-claims",
  },
}

export default function WhyWeOpenSourcedOurPrivacyClaimsPage() {
  return (
    <BlogArticle
      title="Why We Open-Sourced Our Privacy Claims"
      description="Most privacy pages read like legal fog. We wanted privacy claims that can be challenged, tested, and reproduced by anyone with a browser."
      intro="The /verify-claims page exists for one reason: trust should be earned through evidence, not branding."
      simpleTerms="If our product says your files stay local, you should be able to prove that in under five minutes without asking us for special access."
      datePublished="2026-03-03"
      readingTime={7}
      slug="why-we-open-sourced-our-privacy-claims"
      canonicalUrl="https://plain.tools/blog/why-we-open-sourced-our-privacy-claims"
      category="privacy-ethics"
      linkedTools={["merge-pdf", "split-pdf", "redact-pdf"]}
      aiTakeaway="Privacy policies alone are weak trust signals. Verifiable architecture with public test steps is a stronger and more defensible model."
      relatedTool={{
        title: "Merge PDF",
        description: "Process files locally and verify no upload in your own browser.",
        href: "/tools/merge-pdf",
        icon: "merge",
      }}
      relatedReading={[
        {
          href: "/verify-claims",
          title: "Verify Claims",
          description: "The public, step-by-step verification workflow.",
        },
        {
          href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
          title: "DevTools Verification Guide",
          description: "Repeatable process for inspecting network behavior.",
        },
        {
          href: "/blog/how-to-verify-privacy-claims-yourself",
          title: "How to Verify Privacy Claims Yourself",
          description: "Independent techniques that work beyond Plain.",
        },
        {
          href: "/learn/webassembly-pdf-processing-explained",
          title: "WebAssembly PDF Processing Explained",
          description: "Why local browser execution is now practical at scale.",
        },
      ]}
    >
      <ArticleSection title="Privacy policies are necessary, but not sufficient">
        <ArticleParagraph>
          We are not anti-policy. Legal text matters for rights, liability, and governance. But policy
          alone is a weak trust signal in fast-moving software products. Terms can be updated, feature
          boundaries can shift, and users rarely have the time to re-audit every release.
        </ArticleParagraph>
        <ArticleParagraph>
          The gap between "we protect your data" and "here is exactly what happens to your file bytes"
          is where trust usually collapses. We wanted to close that gap with something operational, not
          rhetorical.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection title="The idea: make privacy claims reproducible">
        <ArticleParagraph>
          We framed a simple engineering question: what would a privacy claim look like if it were
          treated like a test case? The answer became /verify-claims. It gives users explicit steps:
          open DevTools, filter XHR/Fetch, run a file operation, inspect requests, and confirm whether
          payload data left the browser.
        </ArticleParagraph>
        <ArticleParagraph>
          That workflow is intentionally boring. Boring is good in security. If a claim depends on
          hand-wavy interpretation, it is not robust.
        </ArticleParagraph>
        <ShareQuote>
          If a privacy claim cannot survive a Network tab check, it is not a guarantee.
        </ShareQuote>
      </ArticleSection>

      <ArticleSection title="What we mean by 'open-sourced claims'">
        <ArticleParagraph>
          We are not just publishing code snippets. We are publishing testable assertions and the
          method to challenge them. For example:
        </ArticleParagraph>
        <ArticleList
          items={[
            "Claim: core PDF tools process files locally.",
            "Test: observe network traffic during merge/split/compress/redact actions.",
            "Expected result: no file payload requests to remote processors.",
            "Failure condition: any outbound request containing document bytes.",
          ]}
        />
        <ArticleParagraph>
          This model converts trust from "believe us" into "repeat the test." That is a better default
          for developers, auditors, and security teams.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection title="Why this resonates with developer communities">
        <ArticleParagraph>
          Engineers dislike unverifiable promises, especially in privacy and security. Hacker News,
          Reddit, and technical communities consistently reward products that show evidence, include
          caveats, and define threat models honestly.
        </ArticleParagraph>
        <ArticleParagraph>
          We built Plain with the same cultural expectation we use in production engineering: if a
          behavior matters, instrument it. If a claim matters, document how to falsify it.
        </ArticleParagraph>
        <ArticleNote>
          This is also why we separate local tools from AI endpoints with explicit consent gates. Users
          should always know when a flow stays on-device and when external processing is involved.
        </ArticleNote>
      </ArticleSection>

      <ArticleSection title="Verifiable architecture changes product decisions">
        <ArticleParagraph>
          Once you commit to verification-first privacy, implementation choices change quickly. You avoid
          hidden upload fallbacks. You reduce optional third-party scripts. You expose clear UI consent
          boundaries. You treat network silence during core file processing as a non-negotiable product
          requirement.
        </ArticleParagraph>
        <ArticleParagraph>
          The result is often a simpler system: fewer moving parts, fewer legal ambiguities, and clearer
          user expectations. Privacy becomes an architectural property, not a compliance afterthought.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection title="What users should demand from every PDF tool">
        <ArticleParagraph>
          You do not need to trust Plain by default. In fact, please do not. Use this checklist across
          all tools:
        </ArticleParagraph>
        <ArticleList
          items={[
            "Can I verify file data flow with built-in browser tools?",
            "Is there a documented offline test for core operations?",
            "Are AI features explicitly opt-in and separately disclosed?",
            "Are deletion/retention claims tied to specific workflows, not vague promises?",
          ]}
        />
        <ArticleParagraph>
          If a vendor cannot answer these clearly, you are not buying certainty. You are buying risk.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection title="Where to start">
        <ArticleParagraph>
          Start with{" "}
          <Link
            href="/verify-claims"
            className="text-accent underline underline-offset-4 hover:text-accent/80"
          >
            /verify-claims
          </Link>
          . Then test a real workflow in{" "}
          <Link
            href="/tools/merge-pdf"
            className="text-accent underline underline-offset-4 hover:text-accent/80"
          >
            Merge PDF
          </Link>{" "}
          or{" "}
          <Link
            href="/tools/redact-pdf"
            className="text-accent underline underline-offset-4 hover:text-accent/80"
          >
            Redact PDF
          </Link>
          . Keep DevTools open while you process. If the claim holds under your own inspection, that is
          real trust.
        </ArticleParagraph>
        <ArticleParagraph>
          Privacy should be inspectable infrastructure. That is what we are trying to build, and that is
          what we think users should expect everywhere.
        </ArticleParagraph>
      </ArticleSection>
    </BlogArticle>
  )
}

