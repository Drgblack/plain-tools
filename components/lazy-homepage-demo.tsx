"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

const HomepageDemo = dynamic(
  () => import("@/components/homepage-demo").then((mod) => mod.HomepageDemo),
  {
    ssr: false,
    loading: () => (
      <section id="homepage-live-demo" className="px-4 py-10 sm:py-12">
        <div className="mx-auto max-w-6xl rounded-xl border border-border/70 bg-card/40 p-6 text-sm text-muted-foreground">
          Loading live demo...
        </div>
      </section>
    ),
  }
)

export function LazyHomepageDemo() {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const target = sentinelRef.current
    if (!target || shouldLoad) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px" }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [shouldLoad])

  return (
    <div ref={sentinelRef}>
      {shouldLoad ? (
        <HomepageDemo />
      ) : (
        <section id="homepage-live-demo" className="px-4 py-10 sm:py-12">
          <div className="mx-auto max-w-6xl rounded-xl border border-border/70 bg-card/40 p-6 text-sm text-muted-foreground">
            Scroll to load the live browser demo.
          </div>
        </section>
      )}
    </div>
  )
}
