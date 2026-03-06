type ToolHelperPanelProps = {
  uploadHint: string
  resultHint: string
  limitationNote: string
  className?: string
}

export function ToolHelperPanel({
  uploadHint,
  resultHint,
  limitationNote,
  className,
}: ToolHelperPanelProps) {
  return (
    <section className={className}>
      <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
        Before you start
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border/70 bg-card/40 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent/90">Upload</p>
          <p className="mt-1.5 text-sm text-muted-foreground">{uploadHint}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-card/40 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent/90">Result</p>
          <p className="mt-1.5 text-sm text-muted-foreground">{resultHint}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-card/40 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent/90">Local processing</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Processing runs in your browser session. Files are not uploaded by default.
          </p>
        </div>
        <div className="rounded-lg border border-border/70 bg-card/40 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent/90">Limitations</p>
          <p className="mt-1.5 text-sm text-muted-foreground">{limitationNote}</p>
        </div>
      </div>
    </section>
  )
}
