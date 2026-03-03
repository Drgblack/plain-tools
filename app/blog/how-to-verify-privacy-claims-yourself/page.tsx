import { Metadata } from "next"
import Script from "next/script"
import {
  BlogArticle,
  ArticleSection,
  ArticleParagraph,
  ArticleList,
  ArticleNote,
} from "@/components/blog-article"
import { serializeJsonLd } from "@/lib/sanitize"

export const metadata: Metadata = {
  title: "How to Verify Privacy Claims Yourself",
  description:
    "Plain shows how to verify whether websites handle files privately using DevTools and network monitoring.",
  authors: [{ name: "Plain Editorial" }],
  openGraph: {
    type: "article",
    title: "How to Verify Privacy Claims Yourself",
    description: "Plain shows how to verify whether websites handle files privately.",
    publishedTime: "2026-02-28T00:00:00Z",
    authors: ["Plain Editorial"],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Verify a Website's Privacy Claims Yourself – Plain Blog",
    description: "Learn practical techniques to independently verify whether websites handle your files privately, including DevTools inspection, network monitoring, and offline testing.",
    images: ["/og?title=How%20to%20Verify%20Privacy%20Claims&subtitle=Plain%20Blog&kind=blog"],
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How can I tell if a site uploads my files?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Open your browser's DevTools (F12), go to the Network tab, then use the website's file processing feature. Watch for outgoing requests—if you see POST or PUT requests containing file data being sent to external servers, the site is uploading your files. If the Network tab shows no such activity during processing, the operation is happening locally in your browser.",
      },
    },
  ],
}

