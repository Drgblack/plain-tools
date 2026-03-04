import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { generateStaticPageMetadata } from "@/lib/seo"

export const metadata: Metadata = generateStaticPageMetadata({
  title: "Privacy Policy",
  description: "Plain Tools privacy policy. We don't collect, store, or transmit your files. All processing happens locally in your browser.",
  slug: "privacy",
})

export default function PrivacyPage() {
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
              <span className="text-foreground">Privacy</span>
            </nav>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Last updated: March 2026
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="prose prose-sm prose-invert max-w-2xl">
              <h2 className="text-lg font-medium text-foreground">Summary</h2>
              <p className="mt-2 text-muted-foreground">
                plain.tools is designed to process your files locally. We don't
                collect, store, or transmit your files. Here's what that means
                in practice:
              </p>

              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li>Files you process never leave your device</li>
                <li>We don't use analytics or tracking scripts</li>
                <li>We don't use cookies for tracking</li>
                <li>We don't sell or share any data</li>
                <li>You can verify our claims by inspecting network traffic</li>
              </ul>

              <h2 className="mt-12 text-lg font-medium text-foreground">
                Local Processing
              </h2>
              <p className="mt-2 text-muted-foreground">
                All file processing tools (PDF, image, document conversions)
                run entirely in your browser using WebAssembly. Your files are
                processed on your device and are never transmitted to our
                servers or any third party.
              </p>

              <h2 className="mt-12 text-lg font-medium text-foreground">
                Network Tools
              </h2>
              <p className="mt-2 text-muted-foreground">
                Some network tools (DNS lookup, site status, ping) require
                server-side processing because browsers cannot perform these
                operations directly. For these tools:
              </p>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li>We use edge functions to process queries</li>
                <li>Queries are not logged or stored</li>
                <li>No personally identifiable information is retained</li>
                <li>Results are returned directly without intermediate storage</li>
              </ul>

              <h2 className="mt-12 text-lg font-medium text-foreground">
                IP Address
              </h2>
              <p className="mt-2 text-muted-foreground">
                When you use our IP lookup tool, we detect your IP address to
                display it to you. This information is not stored or logged.
                The geolocation data is derived from public IP databases and is
                approximate.
              </p>

              <h2 className="mt-12 text-lg font-medium text-foreground">
                Hosting
              </h2>
              <p className="mt-2 text-muted-foreground">
                Our website is hosted on Vercel. Vercel may collect standard
                web server logs including IP addresses for security and
                operational purposes. We don't have access to or control over
                this data. See Vercel's privacy policy for details.
              </p>

              <h2 className="mt-12 text-lg font-medium text-foreground">
                Verification
              </h2>
              <p className="mt-2 text-muted-foreground">
                We encourage you to verify our privacy claims. Open your
                browser's developer tools, go to the Network tab, and use any
                file processing tool. You'll see that files are not transmitted
                anywhere.
              </p>

              <h2 className="mt-12 text-lg font-medium text-foreground">
                Changes
              </h2>
              <p className="mt-2 text-muted-foreground">
                We may update this policy to reflect changes in our practices
                or for legal reasons. Material changes will be noted at the top
                of this page.
              </p>

              <h2 className="mt-12 text-lg font-medium text-foreground">
                Contact
              </h2>
              <p className="mt-2 text-muted-foreground">
                If you have questions about this privacy policy, contact us at{" "}
                <a
                  href="mailto:privacy@plain.tools"
                  className="text-foreground hover:underline"
                >
                  privacy@plain.tools
                </a>
              </p>
            </div>
          </div>
        </section>
    </div>
  )
}
