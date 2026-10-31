import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, MailOpen, QrCode, Heart } from "lucide-react";
import { lineReveal } from "@/lib/anim";
import { scrollToSection, waLink } from "@/lib/site";

const TITLE_LINES = ["Undangan Digital", "Cerdas, Anggun &", "Tak Terhalang Waktu."];

const HERO_IMG =
  "https://images.unsplash.com/photo-1648656433573-ab565ff450c0?crop=entropy&cs=srgb&fm=jpg&q=85";

function InvitationCard() {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [9, -9]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-11, 11]), { stiffness: 120, damping: 18 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <div className="[perspective:1200px] w-full max-w-[420px] mx-auto" data-testid="hero-invitation-card">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-[1.75rem] bg-card border border-gold/40 p-3 shadow-2xl shadow-primary/20"
      >
        <div className="relative rounded-[1.25rem] overflow-hidden">
          <img
            src={HERO_IMG}
            alt="Contoh undangan digital Setia Digital Creative"
            className="w-full h-[420px] sm:h-[480px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-center text-white" style={{ transform: "translateZ(40px)" }}>
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/80">The Wedding Of</p>
            <p className="font-serif text-3xl sm:text-4xl mt-2 italic">Anindya &amp; Raden</p>
            <p className="text-xs tracking-[0.25em] mt-2 text-white/80">24 . 11 . 2026</p>
            <span className="mt-4 inline-flex items-center gap-2 h-9 px-5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-xs font-medium">
              <MailOpen className="w-3.5 h-3.5" />
              Buka Undangan
            </span>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-14 h-14 rounded-full bg-gold text-primary flex items-center justify-center shadow-lg" style={{ transform: "translateZ(60px)" }}>
          <Heart className="w-6 h-6 fill-current" />
        </div>
      </motion.div>

      <div className="animate-float absolute -left-6 sm:-left-12 top-16 flex items-center gap-2.5 rounded-full bg-card/90 backdrop-blur-md border border-border px-4 py-2.5 shadow-lg">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-xs font-semibold">RSVP Real-Time</span>
      </div>
      <div className="animate-float absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2 flex items-center gap-2.5 rounded-full bg-card/90 backdrop-blur-md border border-border px-4 py-2.5 shadow-lg" style={{ animationDelay: "-3s" }}>
        <QrCode className="w-4 h-4 text-gold" />
        <span className="text-xs font-semibold">Amplop Digital &amp; QRIS</span>
      </div>
    </div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <section ref={ref} className="grain relative min-h-screen flex items-center overflow-hidden pt-28 pb-20">
      <motion.div style={{ y: yBg, opacity }} className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -left-32 w-[540px] h-[540px] rounded-full bg-accent/50 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full bg-gold/15 blur-3xl" />
        <span className="absolute top-24 right-[8%] font-serif italic text-[22rem] leading-none text-gold/[0.07] select-none hidden lg:block">
          &amp;
        </span>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-16 lg:gap-10 items-center w-full">
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-amber-800/90 dark:text-gold"
          >
            <span className="h-px w-8 bg-gold/60" />
            Studio Undangan Digital — Jakarta &amp; Bandung
          </motion.p>

          <h1 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight" data-testid="hero-title">
            {TITLE_LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  className={`block ${i === 2 ? "italic text-gold-gradient" : ""}`}
                  variants={lineReveal}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl mx-auto lg:mx-0"
          >
            Mengabadikan setiap detik cerita cinta Anda dalam mahakarya visual interaktif —
            memadukan sentuhan budaya Nusantara dengan estetika digital berstandar internasional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="mt-9 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <button
              data-testid="hero-portfolio-cta"
              onClick={() => scrollToSection("portofolio")}
              className="group inline-flex items-center gap-2 h-12 px-7 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all hover:gap-3.5"
            >
              Lihat Portofolio
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              data-testid="hero-whatsapp-cta"
              href={waLink("Halo Setia! Saya ingin buat undangan digital untuk pernikahan saya.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full border border-gold/60 text-foreground text-sm font-semibold hover:bg-gold/10 transition-colors"
            >
              Buat Undangan Sekarang
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-8 text-xs tracking-wide text-muted-foreground"
          >
            Dipercaya 1.200+ pasangan di 34 provinsi Indonesia
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <InvitationCard />
        </motion.div>
      </div>
    </section>
  );
}
