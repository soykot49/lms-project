import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";

const rawApiRoot = import.meta.env.VITE_API_URL ?? "";
const API_BASE_URL = (String(rawApiRoot).replace(/\/$/, "") || "") + "/api";
if (API_BASE_URL === "/api") { /* same-origin */ }

function apiErrorMessage(res, fallback = "Something went wrong") {
  if (!res) return fallback;
  return res.message || res.error?.message || fallback;
}

const useStudentApi = () => {
  const token = localStorage.getItem("studentToken");
  const request = useCallback(async (endpoint, method = "GET", body = null) => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const options = { method, headers };
    if (body && method !== "GET") options.body = JSON.stringify(body);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const text = await response.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch { data = { success: false, message: "Invalid response" }; }
      if (typeof data.success === "boolean" && !data.status) data.status = data.success ? "success" : "error";
      if (!data.message && data.error?.message) data.message = data.error.message;
      if (response.status === 401) {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("studentRefreshToken");
        window.location.href = "/login";
        return null;
      }
      return data;
    } catch {
      return { status: "error", message: "Network error" };
    }
  }, [token]);
  return { request };
};

const StudentStyles = () => {
  useEffect(() => {
    const id = "student-portal-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Source+Serif+4:wght@600;700&display=swap');
      :root {
        --bg: #0b1220; --surface: #121a2e; --surface2: #182238;
        --border: #24304d; --accent: #38bdf8; --accent2: #7dd3fc;
        --green: #34d399; --red: #f87171; --gold: #fbbf24;
        --text: #e8eef9; --muted: #8b9bb8;
      }
      html, body, #root {
        min-height: 100%;
        min-height: 100dvh;
        height: 100%;
        background-color: var(--bg) !important;
      }
      .student-shell {
        flex: 1;
        width: 100%;
        min-height: 100%;
        min-height: 100dvh;
        background: radial-gradient(ellipse at top, #152040 0%, var(--bg) 55%);
        background-color: var(--bg);
        color: var(--text);
        font-family: 'Outfit', sans-serif;
      }
      .student-nav { display:flex; align-items:center; justify-content:space-between; padding:18px 28px; border-bottom:1px solid var(--border); background:rgba(18,26,46,.85); backdrop-filter:blur(12px); position:sticky; top:0; z-index:50; }
      .student-brand { font-family:'Source Serif 4',serif; font-size:22px; color:var(--accent); }
      .student-brand span { color:var(--muted); font-size:11px; display:block; letter-spacing:.12em; text-transform:uppercase; font-family:'Outfit',sans-serif; }
      .student-nav-links { display:flex; gap:8px; align-items:center; }
      .student-nav-links a, .student-nav-links button { padding:8px 14px; border-radius:8px; font-size:13px; font-weight:500; border:1px solid transparent; background:transparent; color:var(--muted); cursor:pointer; text-decoration:none; }
      .student-nav-links a.active, .student-nav-links a:hover { color:var(--accent); border-color:rgba(56,189,248,.25); background:rgba(56,189,248,.08); }
      .student-content { max-width:1100px; margin:0 auto; padding:28px 20px 48px; }
      .student-hero { margin-bottom:28px; }
      .student-hero h1 { font-family:'Source Serif 4',serif; font-size:32px; margin-bottom:6px; }
      .student-hero p { color:var(--muted); font-size:14px; }
      .stat-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:14px; margin-bottom:24px; }
      .stat-box { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:18px; }
      .stat-box .label { font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; }
      .stat-box .value { font-size:28px; font-weight:700; margin-top:8px; }
      .panel { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px; margin-bottom:18px; }
      .panel h2 { font-size:16px; margin-bottom:14px; font-weight:600; }
      table { width:100%; border-collapse:collapse; font-size:13px; }
      th { text-align:left; color:var(--muted); font-size:11px; text-transform:uppercase; padding:10px 8px; border-bottom:1px solid var(--border); }
      td { padding:12px 8px; border-bottom:1px solid rgba(36,48,77,.6); }
      .badge { display:inline-block; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:600; }
      .badge-issued { background:rgba(56,189,248,.15); color:var(--accent); }
      .badge-overdue { background:rgba(248,113,113,.15); color:var(--red); }
      .badge-pending { background:rgba(251,191,36,.15); color:var(--gold); }
      .badge-paid { background:rgba(52,211,153,.15); color:var(--green); }
      .auth-card { width:420px; max-width:95vw; background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:36px; box-shadow:0 24px 80px rgba(0,0,0,.35); }
      .auth-wrap {
        flex: 1;
        width: 100%;
        min-height: 100%;
        min-height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background: radial-gradient(ellipse at top, #152040 0%, var(--bg) 55%);
        background-color: var(--bg);
      }
      .form-group { margin-bottom:14px; }
      .form-group label { display:block; font-size:12px; color:var(--muted); margin-bottom:6px; }
      .form-group input, .form-group select { width:100%; padding:11px 12px; border-radius:10px; border:1px solid var(--border); background:var(--surface2); color:var(--text); font-family:inherit; font-size:14px; }
      .btn { padding:11px 18px; border-radius:10px; border:none; font-weight:600; cursor:pointer; font-family:inherit; font-size:14px; }
      .btn-primary { background:linear-gradient(135deg,var(--accent),#0ea5e9); color:#041018; width:100%; }
      .btn-outline { background:transparent; border:1px solid var(--border); color:var(--text); }
      .btn-sm { padding:6px 12px; font-size:12px; }
      .book-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:12px; }
      .book-card { border:1px solid var(--border); border-radius:12px; padding:14px; background:var(--surface2); }
      .book-card h3 { font-size:14px; margin-bottom:6px; }
      .book-card p { font-size:12px; color:var(--muted); }
      .tabs { display:flex; gap:8px; margin-bottom:18px; flex-wrap:wrap; }
      .tabs button { padding:8px 14px; border-radius:8px; border:1px solid var(--border); background:var(--surface2); color:var(--muted); cursor:pointer; }
      .tabs button.active { color:var(--accent); border-color:rgba(56,189,248,.4); background:rgba(56,189,248,.1); }
      .alert { padding:12px 14px; border-radius:10px; font-size:13px; margin-bottom:16px; background:rgba(56,189,248,.1); border:1px solid rgba(56,189,248,.25); color:var(--accent2); }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
};

const useToast = () => ({
  show: (msg) => {
    const el = document.createElement("div");
    el.textContent = msg;
    el.style.cssText = "position:fixed;bottom:24px;right:24px;background:#121a2e;color:#fff;padding:12px 18px;border-radius:10px;border:1px solid #38bdf8;z-index:9999;font-size:13px;";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  },
});

function StudentLogin({ onLogin }) {
  const { request } = useStudentApi();
  const { show } = useToast();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!identifier || !password) { show("Enter student ID or email and password"); return; }
    setLoading(true);
    const res = await request("/auth/student/login/", "POST", { identifier, password });
    setLoading(false);
    if (res?.status === "success") {
      const tokens = res.data?.tokens;
      localStorage.setItem("studentToken", tokens.access);
      localStorage.setItem("studentRefreshToken", tokens.refresh);
      onLogin(res.data?.user);
      navigate("/dashboard", { replace: true });
    } else show(apiErrorMessage(res, "Login failed"));
  };

  return (
    <div className="auth-wrap student-shell">
      <StudentStyles />
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div className="student-brand">LibraryOS <span>Student Portal</span></div>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 12 }}>Sign in with your student ID or email</p>
        </div>
        <div className="form-group"><label>Student ID or Email</label><input value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="STU-1001 or you@school.edu" onKeyDown={e => e.key === "Enter" && submit()} /></div>
        <div className="form-group"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} /></div>
        <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading ? "Signing in…" : "Sign In"}</button>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--muted)" }}>
          No account? <Link to="/register" style={{ color: "var(--accent)" }}>Register</Link>
        </p>
        <p style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "var(--muted)" }}>
          Staff? <Link to="/admin/login" style={{ color: "var(--accent)" }}>Admin login</Link>
        </p>
      </div>
    </div>
  );
}

