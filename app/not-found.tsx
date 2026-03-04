import Link from "next/link"
import { FileQuestion, ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <h1 className="mb-2 text-2xl font-semibold text-foreground">
        Page not found
      </h1>
      
      <p className="mb-8 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. 
        Try searching for a tool or browse our categories.
      </p>
      
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="default">
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
        
        <Button asChild variant="outline">
          <Link href="/network-tools" className="inline-flex items-center gap-2">
            <Search className="h-4 w-4" />
            Browse tools
          </Link>
        </Button>
      </div>
    </div>
  )
}
