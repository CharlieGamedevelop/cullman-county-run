# Developer Guide: Cullman County Games

Both games are **plain HTML and JavaScript with no build step**. What is in the repo is exactly what runs.

| Game | Repo | Live URL |
|---|---|---|
| Cullman County Gridiron | https://github.com/CharlieGamedevelop/cullman-county-gridiron | https://charliegamedevelop.github.io/cullman-county-gridiron/?v=6 |
| Cullman County Run | https://github.com/CharlieGamedevelop/cullman-county-run | https://charliegamedevelop.github.io/cullman-county-run/?v=3 |

Owner: the personal GitHub account **CharlieGamedevelop** (a user account, not an organization). Both repos are public and served by GitHub Pages from the `main` branch, root folder.

## Files
- **Gridiron:** `index.html` (page, start screen, safe storage, error bar), `game.js` (all game code), `teams.json` (school data), `fit.js` and `fit.css` (screen fitting), `manifest.webmanifest` plus `icon-*.png` (Add to Home Screen), `og.png`.
- **Run:** `index.html` (game inline), plus the same `fit.js`, `fit.css`, manifest and icons.

## Edit in the browser (github.com or the GitHub mobile app)
1. Open the repo, tap the file (for example `teams.json`), then tap the pencil (Edit).
2. Make the change and tap **Commit changes**, committing directly to `main`.
3. GitHub Pages redeploys in about 1 to 2 minutes. You can watch it under the repo's **Actions** tab ("pages build and deployment").
4. Phones cache pages for about 10 minutes. Bump the cache-bust number in the link you share (`?v=6` becomes `?v=7`). If you changed `game.js`, also bump `game.js?v=6` inside `index.html` so browsers fetch the new script.

The GitHub mobile app can view files and make simple edits. For larger edits, use github.com in a desktop browser, or press `.` on a repo page to open the web editor.

## Clone and run locally
```
git clone https://github.com/CharlieGamedevelop/cullman-county-gridiron.git
cd cullman-county-gridiron
python3 -m http.server 8000
# open http://localhost:8000/  (add ?fast=1 for 16-second quarters while testing)
```
Use a local server rather than double-clicking the file, because `teams.json` is loaded with fetch. If it can't be loaded, the game falls back to a built-in copy.

