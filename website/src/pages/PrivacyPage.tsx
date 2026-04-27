import PageLayout from "@/pages/PageLayout";

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero stack">
          <h1>Privacy</h1>
        </section>
        <section className="page-section">
          <div className="privacy-summary">
            <p>
              No quiz responses are collected and everything is computed and
              stored in the browser. However, non-identifying analytics data may
              be collected by Cloudflare.
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
