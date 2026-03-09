import Head from "next/head"

import { buildCanonicalUrl } from "@/lib/page-metadata"

type CanonicalSelfProps = {
  path?: string
  pathname?: string
}

/**
 * Server-rendered self-canonical link.
 *
 * This stays explicit even when page metadata already defines a canonical URL.
 * The goal is to prevent duplicate-intent routes from drifting into ambiguous
 * canonical clusters when shared layouts or hand-written pages evolve over time.
 */
export function CanonicalSelf({ path, pathname }: CanonicalSelfProps) {
  const resolvedPath = pathname ?? path ?? "/"

  return (
    <Head>
      <link rel="canonical" href={buildCanonicalUrl(resolvedPath)} />
    </Head>
  )
}
