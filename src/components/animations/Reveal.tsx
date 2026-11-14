"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { slideVariants } from "./variants";

type Props = {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "fade";
  className?: string;
  delay?: number;
};

/**
 * Viewport-triggered reveal. direction="left" enters from the left and slides
 * right into place; direction="right" enters from the right and slides left.
 * Place one of each side by side so both animate at the same time.
 */
export default function Reveal({ children, direction = "up", className, delay = 0 }: Props) {
  const reduce = useReducedMotion();
  const variants = slideVariants()[direction];

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
