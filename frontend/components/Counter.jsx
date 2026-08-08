"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function Counter({ to = "1000+", duration = 1.6, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  // Parse number + suffix (e.g. "1000+", "500+", "4+")
  const match = (to || "").toString().match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTs = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - startTs) / (duration * 1000));
      // ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      start = Math.round(eased * target);
      setVal(start);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return (
    <motion.span ref={ref} className={className} data-testid="animated-counter">
      {val}
      {suffix}
    </motion.span>
  );
}
