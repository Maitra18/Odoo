const auth = {
  getToken: () => localStorage.getItem('traveloop_token'),
  getUser: () => JSON.parse(localStorage.getItem('traveloop_user') || 'null'),
  isLoggedIn: () => !!localStorage.getItem('traveloop_token'),
  login(token, user) {
    localStorage.setItem('traveloop_token', token);
    localStorage.setItem('traveloop_user', JSON.stringify(user));
  },
  logout() {
    localStorage.removeItem('traveloop_token');
    localStorage.removeItem('traveloop_user');
    window.location.href = '/index.html';
  },
  requireAuth() {
    if (!this.isLoggedIn()) { window.location.href = '/index.html'; return false; }
    return true;
  },
  requireAdmin() {
    const user = this.getUser();
    if (!user || user.role !== 'admin') { window.location.href = '/dashboard.html'; return false; }
    return true;
  },
};
window.auth = auth;
