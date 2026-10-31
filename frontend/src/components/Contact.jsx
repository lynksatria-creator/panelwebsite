import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { MessageCircle, Phone, Mail, MapPin, Send, Loader2, Calculator } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { waLink, formatIDR } from "@/lib/site";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BASE_PRICE = {
  "Paket Essential": 299000,
  "Paket Premium Royal": 499000,
  "Paket Bespoke Couture": 899000,
};

const initialForm = { name: "", whatsapp: "", wedding_date: "", package: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [pkg, setPkg] = useState("Paket Premium Royal");
  const [guests, setGuests] = useState(300);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const estimate = BASE_PRICE[pkg] + Math.max(0, guests - 200) * 250;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success("Terima kasih! Permintaan konsultasi Anda sudah kami terima — tim kami akan menghubungi Anda via WhatsApp.");
      setForm(initialForm);
    } catch {
      toast.error("Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all placeholder:text-muted-foreground/60";

  return (
    <section id="kontak" className="py-20 lg:py-32 px-4 sm:px-8" data-testid="contact-section">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-amber-800/90 dark:text-gold">
              Kontak
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
              Mulai Cerita Cinta <em className="text-gold-gradient">Anda di Sini</em>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Ceritakan konsep impian Anda — konsultasi pertama kami percayakan gratis, tanpa komitmen apa pun.
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-8 space-y-4 text-sm">
              <a href={waLink("Halo Setia!")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 text-foreground/80 hover:text-foreground transition-colors" data-testid="contact-whatsapp-row">
                <span className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </span>
                +62 812-3456-7890 (WhatsApp)
              </a>
              <p className="flex items-center gap-3.5 text-foreground/80">
                <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </span>
                halo@setiadigital.id
              </p>
              <p className="flex items-center gap-3.5 text-foreground/80">
                <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </span>
                Studio: Jakarta &amp; Bandung, Indonesia
              </p>
            </div>
          </Reveal>

          <Reveal delay={4}>
            <a
              data-testid="whatsapp-direct-btn"
              href={waLink("Halo Setia Digital Creative! Saya ingin konsultasi undangan digital.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2.5 h-13 px-7 py-3.5 rounded-full bg-[#25D366] text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Chat Langsung via WhatsApp
            </a>
          </Reveal>

          <Reveal delay={5}>
            <div className="mt-10 rounded-2xl border border-gold/30 bg-card p-6" data-testid="estimator-card">
              <p className="flex items-center gap-2 font-serif text-xl">
                <Calculator className="w-5 h-5 text-gold" />
                Estimator Biaya Instan
              </p>
              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground">Paket</span>
                  <select
                    data-testid="estimator-package-select"
                    value={pkg}
                    onChange={(e) => setPkg(e.target.value)}
                    className={`${inputCls} mt-1.5`}
                  >
                    {Object.keys(BASE_PRICE).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground">Estimasi tamu: {guests} orang</span>
                  <input
                    data-testid="estimator-guests-range"
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="mt-4 w-full accent-[#D4A373]"
                  />
                </label>
              </div>
              <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">Estimasi awal</span>
                <motion.span
                  key={estimate}
                  initial={{ opacity: 0.4, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-serif text-2xl text-gold-gradient"
                  data-testid="estimator-output"
                >
                  {formatIDR(estimate)}
                </motion.span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Bukan harga final — skema terbaik dikonfirmasi lewat konsultasi gratis.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={2}>
            <form
              onSubmit={submit}
              data-testid="contact-form"
              className="rounded-[1.75rem] border border-border bg-card p-7 sm:p-10 shadow-xl shadow-primary/5"
            >
              <h3 className="font-serif text-2xl sm:text-3xl">Formulir Konsultasi Gratis</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Isi singkat saja — kami balas dalam 1×24 jam pada jam kerja.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-5">
                <label className="block">
                  <span className="text-xs font-semibold text-foreground/80">Nama Lengkap *</span>
                  <input
                    data-testid="contact-input-name"
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Nama Anda"
                    className={`${inputCls} mt-2`}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-foreground/80">No. WhatsApp *</span>
                  <input
                    data-testid="contact-input-whatsapp"
                    required
                    value={form.whatsapp}
                    onChange={set("whatsapp")}
                    placeholder="08xxxxxxxxxx"
                    className={`${inputCls} mt-2`}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-foreground/80">Tanggal Pernikahan</span>
                  <input
                    data-testid="contact-input-date"
                    type="date"
                    value={form.wedding_date}
                    onChange={set("wedding_date")}
                    className={`${inputCls} mt-2`}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-foreground/80">Paket yang Diminati</span>
                  <select data-testid="contact-input-package" value={form.package} onChange={set("package")} className={`${inputCls} mt-2`}>
                    <option value="">Belum menentukan</option>
                    <option>Paket Essential</option>
                    <option>Paket Premium Royal</option>
                    <option>Paket Bespoke Couture</option>
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-foreground/80">Konsep Impian Anda</span>
                  <textarea
                    data-testid="contact-input-message"
                    value={form.message}
                    onChange={set("message")}
                    rows={4}
                    placeholder="Contoh: Kami ingin nuansa Jawa modern dengan sentuhan javanese gold, akad di Yogyakarta..."
                    className={`${inputCls} mt-2 h-auto py-3 resize-none`}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                data-testid="contact-submit-button"
                className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-13 px-9 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? "Mengirim..." : "Kirim Permintaan Konsultasi"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
