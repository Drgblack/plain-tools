import SplitPdfTool from "@/components/tools/split-pdf-tool"

export default function SplitPdfPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold">Split PDF</h1>
          <p className="mb-6 text-muted-foreground">
            Split one PDF into extracted pages, separate page files, or custom ranges using local browser processing.
          </p>
          <div className="mb-4 text-sm text-green-600">100% Local Processing - No Uploads</div>
          <SplitPdfTool />
        </div>
      </main>
    </div>
  )
}
