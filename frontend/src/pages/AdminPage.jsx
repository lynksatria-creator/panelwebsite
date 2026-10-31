import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Trash2, CalendarDays, Sparkles, Phone, LogOut, RefreshCw } from "lucide-react";
import { LogoMark } from "@/components/Logo";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function formatApiErrorDetail(detail) {
  if (detail == null) return "Terjadi kesalahan. Silakan coba lagi.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

function LoginCard({ onLogin }) {
  const [email, setEmail] = useState("admin@setiadigital.id");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password }, { withCredentials: true });
      toast.success(`Selamat datang kembali, ${data.user.name}!`);
      onLogin(data.user);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-secondary/40">
      <form
        onSubmit={submit}
        data-testid="admin-login-form"
        className="w-full max-w-md rounded-[1.75rem] border border-border bg-card p-8 sm:p-10 shadow-xl"
      >
        <div className="flex items-center gap-3 text-primary justify-center">
          <LogoMark className="w-10 h-10 text-gold" />
          <span className="font-serif text-2xl">
            Panel <span className="italic text-gold-gradient">Admin</span>
          </span>
        </div>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Masuk untuk melihat permintaan konsultasi yang masuk.
        </p>
        <label className="block mt-8">
          <span className="text-xs font-semibold text-foreground/80">Email Admin</span>
          <input
            data-testid="admin-login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputCls} mt-2`}
          />
        </label>
        <label className="block mt-5">
          <span className="text-xs font-semibold text-foreground/80">Password</span>
          <input
            data-testid="admin-login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={`${inputCls} mt-2`}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          data-testid="admin-login-submit-button"
          className="mt-8 w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading ? "Memeriksa..." : "Masuk ke Panel Admin"}
        </button>
      </form>
    </div>
  );
}

function InquiryCard({ item, onDelete }) {
  const created = new Date(item.created_at);
  const dateStr = created.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div
      className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-3 hover:border-gold/50 transition-colors"
      data-testid={`admin-inquiry-card-${item.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-serif text-xl leading-snug">{item.name}</p>
          <p className="text-xs text-muted-foreground mt-1">{dateStr}</p>
        </div>
        <button
          data-testid={`admin-inquiry-delete-${item.id}`}
          onClick={() => onDelete(item)}
          aria-label="Hapus permintaan"
          className="w-9 h-9 shrink-0 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-red-600 hover:border-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {item.wedding_date && (
          <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
            <CalendarDays className="w-3.5 h-3.5" /> {item.wedding_date}
          </span>
        )}
        {item.package && (
          <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-gold/15 border border-gold/30 text-xs font-medium text-amber-800 dark:text-gold">
            <Sparkles className="w-3.5 h-3.5" /> {item.package}
          </span>
        )}
      </div>
      {item.message && (
        <p className="text-sm leading-relaxed text-muted-foreground border-l-2 border-gold/40 pl-3 italic">
          “{item.message}”
        </p>
      )}
      <a
        href={`https://wa.me/${item.whatsapp.replace(/^0/, "62").replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        data-testid={`admin-inquiry-whatsapp-${item.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"
      >
        <Phone className="w-4 h-4" /> {item.whatsapp}
      </a>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setBusy(true);
    try {
      const { data } = await axios.get(`${API}/admin/inquiries`, { withCredentials: true });
      setItems(data);
    } catch {
      toast.error("Gagal memuat data permintaan.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (item) => {
    if (!window.confirm(`Hapus permintaan dari ${item.name}?`)) return;
    try {
      await axios.delete(`${API}/admin/inquiries/${item.id}`, { withCredentials: true });
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success("Permintaan dihapus.");
    } catch {
      toast.error("Gagal menghapus permintaan.");
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } finally {
      onLogout();
    }
  };

  const today = new Date().toDateString();
  const todayCount = (items || []).filter(
    (i) => new Date(i.created_at).toDateString() === today
  ).length;

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/85 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary">
            <LogoMark className="w-8 h-8 text-gold" />
            <span className="font-serif text-xl">
              Panel <span className="italic text-gold-gradient">Admin</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-muted-foreground">{user.email}</span>
            <button
              data-testid="admin-logout-button"
              onClick={logout}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full border border-border text-sm font-semibold text-foreground/80 hover:border-gold/50 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl">Permintaan Konsultasi</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Semua permintaan dari formulir di halaman utama tersimpan di sini.
            </p>
          </div>
          <button
            data-testid="admin-refresh-button"
            onClick={load}
            disabled={busy}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${busy ? "animate-spin" : ""}`} /> Muat Ulang
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4" data-testid="admin-stats">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Total Permintaan</p>
            <p className="font-serif text-4xl mt-2" data-testid="admin-stat-total">{items ? items.length : "—"}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Masuk Hari Ini</p>
            <p className="font-serif text-4xl mt-2" data-testid="admin-stat-today">{items ? todayCount : "—"}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="font-serif text-2xl mt-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Terhubung
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5" data-testid="admin-inquiry-list">
          {items === null && <p className="text-sm text-muted-foreground">Memuat data…</p>}
          {items !== null && items.length === 0 && (
            <p className="text-sm text-muted-foreground" data-testid="admin-empty-state">
              Belum ada permintaan masuk. Permintaan dari formulir kontak akan muncul di sini.
            </p>
          )}
          {items !== null && items.map((item) => <InquiryCard key={item.id} item={item} onDelete={remove} />)}
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    axios
      .get(`${API}/auth/me`, { withCredentials: true })
      .then((r) => setUser(r.data))
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <div className="w-10 h-10 rounded-full border-3 border-gold/30 border-t-gold animate-spin" />
      </div>
    );
  }
  if (user === null) return <LoginCard onLogin={setUser} />;
  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}
