importScripts('sjcl.min.js')

onmessage = e => {
  var msg = e.data
  var res = getHash(msg[0], msg[1])
  postMessage(res)
}

function getHash (seed, salt) {
  var data = sjcl.misc.pbkdf2(seed, salt, Math.pow(2, 16), 32 * 4)
  var res = sjcl.codec.hex.fromBits(data)
  return res
}
