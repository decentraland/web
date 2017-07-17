;(function () {
  "use strict";

        var url = encodeURIComponent('https://blog.decentraland.org/feed')
        var query = 'SELECT * FROM json WHERE url="' + url + '"'

        window.handleResponse = function(rr) {
          console.log('handleResponse', rr)
        }

        http({
          method: 'GET',
          url: 'https://query.yahooapis.com/v1/public/yql?format=html&callback=handleResponse&q=' + query,
          success: function(response) {
            console.log('RESPONSE', response)
          }
        })


  // Countdown
  var deadline = new Date(2017, 7, 8)
  initializeClock('js-clock', deadline, function() {
    getElementById('js-clock').className += 'hidden'
  })

  // Mobile navbar hooks
  on('#js-open-navbar',  'click', toggleNavbar)
  on('#js-close-navbar', 'click', closeNavbar)
  on('#js-menu a',      'click', closeNavbar)

  // Analytics events
  on('[data-event-category]', 'click', function() {
    sendEvent(this.dataset.eventCategory, this.dataset.eventAction, this.href)
  })
  on('#js-blog-carousel a', 'click', function() {
    sendEvent('Blog', 'click', this.href)
  })
  on('#js-team-members a', 'click', function() {
    sendEvent('Team Member', 'click', this.href)
  })
  on('#js-partner-logos a', 'click', function() {
    sendEvent('Partner Logo', 'click', this.href)
  })
  on('#js-menu a, #navbar a', 'click', function(event) {
    if (! this.dataset.eventCategory) {
      var text = (this.innerText || this.textContent)
      sendEvent(text + ' Header', 'click', this.href)
    }
  })

  // Subscribe form
  on('form', 'submit', function(event) {
    var form = this
    var email = form.querySelector('[type="email"]').value
    var url = form.action + '&EMAIL='  + email
    var notice = form.querySelector('.js-submit-notice')
    var origin = window.location.origin

    notice.innerHTML = 'Sending...'

    http({
      url: url,
      method: 'GET',
      success: function(response) {
        window.location.href = origin + '/thankyou?email=' + email
      },
      error: function() {
        notice.innerHTML = 'We seem to be having problems subscribing you to the newsletter, please try again later.'

        setTimeout(function() { notice.innerHTML = ''}, 2200)
      }
    })

    event.preventDefault()
  })

  // Main embeded video
  on('#js-play-video', 'click', function(event) {
    var modal = picoModal({
      content: '<iframe class="embed wow fadeIn" width="560" height="315" src="https://www.youtube.com/embed/O6DUV19Ri_8?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>',
      closeHtml: '<i class="icon icon-close"></i>',
      closeStyles: {
        top: '10px', right: '-40px', position: 'absolute',
        padding: '5px 10px', background: 'transparent', cursor: 'pointer',
        outline: 'none', border: 'none'
      },
      modalClass: 'video-modal',
      modalStyles: {
        width: '',
        padding: '25px 0 45.25% 0',
        height: '0',
        borderRadius: '20px'
      }
    })
    .afterShow(function() {
      getElementById('js-background-video').pause()
    })
    .afterClose(function() {
      getElementById('js-background-video').play()
      modal.destroy()
    }).show()
  })

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


  if (typeof Siema !== 'undefined') {
    // Slider
    var slider = new Siema({
      selector: '#js-blog-carousel',
      perPage: {
        800: 2,
        1240: 3
      },
      loop: true
    })

    var prevArrow = document.createElement('div')
    var nextArrow = document.createElement('div')
    prevArrow.className = 'arrow prev'
    nextArrow.className = 'arrow next'

    slider.selector.appendChild(prevArrow)
    slider.selector.appendChild(nextArrow)

    on(prevArrow, 'click', function() {
      slider.prev()
    })
    on(nextArrow, 'click', function() {
      slider.next()
    })
  }


  // ---------------------------------------------------
  // Countdown Utils

  function initializeClock(id, endtime, callback) {
    var clock = getElementById(id)
    if (! clock) return

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


  // ---------------------------------------------------
  // Utils

  function toggleNavbar() {
    var menu = getElementById('js-menu')

    if (menu.className.search('menu-open') === -1) {
      document.body.addEventListener('click', closeNavbarOnOutsideClick, true)
      menu.className = 'menu menu-open'
    } else {
      closeNavbar()
    }

  }

  function closeNavbar(event) {
    document.body.removeEventListener('click', closeNavbarOnOutsideClick, true)
    getElementById('js-menu').className = 'menu'
  }

  function closeNavbarOnOutsideClick(event) {
    if (! isChildrenOf(event.target, getElementById('js-menu'))) {
      closeNavbar()
    }
  }

  function isChildrenOf(el, parent) {
    if (el === parent) return true

    while(el = el.parentElement) {
      if (el === parent) return true
    }
  }

  function on(selector, type, event) {
    var elements = typeof selector === 'string'
    ? Array.prototype.slice.call(document.querySelectorAll(selector))
    : [ selector ] // asume DOM element

    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener(type, event, true)
    }
  }

  function getElementById(id) {
    return document.getElementById(id)
  }

  function http(options, success) {
    var xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function(result) {
      if (xmlhttp.readyState === 4) {
        if(xmlhttp.status >= 400) {
          options.error && options.error(xmlhttp.responseText, xmlhttp)
        } else {
          options.success && options.success(xmlhttp.responseText, xmlhttp)
        }
      }
    }

    xmlhttp.open(options.method, options.url, true)

    if (options.headers) {
      for(var header in options.headers) {
        xmlhttp.setRequestHeader(header, options.headers[header])
      }
    }

    var data = options.formData || JSON.stringify(options.data || null)
    xmlhttp.send(data)
  }

  function sendEvent(category, action, label) {
    ga('send', 'event', category, action, label)
  }

})()
