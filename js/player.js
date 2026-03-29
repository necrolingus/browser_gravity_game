// ============================================================
//  GRAVITY FALL - Player Logic & Rendering
// ============================================================

function resetPlayer() {
  G.player = {
    x: G.W / 2 - PLAYER_W / 2,
    y: 80,
    vx: 0,
    vy: 0,
    onGround: false,
    wasOnGround: false,
  };
}

function updatePlayer(dt, moveDir) {
  // Jump / Air Dash / Jetpack
  if (G.keys['Space'] && G.player.onGround) {
    G.player.vy = JUMP_VEL;
    G.player.onGround = false;
  } else if (G.keys['Space'] && !G.player.onGround && !G.airDashing && G.airDashesLeft > 0 && moveDir !== 0) {
    G.airDashing = true;
    G.airDashTimer = AIR_DASH_DURATION;
    G.airDashDir = moveDir;
    G.airDashesLeft--;
    G.player.vy = 0;
  }

  // Jetpack — up arrow while falling
  if (G.jetpackCooldown > 0) G.jetpackCooldown -= dt;
  if (G.keys['ArrowUp'] && !G.player.onGround && !G.airDashing && G.jetpacksLeft > 0 && G.jetpackCooldown <= 0) {
    G.player.vy = JETPACK_VEL;
    G.jetpacksLeft--;
    G.jetpackCooldown = JETPACK_COOLDOWN;
    G.keys['ArrowUp'] = false; // consume the press so it doesn't fire repeatedly
  }

  // Air dash update
  if (G.airDashing) {
    G.airDashTimer -= dt;
    if (G.airDashTimer <= 0) {
      G.airDashing = false;
    } else {
      G.player.vx = G.airDashDir * AIR_DASH_SPEED;
      G.player.vy = 0;
      G.player.x += G.player.vx * dt;
    }
  }

  if (!G.airDashing) {
    G.player.vy += GRAVITY_ACCEL * dt;
    if (G.player.vy > MAX_FALL_SPEED) G.player.vy = MAX_FALL_SPEED;
    G.player.x += G.player.vx * dt;
    G.player.y += G.player.vy * dt;
  }

  // Wrap horizontally
  if (G.player.x + PLAYER_W < 0) G.player.x = G.W;
  if (G.player.x > G.W) G.player.x = -PLAYER_W;

  // Platform collision (only when falling)
  G.player.wasOnGround = G.player.onGround;
  G.player.onGround = false;
  if (G.player.vy >= 0) {
    for (const p of G.platforms) {
      if (
        G.player.x + PLAYER_W > p.x &&
        G.player.x < p.x + p.w &&
        G.player.y + PLAYER_H >= p.y &&
        G.player.y + PLAYER_H <= p.y + p.h + G.player.vy * dt + 5
      ) {
        G.player.y = p.y - PLAYER_H;
        G.player.vy = 0;
        G.player.onGround = true;
        if (!G.player.wasOnGround) {
          onLanding(p);
        }
        break;
      }
    }
  }
}

