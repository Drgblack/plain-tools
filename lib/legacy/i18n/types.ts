/**
 * Dictionary Types
 * 
 * Type definitions for translation dictionaries.
 * All translations must conform to this structure.
 */

export interface NavigationDictionary {
  tools: string
  learn: string
  blog: string
  home: string
}

export interface CommonDictionary {
  tagline: string
  privacyNotice: string
  learnMore: string
  download: string
  close: string
  loading: string
  error: string
  success: string
}

export interface ToolsDictionary {
  mergePdf: {
    title: string
    description: string
    dropzoneTitle: string
    dropzoneHint: string
    selectFiles: string
    addMore: string
    mergeButton: string
    processing: string
    downloadReady: string
    downloadButton: string
    mergeAnother: string
    pageCount: string
    removeFile: string
    reorder: string
  }
  // Future tools follow same pattern
  splitPdf: {
    title: string
    description: string
  }
  compressPdf: {
    title: string
    description: string
  }
}

export interface FooterDictionary {
  tools: string
  resources: string
  about: string
  privacy: string
  verify: string
  privacyStatement: string
}

export interface MetaDictionary {
  siteTitle: string
  siteDescription: string
  blogTitle: string
  blogDescription: string
  learnTitle: string
  learnDescription: string
}

export interface Dictionary {
  locale: string
  navigation: NavigationDictionary
  common: CommonDictionary
  tools: ToolsDictionary
  footer: FooterDictionary
  meta: MetaDictionary
}
