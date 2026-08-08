import React from "react";

/**
 * BotanicalPatterns.jsx
 * Premium corporate EPC botanical patterns - blending watercolor textures,
 * elegant line art, and architectural contours. Optimized for 3-8% opacity
 * on white backgrounds to achieve a crisp, clear, and high-end aesthetic.
 */

// Design 1: Watercolor & Line Art Branch (Left Edge)
export function WatercolorBranchLeft({ className = "", opacity = 0.07 }) {
  return (
    <svg 
      viewBox="0 0 400 800" 
      className={`pointer-events-none select-none ${className}`} 
      style={{ opacity }} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M -50 850 C 50 600 150 300 350 50" stroke="#064e3b" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* Soft watercolor-style filled leaves */}
      <path d="M 30 700 C 120 600 250 680 200 750 C 130 800 60 750 30 700 Z" fill="#047857" opacity="0.5" />
      <path d="M 80 500 C 180 400 320 480 250 560 C 180 620 100 560 80 500 Z" fill="#10b981" opacity="0.4" />
      <path d="M 150 300 C 260 200 380 280 320 360 C 240 420 170 360 150 300 Z" fill="#064e3b" opacity="0.4" />
      
      {/* Crisp line-art detailing overlaid */}
      <path d="M 30 700 C 100 650 180 700 200 750" stroke="#022c22" strokeWidth="2.5" fill="none" />
      <path d="M 80 500 C 150 450 250 500 250 560" stroke="#022c22" strokeWidth="2.5" fill="none" />
      <path d="M 150 300 C 220 250 320 300 320 360" stroke="#022c22" strokeWidth="2.5" fill="none" />
      
      {/* Opposite smaller line-art leaves */}
      <path d="M 100 600 C 50 550 -20 600 -10 650 C 20 680 80 650 100 600 Z" stroke="#064e3b" strokeWidth="2" fill="none" />
      <path d="M 170 400 C 100 330 30 400 50 450 C 80 480 150 450 170 400 Z" stroke="#064e3b" strokeWidth="2" fill="none" />
      <path d="M 250 200 C 180 130 110 200 130 250 C 160 280 230 250 250 200 Z" stroke="#064e3b" strokeWidth="2" fill="none" />
    </svg>
  );
}

// Design 2: Watercolor & Line Art Branch (Right Edge)
export function WatercolorBranchRight({ className = "", opacity = 0.07 }) {
  return (
    <svg 
      viewBox="0 0 400 800" 
      className={`pointer-events-none select-none ${className}`} 
      style={{ opacity }} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 450 -50 C 300 200 200 500 50 850" stroke="#064e3b" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* Soft filled leaves */}
      <path d="M 350 100 C 250 180 200 50 250 -20 C 320 -50 380 30 350 100 Z" fill="#047857" opacity="0.5" />
      <path d="M 280 300 C 180 380 120 250 180 180 C 250 150 320 230 280 300 Z" fill="#10b981" opacity="0.4" />
      <path d="M 200 550 C 100 630 40 500 100 430 C 170 400 240 480 200 550 Z" fill="#064e3b" opacity="0.4" />

      {/* Center veins */}
      <path d="M 350 100 C 300 100 230 70 250 -20" stroke="#022c22" strokeWidth="2.5" fill="none" />
      <path d="M 280 300 C 230 300 160 270 180 180" stroke="#022c22" strokeWidth="2.5" fill="none" />
      <path d="M 200 550 C 150 550 80 520 100 430" stroke="#022c22" strokeWidth="2.5" fill="none" />

      {/* Outlined leaves on the right */}
      <path d="M 310 180 C 400 230 450 150 420 100 C 380 80 320 130 310 180 Z" stroke="#064e3b" strokeWidth="2" fill="none" />
      <path d="M 240 380 C 330 430 380 350 350 300 C 310 280 250 330 240 380 Z" stroke="#064e3b" strokeWidth="2" fill="none" />
      <path d="M 160 620 C 250 670 300 590 270 540 C 230 520 170 570 160 620 Z" stroke="#064e3b" strokeWidth="2" fill="none" />
    </svg>
  );
}

// Design 3: Fine Botanical Line Art (Corners)
export function LeafOutlineCorner({ className = "", opacity = 0.08 }) {
  return (
    <svg 
      viewBox="0 0 300 300" 
      className={`pointer-events-none select-none ${className}`} 
      style={{ opacity }} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 150 350 C 150 200 120 120 -50 80" stroke="#064e3b" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* Line art fern/monstera-inspired splits */}
      <path d="M 150 250 C 250 220 280 120 220 50 C 180 80 150 150 150 200" stroke="#022c22" strokeWidth="2.5" fill="none" />
      <path d="M 150 180 C 230 150 250 50 180 -10 C 150 30 140 100 140 150" stroke="#047857" strokeWidth="2" fill="none" />
      
      <path d="M 110 100 C 130 20 80 -30 20 -20 C 50 30 90 70 100 90" stroke="#022c22" strokeWidth="2.5" fill="none" />
      <path d="M 60 80 C 50 -10 -20 -10 -50 20 C -20 50 20 60 50 70" stroke="#047857" strokeWidth="2" fill="none" />
    </svg>
  );
}

// Design 4: Minimalist Leaf Repeating Texture (Seamless Background)
export function LeafVeinPattern({ className = "", opacity = 0.05 }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 60 0 C 80 20 80 40 60 60 C 40 40 40 20 60 0 Z' stroke='%23064e3b' stroke-width='1.5' fill='none' /%3E%3Cpath d='M 60 60 C 80 80 80 100 60 120 C 40 100 40 80 60 60 Z' stroke='%23047857' stroke-width='1' fill='none' /%3E%3Cpath d='M 0 60 C 20 40 40 40 60 60 C 40 80 20 80 0 60 Z' stroke='%2310b981' stroke-width='1' fill='none' /%3E%3Cpath d='M 60 60 C 80 40 100 40 120 60 C 100 80 80 80 60 60 Z' stroke='%23064e3b' stroke-width='1' fill='none' /%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}

// Design 5: Contour/Wave Patterns representing earth topographies
export function OrganicWaveSeparator({ className = "", opacity = 0.08 }) {
  return (
    <svg 
      viewBox="0 0 1440 200" 
      className={`pointer-events-none select-none w-full ${className}`} 
      style={{ opacity }} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 0 150 C 400 250, 800 50, 1440 120" stroke="#022c22" strokeWidth="2.5" fill="none" />
      <path d="M 0 170 C 400 270, 800 70, 1440 140" stroke="#047857" strokeWidth="1.5" fill="none" strokeDasharray="8 8" />
      <path d="M 0 190 C 400 290, 800 90, 1440 160" stroke="#10b981" strokeWidth="1" fill="none" />
    </svg>
  );
}

// Design 6: Single Abstract Leaf Motif
export function WatercolorLeafSingle({ className = "", opacity = 0.08, rotate = 0 }) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={`pointer-events-none select-none ${className}`} 
      style={{ opacity, transform: `rotate(${rotate}deg)` }} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 10 190 C 80 180 150 120 190 10 C 120 30 40 100 10 190 Z" fill="#047857" opacity="0.4" />
      <path d="M 10 190 C 70 170 130 100 190 10" stroke="#022c22" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 50 145 L 90 90" stroke="#022c22" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 90 105 L 140 60" stroke="#022c22" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 130 65 L 170 30" stroke="#022c22" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
