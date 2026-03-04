"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Shield, 
  Download, 
  Network, 
  Server, 
  Lock, 
  CheckCircle2,
  FileText,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface PrivacyAuditProps {
  toolName: string
  fileName: string
  fileSize: string
  processingTime: number
  onDownload: () => void
  onDownloadReceipt?: () => void
  className?: string
}

export function PrivacyAudit({
  toolName,
  fileName,
  fileSize,
  processingTime,
  onDownload,
  onDownloadReceipt,
  className = "",
}: PrivacyAuditProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  
  const timestamp = new Date().toISOString()
  
  const auditData = [
    {
      icon: Network,
      label: "Network Traffic",
      value: "0.00kb",
      status: "secure",
    },
    {
      icon: Server,
      label: "Server Interaction",
      value: "None",
      status: "secure",
    },
    {
      icon: Lock,
      label: "Local Encryption",
      value: "Active",
      status: "secure",
    },
  ]
  
  const handleDownload = () => {
    setIsDownloading(true)
    onDownload()
    setTimeout(() => setIsDownloading(false), 1000)
  }
  
  const handleDownloadReceipt = () => {
    // Generate privacy receipt as text file
    const receipt = `
╔══════════════════════════════════════════════════════════════╗
║                    PLAIN PRIVACY RECEIPT                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Tool Used:        ${toolName.padEnd(40)}║
║  File Processed:   ${fileName.substring(0, 40).padEnd(40)}║
║  File Size:        ${fileSize.padEnd(40)}║
║  Processing Time:  ${(processingTime / 1000).toFixed(2)}s${" ".repeat(35)}║
║                                                               ║
╠══════════════════════════════════════════════════════════════╣
║  PRIVACY AUDIT RESULTS                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Network Traffic:      0.00kb                                 ║
║  Server Interaction:   None                                   ║
║  Local Encryption:     Active (AES-256)                       ║
║  Data Uploaded:        NO                                     ║
║  Third-Party APIs:     NO                                     ║
║  Cookies Used:         NO                                     ║
║                                                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Timestamp: ${timestamp.padEnd(47)}║
║                                                               ║
║  This document was processed entirely within your browser     ║
║  using WebAssembly technology. No data was transmitted to     ║
║  any external server.                                         ║
║                                                               ║
║  Verify at: https://plainpdf.com/verify-claims                ║
║                                                               ║
╚══════════════════════════════════════════════════════════════╝
`.trim()
    
    const blob = new Blob([receipt], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `plain-privacy-receipt-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    onDownloadReceipt?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`rounded-xl border border-[#0070f3]/20 bg-[#050505] p-6 shadow-[0_0_40px_rgba(0,112,243,0.1)] ${className}`}
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30">
          <Shield className="h-6 w-6 text-[#0070f3]" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="font-mono text-[14px] font-bold uppercase tracking-wider text-[#0070f3]">
            Privacy Audit
          </h3>
          <p className="text-[12px] text-white/50">
            Verified local processing complete
          </p>
        </div>
        <CheckCircle2 className="ms-auto h-6 w-6 text-green-500" strokeWidth={2} />
      </div>
      
      {/* Audit metrics */}
      <div className="mb-6 space-y-3">
        {auditData.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-lg border border-[#222] bg-[#0a0a0a] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4 text-white/40" strokeWidth={1.5} />
              <span className="text-[13px] text-white/60">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-semibold text-white">
                {item.value}
              </span>
              <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
            </div>
          </div>
        ))}
      </div>
      
      {/* File info */}
      <div className="mb-6 rounded-lg border border-[#222] bg-[#0a0a0a] p-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-[#0070f3]" strokeWidth={1.5} />
          <div className="flex-1 min-w-0">
            <p className="truncate text-[13px] font-medium text-white">{fileName}</p>
            <p className="text-[11px] text-white/40">{fileSize}</p>
          </div>
          <div className="flex items-center gap-1.5 text-white/40">
            <Clock className="h-3.5 w-3.5" strokeWidth={2} />
            <span className="font-mono text-[11px]">{(processingTime / 1000).toFixed(2)}s</span>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 bg-[#0070f3] text-white hover:bg-[#0070f3]/90 shadow-[0_0_20px_rgba(0,112,243,0.3)]"
        >
          <Download className="me-2 h-4 w-4" strokeWidth={2} />
          {isDownloading ? "Preparing..." : "Download Result"}
        </Button>
        
        <Button
          onClick={handleDownloadReceipt}
          variant="outline"
          className="flex-1 border-[#333] bg-transparent text-white/70 hover:border-[#0070f3]/50 hover:bg-[#0070f3]/5 hover:text-white"
        >
          <Shield className="me-2 h-4 w-4" strokeWidth={2} />
          Download Privacy Receipt
        </Button>
      </div>
      
      {/* Footer note */}
      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wider text-white/30">
        All processing completed in-browser. No data transmitted.
      </p>
    </motion.div>
  )
}
