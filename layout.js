const logos = [
  { x: -280, y: -180, size: 130 },
  { x: -160, y: -210, size: 100 },
  { x: -400, y: -90, size: 140 },
  { x: -250, y: -60, size: 110 },
  { x: -420, y: 50, size: 150 },
  { x: -280, y: 60, size: 120 },
  { x: -150, y: 90, size: 130 },
  { x: -350, y: 190, size: 120 },
  { x: -200, y: 220, size: 140 },
  { x: -70, y: 240, size: 100 },
  { x: 180, y: -200, size: 120 },
  { x: 300, y: -160, size: 140 },
  { x: 420, y: -80, size: 110 },
  { x: 180, y: -60, size: 130 },
  { x: 320, y: -20, size: 100 },
  { x: 440, y: 40, size: 150 },
  { x: 160, y: 100, size: 120 },
  { x: 300, y: 120, size: 110 },
  { x: 200, y: 220, size: 130 }
];

logos.forEach((l, i) => {
  console.log(`Logo ${i}: x=${l.x}, y=${l.y}, size=${l.size}`);
});
