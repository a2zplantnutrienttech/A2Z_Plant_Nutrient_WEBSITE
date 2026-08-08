"use client";

// Disabled framer-motion temporarily to fix display issues on SSR

export function FadeIn({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function Stagger({ children, className = "", ...rest }) {
  return <div className={className} {...rest}>{children}</div>;
}

export function StaggerItem({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function ScaleIn({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function TextReveal({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function FloatingLeaf({ className = "", children }) {
  return <div className={className}>{children}</div>;
}
