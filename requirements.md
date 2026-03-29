# Falling Platform Game — Requirements

## Overview
A browser-based endless falling platformer. Pure HTML/JS/CSS, no backend. Players fall downward through procedurally generated platforms, managing a gravity bar that acts as both a resource and scoring mechanism.

## Core Mechanics

### Movement & Controls
- **Arrow keys (Left/Right):** Horizontal movement on platforms and while airborne
- **Spacebar:** Jump upward when standing still; directional jump when combined with arrow keys
- Player has full left/right control while falling
- **Air Dash:** While falling and holding left/right arrow, pressing spacebar launches the player horizontally in a straight line at high speed. **6 dashes per airborne period**, shown as blue pip counter above the character. Resets on landing. Helps avoid landing on a platform too early to rack up more points.
- **Jetpack:** Press up arrow while falling to boost upward. **2 uses per fall**, shown as orange pip counter above the dash pips. Resets on landing. Has a short cooldown between uses to prevent spam.

### Gravity Bar
- Starts at 100 points
- **Drains continuously while the player is airborne** (not on a platform)
- **Refills fully upon landing on a platform**
- Visual bar on screen: green → yellow → red as it drains (20% larger than default)
- **Also displayed above the player character** as a floating bar
- **Gravity only drains while falling downward**, not while jumping up from a platform

### Scoring — Orb System
- Points come from collecting **orbs** that float between platforms
- **4 orb types** with weighted spawn rates:
  - **Yellow** (2 pts) — 55% spawn rate, most common
  - **Baby Blue** (5 pts) — 27% spawn rate
  - **Red** (10 pts) — 13% spawn rate
  - **White** (25 pts) — 5% spawn rate, very rare, swirls to evade the player
- ~10 orbs per screen height, procedurally generated alongside platforms
- ~30% of orbs spawn near platform edges to reward risky play
- Orbs persist (do not disappear when player lands)
- **White orb behavior:** Orbits in a circle; swirl speed increases as the player gets closer (parameterized: `WHITE_ORB_BASE_SWIRL_SPEED`, `WHITE_ORB_PROXIMITY_BOOST`, `WHITE_ORB_PROXIMITY_RANGE`, `WHITE_ORB_SWIRL_RADIUS`)
- **Easy mode:** If gravity bar hits 0 mid-air, orb points are deducted at a **2:1 ratio** (2 points lost per unit of continued fall). Game over when net score reaches 0.
- **Hard mode:** If gravity bar hits 0 mid-air, **game over immediately**. No point stealing.

### 2x Gravity Booster
- Awarded every **12 unique platform landings** (jumping on the same platform repeatedly does not count)
- Activates immediately upon landing on the triggering platform
- Character glows **neon red** while booster is active
- Effect: gravity drains at **half the normal rate** for the next fall
- Does **NOT** double points earned — scoring remains 1:1
- Show a counter: "Next booster in X jumps"

## Platforms
- **Procedurally generated** — random positions so every session feels unique
- **Continuous downward scrolling** — camera follows the player down
- **Variable width** — some platforms are wider (easier to land on), some narrower
- **Static only** — no moving platforms
- Gap spacing varies:
  - Easy mode: platforms closer together
  - Hard mode: platforms spaced further apart

## Game States

### 1. Title Screen (default)
- Game plays in the background on autoplay (bot character falling)
- Overlay shows:
  - Short rules summary
  - Two buttons: **"Play Easy"** and **"Play Hard"**

### 2. Playing
- HUD displays (centered at top):
  - Gravity bar (color-coded)
  - Per-orb breakdown: colored dot + count caught + points earned per type
  - Total score (with gravity penalty shown as negative value in easy mode)
  - Difficulty mode
  - Booster counter ("Next booster in X jumps")
  - Active booster indicator when active
- **"End Game"** button always available

### 3. Game Over / End Game
- Triggered by:
  - Gravity bar empty + net score reaches 0 (Easy mode)
  - Gravity bar empty (Hard mode)
  - Player clicks "End Game"
- Displays:
  - Difficulty played
  - Full orb breakdown (count × value = points per type)
  - Gravity penalty (easy mode, if any)
  - Final score
  - Total gravity spent
- Button: **"Play Again"** → returns to title screen

## Visual Polish
- Screen shake on platform landing
- Particle burst on landing
- Smooth camera follow downward
- Background auto-play demo on title screen
- **Space-themed background:** Deep space gradient with parallax star layers (3 depths), twinkling stars with color variety, subtle nebula clouds, and periodic shooting stars
- **Character design:** Cute character (20% larger than default) with big round eyes (with pupils that follow movement direction and eye shine highlights)
- **Air dash trail:** Ghost afterimages behind the player when air dashing

## Layout
- **Max game width:** 900px — canvas and HUD are capped so the game doesn't stretch too wide on large monitors. Canvas is centered horizontally.

## Tech Stack
- Single `index.html` file (or minimal file set)
- Vanilla JavaScript (no frameworks)
- HTML5 Canvas for rendering
- CSS for UI overlays / HUD
