describe("String", function() {
    beforeAll(function(done) {
        require(["utils/String"], function() {
            done();
        });
    });

    it("hashes the empty string as 0", function() {
        expect("".hashCode()).toBe(0);
    });

    it("hashes \"0\" as 48", function() {
        expect("0".hashCode()).toBe(48);
    });

    it("hashes \"The quick brown fox jumps over the lazy dog\" as -609428141", function() {
        expect("The quick brown fox jumps over the lazy dog".hashCode()).toBe(-609428141);
    });
});
