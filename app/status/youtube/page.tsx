import type { Metadata } from "next"

import { getStatusLandingPageOrThrow } from "@/lib/status-landing-pages"

import { buildStatusLandingMetadata, StatusLandingPageTemplate } from "../status-landing-page"

const page = getStatusLandingPageOrThrow("youtube")

export const metadata: Metadata = buildStatusLandingMetadata(page)

export default function YouTubeStatusLandingPage() {
  return <StatusLandingPageTemplate page={page} />
}
