import { Metadata } from "next"
import { Header } from "@/components/legacy/header"
import { Footer } from "@/components/legacy/footer"

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Plain explains its approach to privacy. Files are processed locally and no user data is collected.",
  openGraph: {
    title: "Privacy - Plain",
    description: "Plain explains its approach to privacy. Files are processed locally and no user data is collected.",
  },
  alternates: {
    canonical: "https://plain.tools/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Privacy
          </h1>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Plain is designed to work without collecting data. Privacy is not a
            feature — it's the default.
          </p>

          <section className="mt-12">
            <h2 className="text-lg font-medium text-foreground">
              What We Do Not Collect
            </h2>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>Uploaded files (files are never uploaded)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>User accounts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>Personal data</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>Usage analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>Tracking cookies</span>
              </li>
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="text-lg font-medium text-foreground">
              How Files Are Handled
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              All PDF processing happens locally in your browser. Files never
              leave your device and are never transmitted to a server.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-lg font-medium text-foreground">Cookies</h2>
            <p className="mt-4 text-muted-foreground">
              Plain does not require cookies to function.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-lg font-medium text-foreground">Changes</h2>
            <p className="mt-4 text-muted-foreground">
              If this changes, it will be clearly stated on this page.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

