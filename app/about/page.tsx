import type { Metadata } from "next"
import Link from "next/link"
import { Shield, Zap, Globe, Code } from "lucide-react"
import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  buildBreadcrumbList,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "Learn how Plain Tools is built for local browser processing, no-upload workflows, and transparent privacy claims for sensitive files.",
  path: "/about",
  image: "/og/default.png",
})

const aboutSchema = combineJsonLd([
  buildWebPageSchema({
    name: "About | Plain Tools",
    description:
      "Learn how Plain Tools is built for local browser processing, no-upload workflows, and transparent privacy claims.",
    url: "https://plain.tools/about",
  }),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "About", url: "https://plain.tools/about" },
  ]),
])

const principles = [
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Privacy by architecture",
    description:
      "We don't just promise privacy, we architect it. Files are processed locally using WebAssembly. There's nothing to upload, nothing to intercept, nothing to leak.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Fast by default",
    description:
      "No waiting for uploads or server processing. Tools run at the speed of your device. Most operations complete instantly.",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Works offline",
    description:
      "Once loaded, most tools work without an internet connection. Take them anywhere.",
  },
  {
    icon: <Code className="h-5 w-5" />,
    title: "Verifiable claims",
    description:
      "Don't trust us. Verify. Open your browser's network tab and see that no files are transmitted. Our approach is transparent.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {aboutSchema ? <JsonLd id="about-page-schema" schema={aboutSchema} /> : null}
      <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <PageBreadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "About" }]}
              className="mb-6"
            />

            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              About plain.tools
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              We build tools that respect your privacy and run entirely in your
              browser. No uploads. No tracking. No compromises.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <Link href="/editorial-policy" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Editorial policy
              </Link>
              <Link href="/methodology/status-checks" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Status methodology
              </Link>
              <Link href="/verify-claims" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Verify privacy claims
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="mb-8 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Our Principles
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {principles.map((principle) => (
                <div key={principle.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-foreground">
                    {principle.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {principle.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="mb-4 text-lg font-medium text-foreground">
              How it works
            </h2>
            <div className="prose prose-sm prose-invert max-w-2xl">
              <p className="text-muted-foreground">
                Traditional online tools require you to upload files to a
                server for processing. This creates privacy risks, speed
                limitations, and requires trust in the service provider.
              </p>
              <p className="mt-4 text-muted-foreground">
                plain.tools takes a different approach. We use WebAssembly to
                run compiled code directly in your browser. PDF operations,
                image conversions, and file transformations all happen on your
                device.
              </p>
              <p className="mt-4 text-muted-foreground">
                For network tools that require server-side processing (like DNS
                lookups), we use edge functions that process queries without
                logging. The architectural choices we make ensure that privacy
                is the default, not an afterthought.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="mb-4 text-lg font-medium text-foreground">
              Transparency routes
            </h2>
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  href: "/editorial-policy",
                  title: "Editorial policy",
                  description: "How Plain Tools reviews guide content, methodology pages, and trust claims.",
                },
                {
                  href: "/methodology/status-checks",
                  title: "Status-check methodology",
                  description: "What the status pages measure, what they infer, and how to interpret results.",
                },
                {
                  href: "/verify-claims",
                  title: "Verify claims",
                  description: "Use DevTools and live examples to validate the no-upload privacy claim yourself.",
                },
              ].map((item) => (
                <article key={item.href} className="rounded-xl border border-border/70 bg-card/40 p-4">
                  <Link href={item.href} className="text-sm font-semibold text-foreground hover:text-accent hover:underline">
                    {item.title}
                  </Link>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
            <h2 className="mb-4 text-lg font-medium text-foreground">
              Contact
            </h2>
            <p className="text-muted-foreground">
              Questions, feedback, or suggestions? We'd like to hear from you.
            </p>
            <p className="mt-2 text-muted-foreground">
              Email:{" "}
              <a
                href="mailto:hello@plain.tools"
                className="text-foreground hover:underline"
              >
                hello@plain.tools
              </a>
            </p>
          </div>
        </section>
    </div>
  )
}
