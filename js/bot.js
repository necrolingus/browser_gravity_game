// ============================================================
//  GRAVITY FALLS - Bot AI (Title Screen Demo)
// ============================================================

function botUpdate() {
  G.keys['ArrowLeft'] = false;
  G.keys['ArrowRight'] = false;
  G.keys['Space'] = false;

  // Find current platform
  let currentPlat = null;
  if (G.player.onGround) {
    for (const p of G.platforms) {
      if (
        G.player.x + PLAYER_W > p.x &&
        G.player.x < p.x + p.w &&
        Math.abs((G.player.y + PLAYER_H) - p.y) < 4
      ) {
        currentPlat = p;
        break;
      }
    }
  }

  // Find nearest platform below
  let best = null;
  let bestDist = Infinity;
  for (const p of G.platforms) {
    if (p === currentPlat) continue;
    if (p.y > G.player.y + PLAYER_H - 5) {
      const dist = p.y - G.player.y;
      if (dist < bestDist) {
        bestDist = dist;
        best = p;
      }
    }
  }
  G.botTarget = best;
  if (!best) return;

  const targetCX = best.x + best.w / 2;
  const playerCX = G.player.x + PLAYER_W / 2;
  const dx = targetCX - playerCX;

  if (G.player.onGround && currentPlat) {
    const targetIsLeft = targetCX < currentPlat.x;
    const targetIsRight = targetCX > currentPlat.x + currentPlat.w;

    if (targetIsLeft) {
      G.keys['ArrowLeft'] = true;
    } else if (targetIsRight) {
      G.keys['ArrowRight'] = true;
    } else {
      const distToLeft = playerCX - currentPlat.x;
      const distToRight = currentPlat.x + currentPlat.w - playerCX;
      if (distToLeft < distToRight) {
        G.keys['ArrowLeft'] = true;
      } else {
        G.keys['ArrowRight'] = true;
      }
    }
  } else if (!G.player.onGround) {
    if (dx < -10) G.keys['ArrowLeft'] = true;
    else if (dx > 10) G.keys['ArrowRight'] = true;
  }
}
