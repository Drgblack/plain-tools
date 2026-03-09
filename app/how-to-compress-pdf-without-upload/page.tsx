import { redirect } from "next/navigation"

export default function HowToCompressPdfWithoutUploadPage() {
  redirect("/diagnosis?fileType=pdf&problem=too-large&goal=upload&q=no%20upload")
}

