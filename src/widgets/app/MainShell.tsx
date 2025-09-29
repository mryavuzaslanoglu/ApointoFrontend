import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";
import {
  LayoutDashboard,
  Building2,
  Users2,
  Sparkles,
  Moon,
  Sun,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAuthActions } from "@/features/auth/model/useAuthActions";
import { useAuthStore } from "@/entities/auth/model/authStore";

const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    label: "Gösterge Paneli",
    description: "Genel durum, özet metrikler ve hızlı bağlantılar",
    icon: LayoutDashboard,
    end: true,
    roles: ["Admin"],
  },
  {
    to: "/business",
    label: "İşletme Ayarları",
    description: "Kimlik bilgileri, iletişim ve çalışma düzeni",
    icon: Building2,
    roles: ["Admin"],
  },
  {
    to: "/staff",
    label: "Personeller",
    description: "Ekip üyeleri ve rollerinizi yönetin",
    icon: Users2,
    roles: ["Admin"],
  },
  {
    to: "/services",
    label: "Hizmetler",
    description: "Hizmet kartları, süreler ve fiyatlar",
    icon: Sparkles,
    roles: ["Admin"],
  },
];

const CUSTOMER_NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    label: "Ana Sayfa",
    description: "Randevu alma ve genel bilgiler",
    icon: LayoutDashboard,
    end: true,
    roles: ["Customer"],
  },
  {
    to: "/book-appointment",
    label: "Randevu Al",
    description: "Yeni randevu oluştur",
    icon: Sparkles,
    roles: ["Customer"],
  },
  {
    to: "/appointments",
    label: "Randevularım",
    description: "Mevcut ve geçmiş randevularım",
    icon: Users2,
    roles: ["Customer"],
  },
];

type NavItem = {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
  end?: boolean;
  roles: string[];
};

export function MainShell() {
  const { logout } = useAuthActions();
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const stored = localStorage.getItem("theme");
    if (stored) {
      return stored === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Get navigation items based on user role
  const navItems = useMemo(() => {
    if (!user?.roles) return [];

    const userRoles = user.roles;
    const isAdmin = userRoles.includes('Admin');
    const isCustomer = userRoles.includes('Customer');

    if (isAdmin) {
      return ADMIN_NAV_ITEMS;
    } else if (isCustomer) {
      return CUSTOMER_NAV_ITEMS;
    }

    return [];
  }, [user?.roles]);

  const activeNav = useMemo(() => {
    const current = navItems.find((item) =>
      item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
    );
    return current ?? navItems[0];
  }, [location.pathname, navItems]);

  const displayName = useMemo(() => {
    if (!user) {
      return "";
    }

    if (user.fullName && user.fullName.trim().length > 0) {
      return user.fullName.trim();
    }

    if (user.email) {
      return user.email.split("@")[0] ?? user.email;
    }

    return "";
  }, [user]);

  const initials = useMemo(() => (displayName ? createInitials(displayName) : "AP"), [displayName]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className={clsx("app-shell", isSidebarOpen && "sidebar-open")}> 
      <aside className="app-sidebar" data-state={isSidebarOpen ? "open" : "closed"}>
        <div className="sidebar-brand">
          <span className="brand-logo" aria-hidden="true">
            <span className="brand-mark" />
            Apointo
          </span>
          <p className="brand-subtitle">
            {user?.roles?.includes('Admin')
              ? 'Randevu yönetim kontrol paneli'
              : 'Randevu sistemi'
            }
          </p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => clsx("sidebar-link", isActive && "is-active")}
              >
                <Icon className="sidebar-link-icon" aria-hidden="true" size={18} />
                <div className="sidebar-link-text">
                  <span>{item.label}</span>
                  <small>{item.description}</small>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {user ? (
          <button type="button" className="sidebar-logout" onClick={logout}>
            Oturumu Kapat
          </button>
        ) : null}
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <button
            type="button"
            className="sidebar-trigger"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label={isSidebarOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            {isSidebarOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
          </button>

          <div className="topbar-heading">
            <span className="topbar-eyebrow">{activeNav.label}</span>
            <p className="topbar-subtitle">{activeNav.description}</p>
          </div>

          <div className="topbar-spacer" />

          <button
            type="button"
            onClick={toggleTheme}
            className="icon-button"
            title={isDark ? "Açık temaya geç" : "Karanlık temaya geç"}
            aria-label={isDark ? "Açık temaya geç" : "Karanlık temaya geç"}
          >
            {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          </button>

          {user ? (
            <div className="user-chip">
              <div className="user-avatar" aria-hidden="true">
                {initials}
              </div>
              <div className="user-meta">
                <span className="user-name">{user.fullName ?? user.email}</span>
                <button type="button" className="user-action" onClick={logout}>
                  Çıkış yap
                </button>
              </div>
            </div>
          ) : null}
        </header>

        <main className="app-content">
          <div className="page-stack">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function createInitials(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
