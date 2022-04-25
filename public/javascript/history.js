'use strict';

const chartList = [];

window.onload = () => {
    //checking current date and time to preset values for user inputs
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let hr = today.getHours();
    let min = today.getMinutes();

    day = checkTime(day);
    month = checkTime(month);
    hr = checkTime(hr);
    min = checkTime(min);
    let startHr = checkTime(hr - 1);

    document.getElementById("date").value = year + "-" + month + "-" + day;
    document.getElementById("hourStart").value = startHr + ":" + min;
    document.getElementById("hourEnd").value = hr + ":" + min;

    // load CAN names and IDs from server to fill dropdown -list
    fetch('/settings/loadCanList')
        .then(response => response.json())
        .then((data) => {
            for (let i = 0; i < data.canList.length; i++) {
                let option = document.createElement("option");
                option.setAttribute("value", data.canList[i].canID);
                option.innerText = data.canList[i].name;
                document.getElementById("canDropDown").appendChild(option);
            }
        });
}

/**
 * @brief adds zero in front of parameter if it is less than 10.
 * @param {number} i 
 * @returns same number but if number
 */
function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    };
    return i;
}

/** 
 * @brief event listener for addNewChartOptions form.
 * @description sends request to get the data for selected CAN and time.
 */
document.forms['addNewChartOptions'].addEventListener('submit', async(event) => {
    // preveting default event
    event.preventDefault();

    let selectElement = document.getElementById("canDropDown");
    let canID = selectElement.value;
    let date = document.getElementById("date").value;
    let hourStart = document.getElementById("hourStart").value;
    let hourEnd = document.getElementById("hourEnd").value;

    // parsing start- and endtimes to the right format for server
    let startTime2 = date + " " + hourStart;
    let endTime2 = date + " " + hourEnd;

    const query = `query DataPoint($can: String, $startTime: String, $endTime: String) {
        dataPoint(CAN: $can, startTime: $startTime, endTime: $endTime) {
          CAN
          timestamp
          data {
            decValue
            unit
          }
        }
      }`;

    const variables = {
        startTime: startTime2,
        endTime: endTime2,
        can: canID
    }

    const data = await fetchGQL(query, variables);
    if (data.data.dataPoint.length === 0) {
        alert('No data found!');
        return;
    }
    createChartElements(data.data.dataPoint, canID);
    fillChartWithValues(data.data.dataPoint);
});


/**
 * @brief Fills chart with data values
 * @param {*} data 
 */
function fillChartWithValues(dataPoints) {
    const chartSettings = new ChartSettings();
    const chartData = chartSettings.data;
    const chartOptions = chartSettings.options;
    const selectedCAN = document.getElementById("canDropDown").value;

    for (let datasets in dataPoints[0].data) {
        let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
        let dataset = {
            spanGaps: true,
            label: dataPoints[0].data[datasets].unit,
            backgroundColor: randomColor,
            borderColor: randomColor,
            borderWidth: 2,
            hoverBackgroundColor: randomColor,
            hoverBorderColor: randomColor,
            data: []
        }

        for (let i = 0; i < dataPoints.length; i++) {
            let value = parseFloat(dataPoints[i].data[datasets].decValue);

            if (value > chartOptions.scales.y.max) {
                chartOptions.scales.y.max = (value + 2);
            }
            dataset.data.push(value);
        }
        chartData.datasets.push(dataset);
    }
    for (let i = 0; i < dataPoints.length; i++) {
        chartData.labels.push(dataPoints[i].timestamp.slice(dataPoints[i].timestamp.indexOf(" ")))
    }
    chartOptions.lineTension = 0;
    chartOptions.elements.point.radius = 3;
    chartOptions.scales.x.grid.display = true;

    const canvas = document.getElementById(selectedCAN);
    let chart = new Chart(canvas, {
        type: 'line',
        options: chartOptions,
        data: chartData
    });
    chartList.push(chart);
}


/**
 * @brief Creates chart HTML elements 
 * @param {*} dataPoints 
 * @param {*} selectedCAN 
 */
const createChartElements = (dataPoints, selectedCAN) => {
    let div = document.createElement("div");
    div.setAttribute("class", "chartDiv");

    div.innerHTML = `   <div id="${selectedCAN}div" class="chart">
                            <canvas id="${selectedCAN}"></canvas>
                        </div>
                        
                        <div class="rangeInput">
                            <input type="range" id="min${selectedCAN}" class="range" min="0" max="${dataPoints.length -1}" value="0";>
                            <input type="range" id="max${selectedCAN}" class="range" max="${dataPoints.length}" min="1" value="${dataPoints.length}">
                        </div>`;

    document.querySelector('main').appendChild(div);

    const minSlider = document.getElementById(`min${selectedCAN}`);
    const maxSlider = document.getElementById(`max${selectedCAN}`);

    minSlider.oninput = function() {
        sliderFunction(selectedCAN, dataPoints);
    }

    maxSlider.oninput = function() {
        sliderFunction(selectedCAN, dataPoints);
    }
}

/**
 * @brief updates chart to show only values between range inputs.
 * @param {*} canID 
 * @param {*} data 
 */
function sliderFunction(canID, dataPoints) {
    const minSlider = document.getElementById("min" + canID);
    const maxSlider = document.getElementById("max" + canID);

    for (let i = 0; i < chartList.length; i++) {
        if (chartList[i].canvas.id == canID) {

            for (let datasets in dataPoints[0].data) {
                let valueArray = [];
                let labelArray = [];
                for (let i = 0; i < dataPoints.length; i++) {
                    if (i >= minSlider.value && i < maxSlider.value) {
                        let value = parseFloat(dataPoints[i].data[datasets].decValue);
                        valueArray.push(value);
                        labelArray.push(dataPoints[i].timestamp.slice(dataPoints[i].timestamp.indexOf(" ")));
                    }
                }
                chartList[i].data.datasets[datasets].data = valueArray;
                chartList[i].data.labels = labelArray;
            }
            chartList[i].update();
        }
    }
}

/**
 * @brief Sends graphql query to server and returns received data
 * @param {*} query grapqhl query
 * @param {*} variables possible variables for query
 * @returns {*} received data
 */
const fetchGQL = (query, variables) => {
    return new Promise((resolve) => {
        fetch('/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            })
            .then(r => r.json())
            .then(data => {
                if (data.errors) {
                    alert(data.errors[0].extensions.code);
                    return;
                } else {
                    resolve(data);
                }
            });
    })
}