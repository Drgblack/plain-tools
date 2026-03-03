import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Plain WebGPU Page Organiser",
  description: "Organise PDF pages with thumbnail grids, drag reorder, bulk actions, and local export processing without sending document files to cloud servers. Built for.",
  openGraph: {
    title: "Plain WebGPU Page Organiser",
    description:
      "Reorder, rotate, duplicate, and delete PDF pages locally with responsive visual controls and private browser-based processing.",
  },
  alternates: {
    canonical: "https://plain.tools/tools/plain-webgpu-page-organiser",
  },
}

export default function WebGpuOrganiserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


