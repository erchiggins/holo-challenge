const input = {
    original: "[{ 'a': 1, 'b': 3, 'c': 10 },{ 'a': 3, 'b': 20, 'c': 12 },{ 'a': -1, 'b': -5, 'c': -4 }]",
    wide: "[{ 'a': 1, 'b': 3, 'c': 10 },{ 'a': 3, 'b': 20, 'c': 12 },{ 'a': -1, 'b': -5, 'c': -4 }]",
    long: "[{ 'a': 1, 'b': 3, 'c': 10 },{ 'a': 3, 'b': 20, 'c': 12 },{ 'a': -1, 'b': -5, 'c': -4 }]"
}

let dataset = {
    name: "",
    data: []
};

window.onload = function() {
    // load input values if not hardcoded
    applyButtonListeners();
    // select original dataset when page loads
    selectDataset('original');
}

// add event listeners to buttons which load original, wide, and long datasets
function applyButtonListeners() {
    const cd = document.getElementById('choose_data');
    for (let element of cd.children) {
        const id = element.id;
        element.firstElementChild.onclick = () => {
            selectDataset(id);
        }
    }
}

// set 'dataset' to the desired values and build corresponding table and chart.
function selectDataset(name) {
    let datastring = "";
    // for hardcoded data
    if (name === 'original') {
        datastring = input.original.replace(/'/g, '"');
    } else if (name === 'wide') {
        datastring = input.wide.replace(/'/g, '"');
    } else if (name === 'long') {
        datastring = input.long.replace(/'/g, '"');
    }
    if (datastring) {
        dataset.name = name;
        dataset.data = JSON.parse(datastring);
    }
    buildTable();
    buildChart();
}

// construct tabular representation of dataset
function buildTable() {
    const table_data = document.getElementById('table_data');
    // check that dataset is not empty
    if (dataset.data.length) {
        // construct top row of table for arbitrary key values
        const table_header = document.getElementById('table_header');
        table_header.innerHTML = '';
        for (let property in dataset.data[0]) {
            table_header.appendChild(createBlock(property));
        }
        // add successive rows of values for each key
        for (let item of dataset.data) {
            const row_div = document.createElement('div');
            table_data.appendChild(row_div);
            for (let property in item) {
                row_div.appendChild(createBlock(item[property]));
            }
        }
    }
}

// construct an element to display an entry on the data table
function createBlock(text) {
    const newSpan = document.createElement('div');
    newSpan.className = 'table_block';
    const newP = document.createElement('p');
    newP.innerText = text;
    newSpan.appendChild(newP);
    return newSpan;
}

// construct line chart representation of dataset
function buildChart() {
    const lc = document.getElementById('line_chart');
    const ctx = lc.getContext('2d');
    const sorted_data = dataset.data.sort((d0, d1) => (d0.a > d1.a) ? 1 : -1);
    console.log(sorted_data);
    let lines = {};
    sorted_data.forEach((element) => {
        for (let property in element) {
            if (lines[property]) {
                lines[property].push(element[property]);
            } else {
                lines[property] = [element[property]];
            }
        }
    });
    console.log(lines);
}