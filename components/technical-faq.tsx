"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { sanitizeInlineHtml } from "@/lib/sanitize"

const faqs = [
  {
    question: "How is it possible to process PDFs without uploading them?",
    answer: "Plain utilises WebAssembly (Wasm) to run professional-grade PDF engines directly in your browser's sandbox. Your files stay in your device's memory and are never transmitted to any external server.",
    technical: ["WebAssembly", "Wasm", "sandbox"],
  },
  {
    question: "Is there a file size limit for local processing?",
    answer: "Since processing happens on your device, the limit is determined by your system's available RAM. Most modern browsers comfortably handle files up to 500MB.",
    technical: ["RAM", "500MB"],
  },
  {
    question: "Does the AI Chat feature send my text to a server?",
    answer: "No. We use WebLLM and WebGPU technologies to execute large language models locally on your machine. Your prompts and document content remain strictly private.",
    technical: ["WebLLM", "WebGPU"],
  },
  {
    question: "Which browsers are supported?",
    answer: "Plain is optimised for the latest versions of Chrome, Edge, and Safari. For AI-driven features, a browser with WebGPU support is required for the best experience.",
    technical: ["Chrome", "Edge", "Safari", "WebGPU"],
  },
  {
    question: "Can I use Plain while offline?",
    answer: "Yes. Once the initial application is loaded, the core PDF tools and AI models function entirely without an active internet connection.",
    technical: [],
  },
]

const techStack = [
  { label: "Wasm Core", description: "WebAssembly runtime" },
  { label: "WebGPU AI", description: "Local model inference" },
  { label: "AES-256 Local", description: "Client-side encryption" },
  { label: "Zero-Cloud Architecture", description: "No server uploads" },
]

// Helper to highlight technical terms with monospace
function highlightTechnical(text: string, terms: string[]) {
  if (terms.length === 0) return text
  
  let result = text
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi')
    result = result.replace(regex, `<code class="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-accent/90">$1</code>`)
  })
  return result
}

export function TechnicalFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="relative px-4 py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0f0f0f]" />
      
      {/* Top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-[#333]" />
      
      <div className="relative mx-auto max-w-3xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Technical FAQ
          </h2>
          <p className="mt-3 text-[14px] text-muted-foreground">
            Common questions about our privacy-first architecture
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            
            return (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-[#333] bg-[#0a0a0a] transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`flex w-full items-center justify-between px-5 py-4 text-left transition-colors duration-200 ${
                    isOpen ? "text-accent" : "text-foreground/90 hover:text-foreground"
                  }`}
                  aria-expanded={isOpen}
                >
                  <span className="pr-4 text-[14px] font-medium leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-accent" : "text-muted-foreground"
                    }`}
                    strokeWidth={2}
                  />
                </button>
                
                <div
                  className={`grid transition-all duration-200 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-[#333]/50 px-5 pb-5 pt-4">
                      <p
                        className="text-[13px] leading-relaxed text-muted-foreground"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeInlineHtml(highlightTechnical(faq.answer, faq.technical), {
                            allowCodeTags: true,
                          })
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tech Stack Badge Grid */}
        <div className="mt-16 border-t border-[#333]/50 pt-10">
          <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
            Technology Stack
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="rounded-md border border-[#333] bg-[#0a0a0a] px-4 py-2 transition-all duration-200 hover:border-accent/30 hover:bg-accent/[0.04]">
                  <span className="font-mono text-[12px] font-medium text-muted-foreground/70 transition-colors duration-200 group-hover:text-muted-foreground">
                    {tech.label}
                  </span>
                </div>
                
                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md bg-foreground/95 px-2.5 py-1.5 text-[11px] text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {tech.description}
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground/95" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p className="mt-10 text-center text-[11px] text-muted-foreground/70">
          All processing occurs within your browser environment. No data is transmitted externally.
        </p>
      </div>
      
      {/* Bottom border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#333]" />
    </section>
  )
}
