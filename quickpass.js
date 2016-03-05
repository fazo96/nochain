var err = document.getElementById('error')
var progress = document.getElementById('progress-container')
var bar = document.getElementById('progress')
var res = document.getElementById('result')

function generate () {
  err.innerHTML = ''
  var seed = document.getElementById('key').value
  var salt = document.getElementById('service').value
  if (seed.length < 8) {
    err.innerHTML = 'Password too short!'
  } else if (salt.length < 3) {
    err.innerHTML = 'Service name too short!'
  } else {
    var worker = new Worker('worker.js')
    worker.onmessage = e => {
      if (e.data[0] === 'result') {
        onProgress(100)
        res.innerHTML = e.data[1]
      } else {
        //console.log('Progress data', e.data[0], e.data[1])
        var percent = parseInt(e.data[0] / e.data[1] * 100)
        if (percent > 100) percent = 100
        onProgress(percent)
      }
    }
    worker.postMessage([seed, salt])
  }
}

function onProgress (percent) {
  //console.log('Progress', percent + '%')
  progress.style.display = 'block'
  bar.style.width = percent + '%'
}

function hide () {
  res.innerHTML = ''
  err.innerHTML = ''
  document.getElementById('key').value = ''
  document.getElementById('service').value = ''
  progress.style.display = 'none'
  bar.style.width = 0
}
