// ==========================================================================
// World Cup Pal - shared data + utilities (load before page scripts)
// Holds the team directory, an embedded match seed (so the site works even
// when opened from a file), live-data polling, time formatting in Pacific
// time, and group standings computation.
// ==========================================================================

const PT_TZ = "America/Los_Angeles";
const GROUP_LETTERS = ["A","B","C","D","E","F","G","H","I","J","K","L"];
const FAVORITES = ["Argentina", "France", "United States", "Mexico", "Japan", "Brazil"];
const PLACEHOLDER_FLAG = "images/logo.jpg";

// name -> { flag, group }
const TEAMS = {
  "Algeria": { flag: "images/algeria.jpg", group: "J" },
  "Argentina": { flag: "images/argentina.jpg", group: "J" },
  "Australia": { flag: "images/australia.jpg", group: "D" },
  "Austria": { flag: "images/austria.jpg", group: "J" },
  "Belgium": { flag: "images/belgium.jpg", group: "G" },
  "Bosnia and Herzegovina": { flag: "images/bosnia.jpg", group: "B" },
  "Brazil": { flag: "images/brazil.jpg", group: "C" },
  "Canada": { flag: "images/canada.jpg", group: "B" },
  "Cape Verde": { flag: "images/capeverde.jpg", group: "H" },
  "Colombia": { flag: "images/colombia.jpg", group: "K" },
  "Croatia": { flag: "images/croatia.jpg", group: "L" },
  "Curaçao": { flag: "images/curacao.jpg", group: "E" },
  "Czechia": { flag: "images/czechia.jpg", group: "A" },
  "DR Congo": { flag: "images/drcongo.jpg", group: "K" },
  "Ecuador": { flag: "images/ecuador.jpg", group: "E" },
  "Egypt": { flag: "images/egypt.jpg", group: "G" },
  "England": { flag: "images/england.jpg", group: "L" },
  "France": { flag: "images/france.jpg", group: "I" },
  "Germany": { flag: "images/germanyx.jpg", group: "E" },
  "Ghana": { flag: "images/ghana.jpg", group: "L" },
  "Haiti": { flag: "images/haiti.jpg", group: "C" },
  "Iran": { flag: "images/iran.jpg", group: "G" },
  "Iraq": { flag: "images/iraq.jpg", group: "I" },
  "Ivory Coast": { flag: "images/ivory_coast.jpg", group: "E" },
  "Japan": { flag: "images/japanx.jpg", group: "F" },
  "Jordan": { flag: "images/jordan.jpg", group: "J" },
  "Mexico": { flag: "images/mexico.jpg", group: "A" },
  "Morocco": { flag: "images/morocco.jpg", group: "C" },
  "Netherlands": { flag: "images/netherlandsx.jpg", group: "F" },
  "New Zealand": { flag: "images/nz.jpg", group: "G" },
  "Norway": { flag: "images/norway.jpg", group: "I" },
  "Panama": { flag: "images/panama.jpg", group: "L" },
  "Paraguay": { flag: "images/paraguay.jpg", group: "D" },
  "Portugal": { flag: "images/portugal.jpg", group: "K" },
  "Qatar": { flag: "images/qatar.jpg", group: "B" },
  "Saudi Arabia": { flag: "images/saudi.jpg", group: "H" },
  "Scotland": { flag: "images/scotland.jpg", group: "C" },
  "Senegal": { flag: "images/senegal.jpg", group: "I" },
  "South Africa": { flag: "images/safrica.jpg", group: "A" },
  "South Korea": { flag: "images/skorea.jpg", group: "A" },
  "Spain": { flag: "images/spain.jpg", group: "H" },
  "Sweden": { flag: "images/sweden.jpg", group: "F" },
  "Switzerland": { flag: "images/switzerlandx.jpg", group: "B" },
  "Tunisia": { flag: "images/tunisia.jpg", group: "F" },
  "Türkiye": { flag: "images/turkey.jpg", group: "D" },
  "United States": { flag: "images/usax.jpg", group: "D" },
  "Uruguay": { flag: "images/uruguay.jpg", group: "H" },
  "Uzbekistan": { flag: "images/uzbekistan.jpg", group: "K" }
};

