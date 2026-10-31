import { Sparkle } from "lucide-react";

const ITEMS = [
  "Elegansi Digital",
  "Konfirmasi RSVP Real-Time",
  "Amplop Digital & QRIS",
  "Peta Lokasi Google Maps",
  "Galeri Foto & Musik Tanpa Batas",
  "Buku Tamu Digital",
  "Video Cinematic Header",
];

const Track = ({ hidden }) => (
  <div aria-hidden={hidden} className="flex items-center shrink-0">
    {ITEMS.map((item) => (
      <span key={item} className="flex items-center gap-6 pr-6">
        <span className="font-serif italic text-lg sm:text-xl tracking-wide whitespace-nowrap">{item}</span>
        <Sparkle className="w-4 h-4 text-gold/80 shrink-0" />
      </span>
    ))}
  </div>
);

export default function Marquee() {
  return (
    <section className="relative py-4 overflow-x-clip" data-testid="marquee-section">
      <div className="bg-primary text-primary-foreground py-5 -rotate-1 shadow-xl overflow-hidden">
        <div className="marquee-track flex w-max">
          <Track />
          <Track hidden />
        </div>
      </div>
    </section>
  );
}
