define(function () {
    /**
     * Returns an array of *bytes* that represent this string.
     */
    String.prototype.toBytes = String.prototype.toBytes || function () {
            var BYTE = 8,
                BYTES = 2,
                MAX = Math.pow(2,BYTE)-1,
                c = '',
                buf,
                len = this.length,
                bytes = [];

            for (var i = 0; i < len; i++) {
                c = this.charCodeAt(i);
                buf = [];
                do { buf.push(c & MAX); c >>= BYTE; } while (c);
                bytes = bytes.concat(buf.reverse());
            }

            return bytes;
        };

    /**
     * Returns an array of *character codes* that represent this string.
     */
    String.prototype.toCodes = String.prototype.toCodes || function () {
            var len = this.length,
                ret = new Array(len);

            for (var i = 0; i < len; i++) {
                ret[i] = this.charCodeAt(i);
            };

            return ret;
        }

    /**
     * Convert a hex bitstring into the string it represents. (For reading output
     * from CryptoJS.) The underlying string is not modified.
     */
    String.prototype.fromHex = String.prototype.fromHex || function () {
            var len = this.length/2,
                ret = new Array(len);

            for (var i = 0; i < len; i++) {
                ret[i] = parseInt('0x' + this[2*i] + this[2*i+1]);
            }

            return String.fromCharCode.apply(this,ret);
        };

    /**
     * Return the array of character codes that cover this range.
     */
    String.prototype.fromRange = String.prototype.fromRange || function () {
            return this.split(',').map(function (str) {
                var range = str.split('..').map(function (e) { return parseInt(e) });
                if (1 === range.length) return [range[0]];
                return Array.fromTo.apply(null,range);
            }).merge();
        };

    /**
     * Return a string that only contains characters from the map. The underlying
     * string is not modified.
     */
    String.prototype.mod = String.prototype.mod || function (map) {
            var bytes = this.toBytes(),
                len = bytes.length,
                mapLen = map.length,
                byteMap = map.map(function(e) {
                    if ('function' === typeof e) e = e.call(e);
                    if ('number' === typeof e) return e;
                    return e.toString().charCodeAt(0);
                }),
                ret = new Array(len);

            for (var i = 0; i < len; i++) {
                ret[i] = byteMap[bytes[i] % mapLen];
            }

            return String.fromCharCode.apply(this,ret);
        };

    return String;
});