// Embedded baseline data; live updates from data/matches.json override this.
const MATCHES_SEED = [
  {
    "id": "A1",
    "group": "A",
    "home": "Mexico",
    "away": "South Africa",
    "kickoff": "2026-06-11T12:00:00-07:00",
    "status": "FINAL",
    "hs": 2,
    "as": 0
  },
  {
    "id": "A2",
    "group": "A",
    "home": "South Korea",
    "away": "Czechia",
    "kickoff": "2026-06-11T19:00:00-07:00",
    "status": "FINAL",
    "hs": 2,
    "as": 1
  },
  {
    "id": "A3",
    "group": "A",
    "home": "Czechia",
    "away": "South Africa",
    "kickoff": "2026-06-18T09:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "A4",
    "group": "A",
    "home": "Mexico",
    "away": "South Korea",
    "kickoff": "2026-06-18T18:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "A5",
    "group": "A",
    "home": "Czechia",
    "away": "Mexico",
    "kickoff": "2026-06-24T18:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "A6",
    "group": "A",
    "home": "South Africa",
    "away": "South Korea",
    "kickoff": "2026-06-24T18:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "B1",
    "group": "B",
    "home": "Canada",
    "away": "Bosnia and Herzegovina",
    "kickoff": "2026-06-12T12:00:00-07:00",
    "status": "FINAL",
    "hs": 1,
    "as": 1
  },
  {
    "id": "B2",
    "group": "B",
    "home": "Qatar",
    "away": "Switzerland",
    "kickoff": "2026-06-13T12:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "B3",
    "group": "B",
    "home": "Switzerland",
    "away": "Bosnia and Herzegovina",
    "kickoff": "2026-06-18T12:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "B4",
    "group": "B",
    "home": "Canada",
    "away": "Qatar",
    "kickoff": "2026-06-18T15:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "B5",
    "group": "B",
    "home": "Switzerland",
    "away": "Canada",
    "kickoff": "2026-06-24T12:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "B6",
    "group": "B",
    "home": "Bosnia and Herzegovina",
    "away": "Qatar",
    "kickoff": "2026-06-24T12:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "C1",
    "group": "C",
    "home": "Brazil",
    "away": "Morocco",
    "kickoff": "2026-06-13T15:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "C2",
    "group": "C",
    "home": "Haiti",
    "away": "Scotland",
    "kickoff": "2026-06-13T18:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "C3",
    "group": "C",
    "home": "Scotland",
    "away": "Morocco",
    "kickoff": "2026-06-19T15:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "C4",
    "group": "C",
    "home": "Brazil",
    "away": "Haiti",
    "kickoff": "2026-06-19T17:30:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "C5",
    "group": "C",
    "home": "Scotland",
    "away": "Brazil",
    "kickoff": "2026-06-24T15:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "C6",
    "group": "C",
    "home": "Morocco",
    "away": "Haiti",
    "kickoff": "2026-06-24T15:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "D1",
    "group": "D",
    "home": "United States",
    "away": "Paraguay",
    "kickoff": "2026-06-12T18:00:00-07:00",
    "status": "FINAL",
    "hs": 4,
    "as": 1
  },
  {
    "id": "D2",
    "group": "D",
    "home": "Australia",
    "away": "Türkiye",
    "kickoff": "2026-06-13T18:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "D3",
    "group": "D",
    "home": "United States",
    "away": "Australia",
    "kickoff": "2026-06-19T12:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "D4",
    "group": "D",
    "home": "Türkiye",
    "away": "Paraguay",
    "kickoff": "2026-06-19T21:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "D5",
    "group": "D",
    "home": "Türkiye",
    "away": "United States",
    "kickoff": "2026-06-25T19:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "D6",
    "group": "D",
    "home": "Paraguay",
    "away": "Australia",
    "kickoff": "2026-06-25T19:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "E1",
    "group": "E",
    "home": "Germany",
    "away": "Curaçao",
    "kickoff": "2026-06-14T10:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "E2",
    "group": "E",
    "home": "Ivory Coast",
    "away": "Ecuador",
    "kickoff": "2026-06-14T16:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "E3",
    "group": "E",
    "home": "Germany",
    "away": "Ivory Coast",
    "kickoff": "2026-06-20T13:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "E4",
    "group": "E",
    "home": "Ecuador",
    "away": "Curaçao",
    "kickoff": "2026-06-20T17:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "E5",
    "group": "E",
    "home": "Ecuador",
    "away": "Germany",
    "kickoff": "2026-06-25T13:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "E6",
    "group": "E",
    "home": "Curaçao",
    "away": "Ivory Coast",
    "kickoff": "2026-06-25T13:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "F1",
    "group": "F",
    "home": "Netherlands",
    "away": "Japan",
    "kickoff": "2026-06-14T13:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "F2",
    "group": "F",
    "home": "Sweden",
    "away": "Tunisia",
    "kickoff": "2026-06-14T19:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "F3",
    "group": "F",
    "home": "Netherlands",
    "away": "Sweden",
    "kickoff": "2026-06-20T10:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "F4",
    "group": "F",
    "home": "Tunisia",
    "away": "Japan",
    "kickoff": "2026-06-20T21:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "F5",
    "group": "F",
    "home": "Japan",
    "away": "Sweden",
    "kickoff": "2026-06-25T16:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "F6",
    "group": "F",
    "home": "Tunisia",
    "away": "Netherlands",
    "kickoff": "2026-06-25T16:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "G1",
    "group": "G",
    "home": "Belgium",
    "away": "Egypt",
    "kickoff": "2026-06-15T12:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "G2",
    "group": "G",
    "home": "Iran",
    "away": "New Zealand",
    "kickoff": "2026-06-15T18:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "G3",
    "group": "G",
    "home": "Belgium",
    "away": "Iran",
    "kickoff": "2026-06-21T12:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "G4",
    "group": "G",
    "home": "New Zealand",
    "away": "Egypt",
    "kickoff": "2026-06-21T18:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "G5",
    "group": "G",
    "home": "Egypt",
    "away": "Iran",
    "kickoff": "2026-06-26T20:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "G6",
    "group": "G",
    "home": "New Zealand",
    "away": "Belgium",
    "kickoff": "2026-06-26T20:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "H1",
    "group": "H",
    "home": "Spain",
    "away": "Cape Verde",
    "kickoff": "2026-06-15T09:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "H2",
    "group": "H",
    "home": "Saudi Arabia",
    "away": "Uruguay",
    "kickoff": "2026-06-15T15:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "H3",
    "group": "H",
    "home": "Spain",
    "away": "Saudi Arabia",
    "kickoff": "2026-06-21T09:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "H4",
    "group": "H",
    "home": "Uruguay",
    "away": "Cape Verde",
    "kickoff": "2026-06-21T15:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "H5",
    "group": "H",
    "home": "Cape Verde",
    "away": "Saudi Arabia",
    "kickoff": "2026-06-26T17:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "H6",
    "group": "H",
    "home": "Uruguay",
    "away": "Spain",
    "kickoff": "2026-06-26T17:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "I1",
    "group": "I",
    "home": "France",
    "away": "Senegal",
    "kickoff": "2026-06-16T12:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "I2",
    "group": "I",
    "home": "Iraq",
    "away": "Norway",
    "kickoff": "2026-06-16T15:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "I3",
    "group": "I",
    "home": "France",
    "away": "Iraq",
    "kickoff": "2026-06-22T14:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "I4",
    "group": "I",
    "home": "Norway",
    "away": "Senegal",
    "kickoff": "2026-06-22T17:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "I5",
    "group": "I",
    "home": "Norway",
    "away": "France",
    "kickoff": "2026-06-26T12:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "I6",
    "group": "I",
    "home": "Senegal",
    "away": "Iraq",
    "kickoff": "2026-06-26T12:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "J1",
    "group": "J",
    "home": "Argentina",
    "away": "Algeria",
    "kickoff": "2026-06-16T18:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "J2",
    "group": "J",
    "home": "Austria",
    "away": "Jordan",
    "kickoff": "2026-06-16T21:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "J3",
    "group": "J",
    "home": "Argentina",
    "away": "Austria",
    "kickoff": "2026-06-22T10:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "J4",
    "group": "J",
    "home": "Jordan",
    "away": "Algeria",
    "kickoff": "2026-06-22T20:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "J5",
    "group": "J",
    "home": "Algeria",
    "away": "Austria",
    "kickoff": "2026-06-27T19:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "J6",
    "group": "J",
    "home": "Jordan",
    "away": "Argentina",
    "kickoff": "2026-06-27T19:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "K1",
    "group": "K",
    "home": "Portugal",
    "away": "DR Congo",
    "kickoff": "2026-06-17T10:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "K2",
    "group": "K",
    "home": "Uzbekistan",
    "away": "Colombia",
    "kickoff": "2026-06-17T19:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "K3",
    "group": "K",
    "home": "Portugal",
    "away": "Uzbekistan",
    "kickoff": "2026-06-23T10:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "K4",
    "group": "K",
    "home": "Colombia",
    "away": "DR Congo",
    "kickoff": "2026-06-23T19:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "K5",
    "group": "K",
    "home": "Colombia",
    "away": "Portugal",
    "kickoff": "2026-06-27T16:30:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "K6",
    "group": "K",
    "home": "DR Congo",
    "away": "Uzbekistan",
    "kickoff": "2026-06-27T16:30:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "L1",
    "group": "L",
    "home": "England",
    "away": "Croatia",
    "kickoff": "2026-06-17T13:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "L2",
    "group": "L",
    "home": "Ghana",
    "away": "Panama",
    "kickoff": "2026-06-17T16:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "L3",
    "group": "L",
    "home": "England",
    "away": "Ghana",
    "kickoff": "2026-06-23T13:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "L4",
    "group": "L",
    "home": "Panama",
    "away": "Croatia",
    "kickoff": "2026-06-23T16:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "L5",
    "group": "L",
    "home": "Panama",
    "away": "England",
    "kickoff": "2026-06-27T14:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  },
  {
    "id": "L6",
    "group": "L",
    "home": "Croatia",
    "away": "Ghana",
    "kickoff": "2026-06-27T14:00:00-07:00",
    "status": "SCHEDULED",
    "hs": null,
    "as": null
  }
];

// ----- small lookups -------------------------------------------------------
function flagFor(name) {
  const team = TEAMS[name];
  return team && team.flag ? team.flag : PLACEHOLDER_FLAG;
}

function groupFor(name) {
  const team = TEAMS[name];
  return team ? team.group : "";
}

function isFavorite(name) {
  return FAVORITES.includes(name);
}

// ----- time formatting in Pacific time -------------------------------------
function formatKickoff(iso) {
  const when = new Date(iso);
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: PT_TZ, weekday: "short", month: "short", day: "numeric"
  }).format(when);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: PT_TZ, hour: "numeric", minute: "2-digit"
  }).format(when);
  return `${day} · ${time} PT`;
}

