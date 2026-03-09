import { redirect } from "next/navigation"

export default function PdfWontOpenPage() {
  redirect("/diagnosis?fileType=pdf&problem=wont-open")
}

