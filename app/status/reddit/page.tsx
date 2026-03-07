import { permanentRedirect } from "next/navigation"

export default function RedditStatusAliasPage() {
  permanentRedirect("/status/reddit.com")
}
