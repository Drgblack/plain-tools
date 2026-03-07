import { permanentRedirect } from "next/navigation"

export default function LegacyBase64Page() {
  permanentRedirect("/tools/base64-encoder")
}

