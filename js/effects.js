// ============================================================
//  GRAVITY FALLS - Visual Effects (Background, Particles)
// ============================================================

// Space background stars
const bgStars = [];
const BG_STAR_LAYERS = 3;
const shootingStars = [];
let shootingStarTimer = 0;

function initBgStars() {
  bgStars.length = 0;
  for (let layer = 0; layer < BG_STAR_LAYERS; layer++) {
    const count = layer === 0 ? 80 : layer === 1 ? 50 : 25;
    for (let i = 0; i < count; i++) {
      bgStars.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        size: layer === 0 ? rand(0.5, 1.5) : layer === 1 ? rand(1.5, 2.5) : rand(2, 3.5),
        brightness: rand(0.3, 1),
        twinkleSpeed: rand(0.5, 3),
        twinkleOffset: rand(0, Math.PI * 2),
        layer: layer,
        parallax: layer === 0 ? 0.02 : layer === 1 ? 0.05 : 0.1,
        color: ['#ffffff', '#aaccff', '#ffddaa', '#ffaacc', '#aaffcc'][Math.floor(Math.random() * 5)]
      });
    }
  }
}

function spawnLandingParticles(x, y) {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    G.particles.push({
      x: x + rand(-10, 10),
      y: y,
      vx: rand(-200, 200),
      vy: rand(-280, -60),
      life: rand(0.3, 0.7),
      maxLife: 0.7,
      size: rand(3, 7),
      color: `hsl(${rand(40, 60)}, 90%, ${rand(55, 80)}%)`
    });
  }
}

function updateParticles(dt) {
  for (let i = G.particles.length - 1; i >= 0; i--) {
    const p = G.particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 500 * dt;
    p.life -= dt;
    if (p.life <= 0) G.particles.splice(i, 1);
  }
}

