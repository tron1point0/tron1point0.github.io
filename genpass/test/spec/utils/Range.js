describe("Range", function() {
    var Range;

    const ATOZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const ATOZ_LOWER = ATOZ.toLowerCase();
    const ATOZ_CODES = (function() {
        var _ret = new Array(ATOZ.length);
        for (var i = 0; i < _ret.length; i++) {
            _ret[i] = ATOZ.charCodeAt(i);
        }
        return _ret;
    })();

    beforeAll(function(done) {
        require(["lib/utils/Range"], function(module) {
            Range = module;
            done();
        });
    });

    it("can be created with an integer", function() {
        expect(new Range(65)).toEqual(jasmine.objectContaining({
            from: 65,
            to: 66,
        }));
    });

    it("can be created with a character", function() {
        expect(new Range("A")).toEqual(jasmine.objectContaining({
            from: 65,
            to: 66,
        }));
    });

    it("can be created with two characters as a single argument", function() {
        expect(new Range("AZ")).toEqual(jasmine.objectContaining({
            from: 65,
            to: 91,
        }));
    });

    it("can be created with a \"..\" specifier", function() {
        expect(new Range("A..Z")).toEqual(jasmine.objectContaining({
            from: 65,
            to: 91,
        }));
    });

    it("can be created with a character class", function() {
        expect(new Range("[A-Z]")).toEqual(jasmine.objectContaining({
            from: 65,
            to: 91,
        }));
    });

    it("can be created with two integers", function() {
        expect(new Range(65, 91)).toEqual(jasmine.objectContaining({
            from: 65,
            to: 91,
        }));
    });

    it("can be created with two characters as separate arguments", function() {
        expect(new Range("A", "Z")).toEqual(jasmine.objectContaining({
            from: 65,
            to: 91,
        }));
    });

    it("can generate its list of characters", function() {
        expect(new Range("A..Z").toCharArray()).toEqual(Array.prototype.slice.call(ATOZ));
    });

    it("can generate its list of character codes", function() {
        expect(new Range("A..Z").toCodeArray()).toEqual(ATOZ_CODES);
    });

    it("lists all of its characters as a string", function() {
        expect(String(new Range("A..Z"))).toBe(ATOZ);
    });

    it("concatenates as a string", function() {
        expect(String(new Range("A..Z")) + String(new Range("a..z"))).toBe(ATOZ + ATOZ_LOWER);
    });

    it("is its size as a number", function() {
        expect(+new Range("A..Z")).toEqual(26);
    });

    it("can generate a range string", function() {
        expect(new Range(65, 91).toRangeString()).toBe("A..Z");
    });

    it("can generate a regex class", function() {
        expect(new Range(65, 91).toRegexString()).toBe("[A-Z]");
    });
});
