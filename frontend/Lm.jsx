import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// GLOBAL STYLES (injected once)
// ============================================================
const GlobalStyles = () => {
  useEffect(() => {
    const id = "libraryos-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

      :root {
        --bg: #0f1117; --surface: #181c27; --surface2: #1e2334;
        --border: #272d42; --accent: #c9a84c; --accent2: #e8c97a;
        --green: #3ecf8e; --red: #e05c5c; --blue: #5c9de0;
        --purple: #9b72e6; --text: #e8eaf0; --muted: #7a8099;
        --sidebar-w: 240px;
      }
      [data-theme="light"] {
        --bg: #f6f8fc; --surface: #ffffff; --surface2: #f1f4fa;
        --border: #d8deeb; --accent: #b2862f; --accent2: #c89d45;
        --green: #1ea266; --red: #c33d3d; --blue: #2f6ebd;
        --purple: #7a56c2; --text: #1b2538; --muted: #5d6b83;
      }
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }
      a { text-decoration: none; color: inherit; }

      .icon-svg { width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;display:inline-block;vertical-align:middle; }
      .icon-svg.lg { width:24px;height:24px; }
      .icon-svg.xl { width:28px;height:28px; }
      .icon-svg.xxl { width:36px;height:36px; }
      .icon-svg.sm { width:14px;height:14px; }

      /* SIDEBAR */
      .sidebar { position:fixed;left:0;top:0;width:var(--sidebar-w);height:100vh;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;z-index:100;transition:.3s; }
      .sidebar-logo { padding:28px 24px 20px;border-bottom:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:10px; }
      .sidebar-logo-icon { width:36px;height:36px;background:linear-gradient(135deg,var(--accent),#a07830);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
      .sidebar-logo-text h1 { font-family:'Playfair Display',serif;font-size:20px;color:var(--accent);letter-spacing:.5px; }
      .sidebar-logo-text span { font-size:10px;color:var(--muted);letter-spacing:2px;text-transform:uppercase; }
      .nav { flex:1;padding:20px 12px;overflow-y:auto; }
      .nav-section { font-size:10px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;padding:14px 12px 6px;margin-top:8px; }
      .nav-item { display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;transition:.2s;font-size:13.5px;font-weight:500;color:var(--muted);border:none;background:none;width:100%;text-align:left; }
      .nav-item:hover { background:var(--surface2);color:var(--text); }
      .nav-item.active { background:linear-gradient(135deg,rgba(201,168,76,.15),rgba(201,168,76,.05));color:var(--accent);border:1px solid rgba(201,168,76,.2); }
      .nav-badge { margin-left:auto;background:var(--red);color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px; }
      .sidebar-footer { padding:16px;border-top:1px solid var(--border); }
      .admin-card { display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;background:var(--surface2); }
      .admin-avatar { width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--purple));display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff; }
      .admin-info p { font-size:13px;font-weight:600; }
      .admin-info span { font-size:11px;color:var(--muted); }

      /* MAIN */
      .main { margin-left:var(--sidebar-w);background:var(--bg);min-height:100vh;display:flex;flex-direction:column; }
      .topbar { background:var(--surface);border-bottom:1px solid var(--border);padding:0 28px;height:60px;display:flex;align-items:center;gap:16px;position:sticky;top:0;z-index:50; }
      .topbar-title { font-family:'Playfair Display',serif;font-size:18px;flex:1; }
      .search-box { display:flex;align-items:center;gap:8px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:7px 14px;width:240px; }
      .search-box input { background:none;border:none;outline:none;font-size:13px;color:var(--text);font-family:'DM Sans',sans-serif;width:100%; }
      .search-box input::placeholder { color:var(--muted); }
      .topbar-btn { width:36px;height:36px;border-radius:8px;background:var(--surface2);border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--muted);position:relative;transition:.2s; }
      .topbar-btn:hover { border-color:var(--accent);color:var(--accent); }
      .theme-toggle-btn { width:40px;height:40px;border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--accent);display:inline-flex;align-items:center;justify-content:center;font-size:18px;transition:all .2s ease;cursor:pointer; }
      .theme-toggle-btn:hover { border-color:var(--accent);box-shadow:0 0 0 3px rgba(201,168,76,.15);transform:translateY(-1px); }
      .topbar-notif-count { position:absolute;top:-6px;right:-6px;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:var(--red);color:#fff;font-size:10px;font-weight:700;line-height:18px;text-align:center;border:2px solid var(--surface); }
      .notif-dot { position:absolute;top:6px;right:6px;width:7px;height:7px;background:var(--red);border-radius:50%;border:2px solid var(--surface); }
      .content { padding:28px;flex:1; }

      /* PAGE ANIMATION */
      .page-enter { animation: fadeIn 0.3s ease; }
      @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

      /* BUTTONS */
      .btn { display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:.2s;font-family:'DM Sans',sans-serif; }
      .btn-primary { background:var(--accent);color:#0f1117; }
      .btn-primary:hover { background:var(--accent2); }
      .btn-outline { background:transparent;color:var(--text);border:1px solid var(--border); }
      .btn-outline:hover { border-color:var(--accent);color:var(--accent); }
      .spacer { flex:1; }
      .badge { display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600; }
      .badge-green { background:rgba(62,207,142,.12);color:var(--green); }
      .badge-red { background:rgba(224,92,92,.12);color:var(--red); }
      .badge-blue { background:rgba(92,157,224,.12);color:var(--blue); }
      .badge-gold { background:rgba(201,168,76,.12);color:var(--accent2); }

      /* STATS */
      .stats-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:28px; }
      .stat-card { background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:22px;position:relative;overflow:hidden;transition:.3s;cursor:default; }
      .stat-card:hover { border-color:var(--accent);transform:translateY(-2px); }
      .stat-card::before { content:'';position:absolute;top:0;right:0;width:80px;height:80px;border-radius:0 14px 0 80px;opacity:.08; }
      .stat-card.gold::before { background:var(--accent); }
      .stat-card.green::before { background:var(--green); }
      .stat-card.blue::before { background:var(--blue); }
      .stat-card.red::before { background:var(--red); }
      .stat-icon { width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:14px; }
      .stat-icon.gold { background:rgba(201,168,76,.12);color:var(--accent); }
      .stat-icon.blue { background:rgba(92,157,224,.12);color:var(--blue); }
      .stat-icon.green { background:rgba(62,207,142,.12);color:var(--green); }
      .stat-icon.red { background:rgba(224,92,92,.12);color:var(--red); }
      .stat-val { font-family:'Playfair Display',serif;font-size:34px;font-weight:700;line-height:1; }
      .stat-label { font-size:12px;color:var(--muted);margin-top:6px;letter-spacing:.5px; }
      .stat-change { font-size:11px;margin-top:10px;display:flex;align-items:center;gap:4px; }
      .stat-change.up { color:var(--green); }
      .stat-change.down { color:var(--red); }

      /* TOOLBAR */
      .toolbar { display:flex;align-items:center;gap:12px;margin-bottom:22px;flex-wrap:wrap; }
      .filter-select { background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:9px 14px;font-size:13px;color:var(--text);font-family:'DM Sans',sans-serif;cursor:pointer;outline:none; }

      /* GRID LAYOUTS */
      .row-grid { display:grid;grid-template-columns:1fr 380px;gap:18px;margin-bottom:18px; }
      .qa-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px; }
      .qa-btn { background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px 14px;display:flex;flex-direction:column;align-items:center;gap:10px;cursor:pointer;transition:.25s;text-align:center;font-family:'DM Sans',sans-serif; }
      .qa-btn:hover { border-color:var(--accent);background:var(--surface2);transform:translateY(-2px); }
      .qa-btn .qa-icon { width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center; }
      .qa-btn span { font-size:12px;font-weight:500;color:var(--muted); }

      /* PANELS & TABLES */
      .panel { background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:22px;overflow:hidden; }
      .panel-hd { display:flex;align-items:center;justify-content:space-between;margin-bottom:18px; }
      .panel-hd h2 { font-family:'Playfair Display',serif;font-size:16px;display:flex;align-items:center;gap:8px; }
      .panel-hd a { font-size:12px;color:var(--accent);font-weight:500;cursor:pointer; }
      table { width:100%;border-collapse:collapse; }
      thead th { font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;padding:14px 16px;text-align:left;border-bottom:1px solid var(--border);background:var(--surface2); }
      tbody tr { transition:.2s; }
      tbody tr:hover { background:var(--surface2); }
      tbody td { padding:13px 16px;font-size:13px;border-bottom:1px solid rgba(39,45,66,.5); }

      /* CHART */
      .chart-bars { display:flex;align-items:flex-end;gap:5px;height:80px;margin-top:16px; }
      .bar-wrap { flex:1;display:flex;flex-direction:column;align-items:center;gap:5px; }
      .bar { width:100%;background:var(--border);border-radius:4px 4px 0 0; }
      .bar.fill-gold { background:linear-gradient(to top,var(--accent),var(--accent2)); }
      .bar.fill-blue { background:linear-gradient(to top,#3a7bd5,var(--blue)); }
      .bar-lbl { font-size:9px;color:var(--muted); }

      /* NOTIFICATIONS & ACTIVITY */
      .notif-list { display:flex;flex-direction:column;gap:10px; }
      .notif-item { display:flex;gap:12px;padding:12px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);transition:.2s; }
      .notif-item:hover { border-color:var(--accent); }
      .notif-icon { width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
      .ni-title { font-size:13px;font-weight:500; }
      .ni-sub { font-size:11px;color:var(--muted);margin-top:2px; }
      .ni-time { font-size:10px;color:var(--muted);margin-top:4px; }
      .activity-list { display:flex;flex-direction:column; }
      .act-item { display:flex;align-items:center;gap:14px;padding:11px 0;border-bottom:1px solid rgba(39,45,66,.5); }
      .act-item:last-child { border-bottom:none; }
      .act-icon { width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
      .act-info { flex:1; }
      .act-info p { font-size:13px; }
      .act-info span { font-size:11px;color:var(--muted); }
      .act-time { font-size:11px;color:var(--muted);white-space:nowrap; }

      /* AUTHOR / MEMBER CARDS */
      .authors-grid,.books-grid,.members-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px; }
      .author-card,.book-card,.member-card { background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:22px;transition:.25s; }
      .author-card:hover,.book-card:hover,.member-card:hover { border-color:var(--accent);transform:translateY(-2px); }
      .author-hd,.member-hd { display:flex;align-items:center;gap:14px;margin-bottom:16px; }
      .author-avatar,.member-avatar { width:50px;height:50px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#fff;flex-shrink:0; }
      .author-name,.member-name { font-size:15px;font-weight:600; }
      .author-nationality,.member-role { font-size:12px;color:var(--muted);margin-top:2px;display:flex;align-items:center;gap:4px; }
      .author-stats,.member-stats { display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px; }
      .astat,.mstat { background:var(--surface2);border-radius:8px;padding:10px;text-align:center; }
      .astat .val,.mstat .val { font-size:20px;font-weight:700;font-family:'Playfair Display',serif; }
      .astat .lbl,.mstat .lbl { font-size:10px;color:var(--muted);margin-top:2px; }
      .author-genre { font-size:11px;color:var(--muted);margin-bottom:12px;display:flex;align-items:center;gap:5px; }
      .author-actions,.member-actions { display:flex;gap:8px; }
      .sm-btn { flex:1;padding:7px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--border);background:none;color:var(--text);font-family:'DM Sans',sans-serif;transition:.2s;text-align:center; }
      .sm-btn:hover { border-color:var(--accent);color:var(--accent); }
      .sm-btn.del { color:var(--red);border-color:rgba(224,92,92,.2); }
      .sm-btn.del:hover { background:rgba(224,92,92,.08); }

      /* BOOKS */
      .book-card { padding:0;overflow:hidden; }
      .book-cover { height:130px;background:linear-gradient(135deg,var(--surface2),var(--border));display:flex;align-items:center;justify-content:center; }
      .book-cover-icon { width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center; }
      .book-card-body { padding:14px; }
      .book-card-body h3 { font-size:13px;font-weight:600;margin-bottom:4px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
      .book-card-body .author { font-size:11px;color:var(--muted);margin-bottom:8px; }
      .book-card-body .meta { display:flex;justify-content:space-between;align-items:center; }
      .book-card-body .isbn { font-size:10px;color:var(--muted); }

      /* RESERVATIONS */
      .reserv-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px; }
      .reserv-card { background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px;transition:.25s;position:relative;overflow:hidden; }
      .reserv-card:hover { border-color:var(--accent);transform:translateY(-2px); }
      .reserv-card::before { content:'';position:absolute;top:0;left:0;right:0;height:3px; }
      .reserv-card.pending::before { background:linear-gradient(90deg,var(--accent),transparent); }
      .reserv-card.ready::before { background:linear-gradient(90deg,var(--green),transparent); }
      .reserv-card.expired::before { background:linear-gradient(90deg,var(--red),transparent); }
      .rc-hd { display:flex;align-items:flex-start;gap:14px;margin-bottom:14px; }
      .rc-icon { width:48px;height:48px;border-radius:10px;background:var(--surface2);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
      .rc-title { font-size:14px;font-weight:600;line-height:1.3;margin-bottom:3px; }
      .rc-author { font-size:12px;color:var(--muted); }
      .rc-badge { margin-left:auto;flex-shrink:0; }
      .rc-info { display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px; }
      .rc-info-item { background:var(--surface2);border-radius:7px;padding:8px 10px; }
      .rc-info-item .lbl { font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px; }
      .rc-info-item .val { font-size:13px;font-weight:600; }
      .rc-actions { display:flex;gap:8px; }
      .sm-btn.approve { color:var(--green);border-color:rgba(62,207,142,.3); }
      .sm-btn.approve:hover { background:rgba(62,207,142,.1); }
      .sm-btn.cancel { color:var(--red);border-color:rgba(224,92,92,.2); }
      .sm-btn.cancel:hover { background:rgba(224,92,92,.08); }

      /* FINES */
      .overdue-alert { background:rgba(224,92,92,.06);border:1px solid rgba(224,92,92,.2);border-radius:12px;padding:14px 18px;display:flex;align-items:center;gap:12px;margin-bottom:22px;font-size:13px; }
      .icon-btn { width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--muted);transition:.2s; }
      .icon-btn:hover { border-color:var(--accent);color:var(--accent); }
      .td-btn { padding:5px 12px;border-radius:6px;border:1px solid;background:none;cursor:pointer;font-size:12px;font-weight:600;font-family:'DM Sans',sans-serif;transition:.2s; }
      .td-btn.pay { border-color:rgba(62,207,142,.3);color:var(--green); }
      .td-btn.pay:hover { background:rgba(62,207,142,.1); }
      .td-btn.waive { border-color:rgba(201,168,76,.3);color:var(--accent); }
      .td-btn.waive:hover { background:rgba(201,168,76,.1); }

      /* MODALS */
      .modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:.25s; }
      .modal-overlay.open { opacity:1;pointer-events:all; }
      .modal { background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px;width:480px;max-width:95vw;transform:translateY(20px);transition:.25s; }
      .modal-overlay.open .modal { transform:translateY(0); }
      .modal-hd { display:flex;align-items:center;justify-content:space-between;margin-bottom:22px; }
      .modal-hd h2 { font-family:'Playfair Display',serif;font-size:18px; }
      .modal-close { width:30px;height:30px;border-radius:6px;border:1px solid var(--border);background:none;cursor:pointer;color:var(--muted);display:flex;align-items:center;justify-content:center;transition:.2s; }
      .modal-close:hover { border-color:var(--red);color:var(--red); }
      .form-grid { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
      .form-group { display:flex;flex-direction:column;gap:6px; }
      .form-group.full { grid-column:1/-1; }
      .form-group label { font-size:12px;color:var(--muted);letter-spacing:.5px;text-transform:uppercase; }
      .form-group input,.form-group select,.form-group textarea { background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:13px;color:var(--text);font-family:'DM Sans',sans-serif;outline:none;transition:.2s; }
      .form-group input:focus,.form-group select:focus,.form-group textarea:focus { border-color:var(--accent); }
      .form-group textarea { resize:vertical;min-height:70px; }
      .modal-footer { display:flex;justify-content:flex-end;gap:10px;margin-top:22px;padding-top:18px;border-top:1px solid var(--border); }

      /* REPORTS */
      .reports-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px; }
      .report-card { background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px;transition:.25s; }
      .report-card:hover { border-color:var(--accent);transform:translateY(-2px); }
      .report-icon { width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:rgba(201,168,76,.1);color:var(--accent);margin-bottom:14px; }
      .report-title { font-size:15px;font-weight:600;margin-bottom:6px; }
      .report-desc { font-size:12px;color:var(--muted);margin-bottom:16px;line-height:1.4; }
      .report-btn { width:100%;padding:8px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--accent);font-family:'DM Sans',sans-serif;transition:.2s; }
      .report-btn:hover { background:var(--surface2);border-color:var(--accent); }

      /* SETTINGS */
      .settings-input { width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:13px;color:var(--text);font-family:'DM Sans',sans-serif;outline:none; }
      .settings-label { font-size:13px;font-weight:600;color:var(--text);display:block;margin-bottom:8px; }

      /* TOAST */
      .toast { position:fixed;top:20px;right:20px;padding:16px 24px;color:white;border-radius:8px;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,.3);animation:slideIn .3s ease; }
      .toast.success { background:var(--green); }
      .toast.error { background:var(--red); }
      @keyframes slideIn { from{transform:translateX(400px);opacity:0} to{transform:translateX(0);opacity:1} }
      @keyframes slideOut { from{transform:translateX(0);opacity:1} to{transform:translateX(400px);opacity:0} }

      /* RESPONSIVE */
      @media(max-width:1024px){.stats-grid{grid-template-columns:repeat(2,1fr)}.qa-grid{grid-template-columns:repeat(2,1fr)}.row-grid{grid-template-columns:1fr}}
      @media(max-width:768px){.sidebar{width:200px}.main{margin-left:0}.topbar{padding:0 16px}.content{padding:16px}.search-box{width:auto}.stats-grid,.qa-grid,.authors-grid,.books-grid,.members-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }, []);
  return null;
};

