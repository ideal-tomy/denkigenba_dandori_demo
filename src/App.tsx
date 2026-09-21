import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { DeskApp } from "./app/DeskApp";

function RedirectToDesk() {
  const { search } = useLocation();
  return <Navigate to={`/desk${search}`} replace />;
}

export default function App() {
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
