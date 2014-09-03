var toString = ({}).toString;
// bug in native ie678, not in simulated ie9
var hasEnumBug = !({toString: 1}.propertyIsEnumerable('toString'));
var enumProperties = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toString',
    'toLocaleString',
    'valueOf'
];

module.exports = {
    isArray: Array.isArray || function (arr) {
        return toString.call(arr) === '[object Array]';
    },

    inArray: function (item, arr) {
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] === item) {
                return true;
            }
        }
        return false;
    },

    keys: Object.keys || function (o) {
        var result = [], p, i;

        for (p in o) {
            // util.keys(new XX())
            if (o.hasOwnProperty(p)) {
                result.push(p);
            }
        }

        if (hasEnumBug) {
            for (i = enumProperties.length - 1; i >= 0; i--) {
                p = enumProperties[i];
                if (o.hasOwnProperty(p)) {
                    result.push(p);
                }
            }
        }

        return result;
    }
};