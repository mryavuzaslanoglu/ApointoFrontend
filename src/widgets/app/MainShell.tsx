import { NavLink, Outlet } from "react-router-dom";
import { useAuthActions } from "@/features/auth/model/useAuthActions";
import { useAuthStore } from "@/entities/auth/model/authStore";

export function MainShell() {
  const { logout } = useAuthActions();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/" className="logo">
          Apointo
        </NavLink>
        <nav className="app-nav">
          <NavLink to="/" end>
            Gösterge Paneli
          </NavLink>
          <NavLink to="/business">İşletme Ayarları</NavLink>
          <NavLink to="/staff">Personeller</NavLink>
          <NavLink to="/services">Hizmetler</NavLink>
        </nav>
        <div className="spacer" />
        {user ? (
          <div className="user-info">
            <span>{user.fullName || user.email}</span>
            <button type="button" onClick={logout} className="link-button">
              Çıkış Yap
            </button>
          </div>
        ) : null}
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
