import type { Dictionary } from "../types"

/**
 * ============================================================================
 * GERMAN DICTIONARY
 * ============================================================================
 * 
 * STATUS: Draft translations - NOT READY FOR PRODUCTION
 * 
 * The translations below are placeholders that require professional review.
 * Before enabling German (localeReady.de = true), ALL translations must be:
 * 
 * 1. Reviewed by a native German speaker
 * 2. Checked for formal register (use "Sie" not "du")
 * 3. Verified to fit within UI constraints
 * 4. Tested in context on actual pages
 * 
 * DO NOT AUTO-TRANSLATE
 * ----------------------
 * Machine translation is not acceptable. These placeholder values were
 * created for structure only. Professional human translation is required.
 * 
 * LOCALIZATION RULES
 * ------------------
 * - Brand name "Plain" is never translated
 * - "PDF" remains "PDF" (not "PDF-Datei" unless contextually needed)
 * - Use formal "Sie" form throughout
 * - Dates: DD.MM.YYYY
 * - Numbers: 1.234,56 (dot thousands, comma decimal)
 * - Keep technical terms consistent with German software conventions
 * 
 * CONTENT CHECKLIST
 * -----------------
 * [ ] All dictionary keys translated
 * [ ] All Learn articles translated (separate files)
 * [ ] All Blog posts translated (separate files)
 * [ ] FAQ content translated
 * [ ] Privacy policy translated
 * [ ] Native speaker review complete
 * [ ] UI text fits design constraints
 * 
 * ============================================================================
 */
export const de: Dictionary = {
  locale: "de",
  
  navigation: {
    tools: "Werkzeuge",
    learn: "Lernen",
    blog: "Blog",
    home: "Startseite",
  },

  common: {
    // TODO: Professional translation required
    tagline: "PDF-Werkzeuge, die in Ihrem Browser laufen",
    privacyNotice: "Lokal verarbeitet. Dateien verlassen nie Ihr Gerät.",
    learnMore: "Mehr erfahren",
    download: "Herunterladen",
    close: "Schließen",
    loading: "Laden",
    error: "Etwas ist schiefgegangen",
    success: "Erfolg",
  },

  tools: {
    mergePdf: {
      // TODO: Professional translation required
      title: "PDFs zusammenführen",
      description: "Mehrere PDF-Dateien zu einem Dokument kombinieren",
      dropzoneTitle: "PDF-Dateien hier ablegen",
      dropzoneHint: "Dateien hierher ziehen oder über die Schaltfläche auswählen",
      selectFiles: "Dateien auswählen",
      addMore: "Weitere Dateien hinzufügen",
      mergeButton: "PDFs zusammenführen",
      processing: "Wird lokal in Ihrem Browser verarbeitet",
      downloadReady: "Ihre zusammengeführte PDF ist bereit",
      downloadButton: "Zusammengeführte PDF herunterladen",
      mergeAnother: "Weitere Dateien zusammenführen",
      pageCount: "Seiten",
      removeFile: "Datei entfernen",
      reorder: "Zum Neuordnen ziehen",
    },
    splitPdf: {
      title: "PDF teilen",
      description: "Seiten aus einem PDF-Dokument extrahieren",
    },
    compressPdf: {
      title: "PDF komprimieren",
      description: "PDF-Dateigröße reduzieren",
    },
  },

  footer: {
    tools: "Werkzeuge",
    resources: "Ressourcen",
    about: "Über uns",
    privacy: "Datenschutz",
    verify: "Unsere Behauptungen überprüfen",
    privacyStatement: "Plain läuft vollständig in Ihrem Browser. Dateien werden nie hochgeladen.",
  },

  meta: {
    siteTitle: "Plain - PDF-Werkzeuge, die in Ihrem Browser laufen",
    siteDescription: "Plain bietet PDF-Werkzeuge, die Dateien lokal in Ihrem Browser verarbeiten. Dateien werden nie auf einen Server hochgeladen.",
    blogTitle: "Blog - Plain",
    blogDescription: "Plain schreibt über PDFs, lokale Dateiverarbeitung und browserbasierte Dokumentenwerkzeuge.",
    learnTitle: "Lernzentrum - Plain",
    learnDescription: "Plain erklärt, wie PDFs funktionieren, wie lokale Verarbeitung funktioniert und wie Sie Datenschutzansprüche überprüfen können.",
  },
}
