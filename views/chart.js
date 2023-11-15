document.addEventListener('myChart', function () {
    // Sample data
    var data = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Income',
                data: [2000, 2200, 2500, 2300, 2400],
                borderColor: 'green',
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
            },
            {
                label: 'Expenses',
                data: [1500, 1700, 2000, 1800, 1900],
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
            },
        ],
    };

    // Configuration options
    var options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    // Get the context of the canvas element
    var ctx = document.getElementById('myChart').getContext('2d');

    // Create the line chart
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options,
    });
});