define([
    "jquery",
    "utils/String",
], function($) {
    /**
     * Creates a string-to-colors hasher.
     *
     * <tt>options</tt> is an object that can contain the following keys:
     *
     * @exports
     * @constructor
     * @this {ColorHash}
     * @param {Object} [options] Overrides of default values.
     * @returns {ColorHash}
     */
    var ColorHash = function(options) {
        if (options) {
            $.extend(this, options);
        }

        return this;
    };

    /**
     * Returns up to 4 bytes of <tt>string</tt>'s hash starting from the least
     * significant byte.
     *
     * @this {ColorHash}
     * @param {String} string The string to hash into colors.
     * @param {int} [count] Number of bytes to return. Maximum 4. Defaults to 3.
     * @return {Uint8Array} bytes of <tt>string</tt>'s hash in LSB order
     */
    ColorHash.prototype.values = function(string, count) {
        if (typeof count  === "undefined") {
            count = 3;
        }

        var hash = String(string).hashCode(),
            _ret = new Uint8Array(count);

        for (var i = 0; i < count; i++) {
            _ret[i] = hash & 0xFF;
            hash >>= 8;
        }

        return _ret;
    };

    /**
     * Converts an individual value produced by {@link #values} into a valid
     * CSS <tt>hsl</tt> color.
     *
     * @this {ColorHash}
     * @param {int} value An element of the <tt>Uint8Array</tt> produced by
     *              {@link #values}
     * @return {String} A CSS <tt>hsl</tt> color.
     */
    ColorHash.prototype.hsl = function(value) {
        var h = ((value & 0x0F) >> 0) * 22.5,
            s = Math.round(((value & 0x30) >> 4) * (50/3) + 50),
            l = Math.round(((value & 0xC0) >> 6) * (50/3) + 25);

        return "hsl(" + h + "," + s + "%," + l + "%)";
    };

    /**
     * Returns a CSS <tt>linear-gradient</tt> mapping the indexes of
     * <tt>array</tt> to their corresponding color in <tt>this.colorMap</tt>.
     *
     * <tt>array</tt> <em>may</em> contain integers greater than
     * <tt>this.colorMap.length - 1</tt>.
     *
     * @this {ColorHash}
     * @param {Uint8Array} array Array of indexes into <tt>this.colorMap</tt>.
     * @return {String} The CSS definition of the gradient.
     */
    ColorHash.prototype.linearGradient = function(array) {
        if (!array.length) {
            return "none";
        }

        var args = ["0deg"],
            step = 100 / array.length,
            color;

        for (var i = 0; i < array.length; i++) {
            color = this.hsl(array[i]);
            args.push(color + " " + Math.round(step * i) + "%");
            args.push(color + " " + Math.round(step * (i + 1)) + "%");
        }

        return "linear-gradient(" + args.join(", ") + ")";
    };

    /**
     * Convenience wrapper around {@link #linearGradient} and {@link #values}.
     *
     * @param {String} The string to hash into a gradient.
     * @returns {String} The CSS definition of the background gradient.
     */
    ColorHash.prototype.generate = function(string) {
        if (!string) {
            return "none";
        }

        return this.linearGradient(this.values(string));
    };

    return ColorHash;
});
