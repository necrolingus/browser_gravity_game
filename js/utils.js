// ============================================================
//  GRAVITY FALL - Utility Functions
// ============================================================

function rand(a, b) { return Math.random() * (b - a) + a; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }

function getPointsMultiplier() {
  const pct = Math.round((G.gravityBar / GRAVITY_MAX) * 100);
  for (const [lo, hi, mult] of MULTIPLIER_TIERS) {
    if (pct >= lo && pct <= hi) return mult;
  }
  return 1.0; // fallback (0% — already empty)
}

function gravityBarColor(pct) {
  if (pct > 0.55) {
    const t = (pct - 0.55) / 0.45;
    return `rgb(${Math.round(lerp(220, 50, t))}, ${Math.round(lerp(200, 200, t))}, 50)`;
  } else {
    const t = pct / 0.55;
    return `rgb(${Math.round(lerp(220, 220, t))}, ${Math.round(lerp(50, 200, t))}, 50)`;
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
