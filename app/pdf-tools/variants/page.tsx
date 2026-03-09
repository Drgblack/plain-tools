import type { Metadata } from "next"
import Link from "next/link"

import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { buildPageMetadata } from "@/lib/page-metadata"
import { getPdfToolVariantIndexGroups } from "@/lib/pdf-tool-variants"

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "PDF Tool Variants | Offline, Secure, Mac, Windows, iPhone | Plain Tools",
    description:
      "Browse PDF tool variants for merge, split, compress, and conversion workflows across Mac, Windows, iPhone, Android, offline, securely, no-upload, and large-file use cases.",
    path: "/pdf-tools/variants",
    image: "/og/tools.png",
  }),
  robots: {
    index: true,
    follow: true,
  },
}

const groups = getPdfToolVariantIndexGroups()

export default function PdfToolVariantsIndexPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14">
      <PageBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "Variants" },
        ]}
        className="mb-4"
      />

      <header className="max-w-4xl space-y-4">
        <div className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          PDF SEO matrix
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          PDF tool variants for platform, privacy, and workflow intent
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground md:text-[1.03rem]">
          This index groups the programmatic PDF pages by tool so users can jump straight into the
          right variant instead of starting from a generic landing page. Each route uses the same
          live browser tool, with modifier-specific content focused on no upload, privacy-first,
          browser-only processing, and practical checks before the file is shared or submitted.
        </p>
      </header>

      <section className="mt-10 grid gap-6">
        {groups.map((group) => (
          <article
            key={group.toolSlug}
            className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {group.toolName}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {group.toolDescription}
                </p>
              </div>
              <Link
                href={`/tools/${group.toolSlug}`}
                className="text-sm font-medium text-accent hover:underline"
              >
                Open canonical tool
              </Link>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {group.categories.map((category) => (
                <section key={category.name}>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-accent/90">
                    {category.name}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {category.pages.map((page) => (
                      <Link
                        key={page.pdfPath}
                        href={page.pdfPath}
                        className="rounded-full border border-border/70 bg-background/70 px-3 py-2 text-sm font-medium text-accent transition-colors hover:border-accent/40 hover:text-accent/90"
                      >
                        {page.h1}
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
