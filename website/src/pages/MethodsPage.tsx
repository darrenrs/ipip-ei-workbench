import { methodsSteps } from "@/lib/site";
import PageLayout from "@/pages/PageLayout";

export default function MethodsPage() {
  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero stack">
          <h1>Methods</h1>
          <p>
            A high-level explanation of how the broader R and Quarto workflow
            connects to the website.
          </p>
        </section>

        <section className="page-section">
          <div className="grid two-up">
            {methodsSteps.map((step) => (
              <article key={step} className="card">
                <p>{step}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
