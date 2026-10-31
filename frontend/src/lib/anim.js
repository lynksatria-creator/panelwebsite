export const EASE = [0.22, 1, 0.36, 1];
export const EASE_SOFT = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: i * 0.1 },
  }),
};

export const lineReveal = {
  hidden: { y: "115%" },
  visible: (i = 0) => ({
    y: "0%",
    transition: { duration: 0.9, ease: EASE_SOFT, delay: 0.2 + i * 0.13 },
  }),
};
