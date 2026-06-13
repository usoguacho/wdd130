// ==========================================================================
// World Cup Pal - Bracket / standings page
// (1) Live group standings, top two highlighted as advancing and third flagged
//     for the best-third race.
// (2) A "through to the Round of 32" tracker that fills as groups finish.
// (3) The full knockout bracket (R32 -> Final) with Pacific kickoff times.
//     Group-fed slots auto-fill with real teams as soon as a group is decided;
//     everything else shows its placeholder until the result is known.
// Refreshes via startLiveData (see data.js).
// ==========================================================================

// ---- group standings ------------------------------------------------------
function buildStandingsTable(letter, standings) {
  const rows = standings[letter] || [];
  const body = rows.map(function (r, index) {
    let cls = "";
    if (index < 2) { cls = "qualifies"; }
    else if (index === 2) { cls = "contention"; }
    const star = isFavorite(r.team) ? ` <span class="fav-star">\u2605</span>` : "";
    return `
      <tr class="${cls}">
        <td class="st-team">
          <img src="${flagFor(r.team)}" alt="" class="mr-flag" loading="lazy">
          <span>${r.team}${star}</span>
        </td>
        <td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td>
        <td>${r.gd > 0 ? "+" : ""}${r.gd}</td>
        <td class="st-pts">${r.pts}</td>
      </tr>`;
  }).join("");

  return `
    <div class="standings-card">
      <h3>Group ${letter}</h3>
      <table class="standings">
        <thead>
          <tr><th scope="col">Team</th><th scope="col" title="Played">P</th><th scope="col" title="Won">W</th><th scope="col" title="Drawn">D</th><th scope="col" title="Lost">L</th><th scope="col" title="Goal difference">GD</th><th scope="col" title="Points">Pts</th></tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}

function renderStandings(matches, standings) {
  const wrap = document.querySelector("#standings-grid");
  if (!wrap) { return; }
  wrap.innerHTML = GROUP_LETTERS.map(function (letter) {
    return buildStandingsTable(letter, standings);
  }).join("");
}

// ---- qualified tracker ----------------------------------------------------
function renderQualified(matches, standings) {
  const panel = document.querySelector("#qualified");
  if (!panel) { return; }

  const decided = GROUP_LETTERS.map(function (letter) {
    if (!groupIsDecided(matches, letter)) { return null; }
    const rows = standings[letter];
    return { letter: letter, winner: rows[0].team, runner: rows[1].team };
  }).filter(function (g) { return g !== null; });

  if (decided.length === 0) {
    panel.innerHTML = `<p class="hint">No groups have finished yet. Winners and runners-up appear here automatically as each group wraps up its three rounds.</p>`;
    return;
  }

  panel.innerHTML = decided.map(function (g) {
    return `
      <div class="qual-row">
        <span class="qual-group">Group ${g.letter}</span>
        <span class="qual-team"><img src="${flagFor(g.winner)}" alt="" class="mr-flag"> ${g.winner} <em>(1st)</em></span>
        <span class="qual-team"><img src="${flagFor(g.runner)}" alt="" class="mr-flag"> ${g.runner} <em>(2nd)</em></span>
      </div>`;
  }).join("");
}

// ---- knockout bracket -----------------------------------------------------
function sideMarkup(side, matches, standings) {
  const resolved = resolveSide(side, matches, standings);
  if (resolved.team) {
    const star = isFavorite(resolved.team) ? ` <span class="fav-star">\u2605</span>` : "";
    return `<span class="ko-team ko-known"><img src="${flagFor(resolved.team)}" alt="" class="mr-flag"> ${resolved.team}${star}</span>`;
  }
  return `<span class="ko-team ko-tbd">${resolved.label}</span>`;
}

function buildKnockoutCard(ko, matches, standings) {
  const isFinal = ko.round === "Final";
  return `
    <article class="ko-match${isFinal ? " ko-final" : ""}">
      <div class="ko-meta">
        <span class="ko-num">Match ${ko.m}</span>
        <span class="ko-when">${formatKickoff(ko.kickoff)}</span>
      </div>
      <div class="ko-sides">
        ${sideMarkup(ko.home, matches, standings)}
        <span class="ko-vs">${isFinal ? "\u2014" : "vs"}</span>
        ${sideMarkup(ko.away, matches, standings)}
      </div>
      <div class="ko-venue">${ko.venue}</div>
    </article>`;
}

function renderKnockouts(matches, standings) {
  const wrap = document.querySelector("#knockout-bracket");
  if (!wrap) { return; }
  wrap.innerHTML = KNOCKOUT_ROUNDS.map(function (round) {
    const games = KNOCKOUTS
      .filter(function (k) { return k.round === round; })
      .sort(function (a, b) { return new Date(a.kickoff) - new Date(b.kickoff); });
    if (games.length === 0) { return ""; }
    const dateSpan = roundDateSpan(games);
    return `
      <section class="ko-round" aria-label="${round}">
        <header class="ko-round-head">
          <h3>${round}</h3>
          <span class="ko-round-dates">${dateSpan}</span>
        </header>
        <div class="ko-grid">
          ${games.map(function (g) { return buildKnockoutCard(g, matches, standings); }).join("")}
        </div>
      </section>`;
  }).join("");
}

// Builds a friendly date range like "Jun 28 - Jul 3" for a round.
function roundDateSpan(games) {
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: PT_TZ, month: "short", day: "numeric" });
  const first = fmt.format(new Date(games[0].kickoff));
  const last = fmt.format(new Date(games[games.length - 1].kickoff));
  return first === last ? first : `${first} \u2013 ${last}`;
}

// ---- orchestration --------------------------------------------------------
function render(matches) {
  const standings = computeStandings(matches);
  renderStandings(matches, standings);
  renderQualified(matches, standings);
  renderKnockouts(matches, standings);
}

startLiveData(render, 30000);
