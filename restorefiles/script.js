const walkGrid = document.getElementById("walk-grid");
const cellSize = 22;
const trailLength = 12;
const stepDelay = 130;
const walkerCount = 10;
const regionColumns = 5;
const regionRows = 2;

let columns = 0;
let rows = 0;
let walkers = [];
let cells = [];
let walkTimer = 0;
let resizeTimer = 0;

function cellAt(column, row) {
  return cells[row * columns + column];
}

function renderWalks() {
  cells.forEach((cell) => cell.classList.remove("is-head", "is-trail"));

  walkers.forEach((walker) => {
    walker.trail.forEach(({ column, row }) => {
      cellAt(column, row)?.classList.add("is-trail");
    });
  });

  walkers.forEach((walker) => {
    cellAt(walker.column, walker.row)?.classList.add("is-head");
  });
}

function createWalkers() {
  walkers = Array.from({ length: walkerCount }, (_, index) => {
    const regionColumn = index % regionColumns;
    const regionRow = Math.floor(index / regionColumns) % regionRows;
    const minColumn = Math.floor((regionColumn * columns) / regionColumns);
    const maxColumn = Math.max(
      minColumn,
      Math.floor(((regionColumn + 1) * columns) / regionColumns) - 1,
    );
    const minRow = Math.floor((regionRow * rows) / regionRows);
    const maxRow = Math.max(
      minRow,
      Math.floor(((regionRow + 1) * rows) / regionRows) - 1,
    );

    return {
      column: minColumn + Math.floor(Math.random() * (maxColumn - minColumn + 1)),
      row: minRow + Math.floor(Math.random() * (maxRow - minRow + 1)),
      minColumn,
      maxColumn,
      minRow,
      maxRow,
      trail: [],
    };
  });
}

function buildWalkGrid() {
  columns = Math.ceil(window.innerWidth / cellSize);
  rows = Math.ceil(window.innerHeight / cellSize);
  walkGrid.style.setProperty("--walk-columns", columns);
  walkGrid.style.setProperty("--walk-rows", rows);
  walkGrid.style.width = `${columns * cellSize}px`;
  walkGrid.style.height = `${rows * cellSize}px`;

  const fragment = document.createDocumentFragment();
  for (let index = 0; index < columns * rows; index++) {
    const cell = document.createElement("span");
    cell.className = "walk-cell";
    fragment.appendChild(cell);
  }

  walkGrid.replaceChildren(fragment);
  cells = Array.from(walkGrid.children);
  createWalkers();
  renderWalks();
}

function takeRandomStep(walker) {
  const directions = [
    { column: 1, row: 0 },
    { column: -1, row: 0 },
    { column: 0, row: 1 },
    { column: 0, row: -1 },
  ];
  let available = [];

  while (!available.length) {
    const blockedCells = new Set(
      walker.trail.map(({ column, row }) => `${column},${row}`),
    );

    available = directions.filter(({ column, row }) => {
      const nextColumn = walker.column + column;
      const nextRow = walker.row + row;
      return (
        nextColumn >= walker.minColumn &&
        nextColumn <= walker.maxColumn &&
        nextRow >= walker.minRow &&
        nextRow <= walker.maxRow &&
        !blockedCells.has(`${nextColumn},${nextRow}`)
      );
    });

    if (!available.length) {
      if (!walker.trail.length) {
        break;
      }
      walker.trail.shift();
    }
  }

  const direction = available[Math.floor(Math.random() * available.length)];
  if (!direction) {
    return;
  }

  walker.trail.push({ column: walker.column, row: walker.row });
  walker.trail = walker.trail.slice(-trailLength);
  walker.column += direction.column;
  walker.row += direction.row;
}

function advanceWalkers() {
  walkers.forEach(takeRandomStep);
  renderWalks();
}

buildWalkGrid();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  walkTimer = window.setInterval(advanceWalkers, stepDelay);
}

window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(buildWalkGrid, 120);
});