export default function HowToVerifyPrivacyClaimsPage() {
  return (
    <>
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />
      <BlogArticle
        title="How to Verify a Website's Privacy Claims Yourself"
        description="Many websites claim to protect your privacy, but how can you actually verify those claims? This guide provides practical techniques anyone can use to independently check whether a website handles files locally or sends them to remote servers."
        datePublished="2026-02-28"
        readingTime={8}
        slug="how-to-verify-privacy-claims-yourself"
        inSimpleTerms="You can verify privacy claims by watching your browser's network activity while using a website. If no data leaves your computer during file processing, the operation is truly local. The techniques in this article work for any website, not just Plain."
        relatedReading={[
          { href: "/verify", title: "How to Verify Plain", description: "Step-by-step verification guide for Plain's tools" },
          { href: "/privacy-by-design", title: "Privacy by Design", description: "Plain's approach to privacy architecture" },
          { href: "/learn/how-plain-works", title: "How Plain Works", description: "Technical explanation of client-side processing" },
          { href: "/blog/can-websites-read-your-files-without-uploading", title: "Can Websites Read Your Files?", description: "Browser security and file access" },
        ]}
      >
        <ArticleSection title="Checking network requests">
          <ArticleParagraph>
            The most reliable way to verify privacy claims is to observe what data actually leaves 
            your computer. Every modern browser includes tools that let you monitor network activity 
            in real time. This is not about trusting what a website says—it's about seeing what 
            it does.
          </ArticleParagraph>
          <ArticleParagraph>
            When you use a file processing tool, one of two things happens: either your file data 
            is sent to a remote server (an upload), or it's processed entirely within your browser. 
            Network monitoring reveals which is occurring.
          </ArticleParagraph>
          <ArticleList
            items={[
              "Uploads appear as outgoing POST or PUT requests with file data in the payload",
              "Local processing shows no outgoing requests during the actual file operation",
              "Some sites may send metadata or analytics separately from file content",
              "Look for requests to domains other than the site you're visiting",
            ]}
          />
          <ArticleParagraph>
            The key insight is that network requests cannot be hidden from browser DevTools. If 
            data is being transmitted, you will see evidence of it.
          </ArticleParagraph>
        </ArticleSection>

        <ArticleSection title="Using browser DevTools">
          <ArticleParagraph>
            Browser Developer Tools (DevTools) are built into every major browser and provide 
            detailed visibility into what a website is doing. Here's how to use them for 
            privacy verification:
          </ArticleParagraph>
          <ArticleParagraph>
            <strong className="text-foreground/90">Step 1: Open DevTools</strong><br />
            Press F12 (Windows/Linux) or Cmd+Option+I (Mac) to open DevTools. Alternatively, 
            right-click anywhere on the page and select "Inspect" or "Inspect Element".
          </ArticleParagraph>
          <ArticleParagraph>
            <strong className="text-foreground/90">Step 2: Navigate to the Network tab</strong><br />
            Click on the "Network" tab in the DevTools panel. This shows all network requests 
            the page makes in real time.
          </ArticleParagraph>
          <ArticleParagraph>
            <strong className="text-foreground/90">Step 3: Clear existing activity</strong><br />
            Click the clear button (a circle with a line through it) to remove previous requests. 
            This gives you a clean slate to observe.
          </ArticleParagraph>
          <ArticleParagraph>
            <strong className="text-foreground/90">Step 4: Perform the file operation</strong><br />
            Now use the website's file processing feature. Select your file and initiate the 
            operation (merge, convert, compress, etc.).
          </ArticleParagraph>
          <ArticleParagraph>
            <strong className="text-foreground/90">Step 5: Analyze the results</strong><br />
            Watch the Network tab during processing. Click on any requests that appear to see 
            their details. Look at the "Request" and "Payload" sections to see what data is 
            being sent.
          </ArticleParagraph>
          <ArticleNote>
            Filter by request type using the toolbar. "Fetch/XHR" shows API calls, while "All" 
            shows everything including images and scripts. For privacy verification, focus on 
            Fetch/XHR requests during the actual file operation.
          </ArticleNote>
        </ArticleSection>

        <ArticleSection title="Offline testing">
          <ArticleParagraph>
            The simplest and most definitive test is to disconnect from the internet and see if 
            the tool still works. If a website claims to process files locally, it should function 
            without any network connection.
          </ArticleParagraph>
          <ArticleList
            items={[
              "Load the website while connected to the internet",
              "Disconnect your network (turn off Wi-Fi or unplug ethernet)",
              "Attempt to use the file processing feature",
              "If it works, the processing is genuinely local",
              "If it fails or shows connection errors, the tool requires server access",
            ]}
          />
          <ArticleParagraph>
            This test is binary and unambiguous. A tool that processes files on remote servers 
            simply cannot function without network access. There is no way to fake local 
            processing if the actual computation happens elsewhere.
          </ArticleParagraph>
          <ArticleParagraph>
            Some websites may load initially but fail at the processing step when offline. This 
            indicates they can display the interface locally but require server communication 
            for the actual file operation. See Plain's{" "}
            <a href="/verify" className="text-accent underline underline-offset-4 hover:text-accent/80">
              verification guide
            </a>{" "}
            for a detailed offline testing walkthrough.
          </ArticleParagraph>
        </ArticleSection>

        <ArticleSection title="Reading privacy policies critically">
          <ArticleParagraph>
            While technical verification is the most reliable approach, privacy policies can 
            provide useful context. However, they require careful reading to understand what's 
            actually being said.
          </ArticleParagraph>
          <ArticleParagraph>
            <strong className="text-foreground/90">Look for specific claims</strong><br />
            Vague statements like "we take privacy seriously" mean nothing. Look for specific, 
            verifiable claims: "files are processed in your browser" or "data is deleted after 
            24 hours" are testable assertions.
          </ArticleParagraph>
          <ArticleParagraph>
            <strong className="text-foreground/90">Understand the scope</strong><br />
            A policy may say "we don't sell your data" while still storing it indefinitely or 
            sharing it with service providers. Read what is and isn't covered.
          </ArticleParagraph>
          <ArticleParagraph>
            <strong className="text-foreground/90">Check for contradictions</strong><br />
            Marketing pages may claim "no uploads" while the privacy policy describes server 
            processing for "service improvement." The legal document typically reflects the 
            actual practice.
          </ArticleParagraph>
          <ArticleList
            items={[
              "Search for terms like 'upload', 'server', 'store', 'retain', 'process'",
              "Check data retention periods—indefinite storage is common",
              "Look for third-party service providers who may receive your data",
              "Note any language about using data for 'improving services' or 'analytics'",
            ]}
          />
          <ArticleParagraph>
            Plain's approach to{" "}
            <a href="/privacy-by-design" className="text-accent underline underline-offset-4 hover:text-accent/80">
              privacy by design
            </a>{" "}
            means there's no data to write policies about—if files never leave your device, 
            there's no server-side data handling to disclose.
          </ArticleParagraph>
        </ArticleSection>

        <ArticleSection title="Conclusion">
          <ArticleParagraph>
            Verifying privacy claims doesn't require technical expertise—it requires observation. 
            Browser DevTools and offline testing are accessible to anyone and provide definitive 
            answers about how a website handles your files.
          </ArticleParagraph>
          <ArticleParagraph>
            The techniques in this guide work for any website, not just file processing tools. 
            Whenever a service claims to protect your privacy, you can verify those claims 
            yourself using the same methods.
          </ArticleParagraph>
          <ArticleParagraph>
            Trust should be earned through transparency and verifiability, not marketing 
            language. The tools to verify are built into every browser—the question is 
            whether you choose to use them.
          </ArticleParagraph>
        </ArticleSection>
      </BlogArticle>
    </>
  )
}