function formatTimeOnly(iso) {
  return `${new Intl.DateTimeFormat("en-US", {
    timeZone: PT_TZ, hour: "numeric", minute: "2-digit"
  }).format(new Date(iso))} PT`;
}

// ----- score line helpers --------------------------------------------------
// Returns a small status object the renderers can use.
function statusInfo(match) {
  if (match.status === "FINAL") {
    return { label: "Final", cls: "is-final", live: false };
  }
  if (match.status === "LIVE") {
    const extra = match.minute ? `${match.minute}'` : "Live";
    return { label: extra, cls: "is-live", live: true };
  }
  return { label: formatTimeOnly(match.kickoff), cls: "is-sched", live: false };
}

function scoreText(match) {
  if (match.status === "SCHEDULED" || match.hs === null || match.hs === undefined) {
    return "vs";
  }
  return `${match.hs} - ${match.as}`;
}

// ----- live data loader ----------------------------------------------------
// Renders immediately from the seed, then polls the JSON for live changes.
function startLiveData(onUpdate, intervalMs) {
  onUpdate(MATCHES_SEED);

  async function tick() {
    try {
      const res = await fetch("data/matches.json", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        onUpdate(data);
      }
    } catch (err) {
      // Offline or opened from a file path: keep showing the embedded seed.
      console.log("Live data unavailable, using embedded schedule.");
    }
  }

  tick();
  return setInterval(tick, intervalMs);
}

