// ============================================================
//  GRAVITY FALLS - Orb System
// ============================================================

function pickOrbType() {
  const totalWeight = ORB_TYPES.reduce((s, t) => s + t.weight, 0);
  let r = Math.random() * totalWeight;
  for (const t of ORB_TYPES) {
    r -= t.weight;
    if (r <= 0) return t;
  }
  return ORB_TYPES[0];
}

function generateOrbChunk(yStart, yEnd) {
  const range = yEnd - yStart;
  if (range < 50) return;
  const screenH = Math.max(G.H, 400);
  const count = Math.max(1, Math.round((range / screenH) * ORBS_PER_SCREEN));

  for (let i = 0; i < count; i++) {
    const type = pickOrbType();
    const oy = yStart + rand(20, range - 20);
    let ox;

    // Chance to place near a platform edge
    if (Math.random() < ORB_EDGE_SPAWN_CHANCE) {
      const nearby = G.platforms.filter(p => Math.abs(p.y - oy) < ORB_PLATFORM_PROXIMITY);
      if (nearby.length > 0) {
        const plat = nearby[Math.floor(Math.random() * nearby.length)];
        ox = Math.random() < 0.5
          ? plat.x - rand(15, 40)
          : plat.x + plat.w + rand(15, 40);
        ox = clamp(ox, ORB_RADIUS + 5, G.W - ORB_RADIUS - 5);
      } else {
        ox = rand(ORB_RADIUS + 10, G.W - ORB_RADIUS - 10);
      }
    } else {
      ox = rand(ORB_RADIUS + 10, G.W - ORB_RADIUS - 10);
    }

    G.orbs.push({
      x: ox, y: oy,
      baseX: ox, baseY: oy,
      type: type,
      alive: true,
      swirlAngle: rand(0, Math.PI * 2),
    });
  }
}

function ensureOrbsBelow() {
  // Generate orbs in screen-sized chunks (mirrors platform generation pattern)
  const targetY = G.cameraY + G.H + WORLD_GEN_LOOKAHEAD;
  const chunkSize = Math.max(G.H, 400);
  while (G.lowestOrbY < targetY) {
    const nextY = G.lowestOrbY + chunkSize;
    generateOrbChunk(G.lowestOrbY, nextY);
    G.lowestOrbY = nextY;
  }
  // Cull orbs far above camera or already collected
  G.orbs = G.orbs.filter(o => o.y > G.cameraY - WORLD_CULL_DISTANCE && o.alive);
}

function updateOrbs(dt) {
  const pcx = G.player.x + PLAYER_W / 2;
  const pcy = G.player.y + PLAYER_H / 2;

  for (const orb of G.orbs) {
    if (!orb.alive) continue;

    // White orb swirling — speeds up as player approaches
    if (orb.type.name === 'white') {
      const distToPlayer = Math.hypot(pcx - orb.baseX, pcy - orb.baseY);
      const proximityFactor = clamp(1 - distToPlayer / WHITE_ORB_PROXIMITY_RANGE, 0, 1);
      const swirlSpeed = WHITE_ORB_BASE_SWIRL_SPEED + WHITE_ORB_PROXIMITY_BOOST * proximityFactor;
      orb.swirlAngle += swirlSpeed * dt;
      orb.x = orb.baseX + Math.cos(orb.swirlAngle) * WHITE_ORB_SWIRL_RADIUS;
      orb.y = orb.baseY + Math.sin(orb.swirlAngle) * WHITE_ORB_SWIRL_RADIUS;
    }

    // Collision check
    const dx = pcx - orb.x;
    const dy = pcy - orb.y;
    const dist = Math.hypot(dx, dy);
    const orbR = orb.type.name === 'white' ? WHITE_ORB_RADIUS : ORB_RADIUS;
    if (dist < orbR + PLAYER_W * ORB_COLLISION_FACTOR) {
      orb.alive = false;
      if (G.state === 'playing') {
        G.orbCounts[orb.type.name]++;
        const mult = getPointsMultiplier();
        const pts = orb.type.points * mult;
        G.orbPoints += pts;
        G.fallPoints += pts;
        G.currentMultiplier = mult; // track for HUD display
      }
    }
  }
}

function renderOrbs(ctx) {
  const orbTime = performance.now() * 0.001;

  for (const orb of G.orbs) {
    if (!orb.alive) continue;
    if (orb.y - G.cameraY < -40 || orb.y - G.cameraY > G.H + 40) continue;

    const ox = orb.x, oy = orb.y;
    const isWhite = orb.type.name === 'white';
    const r = isWhite ? WHITE_ORB_RADIUS : ORB_RADIUS;

    ctx.save();
    if (isWhite) {
      const wPulse = 0.6 + 0.4 * Math.sin(orbTime * 5 + orb.swirlAngle);
      ctx.shadowColor = 'rgba(255,255,255,0.95)';
      ctx.shadowBlur = 30 + wPulse * 15;
      ctx.fillStyle = `rgba(255,255,255,${0.1 + wPulse * 0.08})`;
      ctx.beginPath();
      ctx.arc(ox, oy, r * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 18;
      ctx.fillStyle = `rgba(220,230,255,${0.15 + wPulse * 0.1})`;
      ctx.beginPath();
      ctx.arc(ox, oy, r * 1.6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Glow ring for non-white orbs
      ctx.shadowColor = orb.type.glow;
      ctx.shadowBlur = 22;
      ctx.fillStyle = orb.type.glow.replace(/[\d.]+\)$/, '0.12)');
      ctx.beginPath();
      ctx.arc(ox, oy, r * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 18;
    }

    // Main orb body
    const orbGrd = ctx.createRadialGradient(ox - 3, oy - 3, 1, ox, oy, r);
    orbGrd.addColorStop(0, '#fff');
    orbGrd.addColorStop(isWhite ? 0.3 : 0.4, orb.type.color);
    orbGrd.addColorStop(1, isWhite ? 'rgba(200,210,255,0.6)' : orb.type.glow);
    ctx.fillStyle = orbGrd;
    ctx.beginPath();
    ctx.arc(ox, oy, r, 0, Math.PI * 2);
    ctx.fill();

    // Shine highlight
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.arc(ox - 3, oy - 3, r * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
