import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, MessageCircle } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { scrollToSection, waLink } from "@/lib/site";

const LINKS = [
  { id: "tentang", label: "Tentang" },
  { id: "layanan", label: "Layanan" },
  { id: "portofolio", label: "Portofolio" },
  { id: "harga", label: "Harga" },
  { id: "kontak", label: "Kontak" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const go = (id) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/85 border-b border-border/60 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between">
        <button
          data-testid="nav-brand-button"
          onClick={() => window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 text-primary"
        >
          <LogoMark className="w-9 h-9 text-gold" />
          <span className="font-serif text-xl tracking-wide">
            Setia <span className="italic text-gold-gradient">Digital</span>
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => go(l.id)}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors tracking-wide"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            data-testid="theme-toggle-button"
            onClick={toggleTheme}
            aria-label="Ganti tema"
            className="w-10 h-10 rounded-full border border-border/70 flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-gold/60 transition-colors"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a
            data-testid="nav-cta-button"
            href={waLink("Halo Setia Digital Creative! Saya ingin konsultasi undangan digital.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all hover:gap-3"
          >
            <MessageCircle className="w-4 h-4" />
            Konsultasi Gratis
          </a>
          <button
            data-testid="mobile-menu-button"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="lg:hidden w-10 h-10 rounded-full border border-border/70 flex items-center justify-center text-foreground/80"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden backdrop-blur-xl bg-background/95 border-b border-border/60"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {LINKS.map((l) => (
                <button
                  key={l.id}
                  data-testid={`mobile-nav-link-${l.id}`}
                  onClick={() => go(l.id)}
                  className="text-left font-serif text-2xl text-foreground/80 hover:text-foreground transition-colors"
                >
                  {l.label}
                </button>
              ))}
              <a
                data-testid="mobile-nav-cta"
                href={waLink("Halo Setia Digital Creative! Saya ingin konsultasi undangan digital.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 h-12 rounded-full bg-primary text-primary-foreground font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                Konsultasi Gratis via WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
