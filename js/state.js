// ============================================================
//  GRAVITY FALLS - Mutable Game State
// ============================================================

const G = {
  // Canvas dimensions
  W: 0,
  H: 0,

  // Core state
  state: 'title', // title | playing | gameover
  difficulty: 'easy',
  keys: {},
  lastTime: 0,

  // Player
  player: {},

  // Camera
  cameraY: 0,
  targetCameraY: 0,

  // Platforms
  platforms: [],
  lowestPlatformY: 0,

  // Gravity & scoring
  totalGravitySpent: 0,
  gravityBar: GRAVITY_MAX,
  gravitySpentThisFall: 0,
  overdraftThisFall: 0,
  landingCount: 0,
  lastLandedPlatform: null,
  boosterActive: false,
  boosterCountdown: BOOSTER_INTERVAL,

  // Air dash
  airDashing: false,
  airDashTimer: 0,
  airDashDir: 0,
  airDashesLeft: AIR_DASH_MAX,

  // Jetpack
  jetpacksLeft: JETPACK_MAX,
  jetpackCooldown: 0,

  // Orbs
  orbs: [],
  lowestOrbY: 0,
  orbCounts: { yellow: 0, blue: 0, red: 0, white: 0 },
  orbPoints: 0,
  gravityPenalty: 0,
  currentMultiplier: 1.0,

  // Effects
  shakeTimer: 0,
  particles: [],
  boosterParticles: [],

  // Bot
  botMode: false,
  botTarget: null,
};
