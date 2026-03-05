type FaqItem = {
  question: string
  answer: string
}

type FaqBlockProps = {
  faqs: FaqItem[]
}

export function FaqBlock({ faqs }: FaqBlockProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">FAQ</h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question} className="rounded-lg border border-border bg-card/40 p-4">
            <h3 className="text-lg font-medium text-foreground">{faq.question}</h3>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
