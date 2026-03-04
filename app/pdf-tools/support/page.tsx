"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ChevronDown, 
  ArrowLeft, 
  Bug, 
  Lightbulb, 
  Heart,
  Cpu,
  HardDrive,
  Shield,
  ExternalLink
} from "lucide-react"

// Common Solutions FAQs
const commonSolutions = [
  {
    question: "My PDF won't load or appears corrupted",
    answer: "This is typically caused by insufficient browser memory. Try closing other tabs, clearing your browser cache, or using a smaller file. For PDFs over 100MB, ensure your device has at least 4GB of available RAM.",
    technical: ["RAM", "cache"],
  },
  {
    question: "The AI Chat feature isn't working",
    answer: "AI features require WebGPU support. Check that you're using Chrome 113+, Edge 113+, or Safari 17+. Also ensure hardware acceleration is enabled in your browser settings under 'System' or 'Advanced'.",
    technical: ["WebGPU", "Chrome", "Edge", "Safari"],
  },
  {
    question: "Processing is extremely slow",
    answer: "Local processing speed depends on your device's CPU and available memory. Close background applications, disable browser extensions temporarily, and ensure your device isn't in power-saving mode.",
    technical: ["CPU", "memory"],
  },
  {
    question: "My merged PDF has pages in the wrong order",
    answer: "Use the drag-and-drop interface in the Local Preview pane to reorder files before merging. You can also use the Reorder tool after merging to adjust individual page positions.",
    technical: [],
  },
  {
    question: "Can I recover a file I processed yesterday?",
    answer: "Plain does not store your files on any server. If you enabled Local History, processed files may be cached in your browser's IndexedDB storage. Check the History panel in the header. Otherwise, the original file on your device remains unchanged.",
    technical: ["IndexedDB", "Local History"],
  },
]

// Helper to highlight technical terms
function highlightTechnical(text: string, terms: string[]) {
  if (terms.length === 0) return text
  
  let result = text
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi')
    result = result.replace(regex, `<code class="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-[#0070f3]/90">$1</code>`)
  })
  return result
}

// System Diagnostic Component
function SystemDiagnostic() {
  const [diagnostics, setDiagnostics] = useState({
    browser: "Detecting...",
    ram: "Detecting...",
    webgpu: "Checking...",
    webgpuStatus: "pending" as "pending" | "supported" | "unsupported",
    wasmStatus: "supported" as "supported" | "unsupported",
  })

  useEffect(() => {
    // Detect browser
    const ua = navigator.userAgent
    let browser = "Unknown Browser"
    if (ua.includes("Chrome") && !ua.includes("Edg")) {
      browser = `Chrome ${ua.match(/Chrome\/(\d+)/)?.[1] || ""}`
    } else if (ua.includes("Edg")) {
      browser = `Edge ${ua.match(/Edg\/(\d+)/)?.[1] || ""}`
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      browser = `Safari ${ua.match(/Version\/(\d+)/)?.[1] || ""}`
    } else if (ua.includes("Firefox")) {
      browser = `Firefox ${ua.match(/Firefox\/(\d+)/)?.[1] || ""}`
    }

    // Detect RAM (if available)
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    const ram = deviceMemory ? `${deviceMemory} GB` : "Not reported"

    // Check WebGPU
    const checkWebGPU = async () => {
      if ("gpu" in navigator) {
        try {
          const adapter = await (navigator as Navigator & { gpu: GPU }).gpu.requestAdapter()
          if (adapter) {
            setDiagnostics(prev => ({ 
              ...prev, 
              webgpu: "Supported",
              webgpuStatus: "supported"
            }))
          } else {
            setDiagnostics(prev => ({ 
              ...prev, 
              webgpu: "Limited",
              webgpuStatus: "unsupported"
            }))
          }
        } catch {
          setDiagnostics(prev => ({ 
            ...prev, 
            webgpu: "Unavailable",
            webgpuStatus: "unsupported"
          }))
        }
      } else {
        setDiagnostics(prev => ({ 
          ...prev, 
          webgpu: "Not supported",
          webgpuStatus: "unsupported"
        }))
      }
    }

    // Check Wasm
    const wasmSupported = typeof WebAssembly === "object"

    setDiagnostics(prev => ({
      ...prev,
      browser,
      ram,
      wasmStatus: wasmSupported ? "supported" : "unsupported",
    }))

    checkWebGPU()
  }, [])

  const getStatusColor = (status: string) => {
    if (status === "supported" || status === "Supported") return "text-green-400"
    if (status === "pending" || status === "Checking...") return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="rounded-xl border border-[#333] bg-[#111] p-6 transition-all duration-300 hover:border-[#0070f3]/50">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0070f3]/10">
          <Cpu className="h-5 w-5 text-[#0070f3]" />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-white">System Diagnostic</h3>
          <p className="text-[12px] text-white/50">Check your system before reporting an issue</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Browser */}
        <div className="flex items-center justify-between rounded-lg bg-[#0a0a0a] px-4 py-3">
          <span className="text-[13px] text-white/60">Browser</span>
          <span className="font-mono text-[13px] text-white">{diagnostics.browser}</span>
        </div>

        {/* Device RAM */}
        <div className="flex items-center justify-between rounded-lg bg-[#0a0a0a] px-4 py-3">
          <div className="flex items-center gap-2">
            <HardDrive className="h-3.5 w-3.5 text-white/40" />
            <span className="text-[13px] text-white/60">Device RAM</span>
          </div>
          <span className="font-mono text-[13px] text-white">{diagnostics.ram}</span>
        </div>

        {/* WebGPU */}
        <div className="flex items-center justify-between rounded-lg bg-[#0a0a0a] px-4 py-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-white/40" />
            <span className="text-[13px] text-white/60">WebGPU (AI)</span>
          </div>
          <span className={`font-mono text-[13px] ${getStatusColor(diagnostics.webgpu)}`}>
            {diagnostics.webgpu}
          </span>
        </div>

        {/* Wasm */}
        <div className="flex items-center justify-between rounded-lg bg-[#0a0a0a] px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-white/40" />
            <span className="text-[13px] text-white/60">WebAssembly</span>
          </div>
          <span className={`font-mono text-[13px] ${getStatusColor(diagnostics.wasmStatus)}`}>
            {diagnostics.wasmStatus === "supported" ? "Supported" : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Status Summary */}
      <div className="mt-4 rounded-lg border border-[#333] bg-[#0a0a0a] p-3">
        <p className="text-[12px] leading-relaxed text-white/50">
          {diagnostics.webgpuStatus === "supported" && diagnostics.wasmStatus === "supported" ? (
            <span className="text-green-400/80">All systems operational. Your device is fully compatible with Plain.</span>
          ) : diagnostics.wasmStatus === "unsupported" ? (
            <span className="text-red-400/80">WebAssembly is required. Please update your browser.</span>
          ) : (
            <span className="text-yellow-400/80">Core tools will work, but AI features require WebGPU. Consider updating your browser.</span>
          )}
        </p>
      </div>
    </div>
  )
}

