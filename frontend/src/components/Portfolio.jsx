import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, CalendarDays, Users, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { waLink } from "@/lib/site";

const ITEMS = [
  {
    id: "theme-1",
    title: "Aura Nusantara — Javanese Royal Elegance",
    category: "Adat Nusantara",
    image: "https://images.unsplash.com/photo-1626113850818-c54696645fe4?crop=entropy&cs=srgb&fm=jpg&q=85",
    couple: "Anindya & Raden",
    date: "24 November 2026",
  },
  {
    id: "theme-2",
    title: "Blossom & Grace — Botanical Champagne",
    category: "Botanical Luxe",
    image: "https://images.unsplash.com/photo-1648656433394-6f488f55c561?crop=entropy&cs=srgb&fm=jpg&q=85",
    couple: "Clarissa & Julian",
    date: "18 Desember 2026",
  },
  {
    id: "theme-3",
    title: "Minimal Noir — Urban Contemporary",
    category: "Minimalis Modern",
    image: "https://images.unsplash.com/photo-1510181414401-d3f2aa71a124?crop=entropy&cs=srgb&fm=jpg&q=85",
    couple: "Siti & Farhan",
    date: "10 Januari 2027",
  },
  {
    id: "theme-4",
    title: "Celestial Sunset — Bali Cliffside Romance",
    category: "Royal Floral",
    image: "https://images.unsplash.com/photo-1731248271505-269fe1b06f27?crop=entropy&cs=srgb&fm=jpg&q=85",
    couple: "Devi & Bramantyo",
    date: "14 Februari 2027",
  },
];

const FILTERS = ["Semua", "Adat Nusantara", "Minimalis Modern", "Royal Floral", "Botanical Luxe"];

function SpotlightCard({ item, onPreview }) {
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      onMouseMove={handleMove}
      className="group relative rounded-[1.5rem] overflow-hidden border border-border bg-card transition-all duration-500 hover:border-gold/50 hover:shadow-2xl"
      data-testid={`portfolio-card-${item.id}`}
    >
      <div className="relative overflow-hidden aspect-[4/5]">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(212,163,115,0.28), transparent 65%)",
          }}
        />
        <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/25">
          {item.category}
        </span>
        <button
          data-testid={`portfolio-preview-button-${item.id}`}
          onClick={() => onPreview(item)}
          className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-gold text-primary flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 shadow-lg hover:scale-110"
          aria-label={`Pratinjau ${item.title}`}
        >
          <ArrowUpRight className="w-5 h-5" />
        </button>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl leading-snug">{item.title}</h3>
        <p className="mt-1.5 text-xs text-muted-foreground tracking-wide">
          {item.couple} · {item.date}
        </p>
      </div>
    </div>
  );
}

function PreviewModal({ item, onClose }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
      data-testid="portfolio-preview-modal"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative rounded-[2rem] bg-card border border-border p-6 sm:p-8 max-w-3xl w-full grid sm:grid-cols-2 gap-8 items-center shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <button
          data-testid="portfolio-modal-close-button"
          onClick={onClose}
          aria-label="Tutup pratinjau"
          className="absolute top-4 right-4 w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-gold/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="w-full max-w-[260px] mx-auto rounded-[2.25rem] border-4 border-gold/50 overflow-hidden shadow-2xl">
          <img src={item.image} alt={item.title} className="w-full aspect-[9/16] object-cover" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold px-3 py-1.5 rounded-full bg-gold/15 text-amber-800 dark:text-gold border border-gold/30">
            {item.category}
          </span>
          <h3 className="mt-4 font-serif text-2xl sm:text-3xl leading-snug">{item.title}</h3>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-gold" /> {item.couple}
            </p>
            <p className="flex items-center gap-2.5">
              <CalendarDays className="w-4 h-4 text-gold" /> {item.date}
            </p>
          </div>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <a
              data-testid="portfolio-order-button"
              href={waLink(`Halo Setia! Saya tertarik dengan tema "${item.title}" untuk undangan digital saya.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Pesan Tema Ini
            </a>
            <button
              data-testid="portfolio-demo-button"
              onClick={() => navigate(`/undangan/${item.id}`)}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-gold/60 text-sm font-semibold text-foreground hover:bg-gold/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Buka Demo Undangan
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [filter, setFilter] = useState("Semua");
  const [active, setActive] = useState(null);

  const visible = filter === "Semua" ? ITEMS : ITEMS.filter((i) => i.category === filter);

  return (
    <section id="portofolio" className="py-20 lg:py-32 px-4 sm:px-8" data-testid="portfolio-section">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-xl">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-amber-800/90 dark:text-gold">
                Portofolio
              </p>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
                Karya yang <em className="text-gold-gradient">Mengharukan</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <div className="flex flex-wrap gap-2" data-testid="portfolio-filters">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  data-testid={`portfolio-filter-${f.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setFilter(f)}
                  className={`h-10 px-5 rounded-full text-sm font-medium transition-all border ${
                    filter === f
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "border-border bg-card text-foreground/70 hover:border-gold/50 hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <motion.div layout className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <SpotlightCard item={item} onPreview={setActive} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>{active && <PreviewModal item={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}
