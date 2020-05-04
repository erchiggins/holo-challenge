// hardcoded data inputs
const input = {
    original: "[{ 'a': 1, 'b': 3, 'c': 10 },{ 'a': 3, 'b': 20, 'c': 12 },{ 'a': -1, 'b': -5, 'c': -4 }]",
    wide: "[{ 'a': 1, 'b': 3, 'c': 10, 'd': 5, 'e': 16, 'f': -10, 'g': 9, 'h': 19, 'i': 2, 'j': 0.5, 'k': 7, 'l': -15, 'm': 0}," +
        "{ 'a': 3, 'b': 20, 'c': 12, 'd': 8, 'e': 19, 'f': -17, 'g': 4, 'h': 17, 'i': 4.5, 'j': 4, 'k': -5, 'l': -3, 'm': -17 }," +
        "{ 'a': -1, 'b': -5, 'c': -4, 'd': 12, 'e': 25, 'f': -8, 'g': 4.5, 'h': 24, 'i': 3, 'j': 1.5, 'k': 0, 'l': -10, 'm': -7 }]",
    long: "[{ 'a': 1, 'b': 3, 'c': 10 },{ 'a': 3, 'b': 20, 'c': 12 },{ 'a': -1, 'b': -5, 'c': -4 },{ 'a': -2, 'b': 7, 'c': -2 }," +
        "{ 'a': 15, 'b': 10, 'c': 22}, { 'a': 12, 'b': 20, 'c': 8 },{ 'a': 7, 'b': 2, 'c': 13},{ 'a': 4.5, 'b': 0, 'c': -2 }," +
        "{ 'a': -2, 'b': -3, 'c': -9 },{ 'a': 0, 'b': -4, 'c': -1 },{ 'a': 9, 'b': 15, 'c': 7 },{ 'a': -5, 'b': -8, 'c': -3}," +
        "{ 'a': 8.5, 'b': 10, 'c': 3.5 },{ 'a': 0.5, 'b': 4, 'c': 7 },{ 'a': -3.5, 'b': -5.5, 'c': -4.5 }]"
}

// dataset currently being displayed
let dataset = {
    name: "",
    data: [],
    sorted_data: [],
    colors: {}
};

// chart object, to be modified as datasets are loaded
let chart = null;

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
    // for hardcoded data inputs
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
        // sort dataset by 'a' values for use in plotting
        dataset.sorted_data = dataset.data.sort((d0, d1) => (d0.a > d1.a) ? 1 : -1);
        // generate colors for each set of points 'b', 'c', etc.
        for (let property in dataset.data[0]) {
            dataset.colors[property] = randomColor();
        }
    }
    buildTable();
    buildChart();
}

// construct tabular representation of dataset
function buildTable() {
    // check that dataset is not empty
    if (dataset.data.length) {
        // construct top row of table for arbitrary key values
        const table_header = document.getElementById('table_header');
        table_header.innerHTML = '';
        for (let property in dataset.data[0]) {
            table_header.appendChild(createBlock(property, property));
        }
        // add successive rows of values for each key
        // displays table sorted by 'a' values for readability
        const table_body = document.getElementById('table_body');
        table_body.innerHTML = '';
        for (let item of dataset.sorted_data) {
            const row_div = document.createElement('div');
            table_body.appendChild(row_div);
            for (let property in item) {
                row_div.appendChild(createBlock(property, item[property]));
            }
        }
    }
}

// construct an element to display an entry on the data table
function createBlock(group, text) {
    const newDiv = document.createElement('div');
    newDiv.className = 'table_block';
    const newP = document.createElement('p');
    newP.innerText = text;
    newDiv.appendChild(newP);
    newDiv.style.borderColor = dataset.colors[group].border;
    newDiv.style.backgroundColor = dataset.colors[group].fill;
    return newDiv;
}

// construct line chart representation of dataset
function buildChart() {
    const lc = document.getElementById('line_chart');
    if (chart) {
        // clear canvas for new dataset
        chart.destroy();
    }
    const ctx = lc.getContext('2d');
    // all elements except for 'a' will be lines on the chart 
    let lines = {};
    dataset.sorted_data.forEach((element) => {
        for (let property in element) {
            if (property !== 'a') {
                if (lines[property]) {
                    lines[property].push({ x: element.a, y: element[property] });
                } else {
                    lines[property] = [{ x: element.a, y: element[property] }];
                }
            }
        }
    });
    // combines data points from 'lines' with formatting details
    let dataset_array = [];
    for (let line in lines) {
        if (line !== 'a') {
            dataset_array.push({
                label: line,
                data: lines[line],
                borderColor: dataset.colors[line].border,
                backgroundColor: dataset.colors[line].fill
            })
        }
    }
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: dataset_array
        },
        options: {
            title: {
                display: true,
                text: `${dataset.name} dataset`
            },
            tooltips: {
                mode: 'index'
            },
            layout: {
                padding: {
                    left: 40,
                    right: 40,
                    top: 40,
                    bottom: 40
                }
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: 'a'
                    },
                }]
            }
        }
    });
}

// generate a random color and its less-saturated counterpart
function randomColor() {
    const r = Math.floor(255 * Math.random());
    const g = Math.floor(255 * Math.random());
    const b = Math.floor(255 * Math.random());
    return { border: `rgba(${r},${g},${b},1.0)`, fill: `rgba(${r},${g},${b},0.4)` };
}