// ============================================================
// API LAYER
// ============================================================
const API_BASE_URL = "http://localhost:8000/api";

const useApi = () => {
  const authToken = localStorage.getItem("token");

  const request = useCallback(async (endpoint, method = "GET", body = null) => {
    const headers = { "Content-Type": "application/json" };
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    const options = { method, headers };
    if (body && method !== "GET") options.body = JSON.stringify(body);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const data = await response.json();
      if (typeof data.success === "boolean" && !data.status)
        data.status = data.success ? "success" : "error";
      if (response.status === 401) { localStorage.removeItem("token"); window.location.reload(); return null; }
      return data;
    } catch (err) {
      console.error("API Error:", err);
      return { status: "error", message: "Network error" };
    }
  }, [authToken]);

  return { request };
};

// ============================================================
// TOAST CONTEXT
// ============================================================
const useToast = () => {
  const show = useCallback((message, type = "success") => {
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => { el.style.animation = "slideOut .3s ease"; setTimeout(() => el.remove(), 300); }, 3000);
  }, []);
  return { show };
};

// ============================================================
// SVG ICON SPRITE (hidden)
// ============================================================
const IconSprite = () => (
  <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
    <symbol id="ic-book" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></symbol>
    <symbol id="ic-home" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></symbol>
    <symbol id="ic-books" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></symbol>
    <symbol id="ic-users" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></symbol>
    <symbol id="ic-pen" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></symbol>
    <symbol id="ic-refresh" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></symbol>
    <symbol id="ic-money" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></symbol>
    <symbol id="ic-bookmark" viewBox="0 0 24 24"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></symbol>
    <symbol id="ic-chart" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></symbol>
    <symbol id="ic-bell" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></symbol>
    <symbol id="ic-settings" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></symbol>
    <symbol id="ic-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></symbol>
    <symbol id="ic-plus" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></symbol>
    <symbol id="ic-upload" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></symbol>
    <symbol id="ic-download" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></symbol>
    <symbol id="ic-user-plus" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></symbol>
    <symbol id="ic-edit" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></symbol>
    <symbol id="ic-alert" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></symbol>
    <symbol id="ic-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></symbol>
    <symbol id="ic-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></symbol>
    <symbol id="ic-return" viewBox="0 0 24 24"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></symbol>
    <symbol id="ic-layer" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></symbol>
    <symbol id="ic-package" viewBox="0 0 24 24"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></symbol>
    <symbol id="ic-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></symbol>
    <symbol id="ic-close" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></symbol>
    <symbol id="ic-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></symbol>
    <symbol id="ic-astronomy" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></symbol>
  </svg>
);

