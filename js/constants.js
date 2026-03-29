// ============================================================
//  GRAVITY FALL - Constants
// ============================================================

// Player
const PLAYER_W = 34, PLAYER_H = 43;

// Gravity
const GRAVITY_MAX = 100;
const GRAVITY_DRAIN_RATE = 22; // per second
const GRAVITY_STEAL_RATIO = 2;

// Points multiplier tiers — lower gravity = higher reward
// Each entry: [minPercent, maxPercent, multiplier]
const MULTIPLIER_TIERS = [
  [70, 100, 1.0],
  [50,  69, 1.1],
  [20,  49, 1.2],
  [10,  19, 1.3],
  [ 1,   9, 1.5],
];

// Booster
const BOOSTER_INTERVAL = 12;

// Physics
const JUMP_VEL = -420;
const MOVE_SPEED = 280;
const GRAVITY_ACCEL = 620;
const MAX_FALL_SPEED = 700;

// Air dash
const AIR_DASH_SPEED = 550;
const AIR_DASH_DURATION = 0.25;
const AIR_DASH_MAX = 6;

// Jetpack
const JETPACK_MAX = 2;
const JETPACK_VEL = -480;
const JETPACK_COOLDOWN = 0.25; // seconds between jetpack uses

// Layout
const GAME_MAX_WIDTH = 900;
const TOUCH_CONTROL_HEIGHT = 160;

// Platforms
const PLATFORM_MIN_W = 70;
const PLATFORM_MAX_W = 180;
const PLATFORM_H = 14;
const EASY_GAP_MIN = 80, EASY_GAP_MAX = 140;
const HARD_GAP_MIN = 120, HARD_GAP_MAX = 210;
const GAP_MULTIPLIER_DESKTOP = 1.2;   // 20% fewer platforms on desktop
const GAP_MULTIPLIER_MOBILE = 1.7;    // 70% fewer platforms on mobile

// Orbs
const ORB_RADIUS = 13;
const WHITE_ORB_RADIUS = 17;
const ORB_TYPES = [
  { name: 'yellow', color: '#ffdd00', glow: 'rgba(255,220,0,0.7)', points: 2, weight: 55 },
  { name: 'blue',   color: '#66ddff', glow: 'rgba(100,220,255,0.7)', points: 5, weight: 27 },
  { name: 'red',    color: '#ff3355', glow: 'rgba(255,50,80,0.7)', points: 10, weight: 13 },
  { name: 'white',  color: '#ffffff', glow: 'rgba(255,255,255,0.9)', points: 25, weight: 5 },
];
const ORBS_PER_SCREEN = 10;
const WHITE_ORB_BASE_SWIRL_SPEED = 2.0;
const WHITE_ORB_PROXIMITY_BOOST = 4.0;
const WHITE_ORB_PROXIMITY_RANGE = 150;
const WHITE_ORB_SWIRL_RADIUS = 25;

// Generation & culling
const WORLD_GEN_LOOKAHEAD = 400;
const WORLD_CULL_DISTANCE = 400;
const PLATFORM_EDGE_MARGIN = 20;
const ORB_EDGE_SPAWN_CHANCE = 0.3;
const ORB_PLATFORM_PROXIMITY = 80;
const ORB_COLLISION_FACTOR = 0.4; // multiplied by PLAYER_W

// Camera & effects
const CAMERA_OFFSET_RATIO = 0.35;
const CAMERA_SMOOTH = 4.5;
const SHAKE_DURATION = 0.18;
const SHAKE_INTENSITY = 4;
const PARTICLE_COUNT = 14;
const MAX_DT = 0.05;
