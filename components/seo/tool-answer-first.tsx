import type { ToolAnswerFirstContent } from "@/lib/tool-page-content"

type ToolAnswerFirstProps = {
  toolName: string
  content: ToolAnswerFirstContent
}

export function ToolAnswerFirst({ toolName, content }: ToolAnswerFirstProps) {
  return (
    <section className="mb-6 rounded-xl border border-border/70 bg-card/40 p-4 md:p-5">
      <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
        Quick answer
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.summary}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <article className="rounded-lg border border-border/60 bg-background/60 p-3">
          <h3 className="text-sm font-semibold text-foreground">What this tool does</h3>
          <p className="mt-1 text-sm text-muted-foreground">{content.whatItDoes}</p>
        </article>
        <article className="rounded-lg border border-border/60 bg-background/60 p-3">
          <h3 className="text-sm font-semibold text-foreground">What you provide</h3>
          <p className="mt-1 text-sm text-muted-foreground">{content.whatYouProvide}</p>
        </article>
        <article className="rounded-lg border border-border/60 bg-background/60 p-3">
          <h3 className="text-sm font-semibold text-foreground">What you get</h3>
          <p className="mt-1 text-sm text-muted-foreground">{content.whatYouGet}</p>
        </article>
        <article className="rounded-lg border border-border/60 bg-background/60 p-3">
          <h3 className="text-sm font-semibold text-foreground">Local processing</h3>
          <p className="mt-1 text-sm text-muted-foreground">{content.localProcessing}</p>
        </article>
      </div>

      <div className="mt-4 rounded-lg border border-border/60 bg-background/60 p-3">
        <h3 className="text-sm font-semibold text-foreground">Limitations</h3>
        <p className="mt-1 text-sm text-muted-foreground">{content.limitations}</p>
      </div>

      <div className="mt-4 rounded-lg border border-border/60 bg-background/60 p-3">
        <h3 className="text-sm font-semibold text-foreground">What to expect</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
          {content.whatToExpect.map((item) => (
            <li key={`${toolName}-${item}`}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
