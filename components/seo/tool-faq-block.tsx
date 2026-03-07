type ToolFaqItem = {
  question: string
  answer: string
}

type ToolFaqBlockProps = {
  faqs: ToolFaqItem[]
  className?: string
}

export function ToolFaqBlock({ faqs, className }: ToolFaqBlockProps) {
  if (!faqs.length) return null

  return (
    <section className={className}>
      <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
        Frequently asked questions
      </h2>
      <div className="mt-3 space-y-2">
        {faqs.map((faq) => (
          <details key={faq.question} className="rounded-lg border border-border/60 bg-card/40 p-3">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              {faq.question}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

