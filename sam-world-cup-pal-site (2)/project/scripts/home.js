// ==========================================================================
// World Cup Pal - Home page
// Live "matchday" ticker, a countdown to the next kickoff, and 12 group cards
// whose matchups (with Pacific kickoff times and live scores) reveal on hover
// or tap. Data refreshes itself via startLiveData (see data.js).
// ==========================================================================

let currentMatches = [];

// ---- hero status: counts down to the next match, or flags a live game ----
function updateHeroStatus() {
  const el = document.querySelector("#countdown");
  if (!el) { return; }

  const liveGame = currentMatches.find(function (m) { return m.status === "LIVE"; });
  if (liveGame) {
    el.innerHTML = `<span class="live-dot" aria-hidden="true"></span> LIVE NOW: ${liveGame.home} vs ${liveGame.away}`;
    return;
  }

  const next = nextUpcomingMatch(currentMatches);
  if (!next) {
    el.textContent = "The group stage is complete \u2014 on to the knockouts!";
    return;
  }

  const diff = new Date(next.kickoff) - new Date();
  if (diff <= 0) {
    el.textContent = `Kicking off now: ${next.home} vs ${next.away}`;
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const mins = Math.floor((diff / 60000) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  const lead = days > 0 ? `${days}d ` : "";
  el.textContent = `Next match: ${next.home} vs ${next.away} in ${lead}${hours}h ${mins}m ${secs}s`;
}

// ---- live ticker: recent results, any live game, and what's coming up -----
function renderTicker(matches) {
  const strip = document.querySelector("#ticker");
  if (!strip) { return; }

  const sorted = matches.slice().sort(function (a, b) {
    return new Date(a.kickoff) - new Date(b.kickoff);
  });
  const live = sorted.filter(function (m) { return m.status === "LIVE"; });
  const finals = sorted.filter(function (m) { return m.status === "FINAL"; }).slice(-4);
  const upcoming = sorted.filter(function (m) { return m.status === "SCHEDULED"; }).slice(0, 6);
  const show = live.concat(finals, upcoming);

  strip.innerHTML = show.map(function (m) {
    const s = statusInfo(m);
    const dot = s.live ? `<span class="live-dot" aria-hidden="true"></span>` : "";
    return `
      <div class="tick ${s.cls}">
        <span class="tick-status">${dot}${s.label}</span>
        <span class="tick-teams">
          <img src="${flagFor(m.home)}" alt="" class="mr-flag" loading="lazy"> ${m.home}
          <strong>${scoreText(m)}</strong>
          ${m.away} <img src="${flagFor(m.away)}" alt="" class="mr-flag" loading="lazy">
        </span>
      </div>`;
  }).join("");
}

// ---- group cards ----------------------------------------------------------
function buildMatchRow(m) {
  const s = statusInfo(m);
  const dot = s.live ? `<span class="live-dot" aria-hidden="true"></span>` : "";
  const meta = m.status === "SCHEDULED" ? formatKickoff(m.kickoff) : `${dot}${s.label}`;
  const favH = isFavorite(m.home) ? " mr-fav" : "";
  const favA = isFavorite(m.away) ? " mr-fav" : "";
  return `
    <li class="match-row ${s.cls}">
      <span class="mr-line">
        <span class="mr-team${favH}"><img src="${flagFor(m.home)}" alt="" class="mr-flag" loading="lazy"> ${m.home}</span>
        <span class="mr-score">${scoreText(m)}</span>
        <span class="mr-team mr-right${favA}">${m.away} <img src="${flagFor(m.away)}" alt="" class="mr-flag" loading="lazy"></span>
      </span>
      <span class="mr-meta">${meta}</span>
    </li>`;
}

function buildGroupCard(letter, matches, standings) {
  const rows = standings[letter] || [];
  const teamItems = rows.map(function (r) {
    const star = isFavorite(r.team) ? ` <span class="fav-star" title="Your favorite">\u2605</span>` : "";
    return `
        <li>
          <img src="${flagFor(r.team)}" alt="Flag of ${r.team}" width="30" height="20" loading="lazy">
          <span class="gt-name">${r.team}${star}</span>
          <span class="gt-pts">${r.pts} pt${r.pts === 1 ? "" : "s"}</span>
        </li>`;
  }).join("");

  const groupMatches = matches
    .filter(function (m) { return m.group === letter; })
    .sort(function (a, b) { return new Date(a.kickoff) - new Date(b.kickoff); });
  const matchItems = groupMatches.map(buildMatchRow).join("");

  return `
    <article class="group-card" aria-label="Group ${letter}">
      <div class="group-head">
        <span class="group-letter">Group ${letter}</span>
        <ul class="group-teams">${teamItems}</ul>
      </div>
      <button class="matchups-toggle" type="button" aria-expanded="false">
        Show matches <span class="hint">or hover over this card</span>
      </button>
      <div class="group-matchups">
        <h3>Matches</h3>
        <ul class="match-list">${matchItems}</ul>
      </div>
    </article>`;
}

function renderGroups(matches) {
  const grid = document.querySelector("#group-grid");
  if (!grid) { return; }
  const standings = computeStandings(matches);
  grid.innerHTML = GROUP_LETTERS.map(function (letter) {
    return buildGroupCard(letter, matches, standings);
  }).join("");
  attachToggles();
}

function attachToggles() {
  document.querySelectorAll(".matchups-toggle").forEach(function (button) {
    button.addEventListener("click", handleToggle);
  });
}

function handleToggle(event) {
  const button = event.currentTarget;
  const card = button.closest(".group-card");
  const isOpen = card.classList.toggle("open");
  button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  button.firstChild.textContent = isOpen ? "Hide matches " : "Show matches ";
}

// ---- orchestration --------------------------------------------------------
function render(matches) {
  currentMatches = matches;
  renderTicker(matches);
  renderGroups(matches);
  updateHeroStatus();
}

startLiveData(render, 30000);
setInterval(updateHeroStatus, 1000);
