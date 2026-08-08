const logos = [];
const N = 19;

// We want larger sizes: 130 to 190
// We want more spread.
for (let i = 0; i < N; i++) {
  logos.push({
    size: Math.floor(Math.random() * 60) + 130, 
    x: (Math.random() - 0.5) * 800,
    y: (Math.random() - 0.5) * 400,
    vx: 0, vy: 0
  });
}

for (let step = 0; step < 300; step++) {
  for (let i = 0; i < N; i++) {
    // gentle pull to center
    logos[i].vx -= logos[i].x * 0.002;
    logos[i].vy -= logos[i].y * 0.005;
    
    for (let j = i + 1; j < N; j++) {
      let dx = logos[j].x - logos[i].x;
      let dy = logos[j].y - logos[i].y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      // Increased padding for aesthetic spacing
      let minDist = (logos[i].size + logos[j].size) / 2 + 35;
      
      if (dist < minDist) {
        let force = (minDist - dist) * 0.1;
        let fx = (dx / dist) * force;
        let fy = (dy / dist) * force;
        logos[i].vx -= fx;
        logos[i].vy -= fy;
        logos[j].vx += fx;
        logos[j].vy += fy;
      }
    }
  }
  
  for (let i = 0; i < N; i++) {
    logos[i].x += logos[i].vx;
    logos[i].y += logos[i].vy;
    logos[i].vx *= 0.85;
    logos[i].vy *= 0.85;
  }
}

logos.forEach((l, i) => {
  console.log(`{ x: ${Math.round(l.x)}, y: ${Math.round(l.y)}, size: ${l.size} },`);
});
