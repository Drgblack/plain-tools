import { MetadataRoute } from 'next'

const BASE_URL = 'https://plainpdf.com'
const LAST_MODIFIED = '2026-03-02'

export default function sitemap(): MetadataRoute.Sitemap {
  // High Priority (1.0) - Home page
  const homePage = {
    url: BASE_URL,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }

  // Primary Priority (0.9) - All tools
  const tools = [
    'merge-pdf',
    'split-pdf',
    'compress-pdf',
    'reorder-pdf',
    'extract-pages',
    'pdf-to-jpg',
    'pdf-to-word',
    'pdf-to-excel',
    'image-to-pdf',
    'html-to-pdf',
    'redact-pdf',
    'unlock-pdf',
    'watermark-pdf',
    'ocr-pdf',
    'page-numbers',
    'delete-pages',
    'ai-chat-pdf',
    'ai-summary',
  ].map((tool) => ({
    url: `${BASE_URL}/tools/${tool}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  // Content Priority (0.8) - Learning Centre articles
  const learningArticles = [
    'webassembly-explained',
    'hardware-acceleration',
    'redaction-guide',
    'offline-workflows',
    'ram-optimisation',
    'privacy-101',
    'wasm-vs-cloud',
    'webgpu-acceleration',
    'permanent-redaction',
    'large-pdf-management',
    'no-uploads-explained',
    'verify-offline-processing',
    'client-side-processing',
  ].map((article) => ({
    url: `${BASE_URL}/learn/${article}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Content Priority (0.8) - Blog posts
  const blogPosts = [
    'why-we-built-plain',
    'wasm-performance-guide',
    'privacy-first-development',
    'local-ai-browser',
    'gdpr-compliance-tools',
  ].map((post) => ({
    url: `${BASE_URL}/blog/${post}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Additional Content Pages
  const contentPages = [
    { url: `${BASE_URL}/learn`, priority: 0.8 },
    { url: `${BASE_URL}/blog`, priority: 0.8 },
    { url: `${BASE_URL}/labs`, priority: 0.7 },
    { url: `${BASE_URL}/tools`, priority: 0.9 },
  ].map((page) => ({
    ...page,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'weekly' as const,
  }))

  // Utility Priority (0.5) - About, Support, Ethics
  const utilityPages = [
    'about',
    'support',
    'verify-claims',
  ].map((page) => ({
    url: `${BASE_URL}/${page}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // Low Priority (0.3) - Legal pages
  const legalPages = [
    'terms',
    'privacy',
  ].map((page) => ({
    url: `${BASE_URL}/${page}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }))

  // Comparison pages (0.7)
  const comparisonPages = [
    'plain-vs-ilovepdf',
    'plain-vs-smallpdf',
    'plain-vs-adobe',
  ].map((page) => ({
    url: `${BASE_URL}/compare/${page}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    homePage,
    ...tools,
    ...contentPages,
    ...learningArticles,
    ...blogPosts,
    ...comparisonPages,
    ...utilityPages,
    ...legalPages,
  ]
}
