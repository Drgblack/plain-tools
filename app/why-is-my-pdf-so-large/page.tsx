import { redirect } from "next/navigation"

export default function WhyIsMyPdfSoLargePage() {
  redirect("/diagnosis?fileType=pdf&problem=too-large")
}

