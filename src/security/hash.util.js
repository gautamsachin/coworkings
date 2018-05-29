var cryptoJs = require('crypto-js');

function hash(username, password) {
    var rawStr = (username||'').toLowerCase() + password;
    var utf8Array = cryptoJs.enc.Utf8.parse(rawStr);
    var hashArray = cryptoJs.SHA256(utf8Array);
    var hashedBase64Str = cryptoJs.enc.Base64.stringify(hashArray);
    return hashedBase64Str;
}

module.exports ={
    hash 
}