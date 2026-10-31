import { ArrowUpRight } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { scrollToSection, waLink } from "@/lib/site";

const NAV = [
  { id: "tentang", label: "Tentang" },
  { id: "layanan", label: "Layanan" },
  { id: "portofolio", label: "Portofolio" },
  { id: "harga", label: "Harga" },
  { id: "kontak", label: "Kontak" },
];

const SOCIALS = ["Instagram", "TikTok", "YouTube", "Pinterest"];

export default function Footer() {
  return (
    <footer className="grain relative bg-card border-t border-border/60 pt-20 pb-10 px-4 sm:px-8 overflow-hidden" data-testid="footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 text-primary">
              <LogoMark className="w-10 h-10 text-gold" />
              <span className="font-serif text-2xl">
                Setia <span className="italic text-gold-gradient">Digital Creative</span>
              </span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground max-w-sm">
              Studio undangan digital eksklusif yang mengabadikan momen sakral Anda dalam karya
              interaktif — elegan, personal, dan tak terhalang waktu.
            </p>
            <p className="mt-5 text-xs text-muted-foreground/80">
              Studio: Jakarta &amp; Bandung, Indonesia
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-foreground/60">Navigasi</p>
            <ul className="mt-5 space-y-3">
              {NAV.map((n) => (
                <li key={n.id}>
                  <button
                    data-testid={`footer-nav-${n.id}`}
                    onClick={() => scrollToSection(n.id)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-foreground/60">Media Sosial</p>
            <ul className="mt-5 space-y-3">
              {SOCIALS.map((s) => (
                <li key={s}>
                  <a
                    data-testid={`footer-social-${s.toLowerCase()}`}
                    href={waLink(`Halo Setia! Saya menemukan Anda dari ${s}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold transition-colors"
                  >
                    {s}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
            <a
              data-testid="footer-cta-button"
              href={waLink("Halo Setia Digital Creative! Saya ingin konsultasi undangan digital.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 h-11 px-6 rounded-full border border-gold/50 text-sm font-semibold text-foreground hover:bg-gold/10 transition-colors"
            >
              Konsultasi Gratis
            </a>
          </div>
        </div>

        <div className="mt-16 select-none text-center leading-none" aria-hidden>
          <span className="font-serif text-[clamp(2.6rem,9.5vw,8.5rem)] tracking-tight text-gold-gradient opacity-70">
            Setia Digital
          </span>
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>Hak Cipta © 2026 Setia Digital Creative. All rights reserved.</p>
          <p className="font-serif italic text-sm">“Cerita cinta Anda, layak diceritakan dengan indah.”</p>
        </div>
      </div>
    </footer>
  );
}
