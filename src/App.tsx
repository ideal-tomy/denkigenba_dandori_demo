import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { DeskApp } from "./app/DeskApp";
import { DemoIntro } from "./components/demo-intro/DemoIntro";

function isEmbedIntro() {
  return new URLSearchParams(window.location.search).get("embed") === "intro";
}

function isStageView() {
  return new URLSearchParams(window.location.search).get("view") === "stage";
}

function RedirectToDesk() {
  const { search } = useLocation();
  return <Navigate to={`/desk${search}`} replace />;
}

export default function App() {
  if (isEmbedIntro()) {
    return (
      <main className={`ki-embed-intro${isStageView() ? " ki-embed-stage" : ""}`}>
        <DemoIntro />
      </main>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedirectToDesk />} />
        <Route path="/desk" element={<DeskApp />} />
        <Route path="*" element={<RedirectToDesk />} />
      </Routes>
    </BrowserRouter>
  );
}
