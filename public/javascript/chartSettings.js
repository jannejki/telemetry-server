/**
 * Constructor for chart settings. Easier to modify when these are in a separate file.
 * @constructor
 */

function ChartSettings() {
    this.data = {
        labels: [],
        datasets: []
    };


    this.options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        lineTension: 0.0,
        elements: {
            point: {
                radius: 0
            }
        },
        scales: {
            y: {
                ticks: {
                    autoSkip: true
                },

                suggestedMin: 0,

                type: 'linear',
                display: true,
                position: 'left',
                stacked: true,

                grid: {
                    display: true,
                    color: "#a8a8a8"
                }
            },
            x: {
                ticks: {
                    autoSkip: false,

                },
                grid: {
                    display: false
                }
            }
        }
    };
}