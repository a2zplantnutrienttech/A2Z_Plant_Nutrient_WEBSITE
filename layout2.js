const logos = [];
const N = 19;
const R_MAX = 350;

// simple physics simulation to pack circles
for (let i = 0; i < N; i++) {
  logos.push({
    size: Math.floor(Math.random() * 60) + 90, // 90 to 150
    x: (Math.random() - 0.5) * 400,
    y: (Math.random() - 0.5) * 200,
    vx: 0, vy: 0
  });
}

for (let step = 0; step < 200; step++) {
  for (let i = 0; i < N; i++) {
    // pull to center
    logos[i].vx -= logos[i].x * 0.005;
    logos[i].vy -= logos[i].y * 0.01; // pull harder vertically to make it wide
    
    for (let j = i + 1; j < N; j++) {
      let dx = logos[j].x - logos[i].x;
      let dy = logos[j].y - logos[i].y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      let minDist = (logos[i].size + logos[j].size) / 2 + 10;
      
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
    logos[i].vx *= 0.8;
    logos[i].vy *= 0.8;
  }
}

logos.forEach((l, i) => {
  console.log(`{ x: ${Math.round(l.x)}, y: ${Math.round(l.y)}, size: ${l.size} },`);
});