## Team data (teams.json)
Each team has `id`, `name`, `mascot`, `ab` (2 or 3 letter badge text), `colors` (text), `c1` (primary hex), `c2` (secondary hex), `stadium`, `classification`, `countyRival` (another team's id), `rating` (60 to 90, the opponent strength), and `sources`.
- To change colors, edit `c1` and `c2`. They drive jerseys, helmets, end zones, crowd colors and badges.
- To change a mascot or stadium, edit the text field.
- To add a school, add a new object with a unique `id`. To remove one, delete its object. Saved careers that use a removed id will show the first team.
- The built-in fallback copy is inside `game.js` (the `FALLBACK` line). `teams.json` is the source of truth when it loads.

## Gameplay tuning (top of game.js, `TUNE`)
| Constant | Meaning |
|---|---|
| `QLEN` | Game seconds per quarter (90) |
| `PLAY_RUNOFF` | Extra seconds used per play |
| `REC_SPEED`, `DEF_SPEED`, `RUN_SPEED`, `QB_RUN_SPEED` | Speeds in yards per second |
| `AIM_GAIN` | How far a drag throws (higher means a shorter drag is needed) |
| `MAX_THROW` | Maximum throw length in yards |
| `CATCH_RADIUS`, `TACKLE_RADIUS` | How close the ball or a tackler must get |
| `RUSH_HOLD` | Seconds the line holds before the pass rush gets free |
| `JUKE_CD` | Juke cooldown |
| `SEASON_GAMES`, `COUNTY_FINAL_WINS` | Season length and wins needed for the County Final |

The defense simulation odds are in `simDrive()`. Points and morale changes are in `finishGame()`. Upgrade costs are in `upgCost()`.

## Mobile rules to keep (these fixed real "won't start" bugs)
1. **No fullscreen and no orientation lock.** iPhone Safari does not support them, and they can break the start tap.
2. **Use the safe storage wrapper `LS`** (defined in the first script in `index.html`), never `localStorage` directly. Private mode and in-app browsers throw errors on storage.
3. **The start button** (`#tp` / `#tpb`) listens for `click`, `touchend` and `pointerup`, fires once, and hides the overlay first. Audio starts afterward inside try/catch. Never `await` anything before starting the game.
4. **Resize watchdog:** resize on `resize`, `orientationchange`, `visualViewport` resize and `load`, plus a half-second check that fixes a 0-size canvas.
5. **Error bar:** any uncaught script error shows a red bar at the top with the message. Ask testers for a screenshot of it.
6. Keep the syntax at ES2017 for older iPhones: no `?.`, no `??`, no class fields.

## Screen fit (fit.js / fit.css), keep these
- The page is locked to the visible viewport (`visualViewport`, `100dvh`), with no scrolling, pull-to-refresh, overscroll bounce, pinch zoom, double-tap zoom, long-press menu or text selection.
- `viewport-fit=cover` plus `env(safe-area-inset-*)`: the game draws inside the safe area, so nothing sits under a notch, the Dynamic Island or the iOS home bar. Only the background fills the edges.
- Gridiron scales pixels to a whole number of device pixels when it can (Screen Fit = FIT), so the art stays crisp. FILL uses the whole safe area, and STRETCH ignores the safe areas.
- The Fullscreen button (⛶) only appears where the Fullscreen API works (Android, tablets and desktop browsers, not iPhone). It never runs automatically.

## Add to Home Screen (true full screen on iPhone)
- **iPhone/iPad (Safari):** open the game, tap Share, then **Add to Home Screen**, then Add. Launch it from the new icon and it opens with no Safari bars.
- **Android (Chrome or Samsung Internet):** open the game, tap the ⋮ menu, then **Add to Home screen** (or **Install app**). It opens full screen.

## How to play Gridiron (v6)
1. Before each snap, three big play cards appear at the bottom. Use the < and > arrows to switch between 3 pages. On every page, card 1 is a RUN and cards 2 and 3 are PASS plays. Tap a card to run that play (the snap happens right away). On a computer, keys 1, 2 and 3 pick a card and the Left and Right arrows change pages.
2. **Pass plays:** each eligible receiver gets a ring. Green is open, yellow is close, red is covered. Tap a receiver to throw to him. The throw leads him, and accuracy depends on how open he is and your QB rating. Tap the QB to scramble. The old slingshot still works if you drag from open grass.
3. **Run plays:** the QB hands off to the RB automatically, and the RB follows the play's path. Swipe up or down to take over steering, and tap to juke.
4. **Sideways (landscape):** the camera zooms so the whole width of the field (sideline to sideline), every player and the first-down line are visible. The HUD sits above the field and the play cards sit below it. In portrait, a "Rotate your phone sideways for the full field" screen appears once per game; tap it to keep playing in portrait.

### Playbook (`PLAYS` in game.js)
| Page | Card 1 (run) | Card 2 (pass) | Card 3 (pass) |
|---|---|---|---|
| 1 | DIVE (I-back up the middle, line drive blocks) | SLANT (both wides slant in, slot sits, TE flat) | CURL (wides curl, slot seam, TE drag, RB flat) |
| 2 | SWEEP (RB outside to the bottom, line pulls) | OUT (wides out cuts, slot corner, TE curl) | POST (top wide post, bottom go, slot drag, TE seam, RB flat) |
| 3 | COUNTER (RB steps top, cuts back bottom, trap block) | GO (four verticals look: wides go, slot post, TE curl) | SCREEN (RB screen to the top, line releases to lead block) |

Each play sets its own formation (`form`), routes (`routes`, where `'B'` means the player blocks), RB path (`rb`) and line blocking style (`ol`: drive, pull, trap, pass, screen). Edit those arrays to add or tune plays. Keep 9 plays with a run at positions 1, 4 and 7.

## Gridiron settings (title screen, then SETTINGS; saved with the safe storage wrapper)
Music volume, SFX volume, Announcer on/off, Voice speed, Vibration, Graphics (high = sharp at the device's pixel ratio, low = 1x for older devices), Effects (full/reduced: confetti and shake), Frame rate (60/30), Screen fit (fit/fill/stretch), Left handed (mirrors menu buttons and the corner buttons), Drag power (0.5x to 1.8x), Text size (normal/large), High contrast, Quarter length (short 60 s, normal 90 s, long 120 s), Difficulty (easy/normal/hard), Show FPS, Fullscreen (only where supported), and Reset Save (tap twice within 3 seconds).

## Audio and announcer
- All music and sound effects are generated in code with WebAudio in `game.js` (`SONGS`, `SFX`). The tracks are original compositions: title theme, in-game loop, victory jingle and championship fanfare. No school fight songs or copyrighted melodies are used, so keep it that way when editing.
- Audio unlocks on the first tap only (an iOS rule). It suspends when the tab is hidden and resumes when you come back.
- The announcer shows call banners and speaks with `speechSynthesis` (for example "Touchdown, Hanceville!" or "First down!", plus the matchup and stadium on the intro). If the voice API is missing, it plays short chiptune blips instead and never throws an error.

## Phone testing checklist
- [ ] iPhone Safari: open the link with a new `?v=`, tap TAP TO PLAY, and the title screen appears.
- [ ] iPhone in the Facebook or Messenger app browser: same check (this is where most players will come from).
- [ ] Chrome on iPhone (WebKit): same check.
- [ ] Android Chrome and Samsung Internet: same check, and you feel vibration on a touchdown.
- [ ] New Career, pick a school, Play Game, page through all 3 play pages, and pick each of the 9 plays.
- [ ] On a pass play, tap a receiver and he catches it; on a run play, the RB gets the ball automatically, swipe to steer, tap to juke.
- [ ] Sideways: the whole field width is visible and the cards don't cover players.
- [ ] 4th down menu, punt meter, field goal meter, extra point.
- [ ] The defense ticker appears and you get the ball back.
- [ ] Play to the final whistle and see the final screen and record.
- [ ] Close the tab, reopen, and Continue Career is there with the same record.
- [ ] Rotate the phone during a game and the field resizes.
- [ ] Settings: change music and SFX volume, toggle the announcer (you hear a voice on the intro), and confirm settings survive a reload.
- [ ] Add to Home Screen, launch from the icon, and nothing sits under the notch or home bar.
- [ ] No red error bar at any point.

## Roll back a bad commit
- **On github.com:** open the repo, go to **Commits**, open the last good commit, and copy the file contents back (edit the file, paste, commit). Or open the bad commit and use **Revert** if it's offered on a pull request.
- **From a computer:**
```
git log --oneline          # find the bad commit hash
git revert <hash>          # makes a new commit that undoes it (safe, keeps history)
git push
```
Avoid `git push --force` on `main` unless you are sure. It rewrites history. After any rollback, wait 1 to 2 minutes for Pages, then bump `?v=`.
