const table = document.querySelector('table')
const searchInput = document.querySelector('#search-input')

searchInput.addEventListener('input', (e) => {
    const searchTerm = searchInput.value.toLowerCase();
    console.log("Searched term", searchTerm);
    if(searchTerm === '') showAllRows();
    showMatchedRows(searchTerm);
});

const showAllRows = () => {
    for(let i = 1; i < table.rows.length; i++) {
        table.rows[i].classList.remove('hidden')
    }
}

const showMatchedRows = (searchTerm) => {
    for(let i = 1; i < table.rows.length; i++) {
        let matches = false;
        for(let j = 0; j < table.rows[i].cells.length; j++) {
            if(table.rows[i].cells[j].textContent.toLowerCase().includes(searchTerm)) matches = true;
        }
        if(!matches) table.rows[i].classList.add('hidden');
        else table.rows[i].classList.remove('hidden');
    }
}


const getTableData = () => {
    const data = []
    for(let i = 1; i < table.rows.length; i++) {
        const obj = {}
        for(let j = 0; j < table.rows[i].cells.length; j++) {
            obj[table.rows[0].cells[j].textContent] = table.rows[i].cells[j].textContent;
        }
        data.push(obj);
    }
    return data;
}

const tableData = getTableData();


