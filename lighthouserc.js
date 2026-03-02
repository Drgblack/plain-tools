/**
 * Plain PDF Hub - Lighthouse CI Configuration
 * 
 * Ensures Performance and SEO scores remain above 90.
 * Run with: lhci autorun --config=lighthouserc.js
 */

module.exports = {
  ci: {
    collect: {
      // Use the built Next.js application
      startServerCommand: 'pnpm start',
      startServerReadyPattern: 'ready on',
      startServerReadyTimeout: 30000,
      
      // URLs to audit
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/tools',
        'http://localhost:3000/tools/merge-pdf',
        'http://localhost:3000/learn',
        'http://localhost:3000/blog',
        'http://localhost:3000/about',
      ],
      
      // Number of runs per URL for consistent results
      numberOfRuns: 3,
      
      // Lighthouse settings
      settings: {
        // Use mobile emulation (default)
        preset: 'desktop',
        
        // Skip specific audits if needed
        skipAudits: [
          'uses-http2', // Often fails in local/CI environments
        ],
        
        // Throttling settings
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    
    assert: {
      // Assertion configuration
      preset: 'lighthouse:recommended',
      
      assertions: {
        // Core Web Vitals - must pass
        'categories:performance': ['error', { minScore: 0.90 }],
        'categories:seo': ['error', { minScore: 0.90 }],
        'categories:accessibility': ['warn', { minScore: 0.85 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        
        // Specific performance metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        
        // SEO requirements
        'document-title': 'error',
        'meta-description': 'error',
        'link-text': 'warn',
        'crawlable-anchors': 'warn',
        'is-crawlable': 'error',
        'robots-txt': 'warn',
        'canonical': 'warn',
        'structured-data': 'off', // Handled by our custom validator
        
        // Accessibility basics
        'color-contrast': 'warn',
        'image-alt': 'warn',
        'label': 'warn',
        'button-name': 'warn',
        'link-name': 'warn',
        
        // Performance optimisations
        'render-blocking-resources': 'warn',
        'uses-responsive-images': 'warn',
        'offscreen-images': 'warn',
        'efficient-animated-content': 'off',
        'uses-text-compression': 'warn',
        
        // Best practices
        'errors-in-console': 'warn',
        'deprecations': 'warn',
        'js-libraries': 'off',
        
        // PWA (not required)
        'installable-manifest': 'off',
        'service-worker': 'off',
        'themed-omnibox': 'off',
        'splash-screen': 'off',
        'maskable-icon': 'off',
      },
    },
    
    upload: {
      // Upload results to temporary public storage
      target: 'temporary-public-storage',
    },
  },
};
