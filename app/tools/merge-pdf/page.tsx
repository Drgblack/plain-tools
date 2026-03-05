import MergePdfTool from "@/components/tools/merge-pdf-tool"

export default function MergePdfPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold">Merge PDFs</h1>
          <p className="mb-6 text-muted-foreground">
            Combine multiple PDF files into one document with fully local browser processing.
          </p>
          <div className="mb-4 text-sm text-green-600">100% Local Processing - No Uploads</div>
          <MergePdfTool />
        </div>
      </main>
    </div>
  )
}
