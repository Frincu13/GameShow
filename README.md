# GameShow

Static host dashboard architecture for a game show with 2 teams.

## Features

- clear navigation between 12 sections
- 2-team tracking (`name`, `score`, `money`)
- starting money: `1000` for each team
- betting with max caps per game and rounding to `10`
- dynamic players per team (not fixed)
- lineup assignment board (`Team 1` / `Bench` / `Team 2`) per game
- fixed final title for player `Frincu`: `F1 Gypsy King`
- bench / unavailable statuses for players
- game lineup lock to prevent accidental changes
- up to `6` active players per team per game lineup
- persistent round timer (start, pause, reset, duration)
- undo last result (restores money, round history snapshot, and player stats)
- export/import full save in JSON format
- fullscreen toggle for TV/laptop host mode
- final End Screen with winner, final money, and awards snapshot
- realistic demo data blocks (ready to edit) for:
  - Trivia de grup
  - Pretul corect
  - Film / Joc / Franciza / Fun Fact
  - Cel mai bun samsar
- autosave in `localStorage` (state restored on refresh)

## Run Local

Open `index.html` directly in your browser.

No backend and no build step required.

## LocalStorage

Data is saved under:

`gameshow-host-dashboard-v3`
