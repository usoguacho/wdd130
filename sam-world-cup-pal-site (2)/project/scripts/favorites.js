// ==========================================================================
// World Cup Pal - Favorites page
// One panel per favorite team (Argentina, France, USA, Mexico, Japan, Brazil)
// with the team's record, all three group fixtures, Pacific kickoff times,
// and live scores. Refreshes itself through startLiveData (see data.js).
// ==========================================================================

function recordFor(team, standings) {
  const group = groupFor(team);
  const rows = standings[group] || [];
  return rows.find(function (r) { return r.team === team; });
}

function placeFor(team, standings) {
  const group = groupFor(team);
  const rows = standings[group] || [];
  const index = rows.findIndex(function (r) { return r.team === team; });
  return index >= 0 ? index + 1 : null;
}

function buildFixture(m, team) {
  const s = statusInfo(m);
  const dot = s.live ? `<span class="live-dot" aria-hidden="true"></span>` : "";
  const opponent = m.home === team ? m.away : m.home;
  const homeAway = m.home === team ? "vs" : "at";

  let result = "";
  if (m.status === "FINAL") {
    const us = m.home === team ? m.hs : m.as;
    const them = m.home === team ? m.as : m.hs;
    let outcomeClass = "fx-draw";
    if (us > them) { outcomeClass = "fx-win"; }
    else if (us < them) { outcomeClass = "fx-loss"; }
    result = `<span class="fx-result ${outcomeClass}">${us} - ${them}</span>`;
  } else if (m.status === "LIVE") {
    const us = m.home === team ? m.hs : m.as;
    const them = m.home === team ? m.as : m.hs;
    result = `<span class="fx-result fx-live">${us} - ${them} ${dot}</span>`;
  } else {
    result = `<span class="fx-time">${formatKickoff(m.kickoff)}</span>`;
  }

  return `
    <li class="fixture ${s.cls}">
      <span class="fx-opp">
        ${homeAway} <img src="${flagFor(opponent)}" alt="" class="mr-flag" loading="lazy"> ${opponent}
      </span>
      ${result}
    </li>`;
}

function buildFavCard(team, matches, standings) {
  const rec = recordFor(team, standings);
  const place = placeFor(team, standings);
  const fixtures = matchesForTeam(matches, team);
  const recLine = rec
    ? `${rec.w}W \u00b7 ${rec.d}D \u00b7 ${rec.l}L \u00b7 ${rec.pts} pts`
    : "No matches yet";
  const placeBadge = (place && rec && rec.p > 0)
    ? `<span class="place-badge">${place}${ordinal(place)} in Group ${groupFor(team)}</span>`
    : `<span class="place-badge">Group ${groupFor(team)}</span>`;

  return `
    <article class="fav-card">
      <header class="fav-header">
        <img src="${flagFor(team)}" alt="Flag of ${team}" class="fav-flag" width="60" height="40">
        <div>
          <h2>${team}</h2>
          ${placeBadge}
        </div>
      </header>
      <p class="fav-record">${recLine}</p>
      <ul class="fixtures">${fixtures.map(function (m) { return buildFixture(m, team); }).join("")}</ul>
    </article>`;
}

function ordinal(n) {
  if (n === 1) { return "st"; }
  if (n === 2) { return "nd"; }
  if (n === 3) { return "rd"; }
  return "th";
}

function renderFavorites(matches) {
  const grid = document.querySelector("#fav-grid");
  if (!grid) { return; }
  const standings = computeStandings(matches);
  grid.innerHTML = FAVORITES.map(function (team) {
    return buildFavCard(team, matches, standings);
  }).join("");

  const stamp = document.querySelector("#updated");
  if (stamp) {
    stamp.textContent = `Updated ${new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" }).format(new Date())}`;
  }
}

startLiveData(renderFavorites, 30000);
