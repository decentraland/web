;(function () {
  "use strict"

  // Token Sale Terms charts
  new Chart(document.getElementById('js-dognut-chart'), {
    type: 'doughnut',
    data: {
      labels: ['Foundation', 'Team and early contributors', 'Community and partners', 'Crowdsale'],
      datasets:[{
        label: "Token Sale Terms",
        data: [20,20,20,40],
        backgroundColor: ['#30D7A9', '#04A9FD', '#4959DD', '#000']
      }]
    },
    options: {
      legend: false,
      cutoutPercentage: 90
    }
  })

  new Chart(document.getElementById('js-line-chart'), {
    type: 'horizontalBar',
    data: {
      labels: ['Data'],
      datasets:[{
        label: 'Crowdsale',
        data: [40],
        backgroundColor: '#000'
      },{
        label: 'Team and early contributors',
        data: [20],
        backgroundColor: '#4959DD'
      }, {
        label: 'Community and partners',
        data: [20],
        backgroundColor: '#04A9FD'
      }, {
        label: 'Foundation',
        data: [20],
        backgroundColor: '#30D7A9'
      }]
    },
    options: {
      legend: false,
      tooltips: {
        enabled: false
      },
      scales: {
        xAxes: [{
          display: false,
          stacked: true,
        }],
        yAxes: [{
          display: false,
          stacked: true,
        }]
      }
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
