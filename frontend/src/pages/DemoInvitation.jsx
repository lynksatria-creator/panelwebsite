import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  MailOpen, CalendarDays, Clock, MapPin, Heart, Users, Send,
  Loader2, ArrowLeft, MessageCircle, ExternalLink, Sparkles,
} from "lucide-react";
import { DEMOS, mapsUrl } from "@/lib/demos";
import { waLink } from "@/lib/site";
import { LogoMark } from "@/components/Logo";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function useCountdown(targetIso) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(targetIso).getTime() - now);
  return {
    passed: diff === 0,
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

const Section = ({ children, className = "", testId }) => (
  <motion.section
    data-testid={testId}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
    className={`px-5 py-16 sm:py-20 ${className}`}
  >
    <div className="max-w-2xl mx-auto">{children}</div>
  </motion.section>
);

const Eyebrow = ({ children }) => (
  <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4A373] font-semibold text-center">{children}</p>
);

function Cover({ demo, onOpen }) {
  return (
    <motion.div
      data-testid="demo-cover"
      exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[90] overflow-hidden"
    >
      <img src={demo.cover} alt={demo.title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-16 h-16 rounded-full border border-[#D4A373]/60 text-[#D4A373] flex items-center justify-center"
        >
          <LogoMark className="w-9 h-9" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 text-[11px] uppercase tracking-[0.4em] text-white/80"
        >
          The Wedding Of
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-4 font-serif text-4xl sm:text-6xl italic"
        >
          {demo.bride.first} &amp; {demo.groom.first}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-4 text-sm tracking-[0.2em] text-white/80"
        >
          {demo.dateLabel}
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          onClick={onOpen}
          data-testid="demo-open-button"
          className="mt-10 inline-flex items-center gap-2.5 h-13 px-8 py-3.5 rounded-full bg-[#D4A373] text-[#1A1817] font-semibold shadow-xl hover:scale-105 transition-transform"
        >
          <MailOpen className="w-5 h-5" />
          Buka Undangan
        </motion.button>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="absolute bottom-8 text-[11px] text-white/60"
        >
          Demo undangan oleh Setia Digital Creative
        </motion.p>
      </div>
    </motion.div>
  );
}

function Countdown({ demo }) {
  const { d, h, m, s, passed } = useCountdown(demo.date);
  if (passed)
    return (
      <p className="text-center font-serif italic text-2xl text-[#D4A373]" data-testid="demo-countdown-passed">
        Hari bahagia telah tiba!
      </p>
    );
  const cells = [
    { v: d, l: "Hari" }, { v: h, l: "Jam" }, { v: m, l: "Menit" }, { v: s, l: "Detik" },
  ];
  return (
    <div className="grid grid-cols-4 gap-3" data-testid="demo-countdown">
      {cells.map((c) => (
        <div key={c.l} className="rounded-2xl border border-[#D4A373]/30 bg-white/5 py-5 text-center">
          <p className="font-serif text-3xl sm:text-4xl text-[#E8C89A]">{String(c.v).padStart(2, "0")}</p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 mt-1">{c.l}</p>
        </div>
      ))}
    </div>
  );
}

function RsvpSection({ demo }) {
  const [name, setName] = useState("");
  const [attends, setAttends] = useState("hadir");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const load = async () => {
    try {
      const { data } = await axios.get(`${API}/demo/${demo.id}/rsvp`);
      setStats(data);
    } catch {}
  };
  useEffect(() => { load(); }, [demo.id]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/demo/${demo.id}/rsvp`, { name, attends, guests });
      toast.success("Terima kasih! Konfirmasi kehadiran Anda sudah tercatat.");
      setName("");
      setGuests(1);
      load();
    } catch {
      toast.error("Gagal mengirim konfirmasi. Coba lagi ya.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full h-12 rounded-xl border border-[#D4A373]/30 bg-white/5 px-4 text-sm text-[#F5EDE3] outline-none focus:ring-2 focus:ring-[#D4A373]/50 transition-all placeholder:text-white/40 [&>option]:text-black";

  return (
    <Section testId="demo-rsvp-section">
      <Eyebrow>Konfirmasi Kehadiran</Eyebrow>
      <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-center italic">RSVP</h2>
      {stats && (
        <p className="mt-4 text-center text-sm text-white/70" data-testid="demo-rsvp-stats">
          <Users className="inline w-4 h-4 text-[#D4A373] mr-1.5" />
          {stats.hadir_count} tamu konfirmasi hadir · {stats.total_guests} orang
        </p>
      )}
      <form onSubmit={submit} data-testid="demo-rsvp-form" className="mt-8 rounded-2xl border border-[#D4A373]/25 bg-[#241E1A]/60 p-6 sm:p-8 space-y-5">
        <label className="block">
          <span className="text-xs font-semibold text-white/80">Nama Tamu *</span>
          <input data-testid="demo-rsvp-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" className={`${inputCls} mt-2`} />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs font-semibold text-white/80">Kehadiran</span>
            <select data-testid="demo-rsvp-attends" value={attends} onChange={(e) => setAttends(e.target.value)} className={`${inputCls} mt-2`}>
              <option value="hadir">Hadir</option>
              <option value="tidak">Tidak Hadir</option>
            </select>
          </label>
          {attends === "hadir" && (
            <label className="block">
              <span className="text-xs font-semibold text-white/80">Jumlah Tamu</span>
              <select data-testid="demo-rsvp-guests" value={guests} onChange={(e) => setGuests(Number(e.target.value))} className={`${inputCls} mt-2`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} orang</option>
                ))}
              </select>
            </label>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          data-testid="demo-rsvp-submit-button"
          className="w-full h-12 rounded-full bg-[#D4A373] text-[#1A1817] font-semibold hover:bg-[#E8C89A] transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
          {loading ? "Mengirim..." : "Kirim Konfirmasi"}
        </button>
      </form>
    </Section>
  );
}

function WishesSection({ demo }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      const { data } = await axios.get(`${API}/demo/${demo.id}/wishes`);
      setItems(data.items);
    } catch {}
  };
  useEffect(() => { load(); }, [demo.id]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/demo/${demo.id}/wishes`, { name, message });
      toast.success("Ucapan Anda terkirim. Terima kasih!");
      setName("");
      setMessage("");
      load();
    } catch {
      toast.error("Gagal mengirim ucapan. Coba lagi ya.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-[#D4A373]/30 bg-white/5 px-4 py-3 text-sm text-[#F5EDE3] outline-none focus:ring-2 focus:ring-[#D4A373]/50 transition-all placeholder:text-white/40";

  return (
    <Section testId="demo-wishes-section">
      <Eyebrow>Ucapan &amp; Doa</Eyebrow>
      <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-center italic">Kirim Restu</h2>
      <form onSubmit={submit} data-testid="demo-wishes-form" className="mt-8 rounded-2xl border border-[#D4A373]/25 bg-[#241E1A]/60 p-6 sm:p-8 space-y-5">
        <label className="block">
          <span className="text-xs font-semibold text-white/80">Nama *</span>
          <input data-testid="demo-wishes-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" className={`${inputCls} mt-2`} />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-white/80">Ucapan &amp; Doa *</span>
          <textarea data-testid="demo-wishes-message" required rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tuliskan doa terbaik untuk kedua mempelai..." className={`${inputCls} mt-2 resize-none`} />
        </label>
        <button
          type="submit"
          disabled={loading}
          data-testid="demo-wishes-submit-button"
          className="w-full h-12 rounded-full bg-[#D4A373] text-[#1A1817] font-semibold hover:bg-[#E8C89A] transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-4 h-4" />}
          {loading ? "Mengirim..." : "Kirim Ucapan"}
        </button>
      </form>
      <div className="mt-8 space-y-4" data-testid="demo-wishes-list">
        {items.length === 0 && (
          <p className="text-center text-sm text-white/50">Belum ada ucapan. Jadilah yang pertama!</p>
        )}
        {items.map((w) => (
          <div key={w.id} className="rounded-2xl border border-[#D4A373]/20 bg-white/[0.04] p-5">
            <p className="text-sm text-white/85 leading-relaxed">“{w.message}”</p>
            <p className="mt-3 text-xs font-semibold text-[#D4A373]">— {w.name}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default function DemoInvitation() {
  const { themeId } = useParams();
  const demo = DEMOS[themeId];
  const [opened, setOpened] = useState(false);

  if (!demo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171412] text-[#F5EDE3] px-6 text-center">
        <div>
          <p className="font-serif text-3xl italic">Undangan tidak ditemukan</p>
          <Link to="/" data-testid="demo-notfound-home-link" className="mt-6 inline-flex items-center gap-2 text-sm text-[#D4A373] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171412] text-[#F5EDE3] overflow-x-clip">
      <AnimatePresence>{!opened && <Cover demo={demo} onOpen={() => setOpened(true)} />}</AnimatePresence>

      {opened && (
        <main>
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative min-h-[85vh] flex items-center justify-center text-center px-6 overflow-hidden"
          >
            <img src={demo.cover} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#171412]/40 via-transparent to-[#171412]" />
            <div className="relative z-10 max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.4em] text-[#D4A373]">The Wedding Of</p>
              <h1 className="mt-5 font-serif text-5xl sm:text-7xl italic leading-tight" data-testid="demo-hero-names">
                {demo.bride.first} <span className="text-[#D4A373]">&amp;</span> {demo.groom.first}
              </h1>
              <p className="mt-5 text-sm tracking-[0.25em] text-white/75" data-testid="demo-hero-date">
                {demo.dateLabel}
              </p>
            </div>
          </motion.section>

          <Section testId="demo-couple-section">
            <Eyebrow>Bismillah</Eyebrow>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-center italic">Mempelai</h2>
            <p className="mt-6 text-center text-sm leading-relaxed text-white/70">
              Dengan memohon rahmat dan ridha Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan
              pernikahan kami:
            </p>
            <div className="mt-10 space-y-10">
              {[demo.bride, demo.groom].map((p, idx) => (
                <motion.div
                  key={p.first}
                  variants={fadeUp}
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 mx-auto rounded-full border border-[#D4A373]/50 bg-white/5 flex items-center justify-center font-serif text-3xl italic text-[#D4A373]">
                    {p.first[0]}
                  </div>
                  <h3 className="mt-5 font-serif text-2xl sm:text-3xl" data-testid={`demo-couple-${idx === 0 ? "bride" : "groom"}`}>
                    {p.full}
                  </h3>
                  <p className="mt-2 text-xs text-white/60 max-w-xs mx-auto">{p.parents}</p>
                </motion.div>
              ))}
              <p className="text-center font-serif italic text-2xl text-[#D4A373]">&amp;</p>
            </div>
          </Section>

          <Section testId="demo-countdown-section">
            <Eyebrow>Menanti Hari Bahagia</Eyebrow>
            <h2 className="mt-3 mb-8 font-serif text-3xl sm:text-4xl text-center italic">Countdown</h2>
            <Countdown demo={demo} />
          </Section>

          <Section testId="demo-events-section">
            <Eyebrow>Waktu &amp; Tempat</Eyebrow>
            <h2 className="mt-3 mb-8 font-serif text-3xl sm:text-4xl text-center italic">Acara</h2>
            <div className="space-y-5">
              {demo.events.map((ev) => (
                <div key={ev.name} className="rounded-2xl border border-[#D4A373]/25 bg-[#241E1A]/60 p-6 sm:p-8 text-center" data-testid={`demo-event-${ev.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <h3 className="font-serif text-2xl text-[#E8C89A]">{ev.name}</h3>
                  <div className="mt-4 space-y-2 text-sm text-white/75">
                    <p className="flex items-center justify-center gap-2">
                      <CalendarDays className="w-4 h-4 text-[#D4A373]" /> {demo.dateLabel}
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4A373]" /> {ev.time}
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4 text-[#D4A373]" /> {ev.venue} — {ev.address}
                    </p>
                  </div>
                  <a
                    data-testid={`demo-event-maps-${ev.name.toLowerCase().replace(/\s+/g, "-")}`}
                    href={mapsUrl(ev.maps)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 h-10 px-5 rounded-full border border-[#D4A373]/50 text-xs font-semibold text-[#E8C89A] hover:bg-[#D4A373]/10 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Buka Google Maps
                  </a>
                </div>
              ))}
            </div>
          </Section>

          <Section testId="demo-gallery-section">
            <Eyebrow>Galeri Momen</Eyebrow>
            <h2 className="mt-3 mb-8 font-serif text-3xl sm:text-4xl text-center italic">Galeri</h2>
            <div className="grid grid-cols-2 gap-3">
              {demo.gallery.map((src, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}>
                  <img src={src} alt={`Galeri ${i + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </Section>

          <RsvpSection demo={demo} />
          <WishesSection demo={demo} />

          <footer className="px-6 pb-10 pt-4 text-center">
            <div className="rounded-2xl border border-[#D4A373]/25 bg-[#241E1A]/60 p-8 max-w-2xl mx-auto">
              <p className="font-serif italic text-xl text-[#E8C89A]">
                {demo.bride.first} &amp; {demo.groom.first}
              </p>
              <p className="mt-3 text-xs text-white/60">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
                berkenan hadir dan memberikan doa restu.
              </p>
              <div className="mt-6 h-px bg-[#D4A373]/25" />
              <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-white/50">
                Undangan Digital oleh
              </p>
              <p className="mt-2 font-serif text-lg">Setia Digital Creative</p>
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  data-testid="demo-footer-whatsapp-button"
                  href={waLink(`Halo Setia! Saya suka demo undangan "${demo.title}". Saya ingin buat undangan seperti ini.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform"
                >
                  <MessageCircle className="w-4 h-4" /> Buat Undangan Seperti Ini
                </a>
                <Link
                  data-testid="demo-footer-home-link"
                  to="/"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-[#D4A373]/50 text-sm font-semibold text-[#E8C89A] hover:bg-[#D4A373]/10 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Ke Beranda
                </Link>
              </div>
            </div>
          </footer>
        </main>
      )}

      <AnimatePresence>{!opened && null}</AnimatePresence>
    </div>
  );
}