function renderBackground(ctx) {
  // Deep space gradient
  const grad = ctx.createLinearGradient(0, 0, 0, G.H);
  grad.addColorStop(0, '#050510');
  grad.addColorStop(0.3, '#0a0a20');
  grad.addColorStop(0.7, '#0c0e28');
  grad.addColorStop(1, '#080818');
  ctx.fillStyle = grad;
  ctx.fillRect(-10, -10, G.W + 20, G.H + 20);

  // Nebula clouds
  const nebulaTime = performance.now() * 0.00003;
  const nebulaColors = [
    ['rgba(40,20,80,0.08)', 'rgba(40,20,80,0)'],
    ['rgba(20,40,80,0.06)', 'rgba(20,40,80,0)'],
    ['rgba(60,20,50,0.05)', 'rgba(60,20,50,0)']
  ];
  for (let i = 0; i < 3; i++) {
    const nx = (G.W * 0.3 + i * G.W * 0.25 + Math.sin(nebulaTime + i * 2) * 80) % G.W;
    const ny = G.H * 0.3 + i * G.H * 0.2;
    const ngrd = ctx.createRadialGradient(nx, ny, 0, nx, ny, 180 + i * 40);
    ngrd.addColorStop(0, nebulaColors[i][0]);
    ngrd.addColorStop(1, nebulaColors[i][1]);
    ctx.fillStyle = ngrd;
    ctx.fillRect(0, 0, G.W, G.H);
  }

  // Parallax star layers
  const time = performance.now() * 0.001;
  for (const star of bgStars) {
    const sx = ((star.x - G.cameraY * star.parallax * 0.3) % G.W + G.W) % G.W;
    const sy = ((star.y - G.cameraY * star.parallax) % G.H + G.H) % G.H;
    const twinkle = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
    const alpha = star.brightness * (0.4 + 0.6 * twinkle);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = star.color;
    ctx.beginPath();
    ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
    ctx.fill();
    if (star.size > 2) {
      ctx.globalAlpha = alpha * 0.15;
      ctx.beginPath();
      ctx.arc(sx, sy, star.size * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  // Shooting stars
  shootingStarTimer -= 1 / 60;
  if (shootingStarTimer <= 0) {
    shootingStarTimer = rand(2, 6);
    shootingStars.push({
      x: rand(0, G.W), y: rand(0, G.H * 0.4),
      vx: rand(400, 800) * (Math.random() > 0.5 ? 1 : -1),
      vy: rand(200, 500),
      life: rand(0.3, 0.8),
      maxLife: 0.8,
      length: rand(40, 100)
    });
  }
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const ss = shootingStars[i];
    ss.x += ss.vx / 60;
    ss.y += ss.vy / 60;
    ss.life -= 1 / 60;
    if (ss.life <= 0) { shootingStars.splice(i, 1); continue; }
    const alpha = clamp(ss.life / ss.maxLife, 0, 1);
    const angle = Math.atan2(ss.vy, ss.vx);
    const tailX = ss.x - Math.cos(angle) * ss.length;
    const tailY = ss.y - Math.sin(angle) * ss.length;
    const sgrd = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
    sgrd.addColorStop(0, 'rgba(255,255,255,0)');
    sgrd.addColorStop(1, `rgba(255,255,255,${alpha * 0.7})`);
    ctx.strokeStyle = sgrd;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(ss.x, ss.y);
    ctx.stroke();
  }
}

function renderParticles(ctx) {
  for (const p of G.particles) {
    const alpha = clamp(p.life / p.maxLife, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// Booster firework particles (separate from landing particles)
function updateBoosterFireworks(dt) {
  if (G.boosterActive && G.state === 'playing') {
    // Emit firework sparks from the player
    const cx = G.player.x + PLAYER_W / 2;
    const cy = G.player.y + PLAYER_H / 2;
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(80, 250);
      const hue = [0, 30, 50, 60, 340][Math.floor(Math.random() * 5)];
      G.boosterParticles.push({
        x: cx + rand(-8, 8),
        y: cy + rand(-8, 8),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - rand(40, 120),
        life: rand(0.3, 0.8),
        maxLife: 0.8,
        size: rand(2, 5),
        color: `hsl(${hue}, 100%, ${rand(60, 90)}%)`,
        sparkle: Math.random() < 0.3,
      });
    }
  }

  for (let i = G.boosterParticles.length - 1; i >= 0; i--) {
    const p = G.boosterParticles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 180 * dt;
    p.vx *= 0.98;
    p.life -= dt;
    if (p.life <= 0) G.boosterParticles.splice(i, 1);
  }
}

function renderBoosterFireworks(ctx) {
  for (const p of G.boosterParticles) {
    const alpha = clamp(p.life / p.maxLife, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    if (p.sparkle) {
      // Star-shaped sparkle
      const s = p.size * alpha;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(performance.now() * 0.005);
      ctx.fillRect(-s, -0.5, s * 2, 1);
      ctx.fillRect(-0.5, -s, 1, s * 2);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function renderBoosterLabel(ctx) {
  if (G.boosterActive && G.state === 'playing') {
    const cx = G.player.x + PLAYER_W / 2;
    const ty = G.player.y - 60;
    const t = performance.now() * 0.004;
    const bob = Math.sin(t * 2) * 3;
    const pulse = 0.7 + 0.3 * Math.sin(t * 3);

    ctx.save();
    ctx.font = 'bold 11px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = `rgba(255, 30, 50, ${pulse})`;
    ctx.shadowBlur = 10;
    ctx.fillStyle = `rgba(255, 80, 100, ${pulse})`;
    ctx.fillText('BOOSTER ACTIVE!', cx, ty + bob);
    ctx.shadowBlur = 5;
    ctx.fillText('BOOSTER ACTIVE!', cx, ty + bob);
    ctx.restore();
  }
}

// ---- Floating text (fall score popups) ----

function spawnFloatingText(x, y, text, color, size) {
  G.floatingTexts.push({
    x: x,
    y: y,
    text: text,
    color: color,
    size: size || 22,
    life: 1.5,
    maxLife: 1.5,
    vy: -80,
    scale: 0,
  });
}

function updateFloatingTexts(dt) {
  for (let i = G.floatingTexts.length - 1; i >= 0; i--) {
    const ft = G.floatingTexts[i];
    ft.life -= dt;
    ft.y += ft.vy * dt;
    ft.vy *= 0.97;
    // Scale: pop in quickly, then hold
    const age = ft.maxLife - ft.life;
    if (age < 0.15) {
      ft.scale = age / 0.15;
    } else {
      ft.scale = 1;
    }
    if (ft.life <= 0) G.floatingTexts.splice(i, 1);
  }
}

function renderFloatingTexts(ctx) {
  for (const ft of G.floatingTexts) {
    const alpha = clamp(ft.life / (ft.maxLife * 0.3), 0, 1);
    const scale = ft.scale;
    ctx.save();
    ctx.translate(ft.x, ft.y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    ctx.font = `bold ${ft.size}px Segoe UI, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, 0, 0);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

// Legacy function name kept for game.js call — now a no-op in screen space
function renderBoosterBanner(ctx) {
  // Removed — booster visuals are now rendered in world space
}
