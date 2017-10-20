describe("ColorHash", function () {
    var instance, ColorHash;

    beforeAll(function(done) {
        require(["script/color-hash"], function(module) {
            ColorHash = module;
            done();
        });
    });

    beforeEach(function () {
        instance = new ColorHash();
    });

    it("can generate colors from the empty string", function() {
        expect(instance.colors("")).toEqual(Uint8Array.of(0,0,0));
    });

    it("can generate colors from \"The quick brown fox...\"", function() {
        expect(instance.colors("The quick brown fox jumps over the lazy dog.")).toEqual(Uint8Array.of(14,6,79));
    });

    it("can generate linear-gradient from the empty string", function() {
        expect(instance.linearGradient(Uint8Array.of(0,0,0))).toBe("linear-gradient(0deg, black 0%, black 33%, black 33%, black 67%, black 67%, black 100%)");
    });

    it("can generate linear-gradient from \"The quick brown fox...\"", function() {
        expect(instance.linearGradient(Uint8Array.of(14,6,79))).toBe("linear-gradient(0deg, aqua 0%, aqua 33%, teal 33%, teal 67%, white 67%, white 100%)");
    });
});
