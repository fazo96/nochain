function onmessage(msg) {
  var res = getHash(msg[0], msg[1])
  sendMessage(res)
}

function getHash(seed, salt){
  var data = sjcl.misc.pbkdf2(seed, salt, Math.pow(2,64), 32 * 4)
  var res = sjcl.codec.hex.fromBits(data)
  return res
}