// ----- standings -----------------------------------------------------------
// Builds sorted group tables from FINAL matches.
function computeStandings(matches) {
  const rows = {};
  Object.keys(TEAMS).forEach(function (name) {
    rows[name] = { team: name, group: TEAMS[name].group, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
  });

  matches.forEach(function (m) {
    if (m.status !== "FINAL") { return; }
    const h = rows[m.home];
    const a = rows[m.away];
    if (!h || !a) { return; }
    h.p++; a.p++;
    h.gf += m.hs; h.ga += m.as;
    a.gf += m.as; a.ga += m.hs;
    if (m.hs > m.as) { h.w++; a.l++; h.pts += 3; }
    else if (m.hs < m.as) { a.w++; h.l++; a.pts += 3; }
    else { h.d++; a.d++; h.pts++; a.pts++; }
  });

  Object.values(rows).forEach(function (r) { r.gd = r.gf - r.ga; });

  const byGroup = {};
  GROUP_LETTERS.forEach(function (g) {
    byGroup[g] = Object.values(rows)
      .filter(function (r) { return r.group === g; })
      .sort(function (x, y) {
        return (y.pts - x.pts) || (y.gd - x.gd) || (y.gf - x.gf) || x.team.localeCompare(y.team);
      });
  });
  return byGroup;
}

// Returns matches for one team, sorted by kickoff.
function matchesForTeam(matches, team) {
  return matches
    .filter(function (m) { return m.home === team || m.away === team; })
    .sort(function (a, b) { return new Date(a.kickoff) - new Date(b.kickoff); });
}

// Returns the next match that has not finished, or null.
function nextUpcomingMatch(matches) {
  const now = new Date();
  const upcoming = matches
    .filter(function (m) { return m.status !== "FINAL" && new Date(m.kickoff) >= now; })
    .sort(function (a, b) { return new Date(a.kickoff) - new Date(b.kickoff); });
  return upcoming.length ? upcoming[0] : null;
}

// ==========================================================================
// Knockout bracket (FIFA official structure). Each side is one of:
//   { t:"W", g:"A" }   group winner            -> auto-fills when group done
//   { t:"R", g:"B" }   group runner-up         -> auto-fills when group done
//   { t:"3", g:"A/B/C/D/F" }  one of these groups' third place (stays a label)
//   { t:"MW", m:74 }   winner of a knockout match (stays a label)
//   { t:"TBD" }        decided later in the bracket
// Round of 32 pairings follow FIFA's published bracket; later-round feeders
// are shown where confirmed, otherwise left as "to be decided".
// ==========================================================================
const KNOCKOUTS = [
  // ---- Round of 32 (Jun 28 - Jul 3) ----
  { m: 73, round: "Round of 32", venue: "Los Angeles", kickoff: "2026-06-28T12:00:00-07:00", home: { t: "R", g: "A" }, away: { t: "R", g: "B" } },
  { m: 76, round: "Round of 32", venue: "Houston", kickoff: "2026-06-29T10:00:00-07:00", home: { t: "W", g: "C" }, away: { t: "R", g: "F" } },
  { m: 74, round: "Round of 32", venue: "Boston", kickoff: "2026-06-29T13:30:00-07:00", home: { t: "W", g: "E" }, away: { t: "3", g: "A/B/C/D/F" } },
  { m: 75, round: "Round of 32", venue: "Monterrey", kickoff: "2026-06-29T18:00:00-07:00", home: { t: "W", g: "F" }, away: { t: "R", g: "C" } },
  { m: 78, round: "Round of 32", venue: "Dallas", kickoff: "2026-06-30T10:00:00-07:00", home: { t: "R", g: "E" }, away: { t: "R", g: "I" } },
  { m: 77, round: "Round of 32", venue: "New York / New Jersey", kickoff: "2026-06-30T14:00:00-07:00", home: { t: "W", g: "I" }, away: { t: "3", g: "C/D/F/G/H" } },
  { m: 79, round: "Round of 32", venue: "Mexico City", kickoff: "2026-06-30T18:00:00-07:00", home: { t: "W", g: "A" }, away: { t: "3", g: "C/E/F/H/I" } },
  { m: 80, round: "Round of 32", venue: "Atlanta", kickoff: "2026-07-01T09:00:00-07:00", home: { t: "W", g: "L" }, away: { t: "3", g: "E/H/I/J/K" } },
  { m: 82, round: "Round of 32", venue: "Seattle", kickoff: "2026-07-01T13:00:00-07:00", home: { t: "W", g: "G" }, away: { t: "3", g: "A/E/H/I/J" } },
  { m: 81, round: "Round of 32", venue: "San Francisco Bay Area", kickoff: "2026-07-01T14:00:00-07:00", home: { t: "W", g: "D" }, away: { t: "3", g: "B/E/F/I/J" } },
  { m: 84, round: "Round of 32", venue: "Los Angeles", kickoff: "2026-07-02T12:00:00-07:00", home: { t: "W", g: "H" }, away: { t: "R", g: "J" } },
  { m: 83, round: "Round of 32", venue: "Toronto", kickoff: "2026-07-02T16:00:00-07:00", home: { t: "R", g: "K" }, away: { t: "R", g: "L" } },
  { m: 85, round: "Round of 32", venue: "Vancouver", kickoff: "2026-07-02T20:00:00-07:00", home: { t: "W", g: "B" }, away: { t: "3", g: "E/F/G/I/J" } },
  { m: 88, round: "Round of 32", venue: "Dallas", kickoff: "2026-07-03T11:00:00-07:00", home: { t: "R", g: "D" }, away: { t: "R", g: "G" } },
  { m: 86, round: "Round of 32", venue: "Miami", kickoff: "2026-07-03T15:00:00-07:00", home: { t: "W", g: "J" }, away: { t: "R", g: "H" } },
  { m: 87, round: "Round of 32", venue: "Kansas City", kickoff: "2026-07-03T18:30:00-07:00", home: { t: "W", g: "K" }, away: { t: "3", g: "D/E/I/J/L" } },
  // ---- Round of 16 (Jul 4 - 7) ----
  { m: 90, round: "Round of 16", venue: "Houston", kickoff: "2026-07-04T10:00:00-07:00", home: { t: "MW", m: 73 }, away: { t: "MW", m: 75 } },
  { m: 89, round: "Round of 16", venue: "Philadelphia", kickoff: "2026-07-04T14:00:00-07:00", home: { t: "MW", m: 74 }, away: { t: "MW", m: 77 } },
  { m: 91, round: "Round of 16", venue: "New York / New Jersey", kickoff: "2026-07-05T13:00:00-07:00", home: { t: "MW", m: 76 }, away: { t: "MW", m: 78 } },
  { m: 92, round: "Round of 16", venue: "Mexico City", kickoff: "2026-07-05T17:00:00-07:00", home: { t: "TBD" }, away: { t: "TBD" } },
  { m: 93, round: "Round of 16", venue: "Dallas", kickoff: "2026-07-06T12:00:00-07:00", home: { t: "TBD" }, away: { t: "TBD" } },
  { m: 94, round: "Round of 16", venue: "Seattle", kickoff: "2026-07-06T17:00:00-07:00", home: { t: "TBD" }, away: { t: "TBD" } },
  { m: 95, round: "Round of 16", venue: "Atlanta", kickoff: "2026-07-07T09:00:00-07:00", home: { t: "TBD" }, away: { t: "TBD" } },
  { m: 96, round: "Round of 16", venue: "Vancouver", kickoff: "2026-07-07T13:00:00-07:00", home: { t: "TBD" }, away: { t: "TBD" } },
  // ---- Quarterfinals (Jul 9 - 11) ----
  { m: 97, round: "Quarterfinal", venue: "Boston", kickoff: "2026-07-09T13:00:00-07:00", home: { t: "TBD" }, away: { t: "TBD" } },
  { m: 98, round: "Quarterfinal", venue: "Los Angeles", kickoff: "2026-07-10T12:00:00-07:00", home: { t: "TBD" }, away: { t: "TBD" } },
  { m: 99, round: "Quarterfinal", venue: "Miami", kickoff: "2026-07-11T14:00:00-07:00", home: { t: "TBD" }, away: { t: "TBD" } },
  { m: 100, round: "Quarterfinal", venue: "Kansas City", kickoff: "2026-07-11T18:00:00-07:00", home: { t: "TBD" }, away: { t: "TBD" } },
  // ---- Semifinals (Jul 14 - 15) ----
  { m: 101, round: "Semifinal", venue: "Dallas", kickoff: "2026-07-14T12:00:00-07:00", home: { t: "TBD" }, away: { t: "TBD" } },
  { m: 102, round: "Semifinal", venue: "Atlanta", kickoff: "2026-07-15T12:00:00-07:00", home: { t: "TBD" }, away: { t: "TBD" } },
  // ---- Third-place playoff & Final ----
  { m: 103, round: "Third-Place Playoff", venue: "Miami", kickoff: "2026-07-18T14:00:00-07:00", home: { t: "TBD" }, away: { t: "TBD" } },
  { m: 104, round: "Final", venue: "New York / New Jersey", kickoff: "2026-07-19T12:00:00-07:00", home: { t: "TBD" }, away: { t: "TBD" } }
];

const KNOCKOUT_ROUNDS = ["Round of 32", "Round of 16", "Quarterfinal", "Semifinal", "Third-Place Playoff", "Final"];

// A group is "decided" once all six of its matches are FINAL.
function groupIsDecided(matches, letter) {
  return matches.filter(function (m) { return m.group === letter && m.status === "FINAL"; }).length === 6;
}

// Resolves a bracket slot to a real team (with flag) once known, else a label.
function resolveSide(side, matches, standings) {
  if (side.t === "W" || side.t === "R") {
    if (groupIsDecided(matches, side.g)) {
      const rows = standings[side.g];
      return { team: side.t === "W" ? rows[0].team : rows[1].team, label: null };
    }
    return { team: null, label: (side.t === "W" ? "Winner Group " : "Runner-up Group ") + side.g };
  }
  if (side.t === "3") { return { team: null, label: "3rd place \u00b7 Group " + side.g }; }
  if (side.t === "MW") { return { team: null, label: "Winner of Match " + side.m }; }
  return { team: null, label: "To be decided" };
}