function StudentRegister() {
  const { request } = useStudentApi();
  const { show } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", member_id: "", phone: "",
    password: "", password_confirm: "", member_type: "student",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    setLoading(true);
    const res = await request("/auth/student/register/", "POST", form);
    setLoading(false);
    if (res?.status === "success") {
      setDone(true);
      show("Registration submitted");
    } else show(apiErrorMessage(res, "Registration failed"));
  };

  if (done) {
    return (
      <div className="auth-wrap student-shell">
        <StudentStyles />
        <div className="auth-card">
          <h2 style={{ fontFamily: "'Source Serif 4', serif", marginBottom: 12 }}>Registration received</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
            Your account is pending approval. A librarian will activate it — then you can sign in with your student ID or email.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate("/login")}>Back to login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap student-shell">
      <StudentStyles />
      <div className="auth-card" style={{ width: 480 }}>
        <div className="student-brand" style={{ marginBottom: 20 }}>Create account</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="form-group"><label>First name</label><input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} /></div>
          <div className="form-group"><label>Last name</label><input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} /></div>
        </div>
        <div className="form-group"><label>Student ID</label><input value={form.member_id} onChange={e => setForm(f => ({ ...f, member_id: e.target.value }))} placeholder="STU-1001" /></div>
        <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
        <div className="form-group"><label>Phone (optional)</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
        <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
        <div className="form-group"><label>Confirm password</label><input type="password" value={form.password_confirm} onChange={e => setForm(f => ({ ...f, password_confirm: e.target.value }))} /></div>
        <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading ? "Submitting…" : "Register"}</button>
        <p style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "var(--muted)" }}>
          Already registered? <Link to="/login" style={{ color: "var(--accent)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function StudentLayout({ user, onLogout, children }) {
  const navigate = useNavigate();
  const path = window.location.pathname;
  const link = (to, label) => (
    <Link to={to} className={path === to || path.startsWith(to + "/") ? "active" : ""}>{label}</Link>
  );

  return (
    <div className="student-shell">
      <StudentStyles />
      <nav className="student-nav">
        <div className="student-brand">LibraryOS <span>My Library</span></div>
        <div className="student-nav-links">
          {link("/dashboard", "Dashboard")}
          {link("/dashboard/books", "Request book")}
          <span style={{ color: "var(--muted)", fontSize: 12, marginLeft: 8 }}>{user?.first_name} · {user?.member_id}</span>
          <button type="button" className="btn-outline btn-sm" onClick={() => { onLogout(); navigate("/login"); }}>Logout</button>
        </div>
      </nav>
      <div className="student-content">{children}</div>
    </div>
  );
}

function StudentDashboard() {
  const { request } = useStudentApi();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("borrowings");

  const load = useCallback(async () => {
    const res = await request("/student/dashboard/");
    if (res?.status === "success") setData(res.data);
  }, [request]);

  useEffect(() => { load(); }, [load]);

  if (!data) return <div className="student-content" style={{ padding: 40, color: "var(--muted)" }}>Loading…</div>;

  const { member, stats, borrowings, reservations, fines } = data;

  return (
    <>
      <div className="student-hero">
        <h1>Welcome, {member?.first_name}</h1>
        <p>Student ID {member?.member_id} · View borrowings, fines, and book requests</p>
      </div>
      <div className="alert">You cannot return books here — visit the library desk. Request books below; staff will approve.</div>
      <div className="stat-row">
        <div className="stat-box"><div className="label">Books borrowed</div><div className="value" style={{ color: "var(--accent)" }}>{stats.active_borrowings}</div></div>
        <div className="stat-box"><div className="label">Pending requests</div><div className="value" style={{ color: "var(--gold)" }}>{stats.pending_reservations}</div></div>
        <div className="stat-box"><div className="label">Unpaid fines</div><div className="value" style={{ color: stats.unpaid_fines > 0 ? "var(--red)" : "var(--green)" }}>৳{Number(stats.unpaid_fines).toFixed(2)}</div></div>
        <div className="stat-box"><div className="label">Total loans</div><div className="value">{stats.total_borrowed_ever}</div></div>
      </div>

      <div className="tabs">
        {["borrowings", "reservations", "fines"].map(t => (
          <button key={t} type="button" className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === "borrowings" && (
        <div className="panel">
          <h2>Currently borrowed</h2>
          {borrowings.length === 0 ? <p style={{ color: "var(--muted)" }}>No active borrowings</p> : (
            <table>
              <thead><tr><th>Book</th><th>Issued</th><th>Due</th><th>Status</th></tr></thead>
              <tbody>
                {borrowings.map(b => (
                  <tr key={b.id}>
                    <td>{b.book_title}</td>
                    <td>{b.issue_date?.slice(0, 10)}</td>
                    <td>{b.due_date?.slice(0, 10)}</td>
                    <td><span className={`badge badge-${b.status === "overdue" ? "overdue" : "issued"}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "reservations" && (
        <div className="panel">
          <h2>My requests</h2>
          <table>
            <thead><tr><th>Book</th><th>Requested</th><th>Status</th></tr></thead>
            <tbody>
              {reservations.map(r => (
                <tr key={r.id}>
                  <td>{r.book_title}</td>
                  <td>{r.created_at?.slice(0, 10)}</td>
                  <td><span className={`badge badge-${r.status === "pending" ? "pending" : "issued"}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "fines" && (
        <div className="panel">
          <h2>Fines</h2>
          <table>
            <thead><tr><th>Book</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {fines.map(f => (
                <tr key={f.id}>
                  <td>{f.book_title || f.transaction?.book_title || "—"}</td>
                  <td>৳{Number(f.amount).toFixed(2)}</td>
                  <td><span className={`badge badge-${f.status === "paid" ? "paid" : "overdue"}`}>{f.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function StudentBooksPage() {
  const { request } = useStudentApi();
  const { show } = useToast();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await request(`/student/books/${search ? `?search=${encodeURIComponent(search)}` : ""}`);
    if (res?.status === "success") setBooks(res.data);
  }, [request, search]);

  useEffect(() => { load(); }, [load]);

  const requestBook = async (bookId) => {
    const res = await request("/student/reservations/", "POST", { book: bookId });
    if (res?.status === "success") show(res.message || "Request submitted");
    else show(apiErrorMessage(res, "Could not request book"));
  };

  return (
    <>
      <div className="student-hero">
        <h1>Request a book</h1>
        <p>Browse available titles and submit a reservation for librarian approval</p>
      </div>
      <div className="panel">
        <input
          placeholder="Search by title…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && load()}
          style={{ width: "100%", marginBottom: 16, padding: 11, borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)" }}
        />
        <div className="book-grid">
          {books.map(b => (
            <div key={b.id} className="book-card">
              <h3>{b.title}</h3>
              <p>{b.author_name} · {b.available_quantity} available</p>
              <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: 10, width: "auto" }} onClick={() => requestBook(b.id)}>Request</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function StudentPortal({ user, setUser, onLogout }) {
  return (
    <StudentLayout user={user} onLogout={onLogout}>
      <Routes>
        <Route index element={<StudentDashboard />} />
        <Route path="books" element={<StudentBooksPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </StudentLayout>
  );
}

export default function StudentApp() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const isLoggedIn = !!localStorage.getItem("studentToken");
  const { request } = useStudentApi();

  useEffect(() => {
    const legacy = localStorage.getItem("token");
    if (legacy && !localStorage.getItem("studentToken")) {
      /* leave legacy for admin migration in AdminApp */
    }
    if (!isLoggedIn) { setReady(true); return; }
    request("/auth/profile/").then(res => {
      if (res?.status === "success") setUser(res.data);
      setReady(true);
    });
  }, [isLoggedIn, request]);

  const logout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentRefreshToken");
    setUser(null);
  };

  if (!ready && isLoggedIn) return null;

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<StudentLogin onLogin={setUser} />} />
        <Route path="/register" element={<StudentRegister />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/dashboard/*" element={<StudentPortal user={user} setUser={setUser} onLogout={logout} />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
