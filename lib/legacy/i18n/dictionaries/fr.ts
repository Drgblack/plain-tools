import type { Dictionary } from "../types"

/**
 * ============================================================================
 * FRENCH DICTIONARY
 * ============================================================================
 * 
 * STATUS: Draft translations - NOT READY FOR PRODUCTION
 * 
 * The translations below are placeholders that require professional review.
 * Before enabling French (localeReady.fr = true), ALL translations must be:
 * 
 * 1. Reviewed by a native French speaker
 * 2. Checked for formal register (use "vous" not "tu")
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
 * - "PDF" remains "PDF"
 * - Use formal "vous" form throughout
 * - Dates: DD/MM/YYYY
 * - Numbers: 1 234,56 (space thousands, comma decimal)
 * - Use proper French typography (guillemets, non-breaking spaces)
 * - Keep technical terms consistent with French software conventions
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
export const fr: Dictionary = {
  locale: "fr",
  
  navigation: {
    tools: "Outils",
    learn: "Apprendre",
    blog: "Blog",
    home: "Accueil",
  },

  common: {
    // TODO: Professional translation required
    tagline: "Outils PDF qui fonctionnent dans votre navigateur",
    privacyNotice: "Traité localement. Les fichiers ne quittent jamais votre appareil.",
    learnMore: "En savoir plus",
    download: "Télécharger",
    close: "Fermer",
    loading: "Chargement",
    error: "Une erreur s'est produite",
    success: "Succès",
  },

  tools: {
    mergePdf: {
      // TODO: Professional translation required
      title: "Fusionner des PDF",
      description: "Combiner plusieurs fichiers PDF en un seul document",
      dropzoneTitle: "Déposez les fichiers PDF ici",
      dropzoneHint: "Glissez-déposez vos fichiers ou utilisez le bouton ci-dessous",
      selectFiles: "Sélectionner des fichiers",
      addMore: "Ajouter plus de fichiers",
      mergeButton: "Fusionner les PDF",
      processing: "Traitement local dans votre navigateur",
      downloadReady: "Votre PDF fusionné est prêt",
      downloadButton: "Télécharger le PDF fusionné",
      mergeAnother: "Fusionner un autre ensemble",
      pageCount: "pages",
      removeFile: "Supprimer le fichier",
      reorder: "Glisser pour réorganiser",
    },
    splitPdf: {
      title: "Diviser un PDF",
      description: "Extraire des pages d'un document PDF",
    },
    compressPdf: {
      title: "Compresser un PDF",
      description: "Réduire la taille du fichier PDF",
    },
  },

  footer: {
    tools: "Outils",
    resources: "Ressources",
    about: "À propos",
    privacy: "Confidentialité",
    verify: "Vérifier nos affirmations",
    privacyStatement: "Plain fonctionne entièrement dans votre navigateur. Les fichiers ne sont jamais téléchargés.",
  },

  meta: {
    siteTitle: "Plain - Outils PDF qui fonctionnent dans votre navigateur",
    siteDescription: "Plain fournit des outils PDF qui traitent les fichiers localement dans votre navigateur. Les fichiers ne sont jamais téléchargés sur un serveur.",
    blogTitle: "Blog - Plain",
    blogDescription: "Plain écrit sur les PDF, le traitement local des fichiers et les outils documentaires basés sur le navigateur.",
    learnTitle: "Centre d'apprentissage - Plain",
    learnDescription: "Plain explique comment fonctionnent les PDF, comment fonctionne le traitement local et comment vérifier les revendications de confidentialité.",
  },
}
