// ─── Toast ─────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  let c = document.getElementById('toast-container');
  if (!c) { c = document.createElement('div'); c.id = 'toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
window.showToast = showToast;

// ─── Sidebar builder ───────────────────────────────────────
function buildSidebar(activePage) {
  const user = window.auth.getUser();
  if (!user) return '';
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const adminLink = user.role === 'admin'
    ? `<a href="admin.html" class="nav-item ${activePage === 'admin' ? 'active' : ''}"><i class="fa-solid fa-chart-bar"></i> Admin Panel</a>`
    : '';
  return `
<aside class="sidebar" id="sidebar">
  <div class="sidebar-logo">
    <div class="logo-text"><span class="logo-icon">✈️</span> Traveloop</div>
  </div>
  <nav class="sidebar-nav">
    <div class="nav-section">Main</div>
    <a href="dashboard.html"          class="nav-item ${activePage==='dashboard'?'active':''}"><i class="fa-solid fa-house"></i> Dashboard</a>
    <a href="my-trips.html"           class="nav-item ${activePage==='trips'?'active':''}"><i class="fa-solid fa-suitcase"></i> My Trips</a>
    <a href="create-trip.html"        class="nav-item ${activePage==='create'?'active':''}"><i class="fa-solid fa-plus"></i> Create Trip</a>
    <div class="nav-section">Explore</div>
    <a href="city-search.html"        class="nav-item ${activePage==='cities'?'active':''}"><i class="fa-solid fa-city"></i> City Search</a>
    <a href="activity-search.html"    class="nav-item ${activePage==='activities'?'active':''}"><i class="fa-solid fa-compass"></i> Activities</a>
    <div class="nav-section">Tools</div>
    <a href="budget.html"             class="nav-item ${activePage==='budget'?'active':''}"><i class="fa-solid fa-wallet"></i> Budget</a>
    <a href="packing.html"            class="nav-item ${activePage==='packing'?'active':''}"><i class="fa-solid fa-box"></i> Packing List</a>
    <a href="notes.html"              class="nav-item ${activePage==='notes'?'active':''}"><i class="fa-solid fa-note-sticky"></i> Notes</a>
    <div class="nav-section">Account</div>
    <a href="profile.html"            class="nav-item ${activePage==='profile'?'active':''}"><i class="fa-solid fa-user"></i> Profile</a>
    ${adminLink}
  </nav>
  <div class="sidebar-footer">
    <div class="user-card">
      <div class="avatar">${initials}</div>
      <div>
        <div class="user-name">${user.name}</div>
        <div class="user-role">${user.role === 'admin' ? '⭐ Admin' : 'Traveler'}</div>
      </div>
      <button onclick="auth.logout()" class="btn btn-ghost btn-icon btn-sm" title="Logout" style="margin-left:auto">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </div>
  </div>
</aside>`;
}
window.buildSidebar = buildSidebar;

// ─── URL params helper ─────────────────────────────────────
function getParam(key) { return new URLSearchParams(window.location.search).get(key); }
window.getParam = getParam;

// ─── Format date ───────────────────────────────────────────
function fmtDate(d) { if (!d) return '—'; return new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }); }
window.fmtDate = fmtDate;

// ─── Format currency ───────────────────────────────────────
function fmtMoney(n) { return '₹' + parseFloat(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
window.fmtMoney = fmtMoney;
