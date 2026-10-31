import { Check, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { waLink } from "@/lib/site";

const PACKAGES = [
  {
    slug: "essential",
    name: "Paket Essential",
    price: "Rp 299.000",
    note: "Sekali bayar · masa aktif 6 bulan",
    popular: false,
    features: [
      "Masa Aktif 6 Bulan",
      "Galeri 10 Foto",
      "RSVP via WhatsApp",
      "Musik Latar Standar",
      "Peta Lokasi Interaktif",
    ],
  },
  {
    slug: "premium-royal",
    name: "Paket Premium Royal",
    price: "Rp 499.000",
    note: "Sekali bayar · masa aktif selamanya",
    popular: true,
    features: [
      "Masa Aktif Selamanya",
      "Galeri Foto & Video Tanpa Batas",
      "Amplop Digital & QRIS",
      "Buku Tamu & Ucapan Real-Time",
      "QR Code Check-in Tamu",
      "Custom Musik & Font",
    ],
  },
  {
    slug: "bespoke-couture",
    name: "Paket Bespoke Couture",
    price: "Rp 899.000",
    note: "Konsultasi pribadi · desain dari nol",
    popular: false,
    features: [
      "Desain kustom 100% dari nol",
      "Domain Kustom (misal: romeodanjuliet.com)",
      "Animasi Ilustrasi Khusus Pasangan",
      "Dukungan Integrasi Live Stream",
      "VIP Concierge Support",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="harga" className="py-20 lg:py-32 px-4 sm:px-8 bg-secondary/40" data-testid="pricing-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-amber-800/90 dark:text-gold">
              Harga Paket
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
              Investasi untuk <em className="text-gold-gradient">Momen Abadi</em>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              Semua paket termasuk revisi desain, panduan penggunaan, dan pendampingan hingga hari-H.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PACKAGES.map((pkg, i) => (
            <Reveal key={pkg.slug} delay={i} className="h-full" testId={`package-card-${pkg.slug}`}>
              <div
                className={`relative h-full rounded-[1.75rem] p-8 flex flex-col transition-all duration-500 ${
                  pkg.popular
                    ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30 md:-translate-y-4 border border-gold/60"
                    : "bg-card border border-border hover:border-gold/50 hover:shadow-xl"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 h-8 px-4 rounded-full bg-gold text-primary text-xs font-bold uppercase tracking-wider shadow-lg whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5" />
                    Paling Populer
                  </span>
                )}
                <h3 className="font-serif text-2xl">{pkg.name}</h3>
                <p className={`mt-1.5 text-xs ${pkg.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {pkg.note}
                </p>
                <p className="mt-6 font-serif text-4xl tracking-tight">
                  {pkg.price}
                </p>
                <ul className="mt-7 space-y-3.5 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          pkg.popular ? "bg-gold/20 text-gold" : "bg-emerald-500/15 text-emerald-600"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </span>
                      <span className={pkg.popular ? "text-primary-foreground/90" : "text-foreground/80"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  data-testid={`package-order-button-${pkg.slug}`}
                  href={waLink(`Halo Setia! Saya ingin memesan "${pkg.name}" untuk undangan digital pernikahan saya.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 inline-flex items-center justify-center h-12 rounded-full text-sm font-semibold transition-all ${
                    pkg.popular
                      ? "bg-gold text-primary hover:bg-gold-glow"
                      : "border border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  Pesan Paket Ini
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={3}>
          <p className="mt-10 text-center text-xs text-muted-foreground">
            Hanya contoh harga — skema terbaik untuk anggaran Anda akan kami susun saat konsultasi gratis.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
