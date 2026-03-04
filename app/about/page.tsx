import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Shield, Zap, Globe, Code } from "lucide-react"
import { generateStaticPageMetadata } from "@/lib/seo"

export const metadata: Metadata = generateStaticPageMetadata({
  title: "About",
  description: "Plain Tools builds privacy-first browser utilities that run entirely on your device. No uploads, no tracking, no compromises.",
  slug: "about",
})

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
      <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-12">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground">About</span>
            </nav>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              About plain.tools
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              We build tools that respect your privacy and run entirely in your
              browser. No uploads. No tracking. No compromises.
            </p>
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
