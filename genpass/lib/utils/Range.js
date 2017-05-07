define(function() {
    var Range = function(from, to) {
        var range = normalizeArguments(from, to);

        if (range.from > range.to) {
            // TODO: Just swap the bounds.
            throw new RangeError("Attempted to create a range of negative size.");
        }

        this.from = range.from;
        this.to = range.to;

        return this;
    };

    Range.prototype.toCharArray = function() {
        var _ret = new Array(+this);
        for (var i = this.from, j = 0; i < this.to; i++, j++) {
            _ret[j] = String.fromCharCode(i);
        }
        return _ret;
    };

    Range.prototype.toCodeArray = function() {
        var _ret = new Array(+this);
        for (var i = this.from, j = 0; i < this.to; i++, j++) {
            _ret[j] = i;
        }
        return _ret;
    };

    Range.prototype.toString = function() {
        return this.toCharArray().join("");
    };

    Range.prototype.toRangeString = function() {
        return String.fromCharCode(this.from) + ".." + String.fromCharCode(this.to - 1);
    };

    Range.prototype.toRegexString = function() {
        return "[" + String.fromCharCode(this.from) + "-" + String.fromCharCode(this.to - 1) + "]";
    };

    Range.prototype.valueOf = function() {
        return this.to - this.from;
    };

    function normalizeArguments(from, to) {
        switch (typeof from) {
            case "function":
                throw new TypeError("Cannot instantiate a range starting from a function.");
            case "string":
                return stringArguments(from, to);
            case "number":
                return {
                    from: from,
                    to: (to || to === 0) ? to : from + 1,
                };
            case "object":
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#null
                if (from === null) {
                    throw new TypeError("Cannot instantiate a range starting from `null`.");
                }
                return from;
            default:
                throw new TypeError("Unsupported constructor argument type: [" + (typeof from) + "]");
        }
    };

    function stringArguments(from, to) {
        if (to) {   // "a","z"
            return {
                from: from.charCodeAt(0),
                to: to.charCodeAt(0) + 1,
            };
        }

        switch (from.length) {
            case 1:         // "a"
                return {
                    from: from.charCodeAt(0),
                    to: from.charCodeAt(0) + 1,
                }
            case 2:         // "az"
                return {
                    from: from.charCodeAt(0),
                    to: from.charCodeAt(1) + 1,
                }
            case 4:         // "a..z"
                return {
                    from: from.charCodeAt(0),
                    to: from.charCodeAt(3) + 1,
                }
            case 5:         // "[a-z]"
                return {
                    from: from.charCodeAt(1),
                    to: from.charCodeAt(3) + 1,
                }
        }

        throw new SyntaxError("Unable to parse string constructor: [" + from + "]");
    }

    return Range;
});
