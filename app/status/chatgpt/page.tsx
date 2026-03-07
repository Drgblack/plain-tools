import type { Metadata } from "next"

import { getStatusLandingPageOrThrow } from "@/lib/status-landing-pages"

import { buildStatusLandingMetadata, StatusLandingPageTemplate } from "../status-landing-page"

const page = getStatusLandingPageOrThrow("chatgpt")

export const metadata: Metadata = buildStatusLandingMetadata(page)

export default function ChatGptStatusLandingPage() {
  return <StatusLandingPageTemplate page={page} />
}
