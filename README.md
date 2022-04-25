# toboard-extension
Chromium-based browser extension, alternative client for quick switching entries with toggl's API

This is an image of the current non-released state:
![dashboard](https://github.com/rzfzr/toboard-extension/blob/main/media/newtab.png)
This is a GIF from a parent project (rzfzr/toboard-legacy):
![dashboard](https://github.com/rzfzr/toboard-legacy/blob/main/screenshots/toboard.gif)

As additional information to the licence file, don't publish it before I do it, thanks.
# To-do

- [x] Add licence
- [ ] Add icon
- [ ] Add manual sync settings 

- [ ] Better use background cache, reducing calls
- [ ] Handle local -> sync storage

- [ ] Purge unused 
    - [ ] permissions
    - [ ] other manifest options
    - [ ] webpack plugins

- [ ] Publish on chrome store
---
- [ ] Add global 'edit' button
- [ ] Add entry grouping to list view
    - [ ] group similar next to entries
    - [ ] group similar entries
    - [ ] group project entries

- [ ] Add Goal duration = day | x weeks | x months | x years
- [ ] Add Goal type
    - [ ] Total per {duration} (default per week)
    - [ ] Average per {duration0} in {duration1} (0<1)
    - [ ] Average per entry in {duration}

- [ ] Add popup elements
- [ ] Add Option to Export and Import all options as JSON
- [ ] Add responsiveness to layout
- [ ] Drag and drop elements
- [ ] Create records for each entries' description+project EVER used, in order to fully auto-complete
- [ ] Goals should be expandables in order to present grouped entries OR grouped goals
- [ ] Hide play buttons on goals/favorites, only show on hover (optionable)
- [ ] Entire goal/favorite should be the toggle button (optionable) 