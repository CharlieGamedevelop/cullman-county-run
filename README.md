# Developer Guide: Cullman County Games

Both games are **plain HTML and JavaScript with no build step**. What is in the repo is exactly what runs.

| Game | Repo | Live URL |
|---|---|---|
| Cullman County Gridiron | https://github.com/CharlieGamedevelop/cullman-county-gridiron | https://charliegamedevelop.github.io/cullman-county-gridiron/?v=5 |
| Cullman County Run | https://github.com/CharlieGamedevelop/cullman-county-run | https://charliegamedevelop.github.io/cullman-county-run/?v=3 |

Owner: the personal GitHub account **CharlieGamedevelop** (a user account, not an organization). Both repos are public and served by GitHub Pages from the `main` branch, root folder.

## Files
- **Gridiron:** `index.html` (page, start screen, safe storage, error bar), `game.js` (all game code), `teams.json` (school data), `og.png`, `apple-touch-icon.png`.
- **Run:** `index.html` (everything inline), `og.png`, `apple-touch-icon.png`.

## Edit in the browser (github.com or the GitHub mobile app)
1. Open the repo, tap the file (for example `teams.json`), then tap the pencil (Edit).
2. Make the change and tap **Commit changes**, committing directly to `main`.
3. GitHub Pages redeploys in about 1 to 2 minutes. You can watch it under the repo's **Actions** tab ("pages build and deployment").
4. Phones cache pages for about 10 minutes. Bump the cache-bust number in the link you share (`?v=5` becomes `?v=6`). If you changed `game.js`, also bump `game.js?v=5` inside `index.html` so browsers fetch the new script.

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

## Phone testing checklist
- [ ] iPhone Safari: open the link with a new `?v=`, tap TAP TO PLAY, and the title screen appears.
- [ ] iPhone in the Facebook or Messenger app browser: same check (this is where most players will come from).
- [ ] Chrome on iPhone (WebKit): same check.
- [ ] Android Chrome and Samsung Internet: same check, and you feel vibration on a touchdown.
- [ ] New Career, pick a school, Play Game, drag back to pass, and see the dotted arc and the crosshair.
- [ ] Complete a pass, steer with swipes, juke with a tap.
- [ ] 4th down menu, punt meter, field goal meter, extra point.
- [ ] The defense ticker appears and you get the ball back.
- [ ] Play to the final whistle and see the final screen and record.
- [ ] Close the tab, reopen, and Continue Career is there with the same record.
- [ ] Rotate the phone during a game and the field resizes.
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
