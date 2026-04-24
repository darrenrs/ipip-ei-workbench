import { disclaimers } from "@/lib/site";
import PageLayout from "@/pages/PageLayout";

export default function DisclaimerPage() {
  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero stack">
          <h1>Disclaimer</h1>
          <p>
            This project aims to be clear, useful, and honest about evidence
            strength.
          </p>
        </section>

        <section className="page-section">
          <div className="grid two-up">
            {disclaimers.map((entry) => (
              <article key={entry} className="card">
                <p>{entry}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
