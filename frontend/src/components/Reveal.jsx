import { motion } from "framer-motion";
import { fadeUp } from "@/lib/anim";

export const Reveal = ({ children, delay = 0, className = "", testId }) => (
  <motion.div
    className={className}
    data-testid={testId}
    variants={fadeUp}
    custom={delay}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
  >
    {children}
  </motion.div>
);
