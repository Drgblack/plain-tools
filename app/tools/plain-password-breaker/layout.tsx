import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Plain Password Breaker",
  description: "Recover access to your own password-protected PDF files locally using known-password or bounded brute-force modes with private browser execution. Built for.",
  openGraph: {
    title: "Plain Password Breaker",
    description:
      "Run local PDF password recovery for authorized documents only, with progress controls and no server upload risk.",
  },
  alternates: {
    canonical: "https://plain.tools/tools/plain-password-breaker",
  },
}

export default function PasswordBreakerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


