// ============================================================
//  GRAVITY FALL - Platform Generation & Management
// ============================================================

function createPlatform(y) {
  const w = rand(PLATFORM_MIN_W, PLATFORM_MAX_W);
  const x = rand(PLATFORM_EDGE_MARGIN, G.W - w - PLATFORM_EDGE_MARGIN);
  return { x, y, w, h: PLATFORM_H };
}

function getGapMultiplier() {
  return window.innerWidth <= 700 ? GAP_MULTIPLIER_MOBILE : GAP_MULTIPLIER_DESKTOP;
}

function getGap() {
  const m = getGapMultiplier();
  if (G.difficulty === 'easy') return rand(EASY_GAP_MIN * m, EASY_GAP_MAX * m);
  return rand(HARD_GAP_MIN * m, HARD_GAP_MAX * m);
}

function addPlatformBelow() {
  G.lowestPlatformY += getGap();
  G.platforms.push(createPlatform(G.lowestPlatformY));
}

function generateInitialPlatforms() {
  G.platforms = [];
  const startPlat = { x: G.W / 2 - 70, y: 120, w: 140, h: PLATFORM_H };
  G.platforms.push(startPlat);
  G.lowestPlatformY = startPlat.y;
  for (let i = 0; i < 20; i++) {
    addPlatformBelow();
  }
}

function ensurePlatformsBelow() {
  while (G.lowestPlatformY < G.cameraY + G.H + WORLD_GEN_LOOKAHEAD) {
    addPlatformBelow();
  }
  G.platforms = G.platforms.filter(p => p.y > G.cameraY - WORLD_CULL_DISTANCE);
}

function renderPlatforms(ctx) {
  for (const p of G.platforms) {
    if (p.y - G.cameraY > -30 && p.y - G.cameraY < G.H + 30) {
      ctx.shadowColor = 'rgba(80, 180, 255, 0.3)';
      ctx.shadowBlur = 10;
      const pgrd = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y);
      pgrd.addColorStop(0, '#2a5580');
      pgrd.addColorStop(0.5, '#3a7ab0');
      pgrd.addColorStop(1, '#2a5580');
      ctx.fillStyle = pgrd;
      roundRect(ctx, p.x, p.y, p.w, p.h, 5);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(150, 220, 255, 0.25)';
      ctx.fillRect(p.x + 3, p.y, p.w - 6, 2);
    }
  }
}
