type GuidanceProps = {
  title: string;
  intro: string;
  points: string[];
  questions: Array<{ question: string; answer: string }>;
};

export function MarketGuidance({ title, intro, points, questions }: GuidanceProps) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 md:p-7" aria-labelledby="market-guidance-title">
      <h2 id="market-guidance-title" className="text-2xl font-bold">{title}</h2>
      <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">{intro}</p>
      <ul className="mt-5 grid gap-3 md:grid-cols-3">
        {points.map((point) => <li key={point} className="rounded-xl bg-muted/50 p-4 text-sm leading-6">{point}</li>)}
      </ul>
      <div className="mt-7 border-t pt-6">
        <h3 className="text-xl font-semibold">أسئلة شائعة</h3>
        <div className="mt-4 space-y-4">
          {questions.map(({ question, answer }) => (
            <div key={question}>
              <h4 className="font-semibold">{question}</h4>
              <p className="mt-1 leading-7 text-muted-foreground">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
