/*
  NoChain Password Manager
  Copyright (C) 2016 Enrico Fasoli (fazo96)

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var err = document.getElementById('error')
var progress = document.getElementById('progress-container')
var bar = document.getElementById('progress')
var res = document.getElementById('result')

function generate () {
  res.innerHTML = ''
  err.innerHTML = ''
  var seed = document.getElementById('key').value
  var salt = document.getElementById('service').value
  var buttons = document.getElementById('buttons')
  if (seed.length < 8) {
    err.innerHTML = 'Password too short!'
  } else if (salt.length < 3) {
    err.innerHTML = 'Service name too short!'
  } else {
    buttons.style.display = 'none'
    onProgress(0)
    var worker = new Worker('worker.js')
    worker.onmessage = e => {
      if (e.data[0] === 'result') {
        onProgress(100)
        res.innerHTML = e.data[1]
        buttons.style.display = 'block'
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