function renderPlayer(ctx) {
  const px = G.player.x, py = G.player.y;

  // Air dash trail
  if (G.airDashing) {
    const trailLen = 5;
    for (let i = 1; i <= trailLen; i++) {
      const t = i / trailLen;
      const tx = px - G.airDashDir * i * 12;
      ctx.globalAlpha = (1 - t) * 0.3;
      ctx.fillStyle = G.boosterActive ? '#ff2040' : '#50dd70';
      roundRect(ctx, tx, py + 2, PLAYER_W, PLAYER_H - 4, 6);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // Booster glow layers
  if (G.boosterActive) {
    ctx.save();
    ctx.shadowColor = 'rgba(255, 20, 50, 0.9)';
    ctx.shadowBlur = 50;
    ctx.fillStyle = 'rgba(255, 40, 60, 0.15)';
    ctx.beginPath();
    ctx.arc(px + PLAYER_W / 2, py + PLAYER_H / 2, PLAYER_W * 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(px + PLAYER_W / 2, py + PLAYER_H / 2, PLAYER_W * 1.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Body
  ctx.shadowColor = G.boosterActive ? 'rgba(255, 20, 50, 0.95)' : 'rgba(100, 220, 100, 0.4)';
  ctx.shadowBlur = G.boosterActive ? 35 : 10;
  const bodyGrd = ctx.createLinearGradient(px, py, px, py + PLAYER_H);
  if (G.boosterActive) {
    bodyGrd.addColorStop(0, '#ff3050');
    bodyGrd.addColorStop(1, '#cc1030');
  } else {
    bodyGrd.addColorStop(0, '#50dd70');
    bodyGrd.addColorStop(1, '#2a8840');
  }
  ctx.fillStyle = bodyGrd;
  roundRect(ctx, px, py, PLAYER_W, PLAYER_H, 6);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Eyes
  const eyeY = py + 9;
  const eyeOffX = G.player.vx > 10 ? 2 : (G.player.vx < -10 ? -2 : 0);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(px + 9 + eyeOffX, eyeY + 5, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(px + 19 + eyeOffX, eyeY + 5, 6, 0, Math.PI * 2);
  ctx.fill();
  const pupilOffX = G.player.vx > 10 ? 1.5 : (G.player.vx < -10 ? -1.5 : 0);
  const pupilOffY = G.player.vy > 100 ? 1.5 : (G.player.vy < -100 ? -1.5 : 0);
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(px + 9 + eyeOffX + pupilOffX, eyeY + 5 + pupilOffY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(px + 19 + eyeOffX + pupilOffX, eyeY + 5 + pupilOffY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.arc(px + 7 + eyeOffX, eyeY + 3, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(px + 17 + eyeOffX, eyeY + 3, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Gravity bar above character
  {
    const barW = 56, barH = 25;
    const barX = px + PLAYER_W / 2 - barW / 2;
    const barY = py - 30;
    const pct = G.gravityBar / GRAVITY_MAX;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    roundRect(ctx, barX - 1, barY - 1, barW + 2, barH + 2, 5);
    ctx.fill();
    if (pct > 0) {
      ctx.fillStyle = gravityBarColor(pct);
      roundRect(ctx, barX, barY, barW * pct, barH, 4);
      ctx.fill();
    }
    // Percentage text
    ctx.font = 'bold 13px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 3;
    ctx.fillText(Math.round(pct * 100) + '%', px + PLAYER_W / 2, barY + barH / 2);
    ctx.shadowBlur = 0;
  }

  // Dash counter pips
  {
    const counterY = py - 42;
    const cx = px + PLAYER_W / 2;
    const pipSpacing = 10;
    const totalW = (AIR_DASH_MAX - 1) * pipSpacing;
    const startX = cx - totalW / 2;
    for (let i = 0; i < AIR_DASH_MAX; i++) {
      const pipX = startX + i * pipSpacing;
      if (i < G.airDashesLeft) {
        ctx.fillStyle = '#4af';
        ctx.shadowColor = 'rgba(68,170,255,0.6)';
        ctx.shadowBlur = 4;
      } else {
        ctx.fillStyle = 'rgba(100,100,120,0.4)';
        ctx.shadowBlur = 0;
      }
      ctx.beginPath();
      ctx.arc(pipX, counterY, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  // Jetpack counter pips (row above dash pips)
  {
    const counterY = py - 52;
    const cx = px + PLAYER_W / 2;
    const pipSpacing = 12;
    const totalW = (JETPACK_MAX - 1) * pipSpacing;
    const startX = cx - totalW / 2;
    for (let i = 0; i < JETPACK_MAX; i++) {
      const pipX = startX + i * pipSpacing;
      if (i < G.jetpacksLeft) {
        ctx.fillStyle = '#f80';
        ctx.shadowColor = 'rgba(255,136,0,0.7)';
        ctx.shadowBlur = 5;
      } else {
        ctx.fillStyle = 'rgba(100,100,120,0.4)';
        ctx.shadowBlur = 0;
      }
      ctx.beginPath();
      ctx.arc(pipX, counterY, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }
}
