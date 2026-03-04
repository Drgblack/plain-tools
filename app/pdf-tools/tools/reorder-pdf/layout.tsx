import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reorder PDF Pages Offline – Plain",
  description: "Rearrange PDF pages locally in your browser. Drag and drop to reorder. Files are never uploaded.",
  openGraph: {
    title: "Reorder PDF Pages Offline – Plain",
    description: "Rearrange PDF pages locally in your browser. Drag and drop to reorder. Files are never uploaded.",
  },
}

export default function ReorderPDFLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
