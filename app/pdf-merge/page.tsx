import type { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/seo'
import { PDFMergeClient } from './client'

export const metadata: Metadata = generateToolMetadata({
  name: 'Merge PDF',
  description: 'Combine multiple PDF files into a single document. Drag and drop to reorder pages. All processing happens locally in your browser.',
  slug: 'pdf-merge',
  category: 'PDF Tools',
})

export default function PDFMergePage() {
  return <PDFMergeClient />
}
