// ============================================================
//  GRAVITY FALLS - HUD & UI Updates
// ============================================================

function updateHUD() {
  const pct = G.gravityBar / GRAVITY_MAX;
  gravityBarFill.style.width = (pct * 100) + '%';
  gravityBarFill.style.background = gravityBarColor(pct);
  gravityBarLabel.textContent = Math.ceil(G.gravityBar);

  for (const t of ORB_TYPES) {
    const cap = t.name.charAt(0).toUpperCase() + t.name.slice(1);
    document.getElementById('hud' + cap).textContent = G.orbCounts[t.name];
    document.getElementById('hud' + cap + 'Pts').textContent = G.orbCounts[t.name] * t.points;
  }

  const netScore = Math.max(0, Math.floor(G.orbPoints - G.gravityPenalty));
  hudTotal.textContent = netScore;

  if (G.difficulty === 'easy' && G.gravityPenalty > 0) {
    hudPenalty.textContent = ` (-${Math.floor(G.gravityPenalty)})`;
  } else {
    hudPenalty.textContent = '';
  }

  // Multiplier display
  const mult = getPointsMultiplier();
  G.currentMultiplier = mult;
  const hudMult = document.getElementById('hudMult');
  hudMult.textContent = mult.toFixed(1) + 'x';
  hudMult.className = 'hud-item hud-mult ' + (mult >= 1.3 ? 'mult-high' : mult > 1.0 ? 'mult-low' : 'mult-1');

  const mobile = window.innerWidth <= 700;
  if (G.boosterActive) {
    hudBooster.innerHTML = '<span class="booster-active">BOOST!</span>';
  } else {
    const remaining = BOOSTER_INTERVAL - (G.landingCount % BOOSTER_INTERVAL);
    hudBooster.textContent = mobile ? `Boost: ${remaining}` : `Next booster: ${remaining}`;
  }
}

function populateGameOver() {
  goMode.textContent = G.difficulty === 'easy' ? 'Easy' : 'Hard';
  for (const t of ORB_TYPES) {
    const cap = t.name.charAt(0).toUpperCase() + t.name.slice(1);
    document.getElementById('go' + cap).textContent = G.orbCounts[t.name];
    document.getElementById('go' + cap + 'Pts').textContent = G.orbCounts[t.name] * t.points;
  }
  if (G.difficulty === 'easy' && G.gravityPenalty > 0) {
    goPenaltyRow.textContent = `Gravity Penalty: -${Math.floor(G.gravityPenalty)}`;
  } else {
    goPenaltyRow.textContent = '';
  }
  goTotal.textContent = Math.max(0, Math.floor(G.orbPoints - G.gravityPenalty));
  goGravity.textContent = Math.floor(G.totalGravitySpent);
}
