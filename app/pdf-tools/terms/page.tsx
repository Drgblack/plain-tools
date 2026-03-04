import type { Metadata } from 'next'
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Plain - the local-first PDF processing platform. All processing is executed locally on your device.',
}

const sections = [
  {
    number: "01",
    title: "NATURE OF SERVICE",
    content: `Plain provides browser-based PDF utility tools. All processing is executed locally on the user's device via WebAssembly and WebGPU technologies. No files are uploaded to, processed by, or stored on Plain's infrastructure. The service operates entirely within your web browser, utilising your device's computational resources to perform all PDF operations.`
  },
  {
    number: "02",
    title: "DATA OWNERSHIP & RESPONSIBILITY",
    content: `As no data is transmitted to Plain, the user retains sole ownership and responsibility for the files they process. Plain cannot recover lost files or provide copies of processed documents, as we never possess them. Users are solely responsible for maintaining backups of their original files and any processed outputs. Plain bears no responsibility for data loss resulting from browser crashes, device failures, or user error.`
  },
  {
    number: "03",
    title: "LOCAL AI & HARDWARE USAGE",
    content: `Users acknowledge that AI-driven features (including summarisation, document chat, and intelligent extraction) utilise their local hardware resources, including CPU, RAM, and where available, GPU via WebGPU. Performance is dependent on the user's device specifications and available system resources. Plain is not liable for system instability, browser crashes, or reduced device performance caused by local resource intensity. Users with older devices or limited RAM should exercise caution when using resource-intensive features.`
  },
  {
    number: "04",
    title: "INTELLECTUAL PROPERTY",
    content: `The interface, branding, and proprietary local processing architecture are the intellectual property of Plain. Users may not reverse-engineer, decompile, disassemble, or attempt to extract the underlying WebAssembly modules, WebGPU shaders, or processing algorithms for external use, redistribution, or commercial purposes. The source code, compiled binaries, and processing methodologies remain the exclusive property of Plain.`
  },
  {
    number: "05",
    title: "DISCLAIMER OF WARRANTY",
    content: `Plain is provided 'as is' without warranty of any kind, express or implied. While we strive for 100% local accuracy and reliability, we do not warrant that the tools will be error-free, uninterrupted, or that they will meet every specific requirement of the user. Plain disclaims all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. Users assume all risk associated with the use of the service.`
  },
  {
    number: "06",
    title: "GOVERNING LAW",
    content: `These terms are governed by and construed in accordance with the laws of England and Wales, without regard to conflict of law principles. Any disputes arising from these terms or use of the service shall be subject to the exclusive jurisdiction of the courts of England and Wales. If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.`
  },
]

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="relative px-4 py-16 md:py-24">
        {/* Background subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-[oklch(0.11_0.004_250)] pointer-events-none" />
        
        <div className="relative mx-auto max-w-[800px]">
          {/* Back button */}
          <Link
            href="/pdf-tools/tools"
            className="group mb-8 inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground/70 transition-colors duration-200 hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" strokeWidth={1.5} />
            Back to Tools
          </Link>
          
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-4 font-mono text-[12px] uppercase tracking-wider text-muted-foreground/60">
              Last Updated: March 2026
            </p>
          </div>
          
          {/* Introduction */}
          <div className="mb-12 rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
            <p className="font-serif text-[15px] leading-relaxed text-muted-foreground">
              Welcome to Plain. These Terms of Service govern your use of our local-first PDF processing platform. By accessing or using Plain, you agree to be bound by these terms. Please read them carefully before using our services.
            </p>
          </div>
          
          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.number} className="group">
                {/* Section header */}
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="font-mono text-[13px] font-medium text-accent">
                    {section.number}.
                  </span>
                  <h2 className="font-mono text-[13px] font-medium uppercase tracking-wider text-accent">
                    {section.title}
                  </h2>
                </div>
                
                {/* Section content */}
                <div className="border-l-2 border-white/[0.06] pl-6 transition-colors duration-200 group-hover:border-accent/30">
                  <p className="font-serif text-[15px] leading-[1.8] text-foreground/80">
                    {section.content}
                  </p>
                </div>
              </section>
            ))}
          </div>
          
          {/* Footer note */}
          <div className="mt-16 border-t border-white/[0.06] pt-8">
            <div className="rounded-lg bg-accent/[0.06] p-6 ring-1 ring-accent/20">
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-accent">
                Local-First Commitment
              </h3>
              <p className="mt-3 font-serif text-[14px] leading-relaxed text-muted-foreground">
                These terms reflect our fundamental commitment to local-first processing. Unlike traditional cloud-based PDF services, Plain never has access to your documents. This architecture means we cannot be compelled to produce your data, because we simply do not possess it.
              </p>
            </div>
          </div>
          
          {/* Contact */}
          <div className="mt-8 text-center">
            <p className="text-[13px] text-muted-foreground/60">
              Questions about these terms?{' '}
              <Link href="/pdf-tools/about" className="text-accent hover:underline">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}



