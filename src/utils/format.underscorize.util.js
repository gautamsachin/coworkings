/**
 * This library is copy of camalize but original library only camalize when key contains underscore, dot or hiphen
 */

module.exports = function (obj) {
    if (typeof obj === 'string') return formatToUnderscore(obj);
    return walk(obj);
};

function walk(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (isDate(obj) || isRegex(obj)) return obj;
    if (isArray(obj)) return map(obj, walk);
    return reduce(objectKeys(obj), function (acc, key) {
        var camel = formatToUnderscore(key);
        acc[camel] = walk(obj[key]);
        return acc;
    }, {});
}

function formatToUnderscore(str) {
    return str
        .replace(/[.-](\w|$)/g, function (_, x) {  // replace all underscore, dot and hiphen
            return '_' + x.toLowerCase();
        })
        .replace(/(?:^\w|_[A-Z]|[A-Z]|\b\w)/g, function (letter, index) {
            if (index == 0)
                return letter.toLowerCase();
            else if (letter.indexOf('_') == 0)
                return letter.toLowerCase(); // exclude already started with underscore
            else
                return '_' + letter.toLowerCase();
        })
        .replace(/\s+/g, ''); // replace all spaces

}

var isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

var isDate = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
};

var isRegex = function (obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var has = Object.prototype.hasOwnProperty;
var objectKeys = Object.keys || function (obj) {
    var keys = [];
    for (var key in obj) {
        if (has.call(obj, key)) keys.push(key);
    }
    return keys;
};

function map(xs, f) {
    if (xs.map) return xs.map(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        res.push(f(xs[i], i));
    }
    return res;
}

function reduce(xs, f, acc) {
    if (xs.reduce) return xs.reduce(f, acc);
    for (var i = 0; i < xs.length; i++) {
        acc = f(acc, xs[i], i);
    }
    return acc;
}
