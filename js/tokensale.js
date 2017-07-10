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

  // Countdown
  var deadline = new Date(2017, 7, 8)
  initializeClock('js-clock', deadline, function() {
    document.getElementById('js-clock').classList.add('hidden')
  })

  // ---------------------------------------------------
  // Utils

  function initializeClock(id, endtime, callback) {
    var clock = document.getElementById(id)
    var daysSpan    = clock.querySelector('.days')
    var hoursSpan   = clock.querySelector('.hours')
    var minutesSpan = clock.querySelector('.minutes')
    var secondsSpan = clock.querySelector('.seconds')

    function updateClock() {
      var time = getTimeRemaining(endtime)

      daysSpan.innerHTML    = time.days
      hoursSpan.innerHTML   = ('0' + time.hours).slice(-2)
      minutesSpan.innerHTML = ('0' + time.minutes).slice(-2)
      secondsSpan.innerHTML = ('0' + time.seconds).slice(-2)

      if (time.total <= 0) {
        clearInterval(timeinterval)
        callback && callback()
      }
    }

    updateClock()
    var timeinterval = setInterval(updateClock, 1000)
  }

  function getTimeRemaining(endtime) {
    var time = Date.parse(endtime) - Date.parse(new Date())
    var seconds = Math.floor((time / 1000) % 60)
    var minutes = Math.floor((time / 1000 / 60) % 60)
    var hours = Math.floor((time / (1000 * 60 * 60)) % 24)
    var days = Math.floor(time / (1000 * 60 * 60 * 24))

    return {
      'total'  : time,
      'days'   : days,
      'hours'  : hours,
      'minutes': minutes,
      'seconds': seconds
    }
  }

})()
