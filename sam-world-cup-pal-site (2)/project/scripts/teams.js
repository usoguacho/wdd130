// ==========================================================================
// World Cup Pal - Teams page
// Renders team cards from an array of objects, filters them by confederation
// and search text, and lets visitors save favorites to localStorage.
// ==========================================================================

const teams = [
  { name: "Mexico", confederation: "CONCACAF", flag: "images/mexico.jpg", note: "Co-host nation; opens the tournament at Estadio Azteca." },
  { name: "United States", confederation: "CONCACAF", flag: "images/usax.jpg", note: "Co-host nation; opens against Paraguay in Los Angeles." },
  { name: "Canada", confederation: "CONCACAF", flag: "images/canada.jpg", note: "Co-host nation; plays an early match at BMO Field in Toronto." },
  { name: "Argentina", confederation: "CONMEBOL", flag: "images/argentina.jpg", note: "Reigning champions from the 2022 World Cup." },
  { name: "Brazil", confederation: "CONMEBOL", flag: "images/brazil.jpg", note: "Record five-time world champions." },
  { name: "France", confederation: "UEFA", flag: "images/france.jpg", note: "Champions in 2018 and finalists in 2022." },
  { name: "Germany", confederation: "UEFA", flag: "images/germanyx.jpg", note: "Four-time world champions." },
  { name: "England", confederation: "UEFA", flag: "images/england.jpg", note: "Champions in 1966 and recent semifinalists." },
  { name: "Netherlands", confederation: "UEFA", flag: "images/netherlandsx.jpg", note: "Three-time World Cup finalists." },
  { name: "Japan", confederation: "AFC", flag: "images/japanx.jpg", note: "Asian contenders aiming to reach the knockout rounds." }
];

const STORAGE_KEY = "wcpal-favorites";

// Read the saved favorites array from localStorage.
function getFavorites() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
}

// Save the favorites array to localStorage.
function saveFavorites(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Build the HTML for a single team card using a template literal.
function buildTeamCard(team, favorites) {
  const isFav = favorites.includes(team.name);
  const favClass = isFav ? "fav-btn is-fav" : "fav-btn";
  const favLabel = isFav ? "\u2605 Saved" : "\u2606 Save";

  return `
    <article class="team-card">
      <img src="${team.flag}" alt="Flag of ${team.name}" width="60" height="40" loading="lazy">
      <h3>${team.name}</h3>
      <p class="group-tag">${team.confederation}</p>
      <p>${team.note}</p>
      <button class="${favClass}" data-team="${team.name}">${favLabel}</button>
    </article>`;
}

// Filter the team list and redraw the grid.
function renderTeams() {
  const grid = document.querySelector("#team-grid");
  const count = document.querySelector("#result-count");
  const confValue = document.querySelector("#confederation").value;
  const searchValue = document.querySelector("#search").value.toLowerCase();
  const favorites = getFavorites();

  const filtered = teams.filter(function (team) {
    const matchesConf = confValue === "all" || team.confederation === confValue;
    const matchesSearch = team.name.toLowerCase().includes(searchValue);
    return matchesConf && matchesSearch;
  });

  // Conditional branching for the empty state.
  if (filtered.length === 0) {
    grid.innerHTML = `<p>No teams match your filters. Try a different search.</p>`;
  } else {
    grid.innerHTML = filtered
      .map(function (team) {
        return buildTeamCard(team, favorites);
      })
      .join("");
  }

  count.textContent = `Showing ${filtered.length} of ${teams.length} teams.`;
  attachFavButtons();
}

// Attach click handlers to every Save button currently on the page.
function attachFavButtons() {
  const buttons = document.querySelectorAll(".fav-btn");
  buttons.forEach(function (button) {
    button.addEventListener("click", handleFavClick);
  });
}

// Toggle a team in and out of the favorites list.
function handleFavClick(event) {
  const name = event.target.dataset.team;
  let favorites = getFavorites();

  if (favorites.includes(name)) {
    favorites = favorites.filter(function (item) {
      return item !== name;
    });
  } else {
    favorites.push(name);
  }

  saveFavorites(favorites);
  renderTeams();
}

document.querySelector("#confederation").addEventListener("change", renderTeams);
document.querySelector("#search").addEventListener("input", renderTeams);

renderTeams();
