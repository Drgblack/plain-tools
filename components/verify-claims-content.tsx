"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { 
  ShieldCheck, 
  WifiOff, 
  MonitorSmartphone, 
  Copy, 
  Check, 
  FileSearch,
  Network,
  Plane,
  Trash2,
  AlertCircle,
  BookOpen,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

const trustBadges = [
  { icon: ShieldCheck, label: "No uploads" },
  { icon: MonitorSmartphone, label: "Runs locally" },
  { icon: WifiOff, label: "Works offline after load" },
]

const sections = [
  { id: "what-nothing-uploaded-means", title: "What \"nothing uploaded\" means", icon: FileSearch },
  { id: "verify-network-tab", title: "Verify using Developer Tools", icon: Network },
  { id: "verify-offline-mode", title: "Verify offline mode", icon: Plane },
  { id: "verify-file-handling", title: "Verify file handling", icon: Trash2 },
  { id: "if-you-see-network-request", title: "If you see a network request", icon: AlertCircle },
  { id: "faq", title: "FAQ", icon: BookOpen },
]

const verificationSteps = `How to Verify Plain's Claims

1. Open Plain in your browser
2. Right-click the page and choose Inspect (or press F12)
3. Click the Network tab
4. Turn on "Preserve log" (optional, but helpful)
5. Use a tool (for example: Merge PDF or Split PDF)
6. Watch the Network list while the tool runs

What you should expect to see:
- Normal page assets (HTML, CSS, JS) loading when you open the site
- No network requests containing your PDF file data while processing

Tip: Filter the Network list by Doc, Fetch/XHR, or search for "pdf"`

