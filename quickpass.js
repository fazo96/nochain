var res = document.getElementById('result')
var err = document.getElementById('error')

function generate () {
  err.innerHTML = ''
  var seed = document.getElementById('key').value
  var salt = document.getElementById('service').value
  if (seed.length < 8) {
    err.innerHTML = 'Your password is not long enough to be safe!'
  } else if (salt.length < 3) {
    err.innerHTML = 'Your service name is not long enough to be safe!'
  } else {
    res.innerHTML = 'Generating...'
    var worker = new Worker('worker.js')
    worker.onmessage = e => {
      console.log(e)
      res.innerHTML = e.data
    }
    worker.postMessage([seed, salt])
  }
}

function hide () {
  res.innerHTML = ''
  err.innerHTML = ''
  document.getElementById('key').value = ''
  document.getElementById('service').value = ''
}
