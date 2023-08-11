const table = document.querySelector("table");
const searchInput = document.querySelector("#search-input");
const perPageSelection = document.querySelector("#per-page");
const previousPageBtn = document.querySelector(".pagination-left-icon ");
const nextPageBtn = document.querySelector(".pagination-right-icon ");
const totalPages = document.querySelector(".remaining-pages").textContent;
const columns = document.querySelectorAll(".col-name");

let currCol = -1;
let prevCol = -1;
let prevSortIcon;
let prevAscendingSortIcon;
let prevDescendingSortIcon;
let currSortIcon;
let currAscendingSortIcon;
let currDescendingSortIcon;

const cmp = (a, b, asc) => {
  if (parseFloat(a) && parseFloat(b)) {
    const valA = parseFloat(a);
    const valB = parseFloat(b);
    if (asc) return valA === valB ? 0 : valA < valB ? -1 : 1;
    return valA === valB ? 0 : valB < valA ? -1 : 1;
  }
  if (asc) return a === b ? 0 : a < b ? -1 : 1;
  return a === b ? 0 : b < a ? -1 : 1;
};
const sortBy = (col, isAscending) => {
  const rows = table.rows.length;
  const cols = table.rows[0].cells.length;

  if (isAscending === 1) {
    tableData.sort((a, b) => cmp(a[col], b[col], 1));
  } else {
    tableData.sort((a, b) => cmp(a[col], b[col], 0));
  }
  console.log(tableData);
  for (let ro = 1; ro < rows; ro++) {
    for (let co = 0; co < cols; co++) {
      table.rows[ro].cells[co].textContent =
        tableData[ro - 1][table.rows[0].cells[co].textContent];
    }
  }
};

columns.forEach((col) => {
  let cPrev = "mixed";
  if (!table) return;
  col.addEventListener("click", () => {
    prevCol = currCol;
    prevSortIcon = currSortIcon;
    prevAscendingSortIcon = currAscendingSortIcon;
    prevDescendingSortIcon = currDescendingSortIcon;
    const id = col.id.split("-")[1];
    currCol = id;
    if (prevCol != currCol) {
      if (prevCol != -1) {
        cPrev = "mixed";
        prevSortIcon.classList.remove("hidden");
        prevAscendingSortIcon.classList.add("hidden");
        prevDescendingSortIcon.classList.add("hidden");
      }
    }
    currSortIcon = document.querySelector(".fa-sort-" + currCol);
    currAscendingSortIcon = document.querySelector(".fa-sort-down-" + currCol);
    currDescendingSortIcon = document.querySelector(".fa-sort-up-" + currCol);
    if (cPrev === "mixed") {
      sortBy(col.textContent, 1);
      cPrev = "ascending";
      currSortIcon.classList.add("hidden");
      currAscendingSortIcon.classList.remove("hidden");
    } else if (cPrev === "ascending") {
      sortBy(col.textContent, 0);
      cPrev = "descending";
      currAscendingSortIcon.classList.add("hidden");
      currDescendingSortIcon.classList.remove("hidden");
    } else if (cPrev === "descending") {
      sortBy(col.textContent, 1);
      cPrev = "ascending";
      currDescendingSortIcon.classList.add("hidden");
      currAscendingSortIcon.classList.remove("hidden");
    }
  });
});

perPageSelection.addEventListener("change", () => {
  const perPage = perPageSelection.value;
  const url = new URL(window.location.href);
  url.searchParams.set("perPage", perPage);
  window.location.assign(url);
});

const urlParams = new URLSearchParams(window.location.search);
perPageSelection.value = urlParams.get("perPage") || 100;

searchInput.addEventListener("input", (e) => {
  const searchTerm = searchInput.value.toLowerCase();
  console.log("Searched term", searchTerm);
  if (searchTerm === "") showAllRows();
  showMatchedRows(searchTerm);
});

previousPageBtn.addEventListener("click", () => {
  const perPage = urlParams.get("perPage") || 100;
  const page = parseInt(urlParams.get("page")) || 1;
  if (page === 1) return;
  const destURL = new URL(window.location.href);
  destURL.searchParams.set("perPage", perPage);
  destURL.searchParams.set("page", page - 1);
  if (!table) {
    destURL.searchParams.set("page", totalPages);
  }
  window.location.assign(destURL);
});

nextPageBtn.addEventListener("click", () => {
  const perPage = parseInt(urlParams.get("perPage")) || 100;
  const page = parseInt(urlParams.get("page")) || 1;
  if (page >= parseInt(totalPages) || parseInt(totalPages) === -1) return;
  const destURL = new URL(window.location.href);
  destURL.searchParams.set("perPage", perPage);
  destURL.searchParams.set("page", page + 1);
  window.location.assign(destURL);
});

const showAllRows = () => {
  for (let i = 1; i < table.rows.length; i++) {
    table.rows[i].classList.remove("hidden");
  }
};

const showMatchedRows = (searchTerm) => {
  for (let i = 1; i < table.rows.length; i++) {
    let matches = false;
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      if (table.rows[i].cells[j].textContent.toLowerCase().includes(searchTerm))
        matches = true;
    }
    if (!matches) table.rows[i].classList.add("hidden");
    else table.rows[i].classList.remove("hidden");
  }
};

const getTableData = () => {
  const data = [];
  for (let i = 1; i < table.rows.length; i++) {
    const obj = {};
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      obj[table.rows[0].cells[j].textContent] =
        table.rows[i].cells[j].textContent;
    }
    data.push(obj);
  }
  return data;
};

const tableData = getTableData();
