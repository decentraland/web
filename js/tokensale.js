;(function () {
  "use strict"

  // Token Sale Terms charts
  new Chart(document.getElementById('js-revenue-chart'), {
    type: 'doughnut',
    data: {
      labels: ['Legal', 'Research', 'Marketing and community dev', 'Operations and Business Dev', 'Development'],
      datasets:[{
        label: "Token Sale Terms",
        data: [5, 10, 15, 20, 50],
        backgroundColor: ['#65F5AC', '#30D7A9', '#04A9FD', '#4959DD', '#3E396B']
      }]
    },
    options: {
      tooltips: {
        enabled: false
      },
      legend: false,
      cutoutPercentage: 80
    }
  })

  new Chart(document.getElementById('js-distribution-chart'), {
    type: 'doughnut',
    data: {
      labels: ['Foundation', 'Team and early contributors', 'Community and partners', 'Crowdsale'],
      datasets:[{
        label: "Token Sale Terms",
        data: [20, 20, 20, 40],
        backgroundColor: ['#30D7A9', '#04A9FD', '#4959DD', '#3E396B']
      }]
    },
    options: {
      tooltips: {
        enabled: false
      },
      legend: false,
      cutoutPercentage: 80
    }
  })

})()
