const table = document.querySelector("table");
const searchInput = document.querySelector("#search-input");
const perPageSelection = document.querySelector("#per-page");
const previousPageBtn = document.querySelector(".pagination-left-icon ");
const nextPageBtn = document.querySelector(".pagination-right-icon ");
const totalPages = document.querySelector(".remaining-pages").textContent

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
    if(page === 1) return;
  const destURL = new URL(window.location.href);
  destURL.searchParams.set("perPage", perPage);
  destURL.searchParams.set("page", page - 1);
    if(!table) {
        destURL.searchParams.set('page', totalPages)
    }
  window.location.assign(destURL);
});

nextPageBtn.addEventListener("click", () => {
  const perPage = parseInt(urlParams.get("perPage")) || 100;
  const page = parseInt(urlParams.get("page")) || 1;
    if(page >= parseInt(totalPages) || parseInt(totalPages) === -1) return;
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
