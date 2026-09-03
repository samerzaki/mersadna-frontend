type GuidanceProps = {
  title: string;
  intro: string;
  points: string[];
  questions: Array<{ question: string; answer: string }>;
};

export function MarketGuidance({ title, intro, points, questions }: GuidanceProps) {
  return (
    <section className="card-surface p-5 md:p-7" aria-labelledby="market-guidance-title">
      <h2 id="market-guidance-title" className="font-heading text-[22px] md:text-[25px] font-semibold text-text">
        {title}
      </h2>
      <p className="mt-3 max-w-4xl text-[15px] leading-[1.8] text-muted">{intro}</p>
      <ul className="mt-5 grid gap-3 md:grid-cols-3">
        {points.map((point) => (
          <li key={point} className="stat-tile text-[13px] leading-[1.7] text-text">
            {point}
          </li>
        ))}
      </ul>
      <div className="mt-7 border-t border-[var(--line2)] pt-6">
        <h3 className="font-heading text-[17px] font-semibold text-text">أسئلة شائعة</h3>
        <div className="mt-4 space-y-4">
          {questions.map(({ question, answer }) => (
            <div key={question}>
              <h4 className="text-[14px] font-semibold text-text">{question}</h4>
              <p className="mt-1 text-[14px] leading-[1.8] text-muted">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
