import Link from "next/link"

type TrustBoxProps = {
  localProcessing: string
  noUploads: string
  noTracking: string
  verifyHref: string
}

export function TrustBox({
  localProcessing,
  noUploads,
  noTracking,
  verifyHref,
}: TrustBoxProps) {
  return (
    <section className="rounded-xl border border-border bg-card/50 p-5">
      <h2 className="text-lg font-semibold text-foreground">Trust box</h2>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        <li>Local processing: {localProcessing}</li>
        <li>No uploads: {noUploads}</li>
        <li>No tracking: {noTracking}</li>
        <li>
          Verify this claim:{" "}
          <Link href={verifyHref} className="font-medium text-accent hover:underline">
            {verifyHref}
          </Link>
        </li>
      </ul>
    </section>
  )
}
