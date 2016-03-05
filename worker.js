importScripts('sjcl.min.js')

onmessage = e => {
  var msg = e.data
  var res = getHash(msg[0], msg[1])
  postMessage(['result', res])
}

function onProgress(current, total) {
  postMessage([current, total])
}

function getHash (seed, salt) {
  var data = sjcl.misc.pbkdf2(seed, salt, Math.pow(2, 20), 32 * 4, undefined, onProgress)
  var res = sjcl.codec.hex.fromBits(data)
  return res
}

// Custom PBKDF2 with 'onUpdate' callback to track progress
sjcl.misc.pbkdf2 = function (password, salt, count, length, Prff, progress) {
  count = count || 1000;

  if (length < 0 || count < 0) {
    throw sjcl.exception.invalid("invalid params to pbkdf2");
  }

  if (typeof password === "string") {
    password = sjcl.codec.utf8String.toBits(password);
  }

  if (typeof salt === "string") {
    salt = sjcl.codec.utf8String.toBits(salt);
  }

  Prff = Prff || sjcl.misc.hmac;

  var prf = new Prff(password),
      u, ui, i, j, k, out = [], b = sjcl.bitArray;

  for (k = 1; 32 * out.length < (length || 1); k++) {
    u = ui = prf.encrypt(b.concat(salt,[k]));

    for (i=1; i<count; i++) {
      ui = prf.encrypt(ui);
      for (j=0; j<ui.length; j++) {
        u[j] ^= ui[j];
      }
      if(i > 50000 && i % 5000 === 0) progress(i, count)
    }

    out = out.concat(u);
  }

  if (length) { out = b.clamp(out, length); }

  return out;
};
