import { MetadataRoute } from "next"

import { buildSitemapEntries } from "@/lib/sitemap-data"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries(new Date())
}
