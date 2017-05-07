define([
    "utils/Range",
    "utils/Array",
    "utils/String",
    "crypto-js/pbkdf2",
    "crypto-js/sha256",
], function(Range) {
    /**
     * Default hashing algorithm for PBKDF2.
     */
    const DEFAULT_HASHER = CryptoJS.algo.SHA256;
    /**
     * Default number of iterations to run PBKDF2.
     */
    const DEFAULT_ITERATIONS = 128;
    /**
     * Default output length of the generated key.
     */
    const DEFAULT_LENGTH = 16;
    /**
     * Default list of characters allowed in the converted output.
     */
    const DEFAULT_CHARACTERS = String(new Range("09")) + String(new Range("AZ")) + String(new Range("az"));
    /**
     * Converts an output length to the size of the key that CryptoJS
     * generates.
     *
     * CryptoJS generates single bytes. We convert these to characters.
     */
    const KEY_SIZE_DIVISOR = 4;

    /**
     * Creates a generator.
     *
     * <tt>options</tt> is an object that can contain the following keys:
     *
     *  * <tt>hasher</tt>
     *    Hashing algorithm to use for PBKDF2. Defaults to <tt>SHA256</tt>.
     *  * <tt>iterations</tt>
     *    Number of iterations to run PBKDF2. Defaults to <tt>128</tt>
     *  * <tt>length</tt>
     *    Length of the string to generate as passwords in {@link #generate}. Defaults to <tt>16</tt>.
     *  * <tt>allowedCharacters</tt>
     *    ASCII Characters allowed in the generated password. Defaults to <tt>[0-9A-Za-z]</tt>.
     *
     * @exports
     * @constructor
     * @this {Genpass}
     * @param {Object} [options] Overrides of default values.
     * @returns {Genpass}
     */
    var Genpass = function(options) {
        // Defaults
        this.hasher = DEFAULT_HASHER;
        this.iterations = DEFAULT_ITERATIONS;
        this.length = DEFAULT_LENGTH;
        this.allowedCharacters = DEFAULT_CHARACTERS.toBytes();

        if (options) {
            $.extend(this, options);
        }

        return this;
    };

    /**
     * Generates a password string from the <tt>public</tt> and <tt>secret</tt> strings.
     *
     * @param {String} public value that can be shared
     * @param {String} secret value that cannot be shared
     * @returns {String} generated password
     */
    Genpass.prototype.generate = function(public, secret) {
        if (!public || !secret) {
            return;
        }

        return CryptoJS.enc.Hex.stringify(
            CryptoJS.PBKDF2(public, secret, {
                keySize: this.length / KEY_SIZE_DIVISOR,
                hasher: this.hasher,
                iterations: this.iterations,
            })).fromHex().mod(this.allowedCharacters);
    };

    /**
     * Increments the length of passwords generated by this generator.
     *
     * @this {Genpass}
     * @param {Integer} [amount] Amount to increment by. Defaults to 1.
     * @returns {Genpass}
     */
    Genpass.prototype.increment = function(amount) {
        amount = amount || 1;
        this.length += amount;
        return this;
    };

    /**
     * Decrements the length of passwords generated by this generator.
     *
     * @this {Genpass}
     * @param {Integer} [amount] Amount to decrement by. Defaults to 1.
     * @returns {Genpass}
     */
    Genpass.prototype.decrement = function(amount) {
        amount = amount || 1;
        this.length -= amount;
        return this;
    };

    /**
     * Sets the length of passwords generated by this generator to `length`.
     *
     * @this {Genpass}
     * @param {int} length the length of passwords to generate.
     * @returns {Genpass}
     */
    Genpass.prototype.setLength = function(length) {
        this.length = length;
        return this;
    };

    /**
     * Adds a character as an allowed output character.
     *
     * @this {Genpass}
     * @param {String} c
     * @returns {Genpass}
     */
    Genpass.prototype.addCharacter = function(c) {
        return this.addRange(new Range(c));
    };

    /**
     * Removes a character as an allowed output character.
     *
     * @this {Genpass}
     * @param {String} c
     * @returns {Genpass}
     */
    Genpass.prototype.removeCharacter = function(c) {
        return this.removeRange(new Range(c));
    };

    /**
     * Adds ranges of characters as an allowed output character.
     *
     * @this {Genpass}
     * @param {String...} range
     * @returns {Genpass}
     */
    Genpass.prototype.addRange = function() {
        this.allowedCharacters = Array.prototype.merge.apply(this.allowedCharacters, argumentsToRanges(arguments));
        return this;
    };

    /**
     * Removes ranges of characters as an allowed output character.
     *
     * @this {Genpass}
     * @param {String...} range
     * @returns {Genpass}
     */
    Genpass.prototype.removeRange = function() {
        for (var i = 0; i < arguments.length; i++) {
            this.allowedCharacters = this.allowedCharacters.subtract(new Range(arguments[i]).toCodeArray());
        }
        return this;
    };

    /**
     * @private
     * @param args <tt>arguments</tt> object passed in to the calling function
     * @returns {Array|Array} the passed arguments as array ranges
     */
    function argumentsToRanges(args) {
        return Array.prototype.slice.call(args).map(function (range) {
            return new Range(range).toCodeArray();
        });
    }

    return Genpass;
});
