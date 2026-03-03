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
  title: "Can Websites Read Your Files Without Uploading?",
  description: "Plain explains browser security, file access permissions, and how to verify that websites handle files locally. Learn practical offline PDF privacy strategies.",
  authors: [{ name: "Plain Editorial" }],
  openGraph: {
    type: "article",
    title: "Can Websites Read Your Files Without Uploading?",
    description: "Plain explains browser security and file access permissions.",
    publishedTime: "2026-02-28T00:00:00Z",
    authors: ["Plain Editorial"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Can Websites Read Your Files Without Uploading Them? – Plain Blog",
    description: "A clear explanation of browser security, file access permissions, and how to verify that websites handle your files safely.",
    images: ["/og?title=Can%20Websites%20Read%20Your%20Files%3F&subtitle=Plain%20Blog&kind=blog"],
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can a website secretly upload files?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Browsers require explicit user action (clicking a file picker or drag-and-drop) before a website can access any file. Even then, the website only receives the files you specifically selected. Additionally, you can monitor the Network tab in browser DevTools to verify no unexpected uploads occur.",
      },
    },
  ],
}

export default function CanWebsitesReadFilesPage() {
  return (
    <>
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />
      <BlogArticle
        title="Can Websites Read Your Files Without Uploading Them?"
        description="Browser security model explained: when websites can access files, what they can read, and how to verify upload behavior."
        datePublished="2026-02-28"
        readingTime={6}
        intro="A common concern when using web-based tools is whether websites can access files on your computer without your knowledge. This article explains how browser security works, what permissions websites actually have, and how you can verify file handling behavior yourself."
        inSimpleTerms="Websites cannot access files on your computer unless you explicitly select them. When you do share a file, browsers have security features that prevent websites from reading anything else. You can verify this yourself using browser developer tools."
        relatedReading={[
          { href: "/verify", title: "How to Verify Plain", description: "Step-by-step verification guide" },
          { href: "/learn/how-plain-works", title: "How Plain Works", description: "Technical architecture explained" },
          { href: "/learn/is-offline-pdf-processing-secure", title: "Is Offline Processing Secure?", description: "Security considerations" },
          { href: "/blog/why-browser-based-tools-are-more-powerful", title: "Why Browser Tools Are More Powerful", description: "Modern browser capabilities" },
        ]}
      >
        <ArticleSection title="Browser permission model">
          <ArticleParagraph>
            Modern browsers implement a strict permission model that governs how websites
            interact with your device. This model is designed around a principle called
            "least privilege"—websites start with almost no access and must request
            specific permissions for sensitive operations.
          </ArticleParagraph>
          <ArticleParagraph>
            For file access specifically, the rules are clear:
          </ArticleParagraph>
          <ArticleList
            items={[
              "Websites cannot browse your file system or see what files exist",
              "File access requires explicit user action (clicking a file input or drag-and-drop)",
              "Only the specific files you select are accessible to the website",
              "Permission is granted per-session and does not persist across page reloads",
            ]}
          />
          <ArticleParagraph>
            This permission model is enforced by the browser itself, not by the website.
            A malicious website cannot bypass these restrictions through JavaScript or
            any other client-side code.
          </ArticleParagraph>
        </ArticleSection>

        <ArticleSection title="File access limitations">
          <ArticleParagraph>
            When you select a file through a website's file picker, the browser creates
            a controlled reference to that file. The website receives only what is
            necessary to work with your selection:
          </ArticleParagraph>
          <ArticleList
            items={[
              "The file name (but not its full path on your system)",
              "The file size and type",
              "The ability to read the file's contents",
              "No access to other files in the same folder",
              "No access to file metadata like creation date or author",
            ]}
          />
          <ArticleParagraph>
            Importantly, the browser hides your actual file system structure. If you
            select a file from <code className="rounded bg-accent/10 px-1.5 py-0.5 text-[13px] text-accent">
            /Users/name/Documents/sensitive/contract.pdf</code>, the website only sees
            "contract.pdf"—it cannot determine the folder structure or that a "sensitive"
            directory exists.
          </ArticleParagraph>
          <ArticleParagraph>
            The File System Access API, a newer browser feature, can request broader
            access to directories. However, this requires an additional explicit permission
            prompt and is clearly disclosed to users.
          </ArticleParagraph>
        </ArticleSection>

        <ArticleSection title="Sandbox security explained">
          <ArticleParagraph>
            Browsers run websites inside a security "sandbox"—an isolated environment
            that limits what code can do. The sandbox provides multiple layers of protection:
          </ArticleParagraph>
          <ArticleList
            items={[
              "Process isolation: Each browser tab runs in a separate process with its own memory space",
              "Origin restrictions: Websites can only access data from their own domain",
              "API limitations: Dangerous system APIs are simply not exposed to web code",
              "Content Security Policy: Websites can further restrict their own capabilities",
            ]}
          />
          <ArticleParagraph>
            The sandbox means that even if a website contains malicious code, it cannot
            escape the browser's restrictions to access your file system, install software,
            or read data from other websites. This architecture has been refined over
            decades and is continuously tested by security researchers.
          </ArticleParagraph>
          <ArticleNote>
            Browser sandboxing is not theoretical—it is actively tested. Major browsers
            run bug bounty programs paying researchers to find sandbox escapes. Such
            vulnerabilities are rare, treated as critical, and patched quickly.
          </ArticleNote>
        </ArticleSection>

        <ArticleSection title="How to verify file behavior">
          <ArticleParagraph>
            You do not need to trust claims about file handling—you can verify them
            yourself using tools built into every modern browser. Here is how to check
            whether a website uploads your files:
          </ArticleParagraph>
          <ArticleParagraph>
            <strong className="text-foreground">Step 1: Open Developer Tools</strong>
            <br />
            Press <kbd className="rounded bg-accent/10 px-1.5 py-0.5 text-[12px] text-accent">F12</kbd> or
            right-click and select "Inspect". Navigate to the "Network" tab.
          </ArticleParagraph>
          <ArticleParagraph>
            <strong className="text-foreground">Step 2: Clear existing requests</strong>
            <br />
            Click the clear button (usually a circle with a line) to remove previous
            network activity so you can see only new requests.
          </ArticleParagraph>
          <ArticleParagraph>
            <strong className="text-foreground">Step 3: Select a file and process it</strong>
            <br />
            Use the website's file picker to select a document, then trigger whatever
            processing operation you want to test (merge, convert, etc.).
          </ArticleParagraph>
          <ArticleParagraph>
            <strong className="text-foreground">Step 4: Examine the network activity</strong>
            <br />
            Look for any requests that appear during processing. For a truly offline tool,
            you should see no network requests at all. If you see requests, click on them
            to examine what data is being sent.
          </ArticleParagraph>
          <ArticleParagraph>
            For a complete verification guide including offline testing, see{" "}
            <a href="/verify" className="text-accent underline underline-offset-4 hover:text-accent/80">
              How to Verify Plain
            </a>.
          </ArticleParagraph>
        </ArticleSection>

        <ArticleSection title="Conclusion">
          <ArticleParagraph>
            The browser security model provides strong guarantees about file access.
            Websites cannot secretly read or upload files—they can only access what
            you explicitly provide, and you can verify their behavior using standard
            developer tools.
          </ArticleParagraph>
          <ArticleParagraph>
            This security architecture is what makes browser-based offline tools possible.
            When a tool like Plain processes files locally, the browser's sandbox ensures
            that your documents remain on your device. The technology that protects you
            from malicious websites is the same technology that enables private, local
            processing.
          </ArticleParagraph>
          <ArticleParagraph>
            For details on how Plain implements local processing, see{" "}
            <a href="/learn/how-plain-works" className="text-accent underline underline-offset-4 hover:text-accent/80">
              How Plain Works
            </a>.
          </ArticleParagraph>
        </ArticleSection>
      </BlogArticle>
    </>
  )
}

