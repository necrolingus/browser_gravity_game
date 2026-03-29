// ============================================================
//  GRAVITY FALL - Main Game Loop & State Transitions
// ============================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// DOM refs
const hud = document.getElementById('hud');
const gravityBarFill = document.getElementById('gravityBarFill');
const gravityBarLabel = document.getElementById('gravityBarLabel');
const hudYellow = document.getElementById('hudYellow');
const hudYellowPts = document.getElementById('hudYellowPts');
const hudBlue = document.getElementById('hudBlue');
const hudBluePts = document.getElementById('hudBluePts');
const hudRed = document.getElementById('hudRed');
const hudRedPts = document.getElementById('hudRedPts');
const hudWhite = document.getElementById('hudWhite');
const hudWhitePts = document.getElementById('hudWhitePts');
const hudTotal = document.getElementById('hudTotal');
const hudPenalty = document.getElementById('hudPenalty');
const hudDifficulty = document.getElementById('hudDifficulty');
const hudBooster = document.getElementById('hudBooster');
const btnEnd = document.getElementById('btnEnd');
const titleOverlay = document.getElementById('titleOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const goMode = document.getElementById('goMode');
const goYellow = document.getElementById('goYellow');
const goYellowPts = document.getElementById('goYellowPts');
const goBlue = document.getElementById('goBlue');
const goBluePts = document.getElementById('goBluePts');
const goRed = document.getElementById('goRed');
const goRedPts = document.getElementById('goRedPts');
const goWhite = document.getElementById('goWhite');
const goWhitePts = document.getElementById('goWhitePts');
const goPenaltyRow = document.getElementById('goPenaltyRow');
const goTotal = document.getElementById('goTotal');
const goGravity = document.getElementById('goGravity');

// ---- Resize ----
function isMobile() {
  return window.matchMedia('(max-width: 700px)').matches;
}

function resize() {
  G.W = canvas.width = Math.min(window.innerWidth, GAME_MAX_WIDTH);
  const touchReserve = isMobile() ? TOUCH_CONTROL_HEIGHT : 0;
  G.H = canvas.height = window.innerHeight - touchReserve;
  canvas.style.marginLeft = (window.innerWidth - G.W) / 2 + 'px';
}
window.addEventListener('resize', resize);
resize();

// ---- Input ----
window.addEventListener('keydown', e => {
  if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space',' '].includes(e.key || e.code)) e.preventDefault();
  G.keys[e.code] = true;
});
window.addEventListener('keyup', e => { G.keys[e.code] = false; });

// ---- Buttons ----
document.getElementById('btnEasy').addEventListener('click', () => startGame('easy'));
document.getElementById('btnHard').addEventListener('click', () => startGame('hard'));
document.getElementById('btnAgain').addEventListener('click', () => goToTitle());
btnEnd.addEventListener('click', () => endGame());

// ---- Touch Controls ----
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

function bindTouchBtn(id, keyCode) {
  const el = document.getElementById(id);
  if (!el) return;
  const activate = (e) => { e.preventDefault(); G.keys[keyCode] = true; el.classList.add('active'); };
  const deactivate = (e) => { e.preventDefault(); G.keys[keyCode] = false; el.classList.remove('active'); };
  el.addEventListener('touchstart', activate, { passive: false });
  el.addEventListener('touchend', deactivate, { passive: false });
  el.addEventListener('touchcancel', deactivate, { passive: false });
  // Also handle mouse for testing on desktop
  el.addEventListener('mousedown', activate);
  el.addEventListener('mouseup', deactivate);
  el.addEventListener('mouseleave', deactivate);
}

bindTouchBtn('tbLeft', 'ArrowLeft');
bindTouchBtn('tbRight', 'ArrowRight');
bindTouchBtn('tbJump', 'Space');
bindTouchBtn('tbJetpack', 'ArrowUp');

// ---- State transitions ----
function goToTitle() {
  G.state = 'title';
  titleOverlay.classList.remove('hidden');
  gameOverOverlay.classList.add('hidden');
  hud.classList.add('hidden');
  btnEnd.classList.add('hidden');
  G.botMode = true;
  G.difficulty = 'easy';
  initSession();
}

function startGame(mode) {
  G.state = 'playing';
  G.difficulty = mode;
  titleOverlay.classList.add('hidden');
  gameOverOverlay.classList.add('hidden');
  hud.classList.remove('hidden');
  btnEnd.classList.remove('hidden');
  hudDifficulty.textContent = mode === 'easy' ? 'Easy' : 'Hard';
  G.botMode = false;
  G.keys = {};
  initSession();
}

function endGame() {
  G.state = 'gameover';
  hud.classList.add('hidden');
  btnEnd.classList.add('hidden');
  populateGameOver();
  gameOverOverlay.classList.remove('hidden');
}

function initSession() {
  resetPlayer();
  generateInitialPlatforms();
  G.cameraY = 0;
  G.targetCameraY = 0;
  G.totalGravitySpent = 0;
  G.gravityBar = GRAVITY_MAX;
  G.gravitySpentThisFall = 0;
  G.overdraftThisFall = 0;
  G.landingCount = 0;
  G.boosterActive = false;
  G.boosterCountdown = BOOSTER_INTERVAL;
  G.shakeTimer = 0;
  G.particles = [];
  G.boosterParticles = [];
  G.botTarget = null;
  G.lastLandedPlatform = null;
  G.airDashing = false;
  G.airDashTimer = 0;
  G.airDashesLeft = AIR_DASH_MAX;
  G.jetpacksLeft = JETPACK_MAX;
  G.jetpackCooldown = 0;
  G.orbs = [];
  G.lowestOrbY = 0;
  G.orbCounts = { yellow: 0, blue: 0, red: 0, white: 0 };
  G.orbPoints = 0;
  G.gravityPenalty = 0;
  // Seed initial world
  ensurePlatformsBelow();
  ensureOrbsBelow();
}

function onLanding(platform) {
  G.totalGravitySpent += G.gravitySpentThisFall + G.overdraftThisFall;
  G.gravityBar = GRAVITY_MAX;
  G.gravitySpentThisFall = 0;
  G.overdraftThisFall = 0;
  G.airDashing = false;
  G.airDashesLeft = AIR_DASH_MAX;
  G.jetpacksLeft = JETPACK_MAX;
  G.jetpackCooldown = 0;

  const isNewPlatform = platform !== G.lastLandedPlatform;
  G.lastLandedPlatform = platform;

  if (isNewPlatform) {
    G.landingCount++;
  }
  G.boosterActive = false;
  G.boosterCountdown = BOOSTER_INTERVAL - (G.landingCount % BOOSTER_INTERVAL);
  if (G.boosterCountdown === BOOSTER_INTERVAL) G.boosterCountdown = 0;

  if (isNewPlatform && G.landingCount > 0 && G.landingCount % BOOSTER_INTERVAL === 0) {
    G.boosterActive = true;
    G.boosterCountdown = 0;
  }

  G.shakeTimer = SHAKE_DURATION;
  spawnLandingParticles(G.player.x + PLAYER_W / 2, G.player.y + PLAYER_H);
}

// ---- Update ----
function update(dt) {
  if (G.state === 'title' && G.botMode) {
    botUpdate();
  }

  if (G.state === 'title' || G.state === 'playing') {
    // Movement
    let moveDir = 0;
    if (G.keys['ArrowLeft']) moveDir -= 1;
    if (G.keys['ArrowRight']) moveDir += 1;
    G.player.vx = moveDir * MOVE_SPEED;

    updatePlayer(dt, moveDir);

    // Camera
    G.targetCameraY = G.player.y - G.H * CAMERA_OFFSET_RATIO;
    G.cameraY = lerp(G.cameraY, G.targetCameraY, 1 - Math.exp(-CAMERA_SMOOTH * dt));

    // Generate world (MUST happen before gravity drain which may early-return)
    ensurePlatformsBelow();
    ensureOrbsBelow();

    // Gravity bar drain (only while falling downward)
    if (!G.player.onGround && G.player.vy > 0) {
      let drainRate = GRAVITY_DRAIN_RATE;
      if (G.boosterActive) drainRate *= 0.5;
      const drain = drainRate * dt;

      if (G.gravityBar > 0) {
        const actualDrain = Math.min(drain, G.gravityBar);
        G.gravityBar -= actualDrain;
        G.gravitySpentThisFall += actualDrain;

        if (G.gravityBar <= 0) {
          G.gravityBar = 0;
          if (G.state === 'playing' && G.difficulty === 'hard') {
            endGame();
            return;
          }
        }
      } else if (G.state === 'playing' && G.difficulty === 'easy') {
        G.overdraftThisFall += drain;
        const steal = drain * GRAVITY_STEAL_RATIO;
        G.gravityPenalty += steal;
        if (G.orbPoints > 0 && G.orbPoints - G.gravityPenalty <= 0) {
          endGame();
          return;
        }
      }
    }

    // Orb collision & animation
    updateOrbs(dt);

    // Particles & shake
    updateParticles(dt);
    updateBoosterFireworks(dt);
    if (G.shakeTimer > 0) G.shakeTimer -= dt;

    // HUD
    if (G.state === 'playing') {
      updateHUD();
    }
  }
}

// ---- Render ----
function render() {
  ctx.save();

  // Screen shake
  let sx = 0, sy = 0;
  if (G.shakeTimer > 0 && G.state === 'playing') {
    sx = (Math.random() - 0.5) * SHAKE_INTENSITY * 2;
    sy = (Math.random() - 0.5) * SHAKE_INTENSITY * 2;
  }
  ctx.translate(sx, sy);

  renderBackground(ctx);

  // World-space rendering
  ctx.translate(0, -G.cameraY);

  renderPlatforms(ctx);
  renderOrbs(ctx);
  renderPlayer(ctx);
  renderParticles(ctx);
  renderBoosterFireworks(ctx);
  renderBoosterLabel(ctx);

  ctx.restore();

  // Screen-space overlays
  renderBoosterBanner(ctx);
}

// ---- Main loop ----
function gameLoop(timestamp) {
  if (!G.lastTime) G.lastTime = timestamp;
  let dt = (timestamp - G.lastTime) / 1000;
  G.lastTime = timestamp;
  if (dt > MAX_DT) dt = MAX_DT;

  update(dt);
  render();
  requestAnimationFrame(gameLoop);
}

// ---- Prevent default touch on canvas (no scroll/zoom) ----
canvas.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
canvas.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

// ---- Init ----
initBgStars();
goToTitle();
requestAnimationFrame(gameLoop);
