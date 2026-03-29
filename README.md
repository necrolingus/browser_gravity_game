# Gravity Falls

**Fall through platforms, collect orbs, manage your gravity!**

A browser-based platformer where you descend through an infinite, procedurally generated world collecting orbs for points. The twist? Your gravity bar drains as you fall — the lower it gets, the higher your score multiplier climbs. Risk it all for massive points, or play it safe and land early.

No installs, no downloads — just open `index.html` and play.

---

## How to Play

**Desktop:** Arrow keys to move, Spacebar to jump, Up arrow for jetpack boost

**Mobile:** On-screen touch controls with directional buttons and action buttons

### Core Loop

1. Jump off a platform and fall downward
2. Collect orbs as you descend — each one earns points
3. Watch your gravity bar drain as you fall
4. Land on a platform to refill your gravity and bank your points
5. Repeat — falling deeper each time

---

## Features

### Gravity Risk/Reward System

Your gravity bar is your lifeline. It drains while you're falling and refills completely when you land. But here's the catch — the emptier your gravity bar, the higher your score multiplier:

| Gravity Remaining | Multiplier |
|---|---|
| 70–100% | 1.0x |
| 50–69% | 1.1x |
| 20–49% | 1.2x |
| 10–19% | 1.3x |
| 1–9% | 1.5x |

Push your luck for big points, but don't let it hit zero.

### Four Orb Types

- **Yellow** (common) — 2 points
- **Blue** (uncommon) — 5 points
- **Red** (rare) — 10 points
- **White** (legendary) — 25 points, swirls around their spawn point and speed up as you approach

All orb points are multiplied by your current gravity multiplier when collected.

### Air Dash

Hold a direction and press jump while airborne to air dash — a quick horizontal burst that freezes your vertical momentum. You get 6 dashes per landing, perfect for dodging around platforms or reaching distant orbs.

### Jetpack Boost

Press up while falling for an upward jetpack burst. Two uses per landing. Great for correcting a bad fall or reaching a platform you'd otherwise miss.

### Gravity Booster

Every 12 landings on new platforms, you earn a Gravity Booster for your next fall. While active, your gravity drain is halved — giving you twice as long to collect orbs and rack up points. Your character glows red with firework particles trailing behind.

### Fall Score Tracking

When you land, a floating score popup shows how many points you earned during that fall. Beat your best single-fall score and you'll see a "New record!" celebration.

### Two Difficulty Modes

**Easy Mode** — When your gravity bar empties, you enter overdraft. You can keep falling, but points are stolen from your score at a 2:1 ratio. If your penalty exceeds your total points, it's game over.

**Hard Mode** — No second chances. When your gravity bar hits zero, the game ends immediately. Wider platform gaps make every jump count.

---

## Visual Effects

- **Parallax starfield** — Three layers of twinkling stars with depth-based scrolling
- **Nebula clouds** — Animated, drifting nebulae in the background
- **Shooting stars** — Random meteors streak across the sky
- **Landing particles** — Golden particle bursts on every platform touchdown
- **Screen shake** — Satisfying rumble on landing
- **Booster fireworks** — Sparkle and fire particles during booster mode
- **Floating score text** — Points pop up above your character with scale-in animation
- **Dynamic character eyes** — Pupils track your movement direction
- **Gravity bar color shift** — Green to yellow to red as gravity drains

---

## Mobile Support

Fully playable on mobile with responsive touch controls:

- Dedicated on-screen buttons for movement, jump, and jetpack
- Responsive HUD that adapts to smaller screens
- Touch-optimized button sizes and layout
- Platform gaps adjusted for mobile screen sizes

---

## Running the Game

Just open `index.html` in any modern browser. No build step, no dependencies, no server required.

For a local dev server:
```
npx serve .
```

---

## Tech

- Pure HTML5 Canvas — no frameworks, no libraries
- Vanilla JavaScript with modular file structure
- Procedural infinite world generation with efficient culling
- Frame-rate independent physics with delta time
- Responsive design from desktop to mobile

---

## Acknowledgments

A heartfelt thank you to all the platformer game developers who came before — from the pixel-perfect classics to the modern indie gems. Games like Super Mario Bros, Doodle Jump, Downwell, Celeste, and countless others shaped what a platformer can be. Every mechanic in this game stands on the shoulders of decades of creative work by developers who turned the simple joy of jumping between platforms into an art form.

This game exists because those games existed first. Thank you for the inspiration.

---

*Built with love, gravity, and a healthy disregard for safe landing distances.*
