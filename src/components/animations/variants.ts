import type { Variants } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const slideVariants = (distance = 120): Record<string, Variants> => ({
  left: {
    hidden: { opacity: 0, x: -distance },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
  },
  right: {
    hidden: { opacity: 0, x: distance },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
  },
  up: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7, ease: EASE } },
  },
});

export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
