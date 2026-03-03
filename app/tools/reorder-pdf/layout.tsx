import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reorder PDF Pages Offline – Plain",
  description: "Reorder PDF pages locally with drag-and-drop controls, page rotation, and secure no-upload processing for private document organisation workflows. Built for.",
  openGraph: {
    title: "Reorder PDF Pages Offline – Plain",
    description:
      "Rearrange PDF pages offline in your browser with local processing and no server uploads for confidential file preparation.",
  },
}

export default function ReorderPDFLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

