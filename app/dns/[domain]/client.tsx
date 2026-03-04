"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface DNSDynamicClientProps {
  domain: string
}

export function DNSDynamicClient({ domain }: DNSDynamicClientProps) {
  const [recordType, setRecordType] = useState("A")
  const [results, setResults] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Auto-lookup on mount
    performLookup()
  }, [domain])

  const performLookup = () => {
    setLoading(true)
    setError(null)
    // Placeholder - would be replaced with actual DNS lookup
    setTimeout(() => {
      // Simulated results based on domain
      const mockResults: Record<string, string[]> = {
        "A": ["93.184.216.34"],
        "AAAA": ["2606:2800:220:1:248:1893:25c8:1946"],
        "MX": ["10 mail.example.com", "20 mail2.example.com"],
        "TXT": ["v=spf1 include:_spf.google.com ~all"],
        "NS": ["ns1.example.com", "ns2.example.com"],
        "CNAME": ["www.example.com -> example.com"],
      }
      setResults(mockResults[recordType] || ["No records found"])
      setLoading(false)
    }, 800)
  }

  const handleRecordTypeChange = (type: string) => {
    setRecordType(type)
    setLoading(true)
    setTimeout(() => {
      const mockResults: Record<string, string[]> = {
        "A": ["93.184.216.34"],
        "AAAA": ["2606:2800:220:1:248:1893:25c8:1946"],
        "MX": ["10 mail.example.com", "20 mail2.example.com"],
        "TXT": ["v=spf1 include:_spf.google.com ~all"],
        "NS": ["ns1.example.com", "ns2.example.com"],
        "CNAME": ["www.example.com -> example.com"],
      }
      setResults(mockResults[type] || ["No records found"])
      setLoading(false)
    }, 500)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <code className="block rounded-md bg-secondary px-4 py-3 font-mono text-foreground">
            {domain}
          </code>
        </div>
        <Select value={recordType} onValueChange={handleRecordTypeChange}>
          <SelectTrigger className="w-[140px] bg-secondary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A (IPv4)</SelectItem>
            <SelectItem value="AAAA">AAAA (IPv6)</SelectItem>
            <SelectItem value="MX">MX (Mail)</SelectItem>
            <SelectItem value="TXT">TXT (Text)</SelectItem>
            <SelectItem value="NS">NS (Nameserver)</SelectItem>
            <SelectItem value="CNAME">CNAME (Alias)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : results && results.length > 0 ? (
        <div className="rounded-md border border-border p-4">
          <p className="mb-3 text-sm font-medium text-foreground">
            {recordType} Records
          </p>
          <div className="space-y-2">
            {results.map((record, i) => (
              <code
                key={i}
                className="block rounded bg-secondary px-3 py-2 font-mono text-sm text-foreground"
              >
                {record}
              </code>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-border p-4 text-center text-sm text-muted-foreground">
          No {recordType} records found for this domain
        </div>
      )}

      <Button 
        onClick={performLookup} 
        variant="outline" 
        size="sm"
        disabled={loading}
      >
        Refresh Results
      </Button>
    </div>
  )
}
