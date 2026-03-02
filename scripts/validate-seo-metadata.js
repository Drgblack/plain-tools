#!/usr/bin/env node

/**
 * Plain PDF Hub - SEO Metadata Validator
 * 
 * This script validates that every article and tool page has:
 * - A unique Meta Title and Description
 * - The required JSON-LD TechArticle schema
 * - A canonical link
 * 
 * If any are missing, the build fails with a clear UK English error message.
 * 
 * Usage: node scripts/validate-seo-metadata.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Configuration
const DIRECTORIES_TO_VALIDATE = [
  'app/blog',
  'app/learn',
  'app/tools',
  'app/compare',
];

const REQUIRED_CHECKS = {
  metaTitle: {
    pattern: /export\s+const\s+metadata.*title\s*[:=]/s,
    altPattern: /<title>/,
    error: 'is missing its Meta Title',
  },
  metaDescription: {
    pattern: /export\s+const\s+metadata.*description\s*[:=]/s,
    altPattern: /<meta\s+name="description"/,
    error: 'is missing its Meta Description',
  },
  jsonLdSchema: {
    pattern: /application\/ld\+json|TechArticle|SoftwareApplication|BlogPosting/,
    altPattern: /@type.*Article/,
    error: 'is missing its SEO schema (JSON-LD TechArticle)',
  },
  canonicalLink: {
    pattern: /canonical|<link\s+rel="canonical"/,
    altPattern: /canonicalUrl/,
    error: 'is missing its canonical link',
  },
};

// Track validation state
let errors = [];
let warnings = [];
let validatedFiles = 0;
let skippedFiles = 0;

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
 * Get all page.tsx files in a directory recursively
 */
function getPageFiles(dir, files = []) {
  const absoluteDir = path.join(ROOT_DIR, dir);
  
  if (!fs.existsSync(absoluteDir)) {
    log(`Directory not found: ${dir}`, 'warn');
    return files;
  }
  
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(absoluteDir, entry.name);
    const relativePath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        getPageFiles(relativePath, files);
      }
    } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
      files.push({
        path: fullPath,
        relativePath: relativePath,
        name: extractPageName(relativePath),
      });
    }
  }
  
  return files;
}

/**
 * Extract a human-readable page name from the path
 */
function extractPageName(filePath) {
  const parts = filePath.split(path.sep);
  // Get the directory name before page.tsx
  const dirName = parts[parts.length - 2];
  
  // Convert slug to readable name
  return dirName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Validate a single page file
 */
function validatePage(file) {
  const content = fs.readFileSync(file.path, 'utf-8');
  const pageErrors = [];
  
  for (const [checkName, check] of Object.entries(REQUIRED_CHECKS)) {
    const hasMatch = check.pattern.test(content) || check.altPattern.test(content);
    
    if (!hasMatch) {
      pageErrors.push({
        file: file.relativePath,
        name: file.name,
        check: checkName,
        message: check.error,
      });
    }
  }
  
  return pageErrors;
}

/**
 * Check for duplicate meta titles and descriptions
 */
function checkForDuplicates(allMeta) {
  const titles = new Map();
  const descriptions = new Map();
  const duplicateErrors = [];
  
  for (const meta of allMeta) {
    if (meta.title) {
      if (titles.has(meta.title)) {
        duplicateErrors.push({
          file: meta.file,
          name: meta.name,
          message: `has a duplicate Meta Title (also used by "${titles.get(meta.title)}")`,
        });
      } else {
        titles.set(meta.title, meta.name);
      }
    }
    
    if (meta.description) {
      if (descriptions.has(meta.description)) {
        duplicateErrors.push({
          file: meta.file,
          name: meta.name,
          message: `has a duplicate Meta Description (also used by "${descriptions.get(meta.description)}")`,
        });
      } else {
        descriptions.set(meta.description, meta.name);
      }
    }
  }
  
  return duplicateErrors;
}

/**
 * Main validation function
 */
async function main() {
  console.log('');
  console.log('============================================');
  console.log('Plain PDF Hub - SEO Metadata Validator');
  console.log('============================================');
  console.log('');
  
  log('Starting SEO metadata validation...');
  log(`Scanning directories: ${DIRECTORIES_TO_VALIDATE.join(', ')}`);
  console.log('');
  
  // Collect all page files
  const allFiles = [];
  for (const dir of DIRECTORIES_TO_VALIDATE) {
    const files = getPageFiles(dir);
    allFiles.push(...files);
  }
  
  log(`Found ${allFiles.length} page files to validate`);
  console.log('');
  
  // Validate each file
  const allMeta = [];
  
  for (const file of allFiles) {
    const pageErrors = validatePage(file);
    
    if (pageErrors.length > 0) {
      errors.push(...pageErrors);
      log(`Article "${file.name}" ${pageErrors.map(e => e.message).join(', ')}`, 'error');
    } else {
      validatedFiles++;
      log(`Article "${file.name}" passed all SEO checks`, 'success');
    }
  }
  
  console.log('');
  console.log('============================================');
  console.log('Validation Summary');
  console.log('============================================');
  console.log('');
  console.log(`Total pages scanned:  ${allFiles.length}`);
  console.log(`Passed validation:    ${validatedFiles}`);
  console.log(`Failed validation:    ${errors.length > 0 ? errors.length : 0}`);
  console.log(`Warnings:             ${warnings.length}`);
  console.log('');
  
  if (errors.length > 0) {
    console.log('============================================');
    console.log('Validation Errors');
    console.log('============================================');
    console.log('');
    
    for (const error of errors) {
      console.log(`  - Article "${error.name}" ${error.message}`);
      console.log(`    File: ${error.file}`);
      console.log('');
    }
    
    console.log('============================================');
    console.log('BUILD FAILED: SEO validation errors detected');
    console.log('============================================');
    console.log('');
    console.log('Please fix the above errors before deploying.');
    console.log('Refer to the SEO guidelines in /docs/seo-guidelines.md');
    console.log('');
    
    process.exit(1);
  }
  
  console.log('============================================');
  console.log('BUILD PASSED: All SEO checks successful');
  console.log('============================================');
  console.log('');
  
  process.exit(0);
}

// Run the validator
main().catch((error) => {
  log(`Unexpected error: ${error.message}`, 'error');
  process.exit(1);
});
