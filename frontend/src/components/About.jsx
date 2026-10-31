import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";

const IMG =
  "https://images.unsplash.com/photo-1592347093417-0e95eb5851aa?crop=entropy&cs=srgb&fm=jpg&q=85";

const TRADISI = ["Jawa", "Sunda", "Minang", "Bali", "Bugis", "Modern"];

export default function About() {
  return (
    <section id="tentang" className="py-20 lg:py-32 px-4 sm:px-8" data-testid="about-section">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-5 relative">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-3 border border-gold/40 rounded-[2rem] translate-x-4 translate-y-4" aria-hidden />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                <img
                  src={IMG}
                  alt="Detail kertas undangan artisanal"
                  className="w-full h-[420px] sm:h-[520px] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 sm:left-auto sm:-right-6 sm:translate-x-0 w-[85%] sm:w-64 rounded-2xl bg-card border border-border shadow-xl p-5"
              >
                <p className="font-serif italic text-lg leading-snug text-foreground/90">
                  “Undangan adalah pintu pertama dari sebuah perayaan cinta.”
                </p>
              </motion.div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-amber-800/90 dark:text-gold">
              Tentang Kami
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
              Sakralnya Budaya, <em className="text-gold-gradient">Lahir Karya Digital</em>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground max-w-2xl">
              Setia Digital Creative lahir dari pemahaman mendalam akan sakralnya pernikahan di
              Indonesia. Kami percaya, sebuah undangan bukan sekadar informasi tanggal dan tempat —
              ia adalah dacaran, sepenggal doa, dan ajakan paling personal yang pernah Anda tulis.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground max-w-2xl">
              Tim desainer dan engineer kami memadukan kehangatan tradisi adat dengan kepresisian
              teknologi interaktif kelas dunia — sehingga setiap tamu yang membuka undangan Anda
              merasakan penghormatan yang sama seperti saat menerima undangan cetak berusul
              kilas asing.
            </p>
          </Reveal>
          <Reveal delay={4}>
            <div className="mt-8 flex flex-wrap gap-2.5" data-testid="about-tradisi-chips">
              {TRADISI.map((t) => (
                <span
                  key={t}
                  className="inline-flex h-9 items-center px-4 rounded-full border border-gold/40 bg-card text-sm font-medium text-foreground/80"
                >
                  Adat {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
