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
              No quiz responses are collected or stored server-side; all
              responses are computed locally in the browser. In-progress quizzes
              are stored in session storage, and completed results are stored in
              local storage on this device. However, non-identifying analytics
              data may be collected by Cloudflare.
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