const Icon = ({ id, size = "" }) => (
  <svg className={`icon-svg${size ? " " + size : ""}`} viewBox="0 0 24 24">
    <use href={`#${id}`} />
  </svg>
);

// ============================================================
// MODAL COMPONENT
// ============================================================
const Modal = ({ id, title, open, onClose, children, footer }) => (
  <div className={`modal-overlay${open ? " open" : ""}`} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="modal">
      <div className="modal-hd">
        <h2>{title}</h2>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
      {children}
      {footer && <div className="modal-footer">{footer}</div>}
    </div>
  </div>
);

// ============================================================
// TOPBAR COMPONENT
// ============================================================
const Topbar = ({ title, showSearch, onSearch, unreadCount, onNotifClick, theme, onToggleTheme }) => (
  <div className="topbar">
    <span className="topbar-title">{title}</span>
    {showSearch && (
      <div className="search-box">
        <Icon id="ic-search" size="sm" />
        <input type="text" placeholder="Search..." onChange={e => onSearch && onSearch(e.target.value)} />
      </div>
    )}
    <div className="spacer" />
    <button className="topbar-btn notify-btn" style={{ position: "relative" }} onClick={onNotifClick}>
      <svg className="icon-svg" viewBox="0 0 24 24"><use href="#ic-bell" /></svg>
      {unreadCount > 0 && <span className="topbar-notif-count">{unreadCount}</span>}
    </button>
    <button className="theme-toggle-btn" onClick={onToggleTheme} title="Toggle theme">
      {theme === "dark"
        ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2m-4.34 5.66 1.41 1.41M4.93 4.93l1.41 1.41"/></svg>
        : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      }
    </button>
  </div>
);

