import type { Metadata } from "next"
import Link from "next/link"
import { Merge, Split, Minimize2, ArrowUpDown, FileOutput } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "PDF Tools",
  description:
    "Plain provides PDF tools that run locally in your browser. Merge, split, compress, and reorder pages without uploading files.",
  openGraph: {
    title: "PDF Tools - Plain",
    description: "Plain provides PDF tools that run locally in your browser without uploading files.",
  },
  alternates: {
    canonical: "https://plain.tools/tools",
  },
}

const tools = [
  {
    icon: Merge,
    title: "Merge PDF",
    description: "Combine multiple PDFs into one document",
    href: "/tools/merge-pdf",
    status: "active" as const,
  },
  {
    icon: Split,
    title: "Split PDF",
    description: "Separate a PDF into individual pages",
    href: "/tools/split-pdf",
    status: "active" as const,
  },
  {
    icon: Minimize2,
    title: "Compress PDF",
    description: "Reduce file size while maintaining quality",
    href: "/tools/compress-pdf",
    status: "active" as const,
  },
  {
    icon: ArrowUpDown,
    title: "Reorder Pages",
    description: "Rearrange pages in your PDF document",
    href: "/tools/reorder-pdf",
    status: "active" as const,
  },
  {
    icon: FileOutput,
    title: "Extract Pages",
    description: "Pull specific pages from a PDF",
    href: "/tools/extract-pdf",
    status: "active" as const,
  },
]

export default function ToolsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              PDF Tools
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Simple, offline PDF tools that run entirely in your browser.
            </p>

            <div className="mt-10 space-y-3">
              {tools.map((tool) => {
                const isActive = tool.status === "active"
                const Wrapper = isActive ? Link : "div"
                const wrapperProps = isActive ? { href: tool.href } : {}

                return (
                  <Wrapper key={tool.title} {...wrapperProps}>
                    <Card
                      className={`group transition-colors ${
                        isActive
                          ? "cursor-pointer hover:border-accent/50 hover:bg-secondary/50"
                          : "cursor-default opacity-60"
                      }`}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary">
                          <tool.icon className="h-5 w-5 text-muted-foreground group-hover:text-accent" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-sm font-medium text-foreground">
                            {tool.title}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {tool.description}
                          </p>
                        </div>
                        <Badge
                          variant={isActive ? "default" : "secondary"}
                          className={`shrink-0 text-xs ${
                            isActive
                              ? "bg-accent text-accent-foreground"
                              : ""
                          }`}
                        >
                          {isActive ? "Active" : "Coming Soon"}
                        </Badge>
                      </CardContent>
                    </Card>
                  </Wrapper>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-border px-4 py-12">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Plain provides offline PDF tools designed for privacy-conscious
              users. All tools run locally in the browser without uploading
              files to external servers.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
