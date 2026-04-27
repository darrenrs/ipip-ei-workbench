import PageLayout from "@/pages/PageLayout";

const aboutItems = [
  "This website is an interactive portal for five instruments (standardized tools to assess human psychology) based on theories of personality and emotional intelligence by acclaimed researchers.",
  "Scoring, reliability, and confidence intervals are automatically computed from the Eugene-Springfield Community Sample unless otherwise noted.",
  "The interactive portion of this website omits most technical information for maximum accessibility. Interested users or researchers may consult the full Quarto report.",
  "Some exploratory factor solutions that differ from the intended factor structure are found in the report, but this website does not use them at this time.",
  "Results are not currently sent or stored anywhere. In the future, the ability to save results to the browser may be added.",
  "This website and associated pipeline code is 100% open-source and will be released under the provisions of the MIT license for v1.0.",
];

const limitationItems = [
  "This website is not a clinical service, diagnostic tool, hiring product, or treatment resource.",
  "User-facing results should be read as descriptive tendencies rather than fixed truths.",
  "Some instruments have borderline or limited support for factor analysis, and as such it is not recommended to interpret those results in a serious way.",
  "Percentile ranks and qualitative descriptors are based on a college-educated, middle-aged, White American sample and likely to be inaccurate for people outside those strata.",
  "This website does not use proprietary instruments or professionally validated norms. Instrument, scale, and subscale names are derived from models found in the literature, not commercial products.",
];

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero stack">
          <h1>About</h1>
          <p>
            A lightning-fast explanation of what this website is and how it
            connects to the broader psychometrics project and R/Quarto pipeline.
          </p>
        </section>

        <section className="page-section">
          <div className="grid two-up">
            {aboutItems.map((item) => (
              <article key={item} className="card">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="hero stack">
          <h1>Limitations</h1>
          <p>
            This project aims to be useful, honest, and transparent to all.
            Accordingly, it is vital to understand its limitations.
          </p>
        </section>

        <section className="page-section">
          <div className="grid two-up">
            {limitationItems.map((item) => (
              <article key={item} className="card">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