// ============================================================
// SIDEBAR COMPONENT
// ============================================================
const Sidebar = ({ activePage, onNavigate, badges, currentUser }) => {
  const navItems = [
    { section: "Main" },
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "books", label: "Books", icon: "📖", badge: badges.books },
    { id: "members", label: "Members", icon: "👥" },
    { id: "authors", label: "Authors", icon: "✍️" },
    { section: "Transactions" },
    { id: "transactions", label: "Issue / Return", icon: "🔄" },
    { id: "fines", label: "Fines", icon: "💰", badge: badges.fines },
    { id: "reservations", label: "Reservations", icon: "🏷️" },
    { section: "Reports" },
    { id: "reports", label: "Reports", icon: "📊" },
    { id: "notifications", label: "Notifications", icon: "🔔", badge: badges.notifications },
    { section: "Settings" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={() => onNavigate("dashboard")}>
        <div className="sidebar-logo-icon">
          <svg className="icon-svg" style={{ color: "#fff" }} viewBox="0 0 24 24"><use href="#ic-books" /></svg>
        </div>
        <div className="sidebar-logo-text">
          <h1>LibraryOS</h1>
          <span>Management System</span>
        </div>
      </div>
      <nav className="nav">
        {navItems.map((item, i) =>
          item.section
            ? <div key={i} className="nav-section">{item.section}</div>
            : (
              <button
                key={item.id}
                className={`nav-item${activePage === item.id ? " active" : ""}`}
                onClick={() => onNavigate(item.id)}
              >
                <span>{item.icon}</span>
                {item.label}
                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
              </button>
            )
        )}
      </nav>
      <div className="sidebar-footer">
        <div className="admin-card">
          <div className="admin-avatar">
            {(currentUser?.first_name || "A").charAt(0)}
          </div>
          <div className="admin-info">
            <p>{currentUser ? `${currentUser.first_name} ${currentUser.last_name}`.trim() : "Admin"}</p>
            <span>{currentUser?.role || "Librarian"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

// ============================================================
// DASHBOARD PAGE
// ============================================================
const DashboardPage = ({ onNavigate, unreadCount, theme, onToggleTheme }) => {
  const { request } = useApi();
  const [stats, setStats] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [statsRes, txRes, notifRes] = await Promise.all([
        request("/books/dashboard/stats/"),
        request("/transactions/"),
        request("/notifications/"),
      ]);
      if (statsRes?.status === "success") {
        setStats(statsRes.data.stats || {});
        setMonthlyData(statsRes.data.monthly_borrowing || []);
      }
      if (txRes?.status === "success") {
        const arr = Array.isArray(txRes.data) ? txRes.data : (txRes.data.results || []);
        setRecentTx(arr.slice(0, 5));
      }
      if (notifRes?.status === "success") {
        const arr = Array.isArray(notifRes.data) ? notifRes.data : (notifRes.data.results || []);
        setNotifications(arr.slice(0, 4));
      }
    };
    load();
  }, []);

  const maxVal = Math.max(...monthlyData.map(d => d.issued || 0), ...monthlyData.map(d => d.returned || 0), 1);

  return (
    <div className="page-enter">
      <Topbar
        title="Dashboard"
        showSearch
        unreadCount={unreadCount}
        onNotifClick={() => onNavigate("notifications")}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
      <div className="content">
        {/* Stat Cards */}
        <div className="stats-grid">
          {[
            { color: "gold", icon: "📚", val: stats.total_books ?? 0, label: "Total Books", change: `${stats.available_books ?? 0} currently available`, dir: "up" },
            { color: "blue", icon: "👥", val: stats.total_members ?? 0, label: "Active Members", change: `${stats.total_members ?? 0} active members`, dir: "up" },
            { color: "green", icon: "🔄", val: stats.active_transactions ?? 0, label: "Books Issued", change: `${stats.overdue_books ?? 0} overdue currently`, dir: "down" },
            { color: "red", icon: "💰", val: `$${Number(stats.total_fines || 0).toFixed(2)}`, label: "Total Fines", change: `${stats.overdue_books ?? 0} overdue today`, dir: "up" },
          ].map((s, i) => (
            <div key={i} className={`stat-card ${s.color}`}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-val">{s.val}</div>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-change ${s.dir}`}>
                {s.dir === "up"
                  ? <svg className="icon-svg sm" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
                  : <svg className="icon-svg sm" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
                }
                {s.change}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="qa-grid">
          {[
            { icon: "📤", label: "Issue Book", page: "transactions" },
            { icon: "📥", label: "Return Book", page: "transactions" },
            { icon: "➕", label: "Add Member", page: "members" },
            { icon: "📝", label: "Add Book", page: "books" },
          ].map((qa, i) => (
            <button key={i} className="qa-btn" onClick={() => onNavigate(qa.page)}>
              <span className="qa-icon">{qa.icon}</span>
              <span>{qa.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Transactions + Notifications */}
        <div className="row-grid">
          <div className="panel">
            <div className="panel-hd">
              <h2>Recent Transactions</h2>
              <a onClick={() => onNavigate("transactions")}>View All →</a>
            </div>
            <table>
              <thead>
                <tr><th>Member</th><th>Book</th><th>Issued</th><th>Due Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentTx.length === 0
                  ? <tr><td colSpan={5} style={{ color: "var(--muted)" }}>No transactions yet</td></tr>
                  : recentTx.map((t, i) => (
                    <tr key={i}>
                      <td>{t.member_name}</td>
                      <td>{t.book_title}</td>
                      <td>{t.issue_date}</td>
                      <td>{t.due_date}</td>
                      <td>
                        <span className={`badge badge-${t.status === "returned" ? "green" : t.status === "overdue" ? "red" : "blue"}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          <div className="panel">
            <div className="panel-hd">
              <h2>🔔 Notifications</h2>
              <a onClick={() => onNavigate("notifications")}>See all</a>
            </div>
            <div className="notif-list">
              {notifications.map((n, i) => (
                <div key={i} className="notif-item">
                  <div className="notif-icon" style={{
                    background: n.notification_type === "overdue" ? "rgba(224,92,92,.12)" : "rgba(201,168,76,.12)",
                    color: n.notification_type === "overdue" ? "var(--red)" : "var(--accent)"
                  }}>
                    <Icon id={n.notification_type === "overdue" ? "ic-alert" : "ic-clock"} size="sm" />
                  </div>
                  <div>
                    <div className="ni-title">{n.title}</div>
                    <div className="ni-sub">{n.message}</div>
                    <div className="ni-time">{new Date(n.created_at).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart + Activity */}
        <div className="row-grid">
          <div className="panel">
            <div className="panel-hd"><h2>Monthly Borrowing Overview</h2></div>
            <div className="chart-bars">
              {monthlyData.map((d, i) => (
                <div key={i} className="bar-wrap" style={{ flexDirection: "column-reverse" }}>
                  <span className="bar-lbl">{d.month}</span>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", width: "100%" }}>
                    <div className="bar fill-gold" style={{ height: `${(d.issued / maxVal) * 72}px`, flex: 1 }} />
                    <div className="bar fill-blue" style={{ height: `${(d.returned / maxVal) * 72}px`, flex: 1 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              {[["var(--accent)", "Issued"], ["var(--blue)", "Returned"]].map(([c, l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-hd"><h2>Recent Activity</h2></div>
            <div className="activity-list">
              {recentTx.slice(0, 4).map((t, i) => (
                <div key={i} className="act-item">
                  <div className="act-icon" style={{
                    background: t.status === "returned" ? "rgba(62,207,142,.12)" : "rgba(92,157,224,.12)",
                    color: t.status === "returned" ? "var(--green)" : "var(--blue)"
                  }}>
                    <Icon id={t.status === "returned" ? "ic-return" : "ic-upload"} />
                  </div>
                  <div className="act-info">
                    <p>{t.status === "returned" ? "Book returned" : "Book issued"} by {t.member_name}</p>
                    <span>{t.book_title}</span>
                  </div>
                  <div className="act-time">{t.issue_date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// BOOKS PAGE
// ============================================================
const BooksPage = ({ unreadCount, onNotifClick, theme, onToggleTheme }) => {
  const { request } = useApi();
  const { show } = useToast();
  const [books, setBooks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", isbn: "", author: "", category: "", description: "", quantity: 1, published_year: "" });

  const load = useCallback(async (search = "") => {
    const res = await request(`/books/?search=${search}`);
    if (res?.status === "success") setBooks(Array.isArray(res.data) ? res.data : (res.data.results || []));
  }, []);

  useEffect(() => { load(); }, []);

  const openAdd = async () => {
    setEditingId(null);
    setForm({ title: "", isbn: "", author: "", category: "", description: "", quantity: 1, published_year: "" });
    const [aRes, cRes] = await Promise.all([request("/books/authors/"), request("/books/categories/")]);
    setAuthors(Array.isArray(aRes?.data) ? aRes.data : (aRes?.data?.results || []));
    setCategories(Array.isArray(cRes?.data) ? cRes.data : (cRes?.data?.results || []));
    setModalOpen(true);
  };

  const openEdit = async (id) => {
    const [bRes, aRes, cRes] = await Promise.all([request(`/books/${id}/`), request("/books/authors/"), request("/books/categories/")]);
    if (bRes?.status !== "success") return;
    const b = bRes.data;
    setEditingId(id);
    setForm({ title: b.title || "", isbn: b.isbn || "", author: b.author?.id || "", category: b.category?.id || "", description: b.description || "", quantity: b.quantity || 1, published_year: b.published_year || "" });
    setAuthors(Array.isArray(aRes?.data) ? aRes.data : (aRes?.data?.results || []));
    setCategories(Array.isArray(cRes?.data) ? cRes.data : (cRes?.data?.results || []));
    setModalOpen(true);
  };

  const submit = async () => {
    if (!form.title || !form.isbn || !form.author) { show("Title, ISBN and author are required", "error"); return; }
    const qty = Number(form.quantity);
    const payload = { ...form, author: Number(form.author), category: Number(form.category), quantity: qty, available_quantity: qty, published_year: form.published_year ? Number(form.published_year) : null };
    const endpoint = editingId ? `/books/${editingId}/` : "/books/";
    const res = await request(endpoint, editingId ? "PUT" : "POST", payload);
    if (res?.status === "success") { show(editingId ? "Book updated" : "Book created"); setModalOpen(false); load(); }
    else show(res?.message || "Could not save book", "error");
  };

  return (
    <div className="page-enter">
      <Topbar title="Books Management" showSearch onSearch={v => load(v)} unreadCount={unreadCount} onNotifClick={onNotifClick} theme={theme} onToggleTheme={onToggleTheme} />
      <div className="content">
        <div className="toolbar">
          <button className="btn btn-primary" onClick={openAdd}><Icon id="ic-plus" size="sm" /> Add Book</button>
          <select className="filter-select"><option>All Books</option><option>Available</option><option>Issued</option><option>Reserved</option></select>
          <div className="spacer" />
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{books.length} books</span>
        </div>
        <div className="books-grid">
          {books.length === 0
            ? <div style={{ color: "var(--muted)" }}>No books found</div>
            : books.map(book => (
              <div key={book.id} className="book-card">
                <div className="book-cover" style={{ fontSize: 40 }}>📖</div>
                <div className="book-card-body">
                  <h3>{book.title}</h3>
                  <div className="author">{book.author_name}</div>
                  <div className="meta">
                    <span className="isbn">ISBN: {book.isbn}</span>
                    <span className={`badge badge-${book.available_quantity > 0 ? "green" : "red"}`}>
                      {book.available_quantity > 0 ? "Available" : "Not Available"}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{book.available_quantity}/{book.quantity} available</div>
                  <div className="member-actions" style={{ marginTop: 10 }}>
                    <button className="sm-btn" onClick={() => alert(`Book: ${book.title}\nISBN: ${book.isbn}\nAvailable: ${book.available_quantity}/${book.quantity}`)}>View</button>
                    <button className="sm-btn" onClick={() => openEdit(book.id)}>Edit</button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <Modal title={editingId ? "Edit Book" : "Add New Book"} open={modalOpen} onClose={() => setModalOpen(false)}
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={submit}>Save Book</button></>}>
        <div className="form-grid">
          <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Book title" /></div>
          <div className="form-group"><label>Author</label><select value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}>{authors.map(a => <option key={a.id} value={a.id}>{a.full_name || `${a.first_name} ${a.last_name}`}</option>)}</select></div>
          <div className="form-group"><label>ISBN</label><input value={form.isbn} onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))} placeholder="ISBN" /></div>
          <div className="form-group"><label>Category</label><select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className="form-group full"><label>Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Book description…" /></div>
          <div className="form-group"><label>Quantity</label><input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} min="1" /></div>
          <div className="form-group"><label>Published Year</label><input type="number" value={form.published_year} onChange={e => setForm(f => ({ ...f, published_year: e.target.value }))} placeholder="2024" /></div>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// MEMBERS PAGE
// ============================================================
const MembersPage = ({ unreadCount, onNotifClick, theme, onToggleTheme }) => {
  const { request } = useApi();
  const { show } = useToast();
  const [members, setMembers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", member_type: "student", member_id: "" });

  const load = useCallback(async () => {
    const res = await request("/members/");
    if (res?.status === "success") setMembers(Array.isArray(res.data) ? res.data : (res.data.results || []));
  }, []);

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ first_name: "", last_name: "", email: "", phone: "", member_type: "student", member_id: "" });
    setModalOpen(true);
  };

  const openEdit = async (id) => {
    const res = await request(`/members/${id}/`);
    if (res?.status !== "success") return;
    const m = res.data;
    setEditingId(id);
    setForm({ first_name: m.first_name || "", last_name: m.last_name || "", email: m.email || "", phone: m.phone || "", member_type: m.member_type || "student", member_id: m.member_id || "" });
    setModalOpen(true);
  };

  const submit = async () => {
    if (!form.first_name || !form.last_name || !form.email || !form.member_id) { show("All required fields must be filled", "error"); return; }
    const endpoint = editingId ? `/members/${editingId}/` : "/members/";
    const res = await request(endpoint, editingId ? "PUT" : "POST", form);
    if (res?.status === "success") { show(editingId ? "Member updated" : "Member created"); setModalOpen(false); load(); }
    else show(res?.message || "Could not save member", "error");
  };

  const blockMember = async (id) => {
    if (!confirm("Block this member?")) return;
    const res = await request(`/members/${id}/block/`, "POST");
    if (res?.status === "success") { show("Member blocked"); load(); }
  };

  const unblockMember = async (id) => {
    const res = await request(`/members/${id}/unblock/`, "POST");
    if (res?.status === "success") { show("Member unblocked"); load(); }
  };

  return (
    <div className="page-enter">
      <Topbar title="Members Management" showSearch unreadCount={unreadCount} onNotifClick={onNotifClick} theme={theme} onToggleTheme={onToggleTheme} />
      <div className="content">
        <div className="toolbar">
          <button className="btn btn-primary" onClick={openAdd}><Icon id="ic-plus" size="sm" /> Add Member</button>
          <select className="filter-select"><option>All Members</option><option>Students</option><option>Faculty</option><option>Staff</option></select>
          <div className="spacer" />
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{members.length} members</span>
        </div>
        <div className="members-grid">
          {members.map(m => (
            <div key={m.id} className="member-card">
              <div className="member-hd">
                <div className="member-avatar" style={{ background: "#5c9de0" }}>{(m.first_name || m.full_name || "M").charAt(0)}</div>
                <div><div className="member-name">{m.full_name}</div><div className="member-role">{m.member_type}</div></div>
              </div>
              <div className="member-stats">
                <div className="mstat"><div className="val" style={{ color: "var(--blue)" }}>{m.active_borrowings || 0}</div><div className="lbl">Books Issued</div></div>
                <div className="mstat"><div className="val" style={{ color: m.unpaid_fines_amount > 0 ? "var(--red)" : "var(--accent)" }}>${(m.unpaid_fines_amount || 0).toFixed(2)}</div><div className="lbl">Outstanding Fines</div></div>
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}>📧 {m.email}</div>
              <div className="member-actions">
                <button className="sm-btn" onClick={() => openEdit(m.id)}>Edit</button>
                <button className="sm-btn" onClick={async () => { const res = await request(`/members/${m.id}/history/`); if (res?.status === "success") alert(res.data.map(t => `${t.book_title} - ${t.status}`).join("\n") || "No history"); }}>History</button>
                {m.is_blocked
                  ? <button className="sm-btn" onClick={() => unblockMember(m.id)}>Unblock</button>
                  : <button className="sm-btn" onClick={() => blockMember(m.id)}>Block</button>
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal title={editingId ? "Edit Member" : "Add New Member"} open={modalOpen} onClose={() => setModalOpen(false)}
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={submit}>Save Member</button></>}>
        <div className="form-grid">
          <div className="form-group"><label>First Name</label><input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} placeholder="First name" /></div>
          <div className="form-group"><label>Last Name</label><input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} placeholder="Last name" /></div>
          <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" /></div>
          <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+880..." /></div>
          <div className="form-group"><label>Member Type</label><select value={form.member_type} onChange={e => setForm(f => ({ ...f, member_type: e.target.value }))}><option value="student">Student</option><option value="faculty">Faculty</option><option value="staff">Staff</option></select></div>
          <div className="form-group"><label>ID Number</label><input value={form.member_id} onChange={e => setForm(f => ({ ...f, member_id: e.target.value }))} placeholder="STU-1001" /></div>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// AUTHORS PAGE
// ============================================================
const AuthorsPage = ({ unreadCount, onNotifClick, theme, onToggleTheme }) => {
  const { request } = useApi();
  const { show } = useToast();
  const [authors, setAuthors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", nationality: "", genre: "Computer Science", biography: "", books_published: 0, birth_year: "" });

  useEffect(() => {
    request("/books/authors/").then(res => {
      if (res?.status === "success") setAuthors(Array.isArray(res.data) ? res.data : (res.data.results || []));
    });
  }, []);

  return (
    <div className="page-enter">
      <Topbar title="Author Management" showSearch unreadCount={unreadCount} onNotifClick={onNotifClick} theme={theme} onToggleTheme={onToggleTheme} />
      <div className="content">
        <div className="toolbar">
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}><Icon id="ic-plus" size="sm" /> Add Author</button>
          <div className="spacer" />
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{authors.length} authors</span>
        </div>
        <div className="authors-grid">
          {authors.length === 0
            ? <div style={{ color: "var(--muted)" }}>No authors found</div>
            : authors.map(a => (
              <div key={a.id} className="author-card">
                <div className="author-hd">
                  <div className="author-avatar" style={{ background: "#5c9de0" }}>{(a.first_name || "A").charAt(0)}</div>
                  <div>
                    <div className="author-name">{a.full_name || `${a.first_name || ""} ${a.last_name || ""}`.trim()}</div>
                    <div className="author-nationality">🌍 {a.nationality || "Unknown"}</div>
                  </div>
                </div>
                <div className="author-stats">
                  <div className="astat"><div className="val" style={{ color: "var(--blue)" }}>{a.books_count || 0}</div><div className="lbl">Books</div></div>
                  <div className="astat"><div className="val" style={{ color: "var(--accent)" }}>{a.birth_year || "-"}</div><div className="lbl">Birth Year</div></div>
                </div>
                <div className="author-genre">📚 {a.genre || "General"}</div>
                <div className="author-actions"><button className="sm-btn" onClick={() => setModalOpen(true)}>Edit</button></div>
              </div>
            ))
          }
        </div>
      </div>

      <Modal title="Add New Author" open={modalOpen} onClose={() => setModalOpen(false)}
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary">Save Author</button></>}>
        <div className="form-grid">
          <div className="form-group"><label>First Name</label><input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} placeholder="First name" /></div>
          <div className="form-group"><label>Last Name</label><input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} placeholder="Last name" /></div>
          <div className="form-group"><label>Nationality</label><input value={form.nationality} onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))} placeholder="e.g. American" /></div>
          <div className="form-group"><label>Genre</label><select value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}><option>Computer Science</option><option>Fiction</option><option>Science</option><option>Mathematics</option></select></div>
          <div className="form-group full"><label>Biography</label><textarea value={form.biography} onChange={e => setForm(f => ({ ...f, biography: e.target.value }))} placeholder="Brief author bio…" /></div>
          <div className="form-group"><label>Books Published</label><input type="number" value={form.books_published} onChange={e => setForm(f => ({ ...f, books_published: e.target.value }))} min="0" /></div>
          <div className="form-group"><label>Birth Year</label><input type="number" value={form.birth_year} onChange={e => setForm(f => ({ ...f, birth_year: e.target.value }))} placeholder="1960" /></div>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// TRANSACTIONS PAGE
// ============================================================
const TransactionsPage = ({ unreadCount, onNotifClick, theme, onToggleTheme }) => {
  const { request } = useApi();
  const { show } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    const res = await request("/transactions/");
    if (res?.status === "success") setTransactions(Array.isArray(res.data) ? res.data : (res.data.results || []));
  }, []);

  useEffect(() => { load(); }, []);

  const returnBook = async (id) => {
    if (!confirm("Return this book?")) return;
    const res = await request(`/transactions/${id}/return/`, "POST");
    if (res?.status === "success") {
      show("Book returned successfully");
      if (res.data.fine_created) show(`Fine created: $${res.data.fine_amount}`, "error");
      load();
    }
  };

  return (
    <div className="page-enter">
      <Topbar title="Issue / Return Books" showSearch unreadCount={unreadCount} onNotifClick={onNotifClick} theme={theme} onToggleTheme={onToggleTheme} />
      <div className="content">
        <div className="toolbar">
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}><Icon id="ic-plus" size="sm" /> New Transaction</button>
          <select className="filter-select"><option>All Transactions</option><option>Issued</option><option>Returned</option><option>Overdue</option></select>
          <div className="spacer" />
          <button className="btn btn-outline"><Icon id="ic-download" size="sm" /> Export</button>
        </div>
        <div className="panel">
          <div className="panel-hd"><h2>Transaction Records</h2></div>
          <table>
            <thead><tr><th>Member</th><th>Book</th><th>Issued</th><th>Due Date</th><th>Returned</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {transactions.length === 0
                ? <tr><td colSpan={7} style={{ color: "var(--muted)" }}>No transactions</td></tr>
                : transactions.map(t => (
                  <tr key={t.id}>
                    <td><div style={{ fontWeight: 600 }}>{t.member_name}</div></td>
                    <td>{t.book_title}</td>
                    <td>{t.issue_date}</td>
                    <td>{t.due_date}</td>
                    <td>{t.return_date || "—"}</td>
                    <td><span className={`badge badge-${t.status === "returned" ? "green" : t.status === "overdue" ? "red" : "blue"}`}>{t.status}</span></td>
                    <td>
                      {(t.status === "issued" || t.status === "overdue")
                        ? <button className="btn btn-outline" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => returnBook(t.id)}>Return</button>
                        : <button className="icon-btn"><Icon id="ic-edit" size="sm" /></button>
                      }
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <Modal title="New Transaction" open={modalOpen} onClose={() => setModalOpen(false)}
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary">Save Transaction</button></>}>
        <div className="form-grid">
          <div className="form-group"><label>Member</label><input type="text" placeholder="Select member" /></div>
          <div className="form-group"><label>Book</label><input type="text" placeholder="Select book" /></div>
          <div className="form-group"><label>Issue Date</label><input type="date" /></div>
          <div className="form-group"><label>Due Date</label><input type="date" /></div>
          <div className="form-group full"><label>Notes</label><textarea placeholder="Additional notes…" /></div>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// FINES PAGE
// ============================================================
const FinesPage = ({ unreadCount, onNotifClick, theme, onToggleTheme }) => {
  const { request } = useApi();
  const { show } = useToast();
  const [fines, setFines] = useState([]);
  const [fineRate, setFineRate] = useState(0);

  const load = useCallback(async () => {
    const [res, settingsRes] = await Promise.all([request("/fines/"), request("/fines/settings/")]);
    if (res?.status === "success") setFines(Array.isArray(res.data) ? res.data : (res.data.results || []));
    if (settingsRes?.status === "success") setFineRate(settingsRes.data.fine_per_day || 0);
  }, []);

  useEffect(() => { load(); }, []);

  const collectFine = async (id) => {
    if (!confirm("Collect this fine?")) return;
    const res = await request(`/fines/${id}/collect/`, "POST");
    if (res?.status === "success") { show("Fine collected"); load(); }
  };

  const waiveFine = async (id) => {
    if (!confirm("Waive this fine?")) return;
    const res = await request(`/fines/${id}/waive/`, "POST");
    if (res?.status === "success") { show("Fine waived"); load(); }
  };

  const unpaid = fines.filter(f => f.status === "unpaid");
  const paid = fines.filter(f => f.status === "paid");
  const unpaidTotal = unpaid.reduce((s, f) => s + Number(f.amount || 0), 0);
  const paidTotal = paid.reduce((s, f) => s + Number(f.amount || 0), 0);
  const membersWithUnpaid = new Set(unpaid.map(f => f.member)).size;

  return (
    <div className="page-enter">
      <Topbar title="Fine Management" unreadCount={unreadCount} onNotifClick={onNotifClick} theme={theme} onToggleTheme={onToggleTheme} />
      <div className="content">
        <div className="stats-grid">
          {[
            { icon: "💰", val: `$${unpaidTotal.toFixed(2)}`, label: "Unpaid Fines", color: "var(--red)" },
            { icon: "✅", val: `$${paidTotal.toFixed(2)}`, label: "Collected This Year", color: "var(--green)" },
            { icon: "⚠️", val: membersWithUnpaid, label: "Members with Unpaid Fines", color: "var(--accent)" },
            { icon: "📋", val: `$${Number(fineRate).toFixed(2)}`, label: "Fine Rate / Day", color: "var(--text)" },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="overdue-alert">
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div><strong style={{ color: "var(--red)" }}>{membersWithUnpaid} members</strong> have unpaid fines.</div>
        </div>
        <div className="toolbar">
          <select className="filter-select"><option>All Fines</option><option>Unpaid</option><option>Paid</option><option>Waived</option></select>
          <select className="filter-select"><option>All Members</option><option>Students</option><option>Faculty</option></select>
          <div className="spacer" />
          <button className="btn btn-outline"><Icon id="ic-download" size="sm" /> Export</button>
        </div>
        <div className="panel">
          <div className="panel-hd"><h2>Fine Records</h2></div>
          <table>
            <thead><tr><th>Member</th><th>Book</th><th>Due Date</th><th>Days Overdue</th><th>Fine Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {fines.length === 0
                ? <tr><td colSpan={7} style={{ color: "var(--muted)" }}>No fine records</td></tr>
                : fines.map(f => (
                  <tr key={f.id}>
                    <td><div style={{ fontWeight: 600 }}>{f.member_name}</div></td>
                    <td>{f.book_title || "—"}</td>
                    <td>{f.created_at ? new Date(f.created_at).toLocaleDateString() : "—"}</td>
                    <td style={{ color: f.days_overdue > 0 ? "var(--red)" : "var(--muted)", fontWeight: 600 }}>{Math.max(0, f.days_overdue || 0)} day(s)</td>
                    <td style={{ fontWeight: 700 }}>${Number(f.amount || 0).toFixed(2)}</td>
                    <td><span className={`badge badge-${f.status === "paid" ? "green" : f.status === "waived" ? "blue" : "red"}`}>{f.status}</span></td>
                    <td>
                      {f.status === "unpaid" && (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="td-btn pay" onClick={() => collectFine(f.id)}>Collect</button>
                          <button className="td-btn waive" onClick={() => waiveFine(f.id)}>Waive</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// RESERVATIONS PAGE
// ============================================================
const ReservationsPage = ({ unreadCount, onNotifClick, theme, onToggleTheme }) => {
  const { request } = useApi();
  const { show } = useToast();
  const [reservations, setReservations] = useState([]);

  const load = useCallback(async () => {
    const res = await request("/transactions/reservations/");
    if (res?.status === "success") setReservations(Array.isArray(res.data) ? res.data : (res.data.results || []));
  }, []);

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    const res = await request(`/transactions/reservations/${id}/approve/`, "POST");
    if (res?.status === "success") { show("Reservation approved"); load(); }
  };

  const cancel = async (id) => {
    const res = await request(`/transactions/reservations/${id}/cancel/`, "POST");
    if (res?.status === "success") { show("Reservation cancelled"); load(); }
  };

  const badgeColor = status => ({ ready: "green", cancelled: "red", expired: "red" }[status] || "gold");

  return (
    <div className="page-enter">
      <Topbar title="Reservations" unreadCount={unreadCount} onNotifClick={onNotifClick} theme={theme} onToggleTheme={onToggleTheme} />
      <div className="content">
        <div className="toolbar">
          <select className="filter-select"><option>All Reservations</option><option>Pending</option><option>Ready</option><option>Expired</option></select>
          <div className="spacer" />
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{reservations.length} active reservations</span>
        </div>
        <div className="reserv-grid">
          {reservations.map(res => (
            <div key={res.id} className={`reserv-card ${res.status}`}>
              <div className="rc-hd">
                <div className="rc-icon"><span style={{ fontSize: 24 }}>📚</span></div>
                <div><div className="rc-title">{res.book_title}</div><div className="rc-author">Reservation</div></div>
                <div className="rc-badge"><span className={`badge badge-${badgeColor(res.status)}`}>{res.status}</span></div>
              </div>
              <div className="rc-info">
                <div className="rc-info-item"><div className="lbl">Reserved By</div><div className="val">{res.member_name}</div></div>
                <div className="rc-info-item"><div className="lbl">Reserved On</div><div className="val">{res.reserved_on}</div></div>
                <div className="rc-info-item"><div className="lbl">Expires</div><div className="val" style={{ color: "var(--accent)" }}>{res.expires_on}</div></div>
              </div>
              {res.status === "pending" && (
                <div className="rc-actions">
                  <button className="sm-btn approve" onClick={() => approve(res.id)}>Approve & Issue</button>
                  <button className="sm-btn cancel" onClick={() => cancel(res.id)}>Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// REPORTS PAGE
// ============================================================
const ReportsPage = ({ unreadCount, onNotifClick, theme, onToggleTheme }) => {
  const { request } = useApi();
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    Promise.all([
      request("/books/reports/inventory/"),
      request("/books/reports/circulation/"),
      request("/books/reports/fines/"),
      request("/books/reports/overdue/"),
    ]).then(([inv, circ, fines, overdue]) => {
      setReportData({ inventory: inv?.data, circulation: circ?.data, fines: fines?.data, overdue: overdue?.data });
    });
  }, []);

  const reports = [
    { icon: <Icon id="ic-package" size="xl" />, title: "Inventory Report", desc: `Total books: ${reportData.inventory?.total_books ?? "—"}, Available: ${reportData.inventory?.available_quantity ?? "—"}` },
    { icon: <Icon id="ic-users" size="xl" />, title: "Member Report", desc: "Analyze member activity, registration trends, and membership statistics." },
    { icon: <Icon id="ic-refresh" size="xl" />, title: "Circulation Report", desc: `Issued (30d): ${reportData.circulation?.total_issued ?? "—"}, Returned: ${reportData.circulation?.total_returned ?? "—"}` },
    { icon: <Icon id="ic-money" size="xl" />, title: "Fine Report", desc: `Unpaid: $${(reportData.fines?.total_unpaid ?? 0).toFixed ? Number(reportData.fines?.total_unpaid ?? 0).toFixed(2) : "—"}, Members with fines: ${reportData.fines?.members_with_fines ?? "—"}` },
    { icon: <Icon id="ic-chart" size="xl" />, title: "Statistics Report", desc: "View comprehensive statistics and analytics of library operations." },
    { icon: <Icon id="ic-alert" size="xl" />, title: "Overdue Report", desc: `Total overdue items: ${reportData.overdue?.total_overdue ?? "—"}` },
  ];

  return (
    <div className="page-enter">
      <Topbar title="Reports" unreadCount={unreadCount} onNotifClick={onNotifClick} theme={theme} onToggleTheme={onToggleTheme} />
      <div className="content">
        <div className="reports-grid">
          {reports.map((r, i) => (
            <div key={i} className="report-card">
              <div className="report-icon">{r.icon}</div>
              <div className="report-title">{r.title}</div>
              <div className="report-desc">{r.desc}</div>
              <button className="report-btn">Generate Report</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// NOTIFICATIONS PAGE
// ============================================================
const NotificationsPage = ({ unreadCount, onNotifClick, theme, onToggleTheme, onBadgeUpdate }) => {
  const { request } = useApi();
  const { show } = useToast();
  const [notifications, setNotifications] = useState([]);

  const load = useCallback(async () => {
    const res = await request("/notifications/");
    if (res?.status === "success") {
      const arr = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setNotifications(arr);
      onBadgeUpdate(arr.filter(n => !n.is_read).length);
    }
  }, []);

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await request(`/notifications/${id}/read/`, "POST");
    load();
  };

  const markAllRead = async () => {
    await request("/notifications/mark-all-read/", "POST");
    show("All notifications marked as read");
    load();
  };

  return (
    <div className="page-enter">
      <Topbar title="Notifications" unreadCount={unreadCount} onNotifClick={onNotifClick} theme={theme} onToggleTheme={onToggleTheme} />
      <div className="content">
        <div className="toolbar">
          <select className="filter-select"><option>All Notifications</option><option>Unread</option><option>Read</option></select>
          <select className="filter-select"><option>All Types</option><option>Overdue</option><option>Member</option><option>Book</option><option>Fine</option></select>
          <div className="spacer" />
          <button className="btn btn-outline" onClick={markAllRead}>Mark All Read</button>
        </div>
        <div className="panel">
          <div className="notif-list">
            {notifications.length === 0
              ? <div style={{ color: "var(--muted)" }}>No notifications</div>
              : notifications.map(n => (
                <div key={n.id} className="notif-item" style={{ borderLeft: `3px solid ${n.is_read ? "var(--border)" : "var(--accent)"}` }}>
                  <div className="notif-icon" style={{
                    background: n.notification_type === "overdue" ? "rgba(224,92,92,.12)" : "rgba(201,168,76,.12)",
                    color: n.notification_type === "overdue" ? "var(--red)" : "var(--accent)"
                  }}>
                    <Icon id={n.notification_type === "overdue" ? "ic-alert" : "ic-clock"} size="sm" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="ni-title"><strong>{n.title}</strong></div>
                    <div className="ni-sub">{n.message}</div>
                    <div className="ni-time">{new Date(n.created_at).toLocaleString()}</div>
                  </div>
                  {!n.is_read && <button className="sm-btn" style={{ flex: "none", whiteSpace: "nowrap" }} onClick={() => markRead(n.id)}>Mark Read</button>}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SETTINGS PAGE
// ============================================================
const SettingsPage = ({ unreadCount, onNotifClick, theme, onToggleTheme }) => {
  const { show } = useToast();
  return (
    <div className="page-enter">
      <Topbar title="Settings" unreadCount={unreadCount} onNotifClick={onNotifClick} theme={theme} onToggleTheme={onToggleTheme} />
      <div className="content">
        <div className="panel" style={{ maxWidth: 600 }}>
          <div className="panel-hd"><h2>Library Settings</h2></div>
          <div style={{ padding: "20px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{ marginBottom: 16 }}>
              <label className="settings-label">Library Name</label>
              <input type="text" className="settings-input" defaultValue="LibraryOS" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="settings-label">Book Borrowing Duration (Days)</label>
              <input type="number" className="settings-input" defaultValue="14" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="settings-label">Fine Per Day (৳)</label>
              <input type="number" className="settings-input" defaultValue="10" />
            </div>
          </div>
          <div style={{ padding: "20px 0", textAlign: "right" }}>
            <button className="btn btn-primary" onClick={() => show("Settings saved")}><Icon id="ic-check" size="sm" /> Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// LOGIN SCREEN
// ============================================================
const LoginScreen = ({ onLogin }) => {
  const { request } = useApi();
  const { show } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { show("Enter email and password", "error"); return; }
    setLoading(true);
    const result = await request("/auth/login/", "POST", { email, password });
    setLoading(false);
    if (result?.status === "success") {
      const tokenData = result.data?.tokens || result.data;
      const token = tokenData?.access;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", tokenData.refresh);
        onLogin();
      } else show("Login failed", "error");
    } else show("Login failed", "error");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 40, width: 400, maxWidth: "95vw" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, var(--accent), #a07830)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg className="icon-svg" style={{ width: 28, height: 28, color: "#fff" }} viewBox="0 0 24 24"><use href="#ic-books" /></svg>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "var(--accent)" }}>LibraryOS</h1>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Sign in to continue</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="admin@library.com" /></div>
          <div className="form-group"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="••••••••" /></div>
          <button className="btn btn-primary" style={{ marginTop: 8, justifyContent: "center" }} onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ROOT APP COMPONENT
// ============================================================
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [activePage, setActivePage] = useState("dashboard");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [badges, setBadges] = useState({ books: 0, fines: 0, notifications: 0 });
  const [currentUser, setCurrentUser] = useState(null);
  const { request } = useApi();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!isLoggedIn) return;
    request("/auth/profile/").then(res => {
      if (res?.status === "success") setCurrentUser(res.data);
    });
    // WebSocket for notifications
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    let ws;
    try {
      ws = new WebSocket(`${protocol}://localhost:8000/ws/notifications/`);
      ws.onmessage = (e) => {
        const payload = JSON.parse(e.data || "{}");
        if (payload.type === "notification_snapshot") {
          setBadges(b => ({ ...b, notifications: payload.unread_count || 0 }));
        }
      };
    } catch {}
    return () => ws?.close();
  }, [isLoggedIn]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const topbarProps = {
    unreadCount: badges.notifications,
    onNotifClick: () => setActivePage("notifications"),
    theme,
    onToggleTheme: toggleTheme,
  };

  if (!isLoggedIn) return (
    <>
      <GlobalStyles />
      <IconSprite />
      <LoginScreen onLogin={() => setIsLoggedIn(true)} />
    </>
  );

  const pages = {
    dashboard: <DashboardPage onNavigate={setActivePage} {...topbarProps} />,
    books: <BooksPage {...topbarProps} />,
    members: <MembersPage {...topbarProps} />,
    authors: <AuthorsPage {...topbarProps} />,
    transactions: <TransactionsPage {...topbarProps} />,
    fines: <FinesPage {...topbarProps} />,
    reservations: <ReservationsPage {...topbarProps} />,
    reports: <ReportsPage {...topbarProps} />,
    notifications: <NotificationsPage {...topbarProps} onBadgeUpdate={count => setBadges(b => ({ ...b, notifications: count }))} />,
    settings: <SettingsPage {...topbarProps} />,
  };

  return (
    <>
      <GlobalStyles />
      <IconSprite />
      <Sidebar activePage={activePage} onNavigate={setActivePage} badges={badges} currentUser={currentUser} />
      <main className="main">
        {pages[activePage] || pages.dashboard}
      </main>
    </>
  );
}