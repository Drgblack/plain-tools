import Link from "next/link"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Surface } from "@/components/surface"
import { Button } from "@/components/ui/button"

interface InvalidParamProps {
  paramType: 'domain' | 'ip' | 'site'
  value: string
  toolHref: string
  toolName: string
}

const messages = {
  domain: {
    title: 'Invalid Domain',
    description: 'The domain you entered is not valid. Please enter a valid domain name like "example.com" or "subdomain.example.org".',
    examples: ['example.com', 'google.com', 'api.github.com'],
  },
  ip: {
    title: 'Invalid IP Address',
    description: 'The IP address you entered is not valid. Please enter a valid IPv4 or IPv6 address.',
    examples: ['8.8.8.8', '192.168.1.1', '2001:4860:4860::8888'],
  },
  site: {
    title: 'Invalid Website',
    description: 'The website you entered is not valid. Please enter a valid domain name or URL.',
    examples: ['example.com', 'google.com', 'github.com'],
  },
}

export function InvalidParam({ paramType, value, toolHref, toolName }: InvalidParamProps) {
  const { title, description, examples } = messages[paramType]
  
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Surface className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>
        
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        
        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
          {description}
        </p>
        
        <div className="mt-4 p-3 rounded-lg bg-secondary/50">
          <p className="text-xs text-muted-foreground mb-2">You entered:</p>
          <code className="text-sm font-mono text-foreground break-all">{value || '(empty)'}</code>
        </div>
        
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-2">Valid examples:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {examples.map((example) => (
              <code 
                key={example} 
                className="px-2 py-1 rounded bg-secondary text-xs font-mono text-muted-foreground"
              >
                {example}
              </code>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border/50">
          <Button asChild variant="outline" size="sm">
            <Link href={toolHref} className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go to {toolName}
            </Link>
          </Button>
        </div>
      </Surface>
    </div>
  )
}
