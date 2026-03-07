import type { Metadata } from "next"

import { getStatusLandingPageOrThrow } from "@/lib/status-landing-pages"

import { buildStatusLandingMetadata, StatusLandingPageTemplate } from "../status-landing-page"

const page = getStatusLandingPageOrThrow("discord")

export const metadata: Metadata = buildStatusLandingMetadata(page)

export default function DiscordStatusLandingPage() {
  return <StatusLandingPageTemplate page={page} />
}
