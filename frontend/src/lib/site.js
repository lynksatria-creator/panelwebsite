export const WA_NUMBER = "6281234567890";

export const waLink = (msg) =>
  `https://wa.me/${WA_NUMBER}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;

export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -72 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

export const formatIDR = (n) => `Rp ${n.toLocaleString("id-ID")}`;
