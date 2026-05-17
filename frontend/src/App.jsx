import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminApp from "./AdminApp.jsx";
import StudentApp from "./StudentApp.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <Routes>
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/*" element={<StudentApp />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
