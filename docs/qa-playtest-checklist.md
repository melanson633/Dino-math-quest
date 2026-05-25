# QA Playtest Checklist

Purpose: give future agents and adults a repeatable, practical way to verify Dino Quest across the current Charlotte-facing flows without building a large test bureaucracy.

## Setup

Run from the repo root:

```powershell
$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run dev
```

Open:

```text
http://127.0.0.1:25918/?playtest=YYYY-MM-DD
```

Use a fresh query string for each run to avoid stale service worker or browser cache confusion. If a blank screen appears after recent code changes, unregister the local service worker and reload before treating it as a current runtime failure.

Primary viewport: tablet portrait `820 x 1180` or iPad-like `834 x 1112`.

Secondary quick viewport: mobile portrait `390 x 844`.

Record console warnings/errors, request failures, obvious layout overlap, blocking lag, and whether each flow feels touch-friendly for a 4-year-old.

## Optional State Seeds

Use these only when the flow requires a known starting state.

Fresh run:

```js
localStorage.removeItem("dino-math-quest-state");
location.reload();
```

Dino Den with one unlocked dino:

```js
localStorage.setItem(
  "dino-math-quest-state",
  JSON.stringify({
    currentScreen: "dinoden",
    currentPuzzleIndex: 0,
    score: 0,
    completedPuzzles: [],
    unlockedDinos: ["stego"],
    currentBiome: "meadow",
    selectedCompanionId: "none",
    selectedLearningAreaId: "math",
    adultSettings: {
      mathPace: "balanced",
      speechSupport: "steady",
      musicCues: true
    }
  })
);
location.reload();
```

## Pass Gates

- No blank screen, Vite/runtime overlay, severe overlap, or blocking lag.
- Main tap targets are large and stable on tablet.
- The next child action is visually obvious after one prior use.
- Wrong answers or quiet speech moments stay positive and recoverable.
- Audio starts only after a user gesture and does not create autoplay warnings.
- Adult settings persist and do not dominate Charlotte's home flow.
- Reload preserves expected progress/settings and does not trap the app on a broken transition.

## Core Flow

### Home Base

- Load Home Base with a fresh state.
- Verify family companion choices are visible: no helper, Mama, Dada, River, Gracie, Max.
- Select no helper, then select Mama or Dada.
- Verify exactly one companion appears selected and the learning sections remain easy to tap.
- Open and close settings without losing the selected companion.

Expected result: Home Base feels like the session start, not a menu wall. A child can identify a companion and an adventure by icon, color, and short label.

### Math Quest

- From Home Base, open Math.
- Tap a wrong answer once.
- Verify feedback is encouraging, retry is clear, and the app does not dead-end.
- Tap the correct answer.
- Continue until the first reward or progress signal appears.
- Use More Math, Dino Den, and Home paths when available.

Expected result: Math is the most complete path, supports quick success, and never makes a wrong answer feel punitive.

### Spelling Adventure

- From Home Base, open Words.
- Complete the first word by tapping letters in order.
- Use Next Word when enabled.
- Intentionally tap one wrong letter in a later word.
- Verify the fallback is quiet and supportive, with no visible failure language.
- Return Home.

Expected result: Letter targets are large, word progress is obvious, and support words can reappear after friction.

### Speech Adventure

- From Home Base, open Say It.
- Use the rhythm or beat controls.
- Use the participation control such as `I Tried`.
- If a retry path is visible, verify only one positive retry is requested.
- Do not enable microphone features unless the task explicitly calls for the voice participation prototype.
- Return Home.

Expected result: Speech is optional, confidence-building, and participation-based. There is no pronunciation judging or discouraging copy.

### Music Den

- From Home Base, open Music.
- Trigger the first song or rhythm control after a tap.
- Tap through a full beat pattern.
- Use Next Beat if enabled.
- Return Home.

Expected result: Music interactions are short, responsive, and interruptible. Console stays clean after audio starts.

### Dino Den

- Verify an empty-state run with no unlocked dinos shows a clear path back to Math before a long locked grid.
- Seed one unlocked dino or reach a reward naturally.
- Select the unlocked dino.
- Try name clap, song, and counting practice controls.
- Return Home.

Expected result: Dino Den adds confidence practice, not just collection pressure.

### Grown-Up Controls

- Open settings from Home Base.
- Change Math pace, Speech support, and Music cues.
- Close settings, reload, and reopen settings.
- Verify settings persisted.
- Use Reset Progress if appropriate.
- Verify reset preserves adult settings.

Expected result: Adult configuration is understandable but does not complicate Charlotte's main flow.

### Persistence And Recovery

- From at least two screens, reload the page.
- Verify the app resumes safely or returns to a usable flow.
- Navigate Home after reload.
- Clear state and verify Home Base loads cleanly.

Expected result: localStorage does not trap the app in a broken screen or stale transition.

## Evidence Template

```text
Date:
Tester / role:
Browser / tool:
URL:
Viewport:
State seed:

Home Base: PASS/FAIL - notes
Math Quest: PASS/FAIL - notes
Spelling: PASS/FAIL - notes
Speech: PASS/FAIL - notes
Music: PASS/FAIL - notes
Dino Den: PASS/FAIL - notes
Grown-Up Controls: PASS/FAIL - notes
Persistence: PASS/FAIL - notes
Console / request failures:
Screenshots or recordings:
Overall recommendation: PASS / PASS WITH FOLLOW-UPS / FAIL
```

## iPad Safari Follow-Up

Before calling a release candidate ready for Charlotte, repeat the core flow on real iPad Safari. Pay special attention to safe-area spacing, PWA install behavior, audio unlock, microphone permission wording when the voice prototype is intentionally enabled, scroll momentum, and whether taps feel immediate.

Helper command from the repo root:

```powershell
pnpm --filter @workspace/scripts run dino:ipad-server
```

This starts the Charlotte-facing game with the same local dev server and prints LAN URLs such as `http://192.168.x.x:25918/?playtest=ipad-YYYY-MM-DD`. Keep the terminal open, put the iPad on the same Wi-Fi network as this computer, open the printed URL in Safari, then record results in the evidence template above. If the iPad cannot load the URL, check VPN/firewall/Wi-Fi isolation before treating it as an app failure.
