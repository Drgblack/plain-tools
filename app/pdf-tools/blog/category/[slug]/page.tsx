import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Script from "next/script"
import { ChevronRight } from "lucide-react"
import { categories, posts, getCategoryBySlug, type CategoryId } from "@/lib/legacy/blog-data"
import { generateFAQSchema, generateBreadcrumbSchema, combineSchemas } from "@/lib/legacy/schema"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return categories
    .filter((c) => c.id !== "all")
    .map((category) => ({
      slug: category.slug,
    }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    return { title: "Category Not Found - Plain" }
  }

  const pageDescription = category.longDescription 
    ? category.longDescription.slice(0, 160) 
    : category.description

  return {
    title: `${category.label}`,
    description: pageDescription,
    openGraph: {
      title: `${category.label} - Plain Blog`,
      description: pageDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.label} - Plain Blog`,
      description: pageDescription,
    },
    alternates: {
      canonical: `https://plain.tools/blog/category/${slug}`,
    },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const categoryPosts = posts.filter((post) => post.category === category.id)

  // Generate structured data schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://plain.tools/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://plain.tools/blog" },
      { "@type": "ListItem", position: 3, name: category.label, item: `https://plain.tools/blog/category/${slug}` },
    ],
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.label} - Plain Blog`,
    description: category.longDescription || category.description,
    url: `https://plain.tools/blog/category/${slug}`,
    isPartOf: {
      "@type": "Blog",
      name: "Plain Blog",
      url: "https://plain.tools/blog",
    },
    about: {
      "@type": "Thing",
      name: category.label,
      description: category.description,
    },
  }

  // FAQ schema for LLM retrieval
  const faqSchema = category.faqs && category.faqs.length > 0
    ? generateFAQSchema(category.faqs)
    : null

  const combinedSchema = combineSchemas([breadcrumbSchema, collectionSchema, faqSchema].filter(Boolean))

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-accent/10 bg-[oklch(0.12_0.004_250)] px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-1.5 text-[12px] text-muted-foreground/60">
              <Link href="/pdf-tools/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/pdf-tools/blog" className="hover:text-foreground transition-colors">
                Blog
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{category.label}</span>
            </nav>

            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {category.label}
            </h1>
            
            {/* Long description for context */}
            {category.longDescription && (
              <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground/80">
                {category.longDescription}
              </p>
            )}
          </div>
        </section>

        {/* Articles Grid */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted-foreground/60">
                {categoryPosts.length} {categoryPosts.length === 1 ? "Article" : "Articles"}
              </h2>
              <Link
                href="/pdf-tools/blog"
                className="text-[12px] text-muted-foreground/50 hover:text-foreground transition-colors"
              >
                View all articles
              </Link>
            </div>

            {categoryPosts.length === 0 ? (
              <div className="rounded-xl bg-[oklch(0.15_0.005_250)] p-8 text-center">
                <p className="text-[14px] text-muted-foreground/70">
                  No articles in this category yet.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {categoryPosts.map((post) => {
                  const formattedDate = new Date(post.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })

                  return (
                    <article key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group block rounded-xl bg-[oklch(0.165_0.006_250)] p-6 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
                      >
                        <h3 className="text-[17px] font-semibold leading-snug text-foreground group-hover:text-accent transition-colors">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground/75">
                          {post.description}
                        </p>
                        <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground/55">
                          <time dateTime={post.date}>{formattedDate}</time>
                          <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30" />
                          <span>{post.readingTime} min read</span>
                        </div>
                      </Link>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        {category.faqs && category.faqs.length > 0 && (
          <section className="border-t border-accent/10 px-4 py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Frequently asked questions
              </h2>
              <p className="mt-2 text-[14px] text-muted-foreground/70">
                Common questions about {category.label.toLowerCase()}.
              </p>
              <div className="mt-8 space-y-6">
                {category.faqs.map((faq, index) => (
                  <div key={index} className="rounded-xl bg-[oklch(0.15_0.005_250)] p-6 ring-1 ring-white/[0.04]">
                    <h3 className="text-[15px] font-semibold text-foreground">
                      {faq.question}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground/80">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Learning Links */}
        {category.learnLinks && category.learnLinks.length > 0 && (
          <section className="border-t border-accent/10 bg-[oklch(0.125_0.003_250)] px-4 py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Related articles in the Learning Center
              </h2>
              <p className="mt-2 text-[13px] text-muted-foreground/70">
                Reference material that covers these topics in more depth.
              </p>
              <div className="mt-6 space-y-3">
                {category.learnLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center justify-between rounded-xl border border-accent/10 bg-[oklch(0.16_0.006_250)] p-5 transition-all duration-200 hover:border-accent/25"
                  >
                    <span className="text-[14px] font-medium text-foreground group-hover:text-accent transition-colors">
                      {link.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-accent transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Other Categories */}
        <section className="border-t border-accent/10 px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Explore other topics
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {categories
                .filter((c) => c.id !== "all" && c.id !== category.id)
                .map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/blog/category/${cat.slug}`}
                    className="group rounded-xl border border-white/[0.04] bg-[oklch(0.16_0.006_250)] p-5 transition-all duration-200 hover:border-accent/20"
                  >
                    <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent transition-colors">
                      {cat.label}
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/60 line-clamp-2">
                      {cat.description}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}



