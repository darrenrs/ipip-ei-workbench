import { Navigate, Route, Routes } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import AboutPage from "@/pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import InstrumentPage from "@/pages/InstrumentPage";
import QuizPage from "@/pages/QuizPage";
import ResultsPage from "@/pages/ResultsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/instrument/:slug" element={<InstrumentPage />} />
      <Route path="/instrument/:slug/quiz" element={<QuizPage />} />
      <Route path="/instrument/:slug/results" element={<ResultsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
