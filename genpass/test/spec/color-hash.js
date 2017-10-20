describe("ColorHash", function () {
    var instance, ColorHash;

    const FOX = "The quick brown fox jumps over the lazy dog."

    beforeAll(function(done) {
        require(["script/color-hash"], function(module) {
            ColorHash = module;
            done();
        });
    });

    beforeEach(function () {
        instance = new ColorHash();
    });

    describe("can generate values from", function() {
        it("nothing", function() {
            expect(instance.values()).toEqual(Uint8Array.of(80,97,31));
        });

        it("the empty string", function() {
            expect(instance.values("")).toEqual(Uint8Array.of(0,0,0));
        });

        it("the quick brown fox", function() {
            expect(instance.values(FOX)).toEqual(Uint8Array.of(59,205,238));
        });
    });

    describe("can compute linear-gradients from", function() {
        it("the empty array", function() {
            expect(instance.linearGradient(Uint8Array.of())).toBe("none");
        });

        it("[0,0,0]", function() {
            expect(instance.linearGradient(Uint8Array.of(0,0,0))).toBe(
                "linear-gradient(0deg, " +
                "hsl(0,50%,25%) 0%, hsl(0,50%,25%) 33%, " +
                "hsl(0,50%,25%) 33%, hsl(0,50%,25%) 67%, " +
                "hsl(0,50%,25%) 67%, hsl(0,50%,25%) 100%)");
        });

        it("[80,97,31]", function() {
            expect(instance.linearGradient(Uint8Array.of(80,97,31))).toBe(
                "linear-gradient(0deg, " +
                "hsl(0,67%,42%) 0%, hsl(0,67%,42%) 33%, " +
                "hsl(22.5,83%,42%) 33%, hsl(22.5,83%,42%) 67%, " +
                "hsl(337.5,67%,25%) 67%, hsl(337.5,67%,25%) 100%)");
        });

        it("[59,205,238]", function() {
            expect(instance.linearGradient(Uint8Array.of(59,205,238))).toBe(
                "linear-gradient(0deg, " +
                "hsl(247.5,100%,25%) 0%, hsl(247.5,100%,25%) 33%, " +
                "hsl(292.5,50%,75%) 33%, hsl(292.5,50%,75%) 67%, " +
                "hsl(315,83%,75%) 67%, hsl(315,83%,75%) 100%)");
        });

        it("[14,6,79]", function() {
            expect(instance.linearGradient(Uint8Array.of(14,6,79))).toBe(
                "linear-gradient(0deg, " +
                "hsl(315,50%,25%) 0%, hsl(315,50%,25%) 33%, " +
                "hsl(135,50%,25%) 33%, hsl(135,50%,25%) 67%, " +
                "hsl(337.5,50%,42%) 67%, hsl(337.5,50%,42%) 100%)");
        });
    });

    describe("can generate linear gradients from", function() {
        it("nothing", function() {
            expect(instance.generate()).toBe("none");
        });

        it("the empty string", function() {
            expect(instance.generate("")).toBe("none");
        });

        it("\"0\"", function() {
            expect(instance.generate("0")).toBe(
                "linear-gradient(0deg, " +
                "hsl(0,100%,25%) 0%, hsl(0,100%,25%) 33%, " +
                "hsl(0,50%,25%) 33%, hsl(0,50%,25%) 67%, " +
                "hsl(0,50%,25%) 67%, hsl(0,50%,25%) 100%)");
        });

        it("\"false\"", function() {
            expect(instance.generate("false")).toBe(
                "linear-gradient(0deg, " +
                "hsl(67.5,83%,25%) 0%, hsl(67.5,83%,25%) 33%, " +
                "hsl(202.5,67%,25%) 33%, hsl(202.5,67%,25%) 67%, " +
                "hsl(247.5,50%,75%) 67%, hsl(247.5,50%,75%) 100%)");
        });

        it("the quick brown fox", function() {
            expect(instance.generate(FOX)).toBe(
                "linear-gradient(0deg, " +
                "hsl(247.5,100%,25%) 0%, hsl(247.5,100%,25%) 33%, " +
                "hsl(292.5,50%,75%) 33%, hsl(292.5,50%,75%) 67%, " +
                "hsl(315,83%,75%) 67%, hsl(315,83%,75%) 100%)");
        });
    });

    describe("can decompose Uint8 into hsl from", function() {
        it("nothing", function() {
            expect(instance.hsl()).toBe("hsl(0,50%,25%)");
        });

        it("0", function() {
            expect(instance.hsl(0)).toBe("hsl(0,50%,25%)");
        });

        it("127", function() {
            expect(instance.hsl(127)).toBe("hsl(337.5,100%,42%)");
        });

        it("255", function() {
            expect(instance.hsl(255)).toBe("hsl(337.5,100%,75%)");
        });
    });
});