export default function SupportPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [diagnostics, setDiagnostics] = useState({ browser: "", ram: "" })

  useEffect(() => {
    // Get browser and RAM for mailto links
    const ua = navigator.userAgent
    let browser = "Unknown"
    if (ua.includes("Chrome") && !ua.includes("Edg")) {
      browser = `Chrome ${ua.match(/Chrome\/(\d+)/)?.[1] || ""}`
    } else if (ua.includes("Edg")) {
      browser = `Edge ${ua.match(/Edg\/(\d+)/)?.[1] || ""}`
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      browser = `Safari`
    } else if (ua.includes("Firefox")) {
      browser = `Firefox`
    }

    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    const ram = deviceMemory ? `${deviceMemory}GB` : "Unknown"

    setDiagnostics({ browser, ram })
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  // Generate mailto links with pre-filled templates
  const bugMailto = `mailto:support@plainpdf.com?subject=${encodeURIComponent("[Plain-Bug] [Tool Name]")}&body=${encodeURIComponent(`Browser: ${diagnostics.browser}\nDevice RAM: ${diagnostics.ram}\n\nDescription of issue:\n\n`)}`
  
  const featureMailto = `mailto:support@plainpdf.com?subject=${encodeURIComponent("[Plain-Feature]")}&body=${encodeURIComponent("I would like to see...\n\n")}`
  
  const kudosMailto = `mailto:support@plainpdf.com?subject=${encodeURIComponent("[Plain-Kudos]")}&body=${encodeURIComponent("Just wanted to say...\n\n")}`

  return (
    <div className="min-h-screen bg-[#000]">
      <main>
        {/* Hero Section */}
        <section className="relative border-b border-[#333] px-4 py-16 md:py-24">
          {/* Technical grid pattern */}
          <div className="pointer-events-none absolute inset-0 hero-grid-pattern opacity-30" />
          
          <div className="relative mx-auto max-w-4xl text-center">
            {/* Back to Tools */}
            <Link
              href="/pdf-tools/#tools"
              className="group mb-8 inline-flex items-center gap-2 rounded-lg border border-[#333] bg-[#111] px-4 py-2 text-[13px] font-medium text-white/70 transition-all duration-200 hover:border-[#0070f3] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to Tools
            </Link>
            
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-white md:text-4xl lg:text-5xl">
              Support & Feedback
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/50">
              Check common solutions first, then reach out if you need further assistance.
            </p>
          </div>
        </section>

        {/* Self-Service Section */}
        <section className="relative border-b border-[#333] px-4 py-16 md:py-20">
          <div className="pointer-events-none absolute inset-0 hero-grid-pattern opacity-15" />
          
          <div className="relative mx-auto max-w-4xl">
            <div className="mb-10">
              <span className="mb-3 inline-block rounded-full bg-[#0070f3]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0070f3] ring-1 ring-[#0070f3]/30">
                Self-Service
              </span>
              <h2 className="text-2xl font-bold tracking-[-0.02em] text-white">Common Solutions</h2>
              <p className="mt-2 text-[14px] text-white/50">
                Most issues can be resolved with these troubleshooting steps.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
              {/* FAQ Accordion - 3 columns */}
              <div className="lg:col-span-3">
                <div className="space-y-3">
                  {commonSolutions.map((faq, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[#333] bg-[#111] transition-all duration-300 hover:border-[#0070f3]/30"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="flex w-full items-center justify-between p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0070f3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000]"
                      >
                        <span className={`text-[14px] font-medium transition-colors duration-200 ${
                          openFaqIndex === index ? "text-[#0070f3]" : "text-white/90"
                        }`}>
                          {faq.question}
                        </span>
                        <ChevronDown 
                          className={`h-5 w-5 shrink-0 text-white/40 transition-transform duration-300 ${
                            openFaqIndex === index ? "rotate-180 text-[#0070f3]" : ""
                          }`}
                        />
                      </button>
                      
                      <div className={`overflow-hidden transition-all duration-300 ${
                        openFaqIndex === index ? "max-h-96" : "max-h-0"
                      }`}>
                        <div className="border-t border-[#333] px-5 py-4">
                          <p 
                            className="text-[13px] leading-relaxed text-white/60"
                            dangerouslySetInnerHTML={{ 
                              __html: highlightTechnical(faq.answer, faq.technical) 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Diagnostic - 2 columns */}
              <div className="lg:col-span-2">
                <SystemDiagnostic />
              </div>
            </div>
          </div>
        </section>

        {/* Report an Issue Section */}
        <section className="relative border-b border-[#333] px-4 py-16 md:py-20">
          <div className="pointer-events-none absolute inset-0 hero-grid-pattern opacity-15" />
          
          <div className="relative mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <span className="mb-3 inline-block rounded-full bg-[#0070f3]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0070f3] ring-1 ring-[#0070f3]/30">
                Get in Touch
              </span>
              <h2 className="text-2xl font-bold tracking-[-0.02em] text-white">Report an Issue</h2>
              <p className="mx-auto mt-2 max-w-lg text-[14px] text-white/50">
                Select the appropriate category to help me prioritise and respond effectively.
              </p>
            </div>

            {/* Contact Buttons */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Report Bug */}
              <a
                href={bugMailto}
                className="group flex flex-col items-center rounded-xl border border-[#333] bg-[#111] p-6 text-center transition-all duration-300 hover:border-[#0070f3] hover:shadow-[0_0_30px_rgba(0,112,243,0.12)]"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10 transition-colors duration-300 group-hover:bg-red-500/20">
                  <Bug className="h-7 w-7 text-red-400" />
                </div>
                <h3 className="text-[15px] font-semibold text-white">Report a Technical Bug</h3>
                <p className="mt-2 text-[12px] text-white/50">
                  Something isn&rsquo;t working as expected
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-medium text-[#0070f3] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Open Email <ExternalLink className="h-3 w-3" />
                </span>
              </a>

              {/* Request Feature */}
              <a
                href={featureMailto}
                className="group flex flex-col items-center rounded-xl border border-[#333] bg-[#111] p-6 text-center transition-all duration-300 hover:border-[#0070f3] hover:shadow-[0_0_30px_rgba(0,112,243,0.12)]"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-500/10 transition-colors duration-300 group-hover:bg-yellow-500/20">
                  <Lightbulb className="h-7 w-7 text-yellow-400" />
                </div>
                <h3 className="text-[15px] font-semibold text-white">Request a New Feature</h3>
                <p className="mt-2 text-[12px] text-white/50">
                  Suggest an improvement or new tool
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-medium text-[#0070f3] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Open Email <ExternalLink className="h-3 w-3" />
                </span>
              </a>

              {/* Send Kudos */}
              <a
                href={kudosMailto}
                className="group flex flex-col items-center rounded-xl border border-[#333] bg-[#111] p-6 text-center transition-all duration-300 hover:border-[#0070f3] hover:shadow-[0_0_30px_rgba(0,112,243,0.12)]"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 transition-colors duration-300 group-hover:bg-green-500/20">
                  <Heart className="h-7 w-7 text-green-400" />
                </div>
                <h3 className="text-[15px] font-semibold text-white">Send a Message of Support</h3>
                <p className="mt-2 text-[12px] text-white/50">
                  Your kind words keep me going
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-medium text-[#0070f3] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Open Email <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Solo Operator Note */}
        <section className="relative px-4 py-12 md:py-16">
          <div className="pointer-events-none absolute inset-0 hero-grid-pattern opacity-10" />
          
          <div className="relative mx-auto max-w-2xl text-center">
            <div className="rounded-xl border border-[#333] bg-[#0a0a0a] p-6">
              <p className="text-[13px] leading-relaxed text-white/50">
                <span className="font-medium text-white/70">Plain is a solo project.</span>{" "}
                While I read every message, I prioritise technical bugs over general enquiries. 
                Thank you for your patience and for supporting an independent, privacy-first tool.
              </p>
              <p className="mt-3 font-mono text-[11px] text-white/30">
                — The Plain Developer, United Kingdom
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}