export function VerifyClaimsContent() {
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(verificationSteps)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = verificationSteps
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0px -60% 0px" }
    )

    sections.forEach((section) => {
      const element = sectionRefs.current[section.id]
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative overflow-x-hidden [&_p]:text-base [&_li]:text-base">
      {/* Hero Section */}
      <section className="relative px-4 py-24 md:py-32 bg-[oklch(0.12_0.004_250)]">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[500px] rounded-full bg-accent/[0.10] blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          {/* Trust pill */}
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 ring-1 ring-accent/20">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
            <span className="text-[12px] font-medium text-accent">Verifiable by anyone</span>
          </div>

          <h1 className="animate-fade-up-delay-1 text-2xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Verify Plain{"'"}s Claims
          </h1>
          <p className="animate-fade-up-delay-2 mt-5 text-[15px] leading-relaxed text-muted-foreground md:text-base">
            Anyone can confirm how Plain works using built-in browser tools. No special knowledge required.
          </p>

          {/* Trust badges */}
          <div className="animate-fade-up-delay-2 mt-10 flex flex-wrap items-center justify-center gap-3">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 rounded-lg border border-white/[0.10] bg-white/[0.03] px-4 py-2.5"
              >
                <badge.icon className="h-4 w-4 text-accent/80" strokeWidth={2} />
                <span className="text-[13px] font-medium text-foreground/80">{badge.label}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={handleCopy}
              className="h-11 gap-2 bg-accent px-6 text-[14px] font-semibold text-white hover:bg-accent-hover"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy verification steps
                </>
              )}
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 gap-2 border-white/[0.10] bg-transparent px-6 text-[14px] font-medium text-foreground/80 hover:bg-white/[0.04] hover:text-foreground"
            >
              <Link href="/privacy">
                Read the privacy policy
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main content with TOC */}
      <section className="relative px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="flex gap-12">
            {/* Table of Contents - Desktop only, sticky */}
            <aside className="hidden w-56 shrink-0 lg:block">
              <nav className="sticky top-24">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  On this page
                </p>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className={`group flex items-center gap-2 rounded-md px-3 py-2 text-[13px] transition-all duration-150 ${
                          activeSection === section.id
                            ? "bg-accent/10 text-accent font-medium"
                            : "text-muted-foreground/70 hover:bg-white/[0.04] hover:text-foreground"
                        }`}
                      >
                        <section.icon className={`h-3.5 w-3.5 transition-colors ${
                          activeSection === section.id ? "text-accent" : "text-muted-foreground/50 group-hover:text-accent/60"
                        }`} strokeWidth={2} />
                        <span className="truncate">{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 space-y-12">
              {/* Section 1 */}
              <SectionCard
                id="what-nothing-uploaded-means"
                ref={(el) => { sectionRefs.current["what-nothing-uploaded-means"] = el }}
                icon={FileSearch}
                title='What "nothing uploaded" means'
              >
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  Plain processes your PDF files inside your browser. Your files are not sent to our servers for processing.
                </p>
                <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
                  This is different from many online PDF tools that upload your documents to a remote server, process them there, and send a result back.
                </p>
                <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">In Plain:</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2 text-[14px] text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                    <span>Your files stay on your device.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[14px] text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                    <span>Processing happens locally in your browser tab.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[14px] text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                    <span>The output PDF is generated locally and downloaded by your browser.</span>
                  </li>
                </ul>
              </SectionCard>

              {/* Section 2 */}
              <SectionCard
                id="verify-network-tab"
                ref={(el) => { sectionRefs.current["verify-network-tab"] = el }}
                icon={Network}
                title="Verify using Developer Tools (Network tab)"
              >
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  You can verify this in under a minute:
                </p>
                <ol className="mt-4 space-y-3">
                  {[
                    "Open Plain in your browser.",
                    "Right-click the page and choose Inspect (or press F12).",
                    "Click the Network tab.",
                    "Turn on Preserve log (optional, but helpful).",
                    "Use a tool (for example: Merge PDF or Split PDF).",
                    "Watch the Network list while the tool runs.",
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-3 text-[14px] text-muted-foreground">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/12 text-[12px] font-semibold text-accent">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>

                {/* Callout box */}
                <div className="mt-6 rounded-lg border border-accent/20 bg-accent/[0.06] p-4">
                  <p className="text-[13px] font-semibold text-accent">What you should expect to see:</p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-start gap-2 text-[13px] text-foreground/80">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2} />
                      <span>Normal page assets (HTML, CSS, JS) loading when you open the site.</span>
                    </li>
                    <li className="flex items-start gap-2 text-[13px] text-foreground/80">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2} />
                      <span>No network requests containing your PDF file data while processing.</span>
                    </li>
                  </ul>
                </div>

                <p className="mt-4 text-[13px] text-muted-foreground/80">
                  <strong className="text-foreground/90">Tip:</strong> If you want to be extra sure, filter the Network list by: Doc, Fetch/XHR, or search for {'"'}pdf{'"'}
                </p>
              </SectionCard>

              {/* Section 3 */}
              <SectionCard
                id="verify-offline-mode"
                ref={(el) => { sectionRefs.current["verify-offline-mode"] = el }}
                icon={Plane}
                title="Verify offline mode (works after load)"
              >
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  Plain can work offline after the page has loaded.
                </p>
                <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">To test this:</p>
                <ol className="mt-4 space-y-3">
                  {[
                    "Open Plain normally while online.",
                    "Wait a few seconds for the page to fully load.",
                    "Turn on Airplane mode (or disconnect Wi-Fi).",
                    "Try using a tool.",
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-3 text-[14px] text-muted-foreground">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/12 text-[12px] font-semibold text-accent">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>

                {/* Callout box */}
                <div className="mt-6 rounded-lg border border-accent/20 bg-accent/[0.06] p-4">
                  <p className="text-[13px] font-semibold text-accent">What you should expect:</p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-start gap-2 text-[13px] text-foreground/80">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2} />
                      <span>The interface still works.</span>
                    </li>
                    <li className="flex items-start gap-2 text-[13px] text-foreground/80">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2} />
                      <span>Processing still works for supported tools.</span>
                    </li>
                    <li className="flex items-start gap-2 text-[13px] text-foreground/80">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2} />
                      <span>No upload step appears, because there is no upload step.</span>
                    </li>
                  </ul>
                </div>

                <p className="mt-4 text-[13px] text-muted-foreground/80">
                  <strong className="text-foreground/90">Note:</strong> If you refresh the page while offline, the site may not load until you go online again (depending on caching and your browser settings).
                </p>
              </SectionCard>

              {/* Section 4 */}
              <SectionCard
                id="verify-file-handling"
                ref={(el) => { sectionRefs.current["verify-file-handling"] = el }}
                icon={Trash2}
                title="Verify file handling (nothing stored)"
              >
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  Plain does not require an account. Your files are processed in-memory within the browser tab.
                </p>
                <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">What this means:</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2 text-[14px] text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                    <span>Closing the tab clears the session.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[14px] text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                    <span>Plain does not save your PDFs to a server.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[14px] text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                    <span>Your browser may keep downloaded files in your normal Downloads folder, as with any download.</span>
                  </li>
                </ul>
              </SectionCard>

              {/* Section 5 */}
              <SectionCard
                id="if-you-see-network-request"
                ref={(el) => { sectionRefs.current["if-you-see-network-request"] = el }}
                icon={AlertCircle}
                title="If you ever see a network request during processing"
              >
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  Most network activity you see will be normal website loading (scripts, fonts, images).
                </p>
                <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
                  If you believe you see a request that looks related to file processing:
                </p>
                <ol className="mt-4 space-y-3">
                  {[
                    "Take a screenshot of the Network tab.",
                    "Copy the request URL and headers (do not share your PDF contents).",
                    "Send it to us via the contact link in the footer.",
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-3 text-[14px] text-muted-foreground">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/12 text-[12px] font-semibold text-accent">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-[14px] leading-relaxed text-foreground/80">
                  We take verification seriously. If something ever contradicts the claims on this page, we want to know.
                </p>
              </SectionCard>

              {/* FAQ Section */}
              <SectionCard
                id="faq"
                ref={(el) => { sectionRefs.current["faq"] = el }}
                icon={BookOpen}
                title="FAQ"
              >
                <div className="space-y-6">
                  <FAQItem
                    question="Does Plain upload my PDFs?"
                    answer="No. Plain processes PDFs locally in your browser. Your files are not uploaded for processing."
                  />
                  <FAQItem
                    question="Can I verify this myself?"
                    answer="Yes. Use your browser's Developer Tools (Network tab) while running a tool. You should not see requests containing your PDF data."
                  />
                  <FAQItem
                    question="Does Plain work offline?"
                    answer="Plain can work offline after the site has loaded. If you refresh while offline, loading depends on your browser cache."
                  />
                </div>
              </SectionCard>

              {/* Footer note */}
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-6">
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  Plain is designed to be simple, verifiable, and privacy-first.
                  <br />
                  Learn more in the{" "}
                  <Link href="/learn" className="text-accent hover:underline">
                    Learning Center
                  </Link>
                  {" "}or read the{" "}
                  <Link href="/privacy" className="text-accent hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Section Card Component
interface SectionCardProps {
  id: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
  children: React.ReactNode
}

const SectionCard = ({ id, icon: Icon, title, children, ref }: SectionCardProps & { ref?: (el: HTMLElement | null) => void }) => {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id={id}
      ref={(el) => {
        cardRef.current = el
        if (ref) ref(el)
      }}
      className={`scroll-mt-24 rounded-xl border border-white/[0.12] bg-[oklch(0.15_0.006_250)] p-6 md:p-8 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Left accent bar */}
        <div className="hidden h-full w-1 shrink-0 rounded-full bg-accent md:block" />
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/25">
              <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
            </div>
            <h2 className="text-[18px] font-semibold tracking-tight text-foreground">
              {title}
            </h2>
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-white/[0.06] pb-5 last:border-0 last:pb-0">
      <h3 className="text-[15px] font-semibold text-foreground">{question}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{answer}</p>
    </div>
  )
}
