#!/usr/bin/env node

/**
 * Plain PDF Hub - IndexNow API Pinger
 * 
 * Notifies search engines (Bing, Yandex, Seznam.cz, Naver) about updated URLs
 * using the IndexNow protocol for faster indexing.
 * 
 * Usage: node scripts/ping-indexnow.js
 * 
 * Environment variables:
 *   - INDEXNOW_KEY: Your IndexNow API key
 *   - SITE_URL: The site URL (default: https://plainpdf.com)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Configuration
const SITE_URL = process.env.SITE_URL || 'https://plainpdf.com';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

// URLs to submit (high-priority pages)
const PRIORITY_URLS = [
  '/',
  '/tools',
  '/tools/merge-pdf',
  '/tools/split-pdf',
  '/tools/compress-pdf',
  '/tools/redact-pdf',
  '/tools/reorder-pdf',
  '/learn',
  '/learn/glossary',
  '/blog',
  '/compare',
  '/about',
];

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
 * Get recently modified URLs from git
 */
async function getRecentlyModifiedUrls() {
  const urls = [];
  
  try {
    // Read the app directory to find page files
    const appDir = path.join(ROOT_DIR, 'app');
    
    function scanDirectory(dir, basePath = '') {
      if (!fs.existsSync(dir)) return;
      
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('.')) {
          const routePath = `${basePath}/${entry.name}`;
          const fullPath = path.join(dir, entry.name);
          
          // Check if this directory has a page file
          if (fs.existsSync(path.join(fullPath, 'page.tsx')) || 
              fs.existsSync(path.join(fullPath, 'page.ts'))) {
            urls.push(routePath);
          }
          
          // Recurse into subdirectories
          scanDirectory(fullPath, routePath);
        }
      }
    }
    
    scanDirectory(appDir);
  } catch (error) {
    log(`Error scanning directories: ${error.message}`, 'warn');
  }
  
  return urls;
}

/**
 * Submit URLs to IndexNow
 */
async function submitToIndexNow(urls) {
  if (!INDEXNOW_KEY) {
    log('INDEXNOW_KEY not set. Skipping IndexNow submission.', 'warn');
    return false;
  }
  
  const fullUrls = urls.map(url => `${SITE_URL}${url}`);
  
  const payload = {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: fullUrls,
  };
  
  try {
    log(`Submitting ${fullUrls.length} URLs to IndexNow...`);
    
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    
    if (response.ok || response.status === 200 || response.status === 202) {
      log(`IndexNow accepted ${fullUrls.length} URLs for indexing`, 'success');
      return true;
    } else {
      log(`IndexNow returned status ${response.status}: ${response.statusText}`, 'warn');
      return false;
    }
  } catch (error) {
    log(`IndexNow submission failed: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('');
  console.log('============================================');
  console.log('Plain PDF Hub - IndexNow Pinger');
  console.log('============================================');
  console.log('');
  
  log(`Site URL: ${SITE_URL}`);
  log(`IndexNow Key: ${INDEXNOW_KEY ? '[SET]' : '[NOT SET]'}`);
  console.log('');
  
  // Combine priority URLs with recently modified ones
  const recentUrls = await getRecentlyModifiedUrls();
  const allUrls = [...new Set([...PRIORITY_URLS, ...recentUrls])];
  
  log(`Priority URLs: ${PRIORITY_URLS.length}`);
  log(`Recently modified URLs: ${recentUrls.length}`);
  log(`Total unique URLs to submit: ${allUrls.length}`);
  console.log('');
  
  // Submit to IndexNow
  const success = await submitToIndexNow(allUrls);
  
  console.log('');
  console.log('============================================');
  
  if (success) {
    console.log('IndexNow submission complete');
  } else if (!INDEXNOW_KEY) {
    console.log('IndexNow submission skipped (no API key)');
  } else {
    console.log('IndexNow submission encountered issues');
  }
  
  console.log('============================================');
  console.log('');
  
  // List submitted URLs
  console.log('Submitted URLs:');
  allUrls.slice(0, 20).forEach(url => {
    console.log(`  - ${SITE_URL}${url}`);
  });
  
  if (allUrls.length > 20) {
    console.log(`  ... and ${allUrls.length - 20} more`);
  }
  
  console.log('');
}

// Run the pinger
main().catch((error) => {
  log(`Unexpected error: ${error.message}`, 'error');
  process.exit(1);
});
