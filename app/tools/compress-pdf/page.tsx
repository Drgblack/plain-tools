import CompressPdfTool from "@/components/tools/compress-pdf-tool"

export default function CompressPdfPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold">Compress PDF</h1>
          <p className="mb-6 text-muted-foreground">
            Optimise PDF size locally with best-effort compression modes and no file uploads.
          </p>
          <div className="mb-4 text-sm text-green-600">100% Local Processing - No Uploads</div>
          <CompressPdfTool />
        </div>
      </main>
    </div>
  )
}
