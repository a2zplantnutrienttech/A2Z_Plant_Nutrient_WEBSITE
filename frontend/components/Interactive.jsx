"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Magnetic Hover Wrapper
export function Magnetic({ children, strength = 0.2, className = "" }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      style={{ position: "relative", display: "inline-block", zIndex: 10 }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Button Bloom Effect Wrapper
export function BloomButton({ children, className = "", onClick, as = "button", ...props }) {
  const ref = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty("--mouse-x", `${x}px`);
    ref.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const Component = as;

  return (
    <Component
      ref={ref}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* Bloom element */}
      <span 
        className="pointer-events-none absolute inset-0 z-0 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "radial-gradient(120px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.4), transparent 40%)"
        }}
      />
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </Component>
  );
}
