#!/usr/bin/env node

/**
 * Plain PDF Hub - Dynamic Sitemap Generator
 * 
 * Generates a fresh sitemap.xml based on the /blog, /tools, /learn, and /compare
 * directory structures. Run during build to ensure the sitemap is always current.
 * 
 * Usage: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Configuration
const SITE_URL = process.env.SITE_URL || 'https://plain.tools';
const CURRENT_DATE = new Date().toISOString().split('T')[0];

// Priority and change frequency mappings
const ROUTE_CONFIG = {
  '/': { priority: '1.0', changefreq: 'weekly' },
  '/tools': { priority: '0.9', changefreq: 'weekly' },
  '/learn': { priority: '0.8', changefreq: 'weekly' },
  '/blog': { priority: '0.8', changefreq: 'daily' },
  '/compare': { priority: '0.7', changefreq: 'monthly' },
  '/about': { priority: '0.5', changefreq: 'monthly' },
  '/support': { priority: '0.5', changefreq: 'monthly' },
  '/privacy': { priority: '0.3', changefreq: 'yearly' },
  '/terms': { priority: '0.3', changefreq: 'yearly' },
};

// Tool pages get high priority
const TOOL_PRIORITY = '0.9';
const TOOL_CHANGEFREQ = 'monthly';

// Content pages
const CONTENT_PRIORITY = '0.7';
const CONTENT_CHANGEFREQ = 'monthly';

/**
 * Log message with timestamp
 */
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '[INFO]',
    warn: '[WARN]',
    error: '[ERROR]',
    success: '[OK]',
  }[type] || '[INFO]';
  
  console.log(`${timestamp} ${prefix} ${message}`);
}

/**
 * Get all page directories from app folder
 */
function getRoutes(dir, basePath = '') {
  const routes = [];
  const absoluteDir = path.join(ROOT_DIR, 'app', dir);
  
  if (!fs.existsSync(absoluteDir)) {
    log(`Directory not found: app/${dir}`, 'warn');
    return routes;
  }
  
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Skip special Next.js directories
      if (entry.name.startsWith('_') || entry.name.startsWith('.') || entry.name === 'api') {
        continue;
      }
      
      const routePath = `${basePath}/${entry.name}`;
      const fullDirPath = path.join(absoluteDir, entry.name);
      
      // Check if this directory has a page.tsx
      const hasPage = fs.existsSync(path.join(fullDirPath, 'page.tsx')) ||
                      fs.existsSync(path.join(fullDirPath, 'page.ts'));
      
      if (hasPage) {
        routes.push(routePath);
      }
      
      // Recursively check subdirectories
      const subRoutes = getRoutes(path.join(dir, entry.name), routePath);
      routes.push(...subRoutes);
    }
  }
  
  return routes;
}

/**
 * Get priority and changefreq for a route
 */
function getRouteConfig(route) {
  // Check exact matches first
  if (ROUTE_CONFIG[route]) {
    return ROUTE_CONFIG[route];
  }
  
  // Check prefix matches
  if (route.startsWith('/tools/')) {
    return { priority: TOOL_PRIORITY, changefreq: TOOL_CHANGEFREQ };
  }
  
  if (route.startsWith('/blog/') || route.startsWith('/learn/')) {
    return { priority: CONTENT_PRIORITY, changefreq: CONTENT_CHANGEFREQ };
  }
  
  if (route.startsWith('/compare/')) {
    return { priority: '0.6', changefreq: 'monthly' };
  }
  
  // Default
  return { priority: '0.5', changefreq: 'monthly' };
}

/**
 * Generate XML sitemap content
 */
function generateSitemapXml(routes) {
  const urlEntries = routes.map(route => {
    const config = getRouteConfig(route);
    return `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>`;
  }).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${urlEntries}
</urlset>`;
}

/**
 * Main function
 */
async function main() {
  console.log('');
  console.log('============================================');
  console.log('Plain PDF Hub - Sitemap Generator');
  console.log('============================================');
  console.log('');
  
  log(`Site URL: ${SITE_URL}`);
  log(`Generated date: ${CURRENT_DATE}`);
  console.log('');
  
  // Collect all routes
  const allRoutes = [];
  
  // Static routes
  const staticRoutes = ['', '/tools', '/learn', '/blog', '/compare', '/about', '/support', '/privacy', '/terms'];
  
  // Dynamic routes from directories
  const directories = ['tools', 'blog', 'learn', 'compare'];
  
  log('Scanning directories for routes...');
  
  for (const dir of directories) {
    const routes = getRoutes(dir, `/${dir}`);
    log(`Found ${routes.length} routes in /${dir}`);
    allRoutes.push(...routes);
  }
  
  // Combine and deduplicate
  const uniqueRoutes = [...new Set([...staticRoutes, ...allRoutes])].sort();
  
  console.log('');
  log(`Total unique routes: ${uniqueRoutes.length}`);
  
  // Generate sitemap XML
  const sitemapXml = generateSitemapXml(uniqueRoutes);
  
  // Ensure public directory exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
  
  // Write sitemap
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
  
  console.log('');
  log(`Sitemap written to: ${sitemapPath}`, 'success');
  log(`File size: ${(Buffer.byteLength(sitemapXml, 'utf-8') / 1024).toFixed(2)} KB`);
  
  console.log('');
  console.log('============================================');
  console.log('Sitemap generation complete');
  console.log('============================================');
  console.log('');
  
  // Print route summary by category
  console.log('Route Summary:');
  console.log(`  - Tool pages:    ${uniqueRoutes.filter(r => r.startsWith('/tools/')).length}`);
  console.log(`  - Blog articles: ${uniqueRoutes.filter(r => r.startsWith('/blog/')).length}`);
  console.log(`  - Learn guides:  ${uniqueRoutes.filter(r => r.startsWith('/learn/')).length}`);
  console.log(`  - Comparisons:   ${uniqueRoutes.filter(r => r.startsWith('/compare/')).length}`);
  console.log(`  - Other pages:   ${uniqueRoutes.filter(r => !r.startsWith('/tools/') && !r.startsWith('/blog/') && !r.startsWith('/learn/') && !r.startsWith('/compare/')).length}`);
  console.log('');
}

// Run the generator
main().catch((error) => {
  log(`Unexpected error: ${error.message}`, 'error');
  process.exit(1);
});
