import { ScanLine, Gift, MapPin, Music4, Video, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";

function Card({ className = "", icon: Icon, title, desc, badge, children, testId }) {
  return (
    <div
      data-testid={testId}
      className={`group relative rounded-[1.5rem] border border-border bg-card p-7 sm:p-8 overflow-hidden transition-all duration-500 hover:border-gold/50 hover:shadow-xl hover:shadow-gold/10 ${className}`}
    >
      {badge && (
        <span className="absolute top-5 right-5 text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1.5 rounded-full bg-gold/15 text-amber-800 dark:text-gold border border-gold/30">
          {badge}
        </span>
      )}
      <div className="w-12 h-12 rounded-2xl bg-primary/5 dark:bg-gold/10 border border-gold/25 flex items-center justify-center text-gold transition-transform duration-500 group-hover:scale-110">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="mt-5 font-serif text-2xl leading-snug">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      {children}
    </div>
  );
}

export default function Services() {
  return (
    <section id="layanan" className="py-20 lg:py-32 px-4 sm:px-8 bg-secondary/40" data-testid="services-section">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-amber-800/90 dark:text-gold">
              Layanan Kami
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
              Segala Hal Sakral, <em className="text-gold-gradient">Dalam Satu Undangan</em>
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-12 md:auto-rows-[minmax(190px,auto)] gap-6 lg:gap-8">
          <Reveal className="md:col-span-8 md:row-span-2" testId="service-card-rsvp">
            <Card
              className="h-full flex flex-col"
              icon={ScanLine}
              badge="Fitur Unggulan"
              title="RSVP & Manajemen Tamu Cerdas"
              desc="Sistem konfirmasi kehadiran otomatis terintegrasi dengan WhatsApp, lengkap dengan QR Code check-in eksklusif untuk penerima tamu di venue — data tamu tersaji rapi secara real-time di dashboard privat Anda."
            >
              <div className="mt-auto pt-6 space-y-3">
                {["Konfirmasi kehadiran via satu klik WhatsApp", "QR Code check-in anti antre di lokasi"].map((t) => (
                  <div key={t} className="flex items-center gap-3 text-sm text-foreground/80">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </span>
                    {t}
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          <Reveal delay={1} className="md:col-span-4" testId="service-card-amplop">
            <Card
              className="h-full"
              icon={Gift}
              title="Amplop Digital & Gift Registry"
              desc="Transfer bank langsung, QRIS instan, dan pengiriman hadiah fisik — terverifikasi aman & tanpa potongan."
            />
          </Reveal>

          <Reveal delay={2} className="md:col-span-4" testId="service-card-peta">
            <Card
              className="h-full"
              icon={MapPin}
              title="Navigasi & Peta Presisi"
              desc="Integrasi Google Maps & Waze dengan petunjuk rute interaktif menuju venue."
            />
          </Reveal>

          <Reveal delay={1} className="md:col-span-6" testId="service-card-galeri">
            <Card
              className="h-full"
              icon={Music4}
              title="Galeri Sinematik & Audio Kustom"
              desc="Pemutar musik lagu latar pilihan pasangan, slide foto resolusi tinggi, hingga video trailer pra-nikah."
            />
          </Reveal>

          <Reveal delay={2} className="md:col-span-6" testId="service-card-live">
            <Card
              className="h-full"
              icon={Video}
              title="Integrasi Live Streaming & Hibrida"
              desc="Sematkan tayangan langsung YouTube/Zoom untuk kerabat yang tidak dapat hadir secara fisik."
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
